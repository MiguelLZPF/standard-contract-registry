//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

/**
 * @title (Interface) Code Trust
 * @author Miguel Gomez Carpena
 */
interface ICodeTrust {
  function trustCodeAt(address trustedContract, uint256 expiration) external;

  function revokeTrustAt(address trustedContract) external;

  function isTrusted(
    address trustedContract,
    address by,
    uint256 extTimestamp
  ) external view returns (bool);
}
