// SPDX-License-Identifier: BSD-3-Clause
pragma solidity >=0.8.0 <0.9.0;

/**
 * @title ContractRecord
 * @dev Struct representing a contract record in the contract registry.
 */
struct ContractRecord {
  bytes32 tag; // Unique identifier for the contract
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

//* Commands
/**
 * @title RegisterCommand
 * @dev Struct representing a command to register a contract deployed as a new ContractRecord.
 */
struct RegisterCommand {
  bytes32 tag; // (optional) [0] Unique identifier for the contract
  bytes32 name; // Name of the contract
  address proxy; // (optional) [logic] ContractRecord's proxy
  address logic; // ContractRecord's logic
  uint16 version; // (optional) [0] ContractRecord's version
  bytes32 logicCodeHash; // ContractRecord's logic code hash
  address admin; // (optional) [sender] Address of the admin to use
}

/**
 * @title UpdateCommand
 * @dev Struct representing an update command for a contract in the contract registry.
 */
struct UpdateCommand {
  bytes32 tag; // (optional) [0] Unique identifier for the contract
  bytes32 name; // ContractRecord's name
  address proxy; // (optional) [logic] ContractRecord's proxy
  address logic; // ContractRecord's logic
  address newAdmin; // (optional) [0x00..00] Change the registered admin
  uint16 version; // (optional) [actual + 1] ContractRecord's version
  bytes32 logicCodeHash; // ContractRecord's logic code hash
  address admin; // (optional) [sender] Address of the admin to use
}

/**
 * @title ChangeRegisteredAdminCommand
 * @dev Struct representing a command to change the registered admin of a contract record in the contract registry.
 */
struct ChangeRegisteredAdminCommand {
  bytes32 tag; // ContractRecord's tag
  address newAdmin; // Address of the new admin
}

/**
 * @title EditExtraDataCommand
 * @dev Struct representing a command to edit the extraData field of a ContractRecord.
 */
struct EditExtraDataCommand {
  bytes32 tag; // ContractRecord's tag
  bytes newExtraData; // ContractRecord's new extraData field
}

/**
 * @title RecordQuery
 * @dev Struct representing a query for a contract record in the contract registry.
 */
struct RecordQuery {
  bytes32 tag;      // The tag associated with the contract record.
  address admin;    // The address of the contract admin.
  uint16 version;   // The version of the contract.
}

/**
 * @dev Represents the response of a record lookup in the contract registry.
 */
struct RecordResponse {
  bool found; // Whether the contract record was found or not.
  ContractRecord record; // The contract record.
}



/**
 * @title Contract Registry Interface
 * @author @MiguelLZPF
 * @dev Interface for ContractRegistry Smart Contract
 */
interface IContractRegistry {
  //* EVENTS
  // should be emitted when a contract record is registered or updated
  event NewRecord(
    bytes32 indexed tag,
    bytes32 indexed name,
    address indexed proxy,
    address logic,
    uint16 version,
    bytes32 logicCodeHash,
  );
  // should be emitted when a contract record changes it's registered admin
  event AdminChanged(bytes32 indexed tag, address indexed oldAdmin, address indexed newAdmin);
  // should be emitted when a contract record updates it's extraData
  event ExtraDataUpdated(
    bytes32 indexed tag,
    bytes oldExtraData,
    bytes newExtraData
  );

  //* FUNCTIONS


  /**
   * @dev Registers a contract in the contract registry.
   * @param command The register command containing the necessary information for registration.
   */
  function register(RegisterCommand calldata command) external;

  /**
   * @notice Updates the ContractRecord of a contract deployment. Used only when it is upgradeable
   */
  function update(
    UpdateCommand calldata command
  ) external;

  /**
   * @notice Changes the registered admin/owner of a Contract Record
   */
  function changeRegisteredAdmin(ChangeRegisteredAdminCommand calldata command) external;

  /**
   * @notice Edit / replaces a Contract Record's extraData field
   * @dev it emits an ExtraDataUpdated event
   */
  function editExtraData(EditExtraDataCommand calldata command) external;

  /**
   * @notice Retreives the contract record by a given name and admin
   */
  function getRecord(
    RecordQuery calldata query
  ) external view returns (RecordResponse memory response);

  /**
   * @notice Retreives all contract record's IDs associated to the system or owner of this ContractRegistry
   * @return latestRecords Array of contract names list
   */
  function getSystemRecordList() external view returns (bytes32[] calldata latestRecords);

  /**
   * @notice Retreives all contract record's IDs associated to the Tx signer's account
   * @return latestRecords Array of contract names list
   */
  function getMyRecordList() external view returns (bytes32[] calldata latestRecords);
}
