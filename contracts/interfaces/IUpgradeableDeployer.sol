//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {IContractDeployer} from "./IContractDeployer.sol";
import {IContractRegistry, ContractRecord} from "./IContractRegistry.sol";

/**
 * @title Upgradeable Deployer Interface
 * @author Miguel Gomez Carpena
 * @dev Interface for UpgradeableDeployer Smart Contract
 */
interface IUpgradeableDeployer is IContractDeployer {
    // EVENTS
    // Emits an event when a contract is successfully upgraded
    event ContractUpgraded(
        address registry,
        bytes32 indexed name,
        address indexed proxy,
        uint16 indexed version,
        bytes32 logicCodeHash
    );

    // =========
    // FUNCTIONS

    /**
     * @notice Upgrades the upgradeable contract and updates its ContractRecord
     * @dev It needs a Contract Registry to update de deployment information
     * @param registry ContractRegistry SC to update the ContractRecord
     * @param bytecode The complete bytecode of the upgraded contract
     * @param data ABI Encoded initialize call data
     * @param salt (optional) see Create2
     * @param version New version of the contract
     */
    function upgradeContract(
        IContractRegistry registry,
        bytes32 name,
        bytes memory bytecode,
        bytes memory data,
        bytes32 salt,
        uint16 version,
        address newAdmin
    ) external;
}
