import { Contract, Signer, Wallet, Event } from "ethers";
import { isAddress, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { ethers } from "hardhat";
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
 *
 * @param types array of strings with the type names to be created
 * @param registry actual registry contract or address that keeps track of the types
 * @param version (optional) the version to initialize the new types, can be one version for all or
 *        one version for each type.
 * @return an array with all receipts from transactions
 */
export const setTypes = async (
  types: string[],
  registry: Contract,
  version?: string | string[]
) => {
  let receipts: Promise<TransactionReceipt>[] = [];
  if (version && typeof version == "string") {
    types.forEach(async (type) => {
      receipts.push(
        ((await registry.setType(type, version, GAS_OPT)) as TransactionResponse).wait()
      );
    });
  } else if (version) {
    // must be string[]
    types.forEach(async (type, index) => {
      receipts.push(
        ((await registry.setType(type, version![index], GAS_OPT)) as TransactionResponse).wait()
      );
    });
  } else {
    version = await toHexVersion("0.1");
    types.forEach(async (type) => {
      receipts.push(
        ((await registry.setType(type, version, GAS_OPT)) as TransactionResponse).wait()
      );
    });
  }
  return await Promise.all(receipts);
};

export const deployWithRegistry = async (
  registry: Contract | string,
  contractName: string,
  factOptions?: FactoryOptions,
  type?: string,
  wantContract?: boolean,
  initParams?: unknown[]
) => {
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
    const initData = factory.interface.encodeFunctionData("initialize", [...initParams]);
    const receipt = await registry.deployContract(
      factory.bytecode,
      initData,
      await randBytes,
      type,
      GAS_OPT
    );

    //get event and contract
    if (wantContract) {
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
      throw new Error("No signer specified in factOptions or in registry.signer");
    } else {
      registry = await ethers.getContractAt("ContractRegistry", registry, factOptions.signer);
    }
  } else {
    // registry is a Contract
    if ((!factOptions && !registry.signer) || !isAddress(await registry.signer.getAddress())) {
      throw new Error("No signer specified in factOptions or in registry.signer");
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
