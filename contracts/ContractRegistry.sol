// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import { OwnableUpgradeSafe as Ownable } from "./libs/access/OwnableUS.sol";
import {
  ProxyAdmin,
  TransparentUpgradeableProxy as TUP
} from "./libs/proxy/ProxyAdmin.sol";
//import { TransparentUpgradeableProxy } from "./libs/proxy/TransparentUpgradeableProxy.sol";
import "./libs/utils/Create2.sol";
import { Strings as S } from "./libs/utils/Strings.sol";

/**
* @title Contract Registry
* @author Miguel Gomez Carpena
* @dev This Smart Contract is in charge of deploy and update upgradeable contracts
       for an owner and keeps record of them, and their versions and so on.
 */
contract ContractRegistry is Ownable {
  // EVENTS
  event Initialized(address indexed registry, address indexed owner);
  event NewType(bytes32 indexed id, string type_, bytes2 indexed version);
  event VersionUpdated(ContractType indexed type_, bytes2 indexed oldVersion);
  event TypeDeleted(ContractType indexed type_);
  event Deployed(
    address proxy,
    address logic,
    address indexed owner,
    string indexed type_,
    bytes2 indexed version
  );
  event Created(
    address indexed owner,
    address indexed proxy,
    address indexed logic,
    string type_,
    bytes2 version
  );
  event Upgraded(
    address indexed proxy,
    address oldLogic,
    address newLogic,
    address indexed owner,
    string indexed type_,
    bytes2 oldVersion,
    bytes2 newVersion
  );

  // STRUCTS
  struct ContractType {
    // id that will be the keccak256 of the typeName
    bytes32 id;
    // -- types like: manager, network, host... all lower case
    string typeName;
    // -- version like: 0x0102 == v1.2, 0xFFFF == v255.255
    bytes2 version;
  }
  struct ContractRecord {
    address proxy; // use as ID too
    address logic;
    address owner;
    string type_;
    bytes2 currentVersion;
    uint256 dateCreated;
    uint256 dateUpdated;
  }
  // ==========
  // PROPERTIES
  // 1. Types and versions
  // 1.1 Array to store all known types
  //     need an index to get/update/remove one item by reference (id)
  //     0 index reserved for non init. 1,2,3... N
  //     is like ask "where are this id stored?"
  ContractType[] knownTypes;
  mapping(bytes32 => uint256) typesIndex;
  // 1.2 Check if string is a type
  mapping(string => bool) public isType;
  // DEPRECATED 1.3 Get a type by reference (id)
  //mapping(bytes32 => ContractType) public typeById;
  // 2. Contract Registry
  // 2.1 Array to store all contract records
  //     need an index to remove one item by reference (proxy address)
  //     0 index reserved for non init. 1,2,3... N
  ContractRecord[] records;
  mapping(address => uint256) recordsIndex;
  // DEPRECATED 2.2 Get one record by reference (proxy address)
  //mapping(address => ContractRecord) recordByProxy;
  // 2.2 Get all records of one owner
  mapping(address => ContractRecord[]) recordsByOwner;
  // 2.3 Get all records of one type id
  mapping(bytes32 => ContractRecord[]) recordsByType;

  // 3. Proxy admin contract
  //    the proxy admin contract thats use to deploy and upgrade records
  ProxyAdmin proxyAdm;

  // =========
  // FUNCTIONS
  /**
    0. Initialize function that acts like a constructor
  */
  function initialize() external initializer {
    // initializate the owner as the msg.sender through ownable contract
    __Ownable_init();
    // creates a proxy admin needed to deploy and upgrade contract records
    proxyAdm = new ProxyAdmin();
    emit Initialized(address(this), owner());
  }

  // 1. Type and versions functions
  /**
    1.1 Creates a new contract type
    @param _type the name of the type to create
    @param _version version to set the new contract type XX.YY format
  */
  function setType(string memory _type, bytes2 _version) public onlyOwner {
    // all type strings should be lower case
    _type = S.toLower(_type);
    // can not be defined already
    require(!isType[_type], "this type is already defined");

    // create contrat type
    bytes32 id = S.hash(_type);
    ContractType newType = new ContractType(id, _type, _version);
    // store the contract type
    knownTypes.push(newType);
    // -- save the index + 1 = length
    typesIndex[id] = knownTypes.length;
    isType[_type] = true;

    emit NewType(id, _type, _version);
  }

  /**
    1.2 Gets a type by reference (id)
    @param _id the name of the type to create
    @return a ContractType by index
  */
  function getType(bytes32 _id) public view returns (ContractType) {
    return knownTypes[typesIndex[_id] - 1];
  }

  /**
    1.2 Gets a type from a type name
    @param _typeName the name of the type to create
    @return a ContractType from the hashed type name
  */
  function getType(string memory _typeName) public view returns (ContractType) {
    bytes32 id = S.hash(_typeName);
    return knownTypes[typesIndex[id] - 1];
  }

  /**
    1.3 Gets all types defined
    @return all ContractTypes
  */
  function getTypes() public view returns (ContractType[]) {
    return knownTypes;
  }

  /**
    1.4 Sets the latest version of an available contract
    @param _typeId the reference of the contract type to be updated
    @param _newVersion new version for the contract type
  */
  function setVersion(bytes32 _typeId, bytes2 _newVersion) public onlyOwner {
    require(
      typesIndex[_typeId] > 0,
      "this type is not defined, use 'setType' function instead"
    );
    // get contract type from id
    uint256 index = typesIndex[_typeId] - 1;
    ContractType typeToUpdate = knownTypes[index];

    require(
      typeToUpdate.version < _newVersion,
      "new version must be greater than current one"
    );
    emit VersionUpdated(typeToUpdate, typeToUpdate.version);
    // set the new version to the type
    typeToUpdate.version = _newVersion;
    // store the new contract type
    knownTypes[typesIndex[typeToUpdate.id] - 1] = typeToUpdate;
  }

  /**
    1.5 Gets the version of a contract type by reference (id)
    @param _typeId the id of the type to create
    @return the latest contract type version by index
  */
  function getVersion(bytes32 _typeId) public view returns (bytes2) {
    return knownTypes[typesIndex[_typeId] - 1].version;
  }

  /**
    1.6 Gets the version of a contract type from a type name
    @param _typeName the name of the type to create
    @return the latest contract type version from the hashed type name
  */
  function getVersion(string memory _typeName) public view returns (bytes2) {
    bytes32 typeId = S.hash(_typeName);
    return knownTypes[typesIndex[typeId] - 1].version;
  }

  /**
    1.7 Removes a contract type from storage
    @param _typeId the id of the contract type to remove  
  */
  function removeType(bytes32 _typeId) public {
    uint256 index = typesIndex[_typeId] - 1;
    emit TypeDeleted(knownTypes[index]);
    // get last element of the array
    ContractType last = knownTypes[knownTypes.length - 1];
    // write the last element on the index of the contract type to remove
    knownTypes[index] = last;
    // update the index of the (old) last contract type
    typesIndex[last.id] = index;
    // remove duplicated last element from the array
    knownTypes.pop();
  }

  // Contracts Registry Functions -------------------
  // -- Deploy a new Contract record
  function deployContract(
    bytes memory _bytecode,
    bytes memory _data,
    bytes32 _salt,
    //uint256 _amount,
    string memory _type
  ) external {
    _type = S.toLower(_type);
    address logic = Create2.deploy(0, _salt, _bytecode);
    address proxy = address(new TUP(logic, address(proxyAdm), _data));
    // The owner is the sender
    Ownable(proxy).transferOwnership(_msgSender());
    emit Deployed(proxy, logic, _msgSender(), _type, getVersion(_type));
    createContractRecord(proxy, logic, _type);
  }

  // -- Creates new contract record
  function createContractRecord(
    address _proxy,
    address _logic,
    string memory _type
  ) internal {
    _type = checkType(_type);
    bytes2 version = getVersion(_type);
    ContractRecord memory record =
      ContractRecord(
        _proxy,
        _logic,
        _msgSender(), // owner
        _type,
        version,
        block.timestamp,
        block.timestamp
      );
    setRecord(record);
    emit Created(_msgSender(), _proxy, _logic, _type, version);
  }

  function upgradeContract(
    address payable _proxy,
    bytes calldata _bytecode,
    bytes32 _salt
  ) external fromOwner(_proxy) {
    ContractRecord memory record = recordByProxy[_proxy];
    bytes2 oldVersion = record.version;
    bytes2 currentVer = getVersion(record.type_);
    require(
      oldVersion < currentVer,
      "this contract is already upgraded to the latest version"
    );
    address oldLogic = record.logic;

    address logic = Create2.deploy(0, _salt, _bytecode);
    TUP proxy = TUP(_proxy);
    proxyAdm.upgrade(proxy, logic);
    record.logic = proxyAdm.getProxyImplementation(proxy);
    require(
      record.logic != oldLogic,
      "upgrade went wrong logic addresses cannot be the same"
    );
    record.version = currentVer;
    record.dateUpdated = block.timestamp;
    // save updated contract record
    recordByProxy[_proxy] = record;
    emit Upgraded(
      record.proxy,
      oldLogic,
      record.logic,
      record.owner,
      record.type_,
      oldVersion,
      record.version
    );
  }

  // -- Gets a contract record
  function getContractRecord(address _proxy)
    public
    view
    returns (ContractRecord memory _record)
  {
    return recordByProxy[_proxy];
  }

  // -- Helper function to store all record related structures
  function setRecord(ContractRecord memory _record) internal {
    records.push(_record);
    recordByProxy[_record.proxy] = _record;
    recordsByOwner[_record.owner].push(_record);
    recordsByType[_record.type_].push(_record);
  }

  // MODIFIERS
  // Only from contract owners
  modifier fromOwner(address _proxy) {
    address contractOwner = Ownable(_proxy).owner();
    require(
      _msgSender() == contractOwner,
      "Only contract's owner is able to upgrade this contract"
    );
    _;
  }
}
