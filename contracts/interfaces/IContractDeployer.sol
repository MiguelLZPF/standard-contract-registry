//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

struct ContractRecord {
  address proxy; // use as ID too
  address logic;
  address admin;
  bytes32 name; // must be unique OPT DEF: 0x00...00
  bytes2 version;
  uint16 index; // index in array (limit of 65536 per admin)
  bytes32 logicCodeHash; // OPT def: 0x00...00
  uint256 rat; // Registered AT
  uint256 uat; // Updated AT
}

/**
 * @title Contract Registry Interface
 * @author Miguel Gomez Carpena
 * @dev Interface for ContractRegistry Smart Contract
 */
interface IContractDeployer {
  // EVENTS
  event ContractDeployed(
    address indexed registry,
    address indexed proxy,
    bytes32 name,
    bytes2 indexed version,
    bytes32 logicCodeHash
  );
  event ContractUpgraded(
    address indexed registry,
    address indexed proxy,
    bytes2 indexed version,
    bytes32 logicCodeHash
  );

  // =========
  // FUNCTIONS

  function deployContract(
    address registry,
    bytes calldata bytecode,
    bytes memory data,
    bytes32 salt,
    bytes32 name,
    bytes2 version
  ) external;

  function upgradeContract(
    address registry,
    address payable proxy,
    bytes calldata bytecode,
    bytes calldata data,
    bytes32 salt,
    bytes2 version
  ) external;
}