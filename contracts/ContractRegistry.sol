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
  event VersionUpdated(
    ContractType indexed type_,
    bytes2 indexed oldVersion
  );
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
    address proxy;
    address logic;
    address owner;
    string type_;
    bytes2 currentVersion;
    uint256 dateCreated;
    uint256 dateUpdated;
  }

  // PROPERTIES
  // Types and versions
  ContractType[] knownTypes;
  mapping(string => bool) public isType;
  mapping(bytes32 => ContractType) public typeById;
  // Contracts Registry
  ContractRecord[] records;
  mapping(address => ContractRecord) recordByProxy;
  mapping(address => ContractRecord[]) recordsByOwner;
  mapping(string => ContractRecord[]) recordsByType;

  // Proxy admin contract
  ProxyAdmin proxyAdm;

  // ---------------------
  // FUNCTIONS
  function initialize() external initializer {
    __Ownable_init();
    proxyAdm = new ProxyAdmin();
    emit Initialized(address(this), owner());
  }

  // Proxy Admin functions ---------------
  // -- Creates a new type of contract

  // Type and versions functions ---------------
  // -- Creates a new type of contract
  function setType(string memory _type, bytes2 _version) public onlyOwner {
    // all type strings should be lower case
    _type = S.toLower(_type);
    require(!isType[_type], "this type is already defined");
    require(
      currentVersion[_type] < _version,
      "new version must be greater than current one"
    );

    knownTypes.push(_type);
    isType[_type] = true;
    currentVersion[_type] = _version;
    emit NewType(_type, _version);
  }

  // -- Gets a type from an index
  function getType(uint256 _index)
    public
    view
    returns (string memory _contractType)
  {
    return knownTypes[_index];
  }

  // -- Gets all types defined
  function getTypes() public view returns (string[] memory _contractTypes) {
    return knownTypes;
  }

  // -- Checks if a type exists or not
  function checkType(string memory _type)
    public
    view
    returns (string memory _contractType)
  {
    // all type strings should be lower case
    _type = S.toLower(_type);
    if (isType[_type]) {
      return _type;
    } else {
      return "generic";
    }
  }

  // -- Sets the latest version of a contract available
  function setVersion(string memory _type, bytes2 _version) public onlyOwner {
    // all type strings should be lower case
    _type = S.toLower(_type);
    require(
      isType[_type],
      "this type is not defined, use 'setType' function instead"
    );
    bytes2 _oldVer = currentVersion[_type];
    require(
      currentVersion[_type] < _version,
      "new version must be greater than current one"
    );

    currentVersion[_type] = _version;
    emit VersionUpdated(_type, _oldVer, _version);
  }

  // -- Gets the latest version avilable for a contract type
  function getVersion(string memory _type)
    public
    view
    returns (bytes2 _version)
  {
    return currentVersion[S.toLower(_type)];
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
