// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import {OwnableUpgradeSafe as Ownable} from "./libs/access/OwnableUS.sol";
import {
    ProxyAdmin,
    TransparentUpgradeableProxy as TUP
} from "./libs/proxy/ProxyAdmin.sol";
//import { TransparentUpgradeableProxy } from "./libs/proxy/TransparentUpgradeableProxy.sol";
import "./libs/utils/Create2.sol";
import {Strings as S} from "./libs/utils/Strings.sol";

/**
* @title Contract Registry
* @author Miguel Gomez Carpena
* @dev This Smart Contract is in charge of deploy and update upgradeable contracts
       for an owner and keeps record of them, and their versions and so on.
 */
contract ContractRegistry is Ownable {
    // ======
    // EVENTS
    event Initialized(address indexed registry, address indexed owner);
    event NewType(bytes32 indexed id, string type_, bytes2 indexed version);
    event VersionUpdated(
        bytes32 indexed id,
        bytes2 indexed oldVersion,
        bytes2 indexed newVersion
    );
    event TypeDeleted(bytes32 indexed id);
    event Deployed(
        address proxy,
        address logic,
        address indexed owner,
        bytes32 indexed typeId,
        string typeName,
        bytes2 indexed version
    );
    event Upgraded(
        address indexed proxy,
        address oldLogic,
        address newLogic,
        address indexed owner,
        bytes32 indexed typeId,
        string typeName,
        bytes2 oldVersion,
        bytes2 newVersion
    );
    event OwnerChanged(
        address indexed proxy,
        address indexed oldOwner,
        address indexed newOwner
    );
    // =======
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
        // Owner if deployed with ownable flag, else deployer
        address owner;
        string type_;
        bytes2 version;
        uint256 dateCreated;
        uint256 dateUpdated;
    }
    // Type Array
    struct AContractType {
        ContractType[] array;
        // need an index to remove one item by reference (proxy address)
        // 0 index reserved for non init. 1,2,3... N
        //     is like ask "where are this id stored?"
        mapping(bytes32 => uint256) index;
    }
    // Contract Record Array
    struct AContractRecord {
        ContractRecord[] array;
        // need an index to remove one item by reference (proxy address)
        // 0 index reserved for non init. 1,2,3... N
        mapping(address => uint256) index;
    }
    // ==========
    // PROPERTIES
    // 1. Types and versions
    // 1.1 Array to store all known types
    AContractType knownTypes;
    // 1.2 Check if string is a type
    mapping(string => bool) public isType;

    // 2. Contract Registry
    // 2.1 Array to store all contract records with reference (proxy)
    AContractRecord records;
    // 2.2 Get all records of one owner
    mapping(address => AContractRecord) recordsByOwner;
    // 2.3 Get all records of one type id
    mapping(string => AContractRecord) recordsByType;

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
        // define the first generic contract type
        setType("generic", bytes2(uint16(256)));

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
        ContractType memory newType = ContractType(id, _type, _version);
        // store the contract type
        knownTypes.array.push(newType);
        // -- save the index + 1 = length
        knownTypes.index[id] = knownTypes.array.length;
        isType[_type] = true;

        emit NewType(id, _type, _version);
    }

    /**
    1.2 Gets a type by reference (id)
    @param _id the name of the type to create
    @return a ContractType by index
  */
    function getType(bytes32 _id) public view returns (ContractType memory) {
        return knownTypes.array[knownTypes.index[_id] - 1];
    }

    /**
    1.3 Gets a type from a type name
    @param _typeName the name of the type to create
    @return a ContractType from the hashed type name
  */
    function getTypeByName(string memory _typeName)
        public
        view
        returns (ContractType memory)
    {
        bytes32 id = S.hash(_typeName);
        return knownTypes.array[knownTypes.index[id] - 1];
    }

    /**
    1.4 Gets all types defined
    @return all ContractTypes
  */
    function getTypes() public view returns (ContractType[] memory) {
        return knownTypes.array;
    }

    /**
    1.5 Sets the latest version of an available contract
    @param _typeId the reference of the contract type to be updated
    @param _newVersion new version for the contract type
  */
    function setVersion(bytes32 _typeId, bytes2 _newVersion) public onlyOwner {
        require(
            knownTypes.index[_typeId] > 0,
            "this type is not defined, use 'setType' function instead"
        );
        // get contract type from id
        uint256 index = knownTypes.index[_typeId] - 1;
        ContractType memory typeToUpdate = knownTypes.array[index];

        require(
            typeToUpdate.version < _newVersion,
            "new version must be greater than current one"
        );
        emit VersionUpdated(typeToUpdate.id, typeToUpdate.version, _newVersion);
        // set the new version to the type
        typeToUpdate.version = _newVersion;
        // store the new contract type
        knownTypes.array[index] = typeToUpdate;
    }

    /**
    1.6 Gets the version of a contract type by reference (id)
    @param _typeId the id of the type to create
    @return the latest contract type version by index
  */
    function getVersion(bytes32 _typeId) public view returns (bytes2) {
        return knownTypes.array[knownTypes.index[_typeId] - 1].version;
    }

    /**
    1.7 Gets the version of a contract type from a type name
    @param _typeName the name of the type to create
    @return the latest contract type version from the hashed type name
  */
    function getVersionByName(string memory _typeName)
        public
        view
        returns (bytes2)
    {
        bytes32 typeId = S.hash(_typeName);
        return knownTypes.array[knownTypes.index[typeId] - 1].version;
    }

    /**
    1.8 Removes a contract type from storage
    @param _typeId the id of the contract type to remove  
  */
    function removeType(bytes32 _typeId) public {
        uint256 index = knownTypes.index[_typeId] - 1;
        emit TypeDeleted(knownTypes.array[index].id);
        // get last element of the array
        ContractType memory last =
            knownTypes.array[knownTypes.array.length - 1];
        // write the last element on the index of the contract type to remove
        knownTypes.array[index] = last;
        // update the index of the (old) last contract type
        knownTypes.index[last.id] = index;
        // remove duplicated last element from the array
        knownTypes.array.pop();
    }

    /*________________________________*/
    // 2. Contracts Registry Functions
    /**
    2.1 Deploy a new contract record
    @param _bytecode bytecode of the contract to be deployed
    @param _data the ABI encoded call to be performed after deploy
    @param _salt used to randomize deployment
    @param _type contract type name string
  */
    function deployContract(
        bytes memory _bytecode,
        bytes memory _data,
        bytes32 _salt,
        //uint256 _amount,
        string memory _type
    ) external //bool _ownable
    {
        _type = S.toLower(_type);
        bytes32 typeId = S.hash(_type);
        address logic = Create2.deploy(0, _salt, _bytecode);
        address proxy = address(new TUP(logic, address(proxyAdm), _data));
        // if ownable, the owner is the msg.sender
        try Ownable(proxy).transferOwnership(_msgSender()) {} catch {}
        emit Deployed(
            proxy,
            logic,
            _msgSender(),
            typeId,
            _type,
            getVersion(S.hash(_type))
        );
        storeRecord(proxy, logic, _type);
    }

    /**
    2.2 Store a new contract record
    @param _proxy address of the proxy contract
    @param _logic address of the logic contract
    @param _type contract type name string
  */
    function storeRecord(
        address _proxy,
        address _logic,
        string memory _type
    ) internal {
        // checks
        require(isType[_type], "Contract type parameter does not exist");
        bytes2 version = getVersionByName(_type);
        // create the record
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
        // store the record
        records.array.push(record);
        // -- save the index + 1 = length
        records.index[_proxy] = records.array.length;
        recordsByOwner[record.owner].array.push(record);
        recordsByOwner[record.owner].index[_proxy] = recordsByOwner[
            record.owner
        ]
            .array
            .length;
        recordsByType[record.type_].array.push(record);
        recordsByType[record.type_].index[_proxy] = recordsByType[record.type_]
            .array
            .length;
    }

    /**
    2.3 Upgrade a contract record
    @param _proxy address of the proxy contract
    @param _bytecode bytecode of the contract to be updated
    @param _salt used to randomize deployment
  */
    function upgradeContract(
        address payable _proxy,
        bytes calldata _bytecode,
        bytes32 _salt
    ) external fromOwnerOf(_proxy) {
        // get the contract record
        uint256 index = records.index[_proxy] - 1;
        ContractRecord memory record = records.array[index];
        // check if contract needs to be upgraded
        bytes2 oldVersion = record.version;
        bytes2 currentVer = getVersionByName(record.type_);
        require(
            oldVersion < currentVer,
            "this contract is already upgraded to the latest version"
        );
        // save old version for event
        address oldLogic = record.logic;

        // deploys new logic contract
        address logic = Create2.deploy(0, _salt, _bytecode);
        // use the same proxy with new logic
        TUP proxy = TUP(_proxy);
        proxyAdm.upgrade(proxy, logic);
        // check that the proxy points to the right logic
        record.logic = proxyAdm.getProxyImplementation(proxy);
        require(
            record.logic != oldLogic,
            "upgrade went wrong logic addresses cannot be the same"
        );
        // update contract record
        record.version = currentVer;
        try Ownable(_proxy).owner() returns (address owner) {
            record.owner = owner;
        } catch {}
        record.dateUpdated = block.timestamp;
        // save updated contract record
        records.array[index] = record;
        // use index to avoid "stack too deep"
        index = recordsByOwner[record.owner].index[_proxy] - 1;
        recordsByOwner[record.owner].array[index] = record;
        index = recordsByType[record.type_].index[_proxy] - 1;
        recordsByType[record.type_].array[index] = record;

        emit Upgraded(
            record.proxy,
            oldLogic,
            record.logic,
            record.owner,
            S.hash(record.type_),
            record.type_,
            oldVersion,
            record.version
        );
    }

    /**
    2.4 Transfer ownership and update contract record
    @param _proxy address of the proxy contract to update
    @param _newOwner address of the new owner
  */
    function transferOwner(address _proxy, address _newOwner) public {
        // transferOwnership using owner contract
        Ownable(_proxy).transferOwnership(_newOwner);
        // use the implemented function to update the record
        updateRecordOwner(_proxy);
    }

    /**
    2.5 Updates an already changed owner from a contract record
    @param _proxy address of the proxy contract to update
  */
    function updateRecordOwner(address _proxy) public {
        require(
            records.index[_proxy] > 0,
            "This contract has not been registered yet"
        );
        // get the contract record
        uint256 index = records.index[_proxy] - 1;
        ContractRecord memory record = records.array[index];
        address oldOwner = record.owner;
        // update contract record
        record.owner = Ownable(_proxy).owner();
        // save updated contract record
        records.array[index] = record;
        index = recordsByOwner[record.owner].index[_proxy] - 1;
        recordsByOwner[record.owner].array[index] = record;
        index = recordsByType[record.type_].index[_proxy] - 1;
        recordsByType[record.type_].array[index] = record;
        emit OwnerChanged(record.proxy, oldOwner, record.owner);
    }

    /**
    2.4 Gets a contract record
    @param _proxy address of the proxy contract
    @return 
  */
    function getRecord(address _proxy)
        public
        view
        returns (ContractRecord memory)
    {
        return records.array[records.index[_proxy] - 1];
    }

    // MODIFIERS
    // Only from contract owners
    modifier fromOwnerOf(address _proxy) {
        address contractOwner = Ownable(_proxy).owner();
        require(
            _msgSender() == contractOwner,
            "Only contract's owner is able to upgrade this contract"
        );
        _;
    }
}
