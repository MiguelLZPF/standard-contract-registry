//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import { Create2Upgradeable as Create2 } from "@openzeppelin/contracts-upgradeable/utils/Create2Upgradeable.sol";
import { IContractRegistry } from "./interfaces/IContractRegistry.sol";
import { IContractDeployer } from "./interfaces/IContractDeployer.sol";

contract ContractDeployer is IContractDeployer, ProxyAdmin {
  function deployContract(
    address registry,
    bytes memory bytecode,
    bytes memory data,
    bytes32 salt,
    bytes32 name,
    bytes2 version
  ) external {
    // calculate sha3 hash of the bytecode
    bytes32 logicCodeHash = keccak256(bytecode);
    // check if salt is empty and generate a random salt
    if (salt == bytes32(0)) {
      salt = keccak256(abi.encodePacked(bytecode, block.timestamp));
    }
    // deploy logic/implementation contract
    address logic = Create2.deploy(0, salt, bytecode);
    // deploy proxy/storage contract TransparentUpgradeableProxy
    address proxy = address(new TransparentUpgradeableProxy(logic, msg.sender, data));

    // the owner is the msg.sender. Implementation May or may not be ownable
    try Ownable(proxy).transferOwnership(msg.sender) {} catch {}

    if (registry != address(0)) {
      IContractRegistry(registry).register(proxy, logic, name, version, logicCodeHash);
    }
    emit ContractDeployed(registry, proxy, name, version, logicCodeHash);
  }

  function upgradeContract(
    address registry,
    address payable proxy,
    bytes memory bytecode,
    bytes memory data,
    bytes32 salt,
    bytes2 version
  ) external {
    // calculate sha3 hash of the bytecode
    bytes32 logicCodeHash = keccak256(bytecode);
    // check if salt is empty and generate a random salt
    if (salt == bytes32(0)) {
      salt = keccak256(abi.encodePacked(bytecode, block.timestamp));
    }
    // deploy new logic/implementation contract
    address logic = Create2.deploy(0, salt, bytecode);
    // upgrade the new logic/implementation contract
    if (keccak256(data) != keccak256(new bytes(0))) {
      upgradeAndCall(TransparentUpgradeableProxy(proxy), logic, data);
    } else {
      upgrade(TransparentUpgradeableProxy(proxy), logic);
    }

    // the owner is the msg.sender. May or may not be ownable
    try Ownable(proxy).transferOwnership(msg.sender) {} catch {}

    if (registry != address(0)) {
      IContractRegistry(registry).update(proxy, logic, bytes32(0), version, logicCodeHash);
    }
    emit ContractUpgraded(registry, proxy, version, logicCodeHash);
  }
}
