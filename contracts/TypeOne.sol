// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.8.0;

import { OwnableUpgradeSafe as Ownable } from "./libs/access/OwnableUS.sol";

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract TypeOne is Ownable {
  uint256 number;

  // FUNCTIONS
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
