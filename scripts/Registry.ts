import { Contract, Event } from "ethers";
import { isAddress, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { FactoryOptions } from "hardhat/types";
import {
  GAS_OPT,
  getEvents,
  TransactionReceipt,
  TransactionResponse,
} from "./Blockchain";
import { random32Bytes, toHexVersion } from "./Utils";

/**
 *  Creates new types if contracts in batch
 * @param types array of strings with the type names to be created
 * @param registry actual registry contract or address that keeps track of the types
 * @param version (optional) the version to initialize the new types, can be one version for all or
 *        one version for each type.
 * @return an array with all receipts from transactions
 */
export const setTypes = async (
  registry: Contract,
  types: string[],
  version?: string | string[]
) => {
  // get base nonce
  const baseNonce = registry.signer.getTransactionCount();
  let receipts: Promise<TransactionReceipt>[] = [];
  if (version && typeof version == "string") {
    for (let index = 0; index < types.length; index++) {
      receipts.push(
        setType(registry, types[index], (await baseNonce) + index, version)
      );
    }
  } else if (version) {
    // must be string[]
    for (let index = 0; index < types.length; index++) {
      receipts.push(
        setType(
          registry,
          types[index],
          (await baseNonce) + index,
          version[index]
        )
      );
    }
  } else {
    for (let index = 0; index < types.length; index++) {
      receipts.push(setType(registry, types[index], (await baseNonce) + index));
    }
  }
  return await Promise.all(receipts);
};

const setType = async (
  registry: Contract,
  type: string,
  nonce: number,
  version?: string
) => {
  version ? version : (version = await toHexVersion("0.1"));

  return await ((await registry.setType(type, version, {
    gasLimit: "0xffffffff",
    gasPrice: "0x00",
    nonce: nonce,
  })) as TransactionResponse).wait();
};

/**
 * Deploys an array of contracts using a ContractRegistry deployed in the network
 *
 * @dev a Signer must be provided in the factOptions.signer or in the registry.signer
 *
 * @param registry actual contract registry of the system
 * @param contractNames names of the contracts to be deployed
 * @param factOptions contract factory options with signer and libraries
 * @param types type ids or type names of the contracts to be deployed
 * @param wantContract whether or not to return the deployed contracts. Default is true
 * @param initParams initialize (constructor) paramenters
 * @return the deployed contract or nothing if wantContract == false
 */
export const deployWithRegistryBatch = async (
  registry: Contract | string,
  contractNames: string[],
  factOptions?: FactoryOptions[] | FactoryOptions,
  types?: string[],
  wantContract?: boolean,
  initParams?: unknown[][]
) => {
  try {
    let contracts: Promise<Contract>[] = [];
    let factOptArray = Array<FactoryOptions>(contractNames.length);
    if (factOptions && !(factOptions instanceof Array)) {
      for (let index = 0; index < contractNames.length; index++) {
        factOptArray[index] = factOptions;
      }
    }
    factOptions = factOptArray as FactoryOptions[];
    if (wantContract || !wantContract) {
      contractNames.forEach(async (contractName, index) => {
        contracts.push(
          deployWithRegistry(
            registry,
            contractName,
            factOptions ? (factOptions as FactoryOptions[])[index] : undefined,
            types ? types[index] : undefined,
            true,
            initParams ? initParams[index] : undefined
          ) as Promise<Contract>
        );
      });
      return await Promise.all(contracts);
    } else {
      contractNames.forEach(async (contractName, index) => {
        contracts.push(
          deployWithRegistry(
            registry,
            contractName,
            factOptions ? (factOptions as FactoryOptions[])[index] : undefined,
            types ? types[index] : undefined,
            false,
            initParams ? initParams[index] : undefined
          ) as Promise<Contract>
        );
      });
    }
  } catch (error) {
    console.error(`ERROR: Cannot deploy Contracts in batch. ${error.stack}`);
  }
};

/**
 * Deploys a contract using a ContractRegistry deployed in the network
 *
 * @dev a Signer must be provided in the factOptions.signer or in the registry.signer
 *
 * @param registry actual contract registry of the system
 * @param contractName name of the contract to be deployed
 * @param factOptions contract factory options with signer and libraries
 * @param type type id or type name of the contract to be deployed
 * @param wantContract whether or not to return the deployed contract. Default is true
 * @param initParams initialize (constructor) paramenters
 * @return the deployed contract or nothing if wantContract == false
 */
export const deployWithRegistry = async (
  registry: Contract | string,
  contractName: string,
  factOptions?: FactoryOptions,
  type?: string,
  wantContract?: boolean,
  initParams?: unknown[]
): Promise<Contract | void | undefined> => {
  try {
    // async
    const randBytes = random32Bytes();
    // Check parameters
    [registry, factOptions, type, initParams] = (await checkDeployParams(
      registry,
      factOptions,
      type,
      initParams
    )) as [Contract, FactoryOptions, string, unknown[]];
    const from = factOptions.signer?.getAddress();
    // Main Logic
    const factory = await ethers.getContractFactory(contractName, factOptions);
    const initData = factory.interface.encodeFunctionData("initialize", [
      ...initParams,
    ]);
    const receipt = await registry.deployContract(
      factory.bytecode,
      initData,
      await randBytes,
      type,
      GAS_OPT
    );

    //get event and contract
    if (wantContract || !wantContract) {
      const deployEvent = (await getEvents(
        registry,
        "Deployed",
        [null, null, await from, type, null, null],
        true,
        receipt.blockNumber,
        receipt.blockNumber
      )) as Event;

      return await ethers.getContractAt(
        contractName,
        deployEvent.args!.proxy,
        factOptions.signer
      );
    }
  } catch (error) {
    console.error(`ERROR: Cannot deploy Contract. ${error.stack}`);
  }
};
/**
 * Cheks the parameters of the deployWithRegistry function
 */
const checkDeployParams = async (
  registry: Contract | string,
  factOptions?: FactoryOptions,
  type?: string,
  initParams?: unknown[]
) => {
  // registry and from (related through registry.signer)
  if (typeof registry == "string" && !isAddress(registry)) {
    throw new Error("Invalid registry contract address");
  } else if (typeof registry == "string") {
    // registry is a valid address
    if (!factOptions || !factOptions.signer) {
      throw new Error(
        "No signer specified in factOptions or in registry.signer"
      );
    } else {
      registry = await ethers.getContractAt(
        "ContractRegistry",
        registry,
        factOptions.signer
      );
    }
  } else {
    // registry is a Contract
    if (
      (!factOptions && !registry.signer) ||
      !isAddress(await registry.signer.getAddress())
    ) {
      throw new Error(
        "No signer specified in factOptions or in registry.signer"
      );
    } else if (factOptions && factOptions.signer) {
      registry = registry.connect(factOptions.signer);
    }
  }
  // here we should have a registry contract connected to a Signer to sing TXs
  // type - can be the type name or type id
  if (!type) {
    type = keccak256(toUtf8Bytes("generic"));
  } else if (type.slice(0, 2) != "0x") {
    // is a type name
    type = keccak256(toUtf8Bytes(type));
  } else if (type.length != 64 + 2) {
    // is a type id and length is not 32 bytes
    throw new Error(
      "type id is not valid. Must be a bytes array starting with 0x and 32 bytes length"
    );
  }
  // initParams
  initParams = initParams ? initParams : [];

  return [registry, factOptions, type, initParams];
};
