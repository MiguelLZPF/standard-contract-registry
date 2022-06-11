//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import { IContractRegistry } from "./IContractRegistry.sol";

/**
 * @title Contract Registry Interface
 * @author Miguel Gomez Carpena
 * @dev Interface for ContractDeployer Smart Contract
 */
interface IContractDeployer {
  // EVENTS
  // Emits an event when a new contract is succesfully deployed
  event ContractDeployed(
    address registry,
    address indexed proxy,
    bytes32 name,
    bytes2 indexed version,
    bytes32 logicCodeHash
  );
  // Emits an event when a contract is successfully upgraded
  event ContractUpgraded(
    address indexed registry,
    address indexed proxy,
    bytes2 indexed version,
    bytes32 logicCodeHash
  );

  // =========
  // FUNCTIONS

  /**
   * @notice Deploys a new contract as upgradeable and registerd a new ContractRecord
   * @dev It needs a Contract Registry to register de deployment information
   * @param registry ContractRegistry SC to register the new ContractRecord
   * @param bytecode The complete bytecode of the contract to be deployed
   * @param data ABI Encoded initialize call data
   * @param salt (optional) see Create2
   * @param name Name to identify this contract
   * @param version Initial version of the contract
   */
  function deployContract(
    IContractRegistry registry,
    bytes calldata bytecode,
    bytes memory data,
    bytes32 salt,
    bytes32 name,
    bytes2 version
  ) external;

  /**
   * @notice Upgrades the upgradeable contract and updates its ContractRecord
   * @dev It needs a Contract Registry to update de deployment information
   * @param registry ContractRegistry SC to update the ContractRecord
   * @param bytecode The complete bytecode of the upgraded contract
   * @param data ABI Encoded initialize call data
   * @param salt (optional) see Create2
   * @param version New version of the contract
   */
  function upgradeContract(
    IContractRegistry registry,
    TransparentUpgradeableProxy proxy,
    bytes calldata bytecode,
    bytes calldata data,
    bytes32 salt,
    bytes2 version
  ) external;
}
