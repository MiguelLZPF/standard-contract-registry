//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

struct ContractRecord {
  address proxy; // use as ID too
  address logic;
  address admin;
  bytes30 name; // must be unique OPT DEF: 0x00...00
  bytes2 version;
  bytes32 logicCodeHash; // OPT def: 0x00...00
  uint256 rat; // Registered AT
  uint256 uat; // Updated AT
}

/**
 * @title Contract Registry
 * @author Miguel Gomez Carpena
 * @dev Interface for ContractRegistry Smart Contract
 */
interface IContractRegistry {
  function register(
    address proxy,
    address logic,
    bytes30 name,
    bytes2 version,
    bytes32 logicCodeHash
  ) external;

  function update(
    address proxy,
    address logic,
    bytes2 version,
    bytes32 logicCodeHash
  ) external;
}
