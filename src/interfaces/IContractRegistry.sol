// SPDX-License-Identifier: BSD-3-Clause
pragma solidity >=0.8.0 <0.9.0;

/**
 * @title ContractRecord
 * @dev Struct representing a contract record in the contract registry.
 */
struct ContractRecord {
  bytes32 tag; // Unique identifier for the contract
  uint256 chainId; // Chain ID where the contract is deployed
  bytes32 name; // Name of the contract
  address proxy; // Proxy contract address
  address logic; // Logic contract address
  address admin; // Admin contract address
  uint16 version; // Version of the contract
  bytes32 logicCodeHash; // Hash of the logic contract code
  bytes extraData; // Extra data associated with the contract
  uint256 timestamp; // Timestamp of when the contract was added
}

/**
 * @title Metadata
 * @notice Other information about the contract record storage needed to retrieve the ContractRecords
 * @param latestVersion mapping that stores the latest version for a given ContractRecord
 * @param previousName mapping that stores the previous name for a given ContractRecord
 * @param latestRecord latest ContractRecord that has been registered
 */
struct Metadata {
  mapping(bytes32 => uint16) latestVersion;
  mapping(bytes32 => bytes32) previousName;
  bytes32 latestRecord;
}

/**
 * @title Contract Registry Interface
 * @author @MiguelLZPF
 * @dev Interface for ContractRegistry Smart Contract
 */
interface IContractRegistry {
  // EVENTS
  // should be emitted when a contract record is registered or updated
  event NewRecord(
    bytes32 indexed name,
    address indexed proxy,
    address logic,
    uint16 indexed version,
    bytes32 logicCodeHash
  );
  // should be emitted when a contract record changes it's registered admin
  event AdminChanged(bytes32 indexed name, address indexed oldAdmin, address indexed newAdmin);
  // should be emitted when a contract record updates it's extraData
  event ExtraDataUpdated(
    bytes32 indexed name,
    bytes indexed oldExtraData,
    bytes indexed newExtraData
  );

  // =========
  // FUNCTIONS

  /**
   * @notice Registers a contract deployed as a new ContractRecord
   * @param name ContractRecord's name
   * @param proxy (optional) [logic] ContractRecord's proxy
   * @param logic ContractRecord's logic
   * @param version (optional) [0] ContractRecord's version
   * @param logicCodeHash ContractRecord's logic code hash
   * @param admin (optional) [sender] Address of the admin to use
   */
  function register(
    bytes32 name,
    address proxy,
    address logic,
    uint16 version,
    bytes32 logicCodeHash,
    address admin
  ) external;

  /**
   * @notice Updates the ContractRecord of a contract deployment. Used only when it is upgradeable
   * @param name ContractRecord's name
   * @param proxy (optional) [logic] ContractRecord's proxy
   * @param logic ContractRecord's logic
   * @param newAdmin (optional) [0x00..00] Change the registered admin
   * @param version (optional) [actual + 1] ContractRecord's version
   * @param logicCodeHash ContractRecord's logic code hash
   * @param admin (optional) [sender] Address of the admin to use
   */
  function update(
    bytes32 name,
    address proxy,
    address logic,
    address newAdmin,
    uint16 version,
    bytes32 logicCodeHash,
    address admin
  ) external;

  /**
   * @notice Changes the registered admin/owner of a Contract Record
   * @param name ContractRecord's name
   * @param newAdmin Address of the new admin
   */
  function changeRegisteredAdmin(bytes32 name, address newAdmin) external;

  /**
   * @notice Edit / replaces a Contract Record's extraData field
   * @param name ContractRecord's name
   * @param newExtraData ContractRecord's new extraData field
   * @dev it emits an ExtraDataUpdated event
   */
  function editExtraData(bytes32 name, bytes calldata newExtraData) external;

  /**
   * @notice Retreives the contract record by a given name and admin
   * @param name ContractRecord's name
   * @param admin ContractRecord's admin
   * @param version ContractRecord's version. Use version > 9999 to retreive the latest one
   * @return found Whether the contract record is found or not
   * @return record Actual contract record struct object
   */
  function getRecord(
    bytes32 name,
    address admin,
    uint16 version
  ) external view returns (bool found, ContractRecord calldata record);

  /**
   * @notice Retreives all contract record's IDs associated to the system or owner of this ContractRegistry
   * @return latestRecords Array of contract names list
   */
  function getSystemRecords() external view returns (bytes32[] calldata latestRecords);

  /**
   * @notice Retreives all contract record's IDs associated to the Tx signer's account
   * @return latestRecords Array of contract names list
   */
  function getMyRecords() external view returns (bytes32[] calldata latestRecords);
}
