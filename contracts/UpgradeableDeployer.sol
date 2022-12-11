// SPDX-License-Identifier: BSD-3-Clause
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Create2.sol";
import "./interfaces/IUpgradeableDeployer.sol";

/**
 * @title Contract Registry
 * @author Miguel Gomez Carpena
 * @dev This Smart Contract extends the ProxyAdmin functionality and, therefore, is owned by an admin or account.
 *      To check function documentation, please see IContractRegistry documentation
 */
contract UpgradeableDeployer is IUpgradeableDeployer, ProxyAdmin {
  IContractRegistry private defaultRegistry;

  /**
   * @notice Initializes the contract and adds intself as first record
   * @dev The logic address in not needed because is the address(this)
   * @param initRegistry default ContractRegistry contract
   */
  constructor(IContractRegistry initRegistry) {
    defaultRegistry = initRegistry;
  }

  function deployContract(
    IContractRegistry registry,
    bytes memory bytecode,
    bytes memory data,
    bytes32 salt,
    bytes32 name,
    uint16 version
  ) external onlyOwner {
    // set default if empty
    if (address(registry) == address(0)) {
      registry = defaultRegistry;
    }
    address registryAddr = address(registry);
    // check if salt is empty and generate a random salt
    if (salt == bytes32(0)) {
      salt = keccak256(abi.encodePacked(bytecode, block.timestamp));
    }
    // deploy logic/implementation contract
    address logic = Create2.deploy(0, salt, bytecode);
    // deploy proxy/storage contract TransparentUpgradeableProxy
    address proxy = address(new TransparentUpgradeableProxy(logic, address(this), data));

    // calculate sha3 hash of the deployed bytecode
    bytes32 logicCodeHash = keccak256(logic.code);

    // the owner is the msg.sender. Implementation May or may not be ownable
    try Ownable(proxy).transferOwnership(_msgSender()) {} catch {}

    // Update record on ContractRegistry
    registry.register(name, proxy, logic, version, logicCodeHash, _msgSender());

    emit ContractDeployed(registryAddr, name, proxy, version, logicCodeHash);
  }

  function upgradeContract(
    IContractRegistry registry,
    bytes32 name,
    bytes memory bytecode,
    bytes memory data,
    bytes32 salt,
    uint16 version,
    address newAdmin
  ) external onlyOwner {
    // set default if empty
    if (address(registry) == address(0)) {
      registry = defaultRegistry;
    }
    address registryAddr = address(registry);
    // get proxy by record's name
    (, ContractRecord memory record) = registry.getRecord(name, _msgSender(), 10000);
    address proxyAddr = record.proxy;
    TransparentUpgradeableProxy proxy = TransparentUpgradeableProxy(payable(proxyAddr));
    // check if salt is empty and generate a random salt
    if (salt == bytes32(0)) {
      salt = keccak256(abi.encodePacked(bytecode, proxyAddr.code, proxyAddr, block.timestamp));
    }
    // deploy new logic/implementation contract
    address logic = Create2.deploy(0, salt, bytecode);
    // upgrade the new logic/implementation contract
    if (keccak256(data) != keccak256(new bytes(0))) {
      upgradeAndCall(proxy, logic, data);
    } else {
      upgrade(proxy, logic);
    }

    // calculate sha3 hash of the deployed bytecode
    bytes32 logicCodeHash = keccak256(logic.code);

    // the owner is the msg.sender. May or may not be ownable
    try Ownable(proxyAddr).transferOwnership(_msgSender()) {} catch {}

    // Update record on ContractRegistry
    IContractRegistry(registry).update(
      name,
      proxyAddr,
      logic,
      newAdmin,
      version,
      logicCodeHash,
      _msgSender()
    );

    emit ContractUpgraded(registryAddr, name, proxyAddr, version, logicCodeHash);
  }
}
