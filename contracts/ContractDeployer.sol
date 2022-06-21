//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import { IContractDeployer, IContractRegistry } from "./interfaces/IContractDeployer.sol";

contract ContractDeployer is IContractDeployer, ProxyAdmin {
  IContractRegistry private defaultRegistry;

  /**
   * @notice Initializes the contract and adds intself as first record
   * @dev The logic address in not needed because is the address(this)
   * @param initRegistry default ContractRegistry contract
   * @param name (optional) [ContractRegistry] name to identify this contract
   * @param logicCodeHash the external bytecode or deployBytecode or off-chain bytecode
   */
  constructor(
    IContractRegistry initRegistry,
    bytes32 name,
    bytes32 logicCodeHash
  ) {
    defaultRegistry = initRegistry;
    if (name == bytes32(0)) {
      name = bytes32("ContractDeployer");
    }
    defaultRegistry.register(address(this), address(this), name, uint16(0), logicCodeHash);
    // return control of the proxy
    defaultRegistry.changeRegisteredAdmin(address(this), _msgSender());
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
    // calculate sha3 hash of the bytecode
    bytes32 logicCodeHash = keccak256(bytecode);
    // check if salt is empty and generate a random salt
    if (salt == bytes32(0)) {
      salt = keccak256(abi.encodePacked(bytecode, block.timestamp));
    }
    // deploy logic/implementation contract
    address logic = Create2.deploy(0, salt, bytecode);
    // deploy proxy/storage contract TransparentUpgradeableProxy
    address proxy = address(new TransparentUpgradeableProxy(logic, address(this), data));

    // the owner is the msg.sender. Implementation May or may not be ownable
    try Ownable(proxy).transferOwnership(_msgSender()) {} catch {}

    // Update record on ContractRegistry
    registry.register(proxy, logic, name, version, logicCodeHash);

    emit ContractDeployed(registryAddr, proxy, name, version, logicCodeHash);
  }

  function upgradeContract(
    IContractRegistry registry,
    TransparentUpgradeableProxy proxy,
    bytes memory bytecode,
    bytes memory data,
    bytes32 salt,
    uint16 version
  ) external onlyOwner {
    // set default if empty
    if (address(registry) == address(0)) {
      registry = defaultRegistry;
    }
    address registryAddr = address(registry);
    address proxyAddr = address(proxy);
    // calculate sha3 hash of the bytecode
    bytes32 logicCodeHash = keccak256(bytecode);
    // check if salt is empty and generate a random salt
    if (salt == bytes32(0)) {
      salt = keccak256(abi.encodePacked(bytecode, block.timestamp));
    }
    // deploy new logic/implementation contract
    address logic = Create2.deploy(0, salt, bytecode);
    // upgrade the new logic/implementation contract
    if (keccak256(data) != keccak256(new bytes(0))) {
      upgradeAndCall(proxy, logic, data);
    } else {
      upgrade(proxy, logic);
    }

    // the owner is the msg.sender. May or may not be ownable
    try Ownable(proxyAddr).transferOwnership(_msgSender()) {} catch {}

    // Update record on ContractRegistry
    IContractRegistry(registry).update(proxyAddr, logic, bytes32(0), version, logicCodeHash);

    emit ContractUpgraded(registryAddr, proxyAddr, version, logicCodeHash);
  }
}
