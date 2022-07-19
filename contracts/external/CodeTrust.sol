//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

import "./ICodeTrust.sol";

/**
 * @title (Interface) Code Trust
 * @author Miguel Gomez Carpena
 */
contract CodeTrust {
  mapping(address => mapping(address => uint256)) private trustExpiration;

  function trustCodeAt(address trustedContract, uint256 duration) external {
    require(duration >= 10 && duration <= 31536000, "Invalid duration, check Docs");
    trustExpiration[msg.sender][trustedContract] = block.timestamp + duration;
  }

  function revokeTrustAt(address trustedContract) external {
    uint256 actualExpiration = trustExpiration[msg.sender][trustedContract];
    require(actualExpiration > block.timestamp + 5, "Already expired");
    trustExpiration[msg.sender][trustedContract] = 0;
  }

  function isTrusted(
    address trustedContract,
    address by,
    uint256 extTimestamp
  ) external view returns (bool) {
    if (extTimestamp == 0) {
      extTimestamp = block.timestamp;
    }
    if (by == address(0)) {
      by = msg.sender;
    }
    uint256 actualExpiration = trustExpiration[by][trustedContract];
    if (actualExpiration > extTimestamp + 5) {
      return true;
    } else {
      return false;
    }
  }
}
