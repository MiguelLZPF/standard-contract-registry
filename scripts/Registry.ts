import { Contract, Event } from "ethers";
import { isAddress, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { boolean, string } from "hardhat/internal/core/params/argumentTypes";
import { FactoryOptions } from "hardhat/types";
import {
  GAS_OPT,
  getEvents,
  provider,
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
  //const baseNonce = registry.signer.getTransactionCount();
  let receipts: TransactionReceipt[] = [];
  if (version && typeof version == "string") {
    for (let index = 0; index < types.length; index++) {
      receipts.push(await setType(registry, types[index], version));
    }
  } else if (version) {
    // must be string[]
    for (let index = 0; index < types.length; index++) {
      receipts.push(await setType(registry, types[index], version[index]));
    }
  } else {
    for (let index = 0; index < types.length; index++) {
      receipts.push(await setType(registry, types[index]));
    }
  }
  return await Promise.all(receipts);
};

const setType = async (registry: Contract, type: string, version?: string) => {
  version ? version : (version = await toHexVersion("0.1"));

  return await ((await registry.setType(type, version, GAS_OPT)) as TransactionResponse).wait();
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
  factOptions: FactoryOptions[],
  types?: string[],
  wantContract?: boolean,
  initParams?: unknown[][]
) => {
  try {
    // check parameters
    if (
      contractNames.length != factOptions.length ||
      (types && types.length != contractNames.length)
    ) {
      throw new Error(`Lengths does not match:
        - Contract names: ${contractNames.length}
        - FactoryOptions: ${factOptions.length}
        - Types: ${types?.length}`);
    }
    // -- make sure all have signers
    for (let index = 0; index < factOptions.length; index++) {
      if (!factOptions[index].signer) {
        throw new Error(`all Factory Options must have a Signer, index: ${index} not defined`);
      }
    }
    // -- registry
    if (typeof registry == "string") {
      registry = await ethers.getContractAt("ContractRegistry", registry);
    }
    registry = registry.connect(provider);

    // Main Logic
    let contracts: Contract[] = [];
    if (wantContract || !wantContract) {
      // wantContract == true || undefined
      for (let index = 0; index < contractNames.length; index++) {
        contracts.push(
          await (deployWithRegistry(
            registry,
            contractNames[index],
            factOptions[index],
            types ? types[index] : undefined,
            true,
            initParams ? initParams[index] : undefined
          ) as Promise<Contract>)
        );
      }
      return await Promise.all(contracts);
    } else {
      for (let index = 0; index < contractNames.length; index++) {
        contracts.push(
          await (deployWithRegistry(
            registry,
            contractNames[index],
            factOptions[index],
            types ? types[index] : undefined,
            false,
            initParams ? initParams[index] : undefined
          ) as Promise<Contract>)
        );
      }
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
  registry: Contract,
  contractName: string,
  factOptions: FactoryOptions,
  type?: string,
  wantContract?: boolean,
  initParams?: unknown[]
): Promise<Contract | void | undefined> => {
  try {
    // async
    const randBytes = random32Bytes();
    // check parameters
    if (!factOptions.signer) {
      throw new Error("Signer needed to be provided in Factory Options");
    }
    // make sure the contract is connected to the correct signer
    registry = registry.connect(factOptions.signer);
    // -- type - can be the type name or type id
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
    // -- initParams
    initParams = initParams ? initParams : [];
    // get address
    const from = factOptions.signer.getAddress();
    // Main Logic
    const factory = await ethers.getContractFactory(contractName, factOptions);
    const initData = factory.interface.encodeFunctionData("initialize", [...initParams]);
    console.log(`Deploying Contract ${contractName}(${initParams}) from '${await from}'`);
    const receipt = await ((await registry.deployContract(
      factory.bytecode,
      initData,
      await randBytes,
      type,
      GAS_OPT
    )) as TransactionResponse).wait();

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

      return await ethers.getContractAt(contractName, deployEvent.args!.proxy, factOptions.signer);
    }
  } catch (error) {
    console.error(`ERROR: Cannot deploy Contract. ${error.stack}`);
  }
};
