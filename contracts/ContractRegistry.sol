//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "./interfaces/IContractRegistry.sol";
import "./external/interfaces/ICodeTrust.sol";

/**
 * @title Contract Registry
 * @author Miguel Gomez Carpena
 * @dev This Smart Contract is in charge of keep a registry of deployed SC
 *      for a given system. To check function documentation, please see IContractRegistry documentation
 */
contract ContractRegistry is IContractRegistry, Ownable {
  // ======
  // CONSTANTS
  uint16 private constant MAX_VERSION = 9999;
  bytes32 private constant REGISTRY_NAME = bytes32("ContractRegistry");

  // ======
  // VARIABLES
  // Code trust contract needed for this contrac to trust another ones (normally the ContractDeployer or the UpgradeableDeployer)
  ICodeTrust private codeTrust;
  // Relation to be able to find Record by Name related to an admin
  // --   ((admin,           name)              version) --> proxy
  mapping(address => mapping(bytes32 => mapping(uint16 => ContractRecord))) private contractRecords;
  // Relation to link metadata with an admin
  // --   admin  --> metadata
  mapping(address => Metadata) private metadata;

  // =========
  // FUNCTIONS
  /**
   * @notice Initializes the contract and adds intself as first record
   * @dev The logic address in not needed because is the address(this)
   * @param initCodeTrust the initial code trust to be used
   * @param name (optional) [ContractRegistry] name to identify this contract
   * @param version (optional) [00.00] initial version of the contract
   * @param logicCodeHash the external bytecode or deployBytecode or off-chain bytecode
   */
  constructor(
    ICodeTrust initCodeTrust,
    bytes32 name,
    uint16 version,
    bytes32 logicCodeHash
  ) {
    // set contract to ask for trusted code
    codeTrust = initCodeTrust;
    if (name == bytes32(0)) {
      name = REGISTRY_NAME;
    }
    _register(name, address(this), address(this), version, logicCodeHash, _msgSender());
  }

  function register(
    bytes32 name,
    address proxy,
    address logic,
    uint16 version,
    bytes32 logicCodeHash,
    address admin
  ) external {
    // if admin undefined continue as sender
    if (admin == address(0)) {
      admin = _msgSender();
    }
    // or direct call or trusted undirect call
    require(
      admin == _msgSender() || codeTrust.isTrustedCode(_msgSender(), admin, 0),
      "Call from untrusted address"
    );
    _register(name, proxy, logic, version, logicCodeHash, admin);
  }

  function update(
    bytes32 name,
    address proxy,
    address logic,
    address newAdmin,
    uint16 version,
    bytes32 logicCodeHash,
    address admin
  ) external {
    // if admin undefined continue as sender
    if (admin == address(0)) {
      admin = _msgSender();
    }
    // or direct call or trusted undirect call
    require(
      admin == _msgSender() || codeTrust.isTrustedCode(_msgSender(), admin, 0),
      "Call from untrusted address"
    );
    _update(name, proxy, logic, newAdmin, version, logicCodeHash, admin);
  }

  function changeRegisteredAdmin(bytes32 name, address newAdmin) external {
    address sender = _msgSender();
    require(newAdmin != address(0) && newAdmin != sender, "Invalid new admin");
    // get data to change admin
    Metadata storage oldMetadata = metadata[sender];
    ContractRecord storage oldRecord = contractRecords[sender][name][
      oldMetadata.latestVersion[name]
    ];
    require(oldRecord.timestamp != 0, "Contract record not registered");
    // store replicated data as newAdmin
    _register(
      oldRecord.name,
      oldRecord.proxy,
      oldRecord.logic,
      oldRecord.version,
      oldRecord.logicCodeHash,
      newAdmin
    );
    // remove prevoious reference
    _removePreviousReference(oldMetadata, name);
    // remove latest version reference
    delete contractRecords[sender][name][oldMetadata.latestVersion[name]];
    emit AdminChanged(name, sender, newAdmin);
  }

  function getRecord(
    bytes32 name,
    address admin,
    uint16 version
  ) external view returns (bool found, ContractRecord memory record) {
    return _getRecord(name, admin, version);
  }

  function getSystemRecords() external view returns (bytes32[] memory latestRecords) {
    return _getRecords(owner());
  }

  function getMyRecords() external view returns (bytes32[] memory latestRecords) {
    return _getRecords(_msgSender());
  }

  function _register(
    bytes32 name,
    address proxy,
    address logic,
    uint16 version,
    bytes32 logicCodeHash,
    address sender
  ) internal {
    // Parameter checks
    require(logic != address(0), "Logic address is nedded");
    // -- regular deployment proxy = logic
    if (proxy == address(0)) {
      proxy = logic;
    }
    require(version <= MAX_VERSION, "Version must be lower than 9999");
    // Other checks
    // get sender's metadata
    Metadata storage senderMetadata = metadata[sender];
    // retrieve the empty contract record
    ContractRecord storage record = contractRecords[sender][name][
      senderMetadata.latestVersion[name]
    ];
    require(record.timestamp == 0 && record.version == 0, "Already registered, use update");
    // get the record qith the param version
    record = contractRecords[sender][name][version];
    // Register record in storage
    record.name = name;
    record.proxy = proxy;
    record.logic = logic;
    record.admin = sender;
    record.version = version;
    record.logicCodeHash = logicCodeHash;
    record.timestamp = block.timestamp;
    // update metadata
    senderMetadata.previousName[name] = senderMetadata.latestRecord;
    senderMetadata.latestRecord = name;
    senderMetadata.latestVersion[name] = version;
    // events
    emit NewRecord(record.name, record.proxy, record.logic, record.version, record.logicCodeHash);
  }

  function _update(
    bytes32 name,
    address proxy,
    address logic,
    address newAdmin,
    uint16 version,
    bytes32 logicCodeHash,
    address sender
  ) internal {
    // Parameter checks
    // -- keccak256(name) is used as Record ID
    require(name != bytes32(0), "Record name needed");
    // Get sender's metadata
    Metadata storage senderMetadata = metadata[sender];
    // Get record's latestVersion (actualRecord)
    ContractRecord storage actualRecord = contractRecords[sender][name][
      senderMetadata.latestVersion[name]
    ];
    require(actualRecord.timestamp != 0, "Not registered, use register");
    // Check that new version is greater than the actual version
    if (version == 0) {
      version = actualRecord.version + 1;
    }
    require(actualRecord.version < version, "Invalid new version");
    ContractRecord storage newRecord = contractRecords[sender][name][version];
    // Register new version
    if (proxy != address(0)) {
      newRecord.proxy = proxy;
    } else {
      newRecord.proxy = actualRecord.proxy;
    }
    if (logic != address(0)) {
      newRecord.logic = logic;
    } else {
      newRecord.logic = actualRecord.logic;
    }
    if (newAdmin != address(0)) {
      newRecord.admin = newAdmin;
    } else {
      newRecord.admin = actualRecord.admin;
    }
    if (logicCodeHash != bytes32(0)) {
      newRecord.logicCodeHash = logicCodeHash;
    } else {
      newRecord.logicCodeHash = actualRecord.logicCodeHash;
    }
    newRecord.name = actualRecord.name;
    newRecord.version = version;
    newRecord.timestamp = block.timestamp;
    senderMetadata.latestVersion[name] = newRecord.version;
    // events
    emit NewRecord(
      newRecord.name,
      newRecord.proxy,
      newRecord.logic,
      newRecord.version,
      newRecord.logicCodeHash
    );
  }

  // previous | actual | next
  function _removePreviousReference(Metadata storage senderMetadata, bytes32 recordName) internal {
    // Get next record reference, wich is the one to change its previous id
    // -- Start from latestRecord and check what is the one whose previousId is the actual recordId
    bytes32 nextName = senderMetadata.latestRecord;
    // if only one record
    if (senderMetadata.previousName[nextName] == bytes32(0)) {
      senderMetadata.previousName[recordName] = bytes32(0);
      senderMetadata.latestRecord = bytes32(0);
    } else {
      while (senderMetadata.previousName[nextName] != recordName) {
        // this means it goes through all the records
        require(nextName != bytes32(0), "RecordName not found for sender");
        nextName = senderMetadata.previousName[nextName];
      }
      // Change the next record's previous id to the actual record's previous id
      senderMetadata.previousName[nextName] = senderMetadata.previousName[recordName];
    }
  }

  function _getRecord(
    bytes32 name,
    address admin,
    uint16 version
  ) internal view returns (bool found, ContractRecord memory record) {
    if (version > MAX_VERSION) {
      version = metadata[admin].latestVersion[name];
    }
    record = contractRecords[admin][name][version];
    if (record.timestamp == 0) {
      found = false;
    } else {
      found = true;
    }
    return (found, record);
  }

  function _getRecords(address admin) internal view returns (bytes32[] memory latestRecords) {
    // first get records length
    bytes32 actualId = metadata[admin].latestRecord;
    uint256 length = 0;
    while (actualId != bytes32(0) && length < 10000) {
      length++;
      actualId = metadata[admin].previousName[actualId];
    }
    // then fill the array
    actualId = metadata[admin].latestRecord;
    bytes32[] memory records = new bytes32[](length);
    for (uint256 i = 0; i < length; i++) {
      records[i] = actualId;
      actualId = metadata[admin].previousName[actualId];
    }
    return records;
  }
}
