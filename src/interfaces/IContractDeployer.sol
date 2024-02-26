// SPDX-License-Identifier: BSD-3-Clause
pragma solidity >=0.8.0 <0.9.0;

import { IContractRegistry } from "./IContractRegistry.sol";

/**
 * @title Contract Deployer Interface
 * @author Miguel Gomez Carpena
 * @dev Interface for ContractDeployer Smart Contract
 */
interface IContractDeployer {
  // EVENTS
  // Emits an event when a new contract is succesfully deployed
  event ContractDeployed(
    address registry,
    bytes32 indexed name,
    address indexed proxyOrLogic,
    uint16 indexed version,
    bytes32 logicCodeHash
  );

  // =========
  // FUNCTIONS
  /**
   * @notice Deploys a new contract and registers a new ContractRecord in the ContractRegistry
   * @dev It needs a ContractRegistry SC to register de deployment information
   * @dev It uses Create2 function to deploy the contract
   * @param registry ContractRegistry SC to register the newly deployed ContractRecord
   * @param bytecode The complete bytecode of the contract to be deployed
   * @param data ABI Encoded initialize call data
   * @param salt (optional) [0x00...00] see Create2
   * @param name Name to identify this contractRecord
   * @param version (optional) [00.00] Initial version of the contract
   */
  function deployContract(
    IContractRegistry registry,
    bytes calldata bytecode,
    bytes memory data,
    bytes32 salt,
    bytes32 name,
    uint16 version
  ) external;
}
