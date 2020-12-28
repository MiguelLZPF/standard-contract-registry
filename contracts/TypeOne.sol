// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.8.0;

import {
  OwnableUpgradeable as Ownable
} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract TypeOne is Ownable {
  uint256 number;

  // FUNCTIONS
  function empty() external {}
  function initialize() external initializer {
    __Ownable_init();
  }

  /**
   * @dev Store value in variable
   * @param num value to store
   */
  function store(uint256 num) public {
    number = num;
  }

  /**
   * @dev Return value
   * @return value of 'number'
   */
  function retrieve() public view returns (uint256) {
    return number;
  }
}
