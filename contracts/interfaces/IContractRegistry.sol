//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

// represents a contract record or a deployment of a contract in blockchain
struct ContractRecord {
  bytes32 name; // must be unique (ID)
  address proxy;
  address logic;
  address admin;
  uint16 version; // limited to use 9999 as version = v99.99
  bytes32 logicCodeHash; // OPT def: 0x00...00
  uint256 timestamp; // version timestamp
}

struct Metadata {
  mapping(bytes32 => uint16) latestVersion;
  mapping(bytes32 => bytes32) previousName; // reference to previous contract record;
  bytes32 latestRecord;
}

/**
 * @title Contract Registry Interface
 * @author Miguel Gomez Carpena
 * @dev Interface for ContractRegistry Smart Contract
 */
interface IContractRegistry {
  // EVENTS
  // should be emitted when a contract record is registered
  event NewRecord(
    bytes32 indexed name,
    address indexed proxy,
    address logic,
    uint16 indexed version,
    bytes32 logicCodeHash
  );
  // should be emitted when a contract record is updated
  // event Updated(
  //   bytes32 indexed name,
  //   address proxy,
  //   address logic,
  //   uint16 indexed version,
  //   bytes32 indexed logicCodeHash
  // );
  // should be emitted when a contract record changes it's registered admin
  event AdminChanged(bytes32 name, address indexed oldAdmin, address indexed newAdmin);

  // =========
  // FUNCTIONS

  /**
   * @notice Registers a contract deployed as a new ContractRecord
   * @param name Name to identify this contract
   * @param proxy Address of the proxy | storage contract. If NO upgradeable deployment proxy = logic
   * @param logic Address of the logic | implementation contract
   * @param version Initial version of the contract
   * @param logicCodeHash The external bytecode or deployBytecode or off-chain bytecode
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
   * @param proxy Address of the proxy | storage contract. Identifies the contract if no actualName
   * @param logic Address of the logic | implementation contract
   * @param name (optional) [0x0000000000] Name to identify this contract
   * @param version initial version of the contract
   * @param logicCodeHash the external bytecode or deployBytecode or off-chain bytecode
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
   * @param name String that identifies the contract record
   * @param newAdmin Address of the new admin
   */
  function changeRegisteredAdmin(bytes32 name, address newAdmin) external;

  /**
   * @notice Retreives the contract record associated to the given proxy address
   * @param name String of the name that identifies the contract record
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
   * @notice Retreives all contract record's IDs associated to the system or owner of this ContractRegistry
   * @return latestRecords Array of contract names list
   */
  function getMyRecords() external view returns (bytes32[] calldata latestRecords);

  /**
   * @notice Retreives the contract's proxy
   */
  function getProxyAddress(
    bytes32 name,
    address admin,
    uint16 version
  ) external view returns (address);
}
