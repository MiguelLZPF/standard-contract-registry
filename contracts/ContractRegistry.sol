//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { OwnableUpgradeable as Ownable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { TransparentUpgradeableProxy as TUP } from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import { Create2Upgradeable as Create2 } from "@openzeppelin/contracts-upgradeable/utils/Create2Upgradeable.sol";
import { ContractRecord } from "./interfaces/IContractRegistry.sol";

/**
 * @title Contract Registry
 * @author Miguel Gomez Carpena
 * @dev This Smart Contract is in charge of keep a registry of deployed SC
 *      for a given system. It can also deploy or upgrade them
 */
contract ContractRegistry is Initializable, Ownable {
  // ======
  // EVENTS
  event Registered(
    address indexed proxy,
    bytes30 name,
    bytes2 indexed version,
    bytes32 indexed logicCodeHash
  );
  event Updated(
    address indexed proxy,
    bytes30 name,
    bytes2 indexed version,
    bytes32 indexed logicCodeHash
  );
  // ======
  // VARIABLES
  // Store Contract Records associated to the proxy address
  mapping(address => ContractRecord) public contractRecords;
  // Relation to be able to find Record by Name
  mapping(bytes32 => address) private nameToProxy;
  // Relation between admin and contract record names
  mapping(address => bytes30[]) private adminRecordNames;

  // =========
  // FUNCTIONS
  /**
  0. Initialize function that acts like a constructor
  */
  function initialize(
    address proxy,
    bytes30 name,
    bytes2 version,
    bytes32 logicCodeHash
  ) external initializer {
    __Ownable_init();
    if (proxy == address(0)) {
      proxy = address(this);
    }
    if (name == bytes30(0)) {
      name = bytes30("ContractRegistry");
    }
    _register(proxy, address(this), name, version, logicCodeHash);
  }

  // update
  // upgrade

  function register(
    address proxy,
    address logic,
    bytes30 name,
    bytes2 version,
    bytes32 logicCodeHash
  ) external {
    _register(proxy, logic, name, version, logicCodeHash);
  }

  /*   function deploy(
    bytes memory bytecode,
    bytes memory data,
    bytes32 salt,
    bytes30 name,
    bytes2 version
  ) external {
    require(bytecode.length > 10, "Bytecode cannot be empty");
    bytes32 logicCodeHash = keccak256(bytecode);
    if (salt == bytes32(0)) {
      salt = keccak256(abi.encodePacked(bytecode, block.timestamp));
    }
    address logic = Create2.deploy(0, salt, bytecode);
    address proxy = address(new TUP(logic, _msgSender(), data));

    // the owner is the msg.sender. May or may not be ownable
    try Ownable(proxy).transferOwnership(_msgSender()) {} catch {}

    _register(proxy, logic, name, version, logicCodeHash);
  } */

  function update(
    address proxy,
    address logic,
    bytes2 version,
    bytes32 logicCodeHash
  ) external {
    _update(proxy, logic, version, logicCodeHash);
  }

  /* function upgrade(
    address payable proxy,
    bytes memory bytecode,
    bytes memory data,
    bytes32 salt,
    bytes2 version
  ) external {
    // Parameter checks
    require(bytecode.length > 10, "Bytecode cannot be empty");
    bytes32 logicCodeHash = keccak256(bytecode);
    if (salt == bytes32(0)) {
      salt = keccak256(abi.encodePacked(bytecode, block.timestamp));
    }
    address logic = Create2.deploy(0, salt, bytecode);
    if (keccak256(data) != keccak256(new bytes(0))) {
      TUP(proxy).upgradeToAndCall(logic, data);
    } else {
      TUP(proxy).upgradeTo(logic);
    }

    // return admin rigths
    TUP(proxy).changeAdmin(logic);
    // the owner is the msg.sender. May or may not be ownable
    try Ownable(proxy).transferOwnership(_msgSender()) {} catch {}

    _update(proxy, logic, version, logicCodeHash);
  } */

  function changeRegisteredAdmin(bytes30 name, address newAdmin) external {
    ContractRecord storage record = contractRecords[nameToProxy[keccak256(abi.encodePacked(name))]];
    // check if msg.sender is the admin who registred it
    require(record.admin == _msgSender(), "You are not the owner");
    record.admin = newAdmin;
  }

  function getRecord(address proxy)
    external
    view
    returns (bool found, ContractRecord memory record)
  {
    return _getRecord(proxy);
  }

  function getByName(bytes30 name)
    external
    view
    returns (bool found, ContractRecord memory record)
  {
    return _getRecord(nameToProxy[keccak256(abi.encodePacked(name))]);
  }

  function getAdminContracts() external view returns (bytes30[] memory contractNames) {
    return _getContracts(owner());
  }

  function getMyContracts() external view returns (bytes30[] memory contractNames) {
    return _getContracts(_msgSender());
  }

  function _register(
    address proxy,
    address logic,
    bytes30 name,
    bytes2 version,
    bytes32 logicCodeHash
  ) internal {
    // Parameter checks
    require(proxy != address(0), "Proxy address is nedded");
    // regular deployment proxy = logic
    if (logic == address(0)) {
      logic = proxy;
    }
    bytes32 nameHash = keccak256(abi.encodePacked(name));
    require(
      name == bytes30(0) || nameToProxy[nameHash] == address(0),
      "Name must be unique or null"
    );
    // Other checks
    ContractRecord storage record = contractRecords[proxy];
    require(record.rat == 0, "Contract already registered");

    // Register in storage
    record.proxy = proxy;
    record.logic = logic;
    record.admin = _msgSender();
    record.name = name;
    record.version = version;
    record.logicCodeHash = logicCodeHash;
    record.rat = block.timestamp;
    record.uat = block.timestamp;
    // Store proxy by name
    nameToProxy[nameHash] = proxy;
    // store admin's name list
    adminRecordNames[record.admin].push(name);
    // events
    emit Registered(record.proxy, record.name, record.version, record.logicCodeHash);
  }

  function _update(
    address proxy,
    address logic,
    bytes2 version,
    bytes32 logicCodeHash
  ) internal {
    // Parameter checks
    require(proxy != address(0), "Proxy address is nedded");
    ContractRecord storage record = contractRecords[proxy];
    // Other checks
    // -- check if registered
    require(record.rat != 0, "Contract not registered");
    // -- check if diferent logic address
    require(record.logic != logic, "Logic already updated");
    require(record.logicCodeHash != logicCodeHash, "Logic already updated");
    // -- check if msg.sender is the admin how registred it
    require(record.admin == _msgSender(), "You are not the admin");

    // Update in storage
    record.logic = logic;
    record.version = version;
    record.logicCodeHash = logicCodeHash;
    record.uat = block.timestamp;
    // events
    emit Updated(record.proxy, record.name, record.version, record.logicCodeHash);
  }

  function _getRecord(address proxy)
    internal
    view
    returns (bool found, ContractRecord memory record)
  {
    record = contractRecords[proxy];
    if (record.rat == 0) {
      found = false;
    } else {
      found = true;
    }
    return (found, record);
  }

  function _getContracts(address from) internal view returns (bytes30[] memory contractNames) {
    return adminRecordNames[from];
  }
}
