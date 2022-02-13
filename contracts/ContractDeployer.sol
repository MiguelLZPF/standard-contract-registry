//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

import { OwnableUpgradeable as Ownable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { TransparentUpgradeableProxy as TUP } from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import { Create2Upgradeable as Create2 } from "@openzeppelin/contracts-upgradeable/utils/Create2Upgradeable.sol";
import { IContractRegistry } from "./interfaces/IContractRegistry.sol";

contract ContractDeployer {
  function deploy(
    address registry,
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
    address proxy = address(new TUP(logic, msg.sender, data));

    // the owner is the msg.sender. May or may not be ownable
    try Ownable(proxy).transferOwnership(msg.sender) {} catch {}

    IContractRegistry(registry).register(proxy, logic, name, version, logicCodeHash);
  }

  function upgrade(
    address registry,
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
    try Ownable(proxy).transferOwnership(msg.sender) {} catch {}

    IContractRegistry(registry).update(
      proxy,
      logic,
      bytes30(0),
      version,
      logicCodeHash
    );
  }
}
