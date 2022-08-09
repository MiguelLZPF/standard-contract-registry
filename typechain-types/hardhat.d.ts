/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "OwnableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnableUpgradeable__factory>;
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "ContextUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContextUpgradeable__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC1822Proxiable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1822Proxiable__factory>;
    getContractFactory(
      name: "IBeacon",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBeacon__factory>;
    getContractFactory(
      name: "ERC1967Proxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1967Proxy__factory>;
    getContractFactory(
      name: "ERC1967Upgrade",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1967Upgrade__factory>;
    getContractFactory(
      name: "Proxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Proxy__factory>;
    getContractFactory(
      name: "ProxyAdmin",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ProxyAdmin__factory>;
    getContractFactory(
      name: "TransparentUpgradeableProxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TransparentUpgradeableProxy__factory>;
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "ContractDeployer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContractDeployer__factory>;
    getContractFactory(
      name: "ContractRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContractRegistry__factory>;
    getContractFactory(
      name: "ExampleBallot",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ExampleBallot__factory>;
    getContractFactory(
      name: "ExampleOwnerV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ExampleOwnerV2__factory>;
    getContractFactory(
      name: "ExampleOwner",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ExampleOwner__factory>;
    getContractFactory(
      name: "ExampleStorage",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ExampleStorage__factory>;
    getContractFactory(
      name: "CodeTrust",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CodeTrust__factory>;
    getContractFactory(
      name: "ICodeTrust",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICodeTrust__factory>;
    getContractFactory(
      name: "ICodeTrust",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICodeTrust__factory>;
    getContractFactory(
      name: "ProxyAdmin",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ProxyAdmin__factory>;
    getContractFactory(
      name: "IContractDeployer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IContractDeployer__factory>;
    getContractFactory(
      name: "IContractRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IContractRegistry__factory>;
    getContractFactory(
      name: "IUpgradeableDeployer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUpgradeableDeployer__factory>;
    getContractFactory(
      name: "UpgradeableDeployer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UpgradeableDeployer__factory>;

    getContractAt(
      name: "OwnableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OwnableUpgradeable>;
    getContractAt(
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "ContextUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContextUpgradeable>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "IERC1822Proxiable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1822Proxiable>;
    getContractAt(
      name: "IBeacon",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBeacon>;
    getContractAt(
      name: "ERC1967Proxy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1967Proxy>;
    getContractAt(
      name: "ERC1967Upgrade",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1967Upgrade>;
    getContractAt(
      name: "Proxy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Proxy>;
    getContractAt(
      name: "ProxyAdmin",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ProxyAdmin>;
    getContractAt(
      name: "TransparentUpgradeableProxy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TransparentUpgradeableProxy>;
    getContractAt(
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "ContractDeployer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContractDeployer>;
    getContractAt(
      name: "ContractRegistry",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContractRegistry>;
    getContractAt(
      name: "ExampleBallot",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ExampleBallot>;
    getContractAt(
      name: "ExampleOwnerV2",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ExampleOwnerV2>;
    getContractAt(
      name: "ExampleOwner",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ExampleOwner>;
    getContractAt(
      name: "ExampleStorage",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ExampleStorage>;
    getContractAt(
      name: "CodeTrust",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CodeTrust>;
    getContractAt(
      name: "ICodeTrust",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICodeTrust>;
    getContractAt(
      name: "ICodeTrust",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICodeTrust>;
    getContractAt(
      name: "ProxyAdmin",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ProxyAdmin>;
    getContractAt(
      name: "IContractDeployer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IContractDeployer>;
    getContractAt(
      name: "IContractRegistry",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IContractRegistry>;
    getContractAt(
      name: "IUpgradeableDeployer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUpgradeableDeployer>;
    getContractAt(
      name: "UpgradeableDeployer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UpgradeableDeployer>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
