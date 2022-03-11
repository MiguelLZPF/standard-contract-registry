//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

// represents a contract record or a deployment of a contract in blockchain
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
interface IContractRegistry {
  // EVENTS
  // should be emited when a contract record is registered
  event Registered(
    address indexed proxy,
    bytes32 name,
    bytes2 indexed version,
    bytes32 indexed logicCodeHash
  );
  // should be emited when a contract record is updated
  event Updated(
    address indexed proxy,
    bytes32 name,
    bytes2 indexed version,
    bytes32 indexed logicCodeHash
  );
  // should be emited when a contract record changes it's registered admin
  event AdminChanged(address indexed oldAdmin, address indexed newAdmin, bytes32 name);

  // =========
  // FUNCTIONS
  function initialize(
    address proxy,
    bytes32 name,
    bytes2 version,
    bytes32 logicCodeHash
  ) external;

  function register(
    address proxy,
    address logic,
    bytes32 name,
    bytes2 version,
    bytes32 logicCodeHash
  ) external;

  function update(
    address proxy,
    address logic,
    bytes32 actualName,
    bytes2 version,
    bytes32 logicCodeHash
  ) external;

  function changeRegisteredAdmin(address proxy, address newAdmin) external;

  function getRecord(address proxy)
    external
    view
    returns (bool found, ContractRecord calldata record);

  function getRecordByName(bytes32 name, address admin)
    external
    view
    returns (bool found, ContractRecord calldata record);

  function getSystemRecords() external view returns (bytes32[] calldata contractNames);

  function getMyRecords() external view returns (bytes32[] calldata contractNames);
}
