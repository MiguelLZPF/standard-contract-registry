//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Create2.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IContractDeployer, IContractRegistry } from "./interfaces/IContractDeployer.sol";

contract ContractDeployer is IContractDeployer {
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
  ) external {
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
    address logic = Create2.deploy(0, salt, bytes.concat(bytecode, data));

    // calculate sha3 hash of the deployed bytecode
    bytes32 logicCodeHash = keccak256(logic.code);

    // the owner is the msg.sender. Implementation May or may not be ownable
    try Ownable(logic).transferOwnership(msg.sender) {} catch {}

    // check if the same contract has been registeded earlier
    (bool found, ) = registry.getRecord(name, msg.sender, 10000);
    // Register new record on ContractRegistry
    if (found) {
      registry.update(name, logic, logic, msg.sender, version, logicCodeHash, msg.sender);
    } else {
      registry.register(name, logic, logic, version, logicCodeHash, msg.sender);
    }
    emit ContractDeployed(registryAddr, name, logic, version, logicCodeHash);
  }
}
