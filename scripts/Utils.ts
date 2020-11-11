import { ethers } from "hardhat";

import * as fs from "async-file";
import { Contract, providers, Signer, Wallet } from "ethers";
import * as TUP from "./../artifacts/contracts/libs/proxy/TransparentUpgradeableProxy.sol/TransparentUpgradeableProxy.json";
import * as Registry from "./../artifacts/contracts/Registry.sol/ContractRegistry.json";
import { formatBytes32String, randomBytes } from "ethers/lib/utils";

const util = require("util");

export const provider = ethers.provider;

export type TransactionResponse = providers.TransactionResponse;
export type TransactionReceipt = providers.TransactionReceipt;

// gas default options
export const GAS_OPT = {
  gasLimit: "0xffffffff",
  gasPrice: "0x00",
};
/**
 *  Creates a new wallet and stores it encripted in the specified path
 *
 * @dev If alrready created, it decrypts it and returns.
 *
 * @param path to store the new generated wallet
 * @param password used to encript and decript the wallet
 * @param entropy used to add random to the private key
 *
 * @return wallet the instance of the Wallet created, unencrypted and ready to use
 */
export const createWallet = async (
  path: string,
  password: string,
  entropy?: string
): Promise<Wallet | undefined> => {
  let wallet: Wallet | undefined;
  try {
    // if not exists, create save in wallets and keystores (encypted)
    if (!(await fs.exists(path))) {
      console.log(`${path} does not exists, creating new one`);
      if (entropy) {
        wallet = Wallet.createRandom(entropy);
      } else {
        wallet = Wallet.createRandom();
      }
      wallet = wallet.connect(ethers.provider);
      const encWallet = wallet.encrypt(password);
      fs.writeFile(path, await encWallet);
    } else {
      // if exists, read, decrypt and add to wallets array
      const encWallet = JSON.parse(await fs.readFile(path));
      wallet = await ethers.Wallet.fromEncryptedJson(
        JSON.stringify(encWallet),
        password
      );
      wallet = wallet.connect(ethers.provider);
    }
  } catch (error) {
    console.error(`ERROR: Cannot create or retreive wallet: ${error}`);
  }
  return wallet;
};

export const deploy = async (
  contractName: string,
  from: Signer,
  initParams?: unknown[]
) => {
  try {
    initParams = initParams ? initParams : [];
    console.log(
      `deploying '${contractName}(${initParams})' with '${await from.getAddress()}' account`
    );
    // Deploy contract
    const contractFactory = await ethers.getContractFactory(contractName, from);
    let contractInterface = await contractFactory.deploy(
      ...initParams,
      GAS_OPT
    );
    return await contractInterface.deployed();
  } catch (error) {
    console.error(
      `ERROR: Cannot deploy or initialize Contract. ${error.stack}`
    );
  }
};

export const deployNinit = async (
  contractName: string,
  from: Signer | Wallet,
  initParams?: unknown[]
): Promise<[Contract, providers.TransactionReceipt] | undefined> => {
  try {
    initParams = initParams ? initParams : [];
    console.log(
      `deploying and initializing '${contractName}(${initParams})' with '${await from.getAddress()}' account`
    );
    // Deploy contract
    const contractFactory = await ethers.getContractFactory(contractName, from);
    let contractInterface = await contractFactory.deploy();
    contractInterface = await contractInterface.deployed();
    // Initialice host contract
    const resTx: providers.TransactionResponse = await contractInterface.initialize(
      ...initParams,
      GAS_OPT
    );
    return [contractInterface, await resTx.wait()];
  } catch (error) {
    console.error(
      `ERROR: Cannot deploy or initialize Contract. ${error.stack}`
    );
  }
};

export const deployNinitRegistry = async (
  from: Signer,
  proxyAdmin: string,
  initParams?: unknown[]
) => {
  try {
    initParams = initParams ? initParams : [];
    // Deploy contracts
    const registryFactory = ethers.getContractFactory(
      Registry.abi,
      Registry.bytecode,
      from
    );
    const tupFactory = ethers.getContractFactory(TUP.abi, TUP.bytecode, from);
    console.log(` 1. deploying registry logic...`);
    const registryInterface = (
      await (await registryFactory).deploy()
    ).deployed();
    const data = (
      await registryFactory
    ).interface.encodeFunctionData("initialize", [...initParams]);
    //console.log(`Encoded data: ${data}`);
    // Deploy TUProxy, connects to registry logic, sets admin to proxy admin and init registry
    // all from "from"
    console.log(
      ` 2. deploying registry TUP proxy and init registry with data: '${data}'`
    );
    const tupInterface = await (
      await (await tupFactory).deploy(
        (await registryInterface).address,
        proxyAdmin,
        data,
        GAS_OPT
      )
    ).deployed();
    console.log(` 3. Contracts deployed using deployNinitRegistry`);

    // Contract with address TUP and interface Registry
    const registry = new Contract(tupInterface.address, Registry.abi, from);
    return registry;
  } catch (error) {
    console.error(
      `ERROR: Cannot deploy or initialize Contract. ${error.stack}`
    );
  }
};

export const getEvents = async (
  contractInstance: Contract,
  eventName: string,
  indexes: any[],
  onlyFirst?: boolean,
  fromBlock?: number | string,
  toBlock?: number | string
) => {
  try {
    const filter = contractInstance.filters[eventName](...indexes);
    const events = await contractInstance.queryFilter(
      filter,
      fromBlock,
      toBlock
    );
    if (onlyFirst && events.length == 1) {
      return events[0];
    } else {
      return events;
    }
  } catch (error) {
    console.error(`ERROR: Cannot get any event. ${(error.stack, error.code)}`);
  }
};

export const toHexIp = async (decimalIp: string) => {
  try {
    let hexIp = "0x";
    const splitIp = decimalIp.split(".");
    if (splitIp.length != 4) {
      throw new Error(
        "Not valid IP address. Notice that IPv6 is not supported."
      );
    }
    splitIp.forEach(async (byte) => {
      if (byte.length == 1) {
        hexIp = `${hexIp}0${parseInt(byte).toString(16)}`;
      } else {
        hexIp = `${hexIp}${parseInt(byte).toString(16)}`;
      }
    });
    return hexIp;
  } catch (error) {
    console.error(
      `ERROR: Cannot convert to hexadecimal IP. ${(error.stack, error.code)}`
    );
  }
};

export const toHexMac = async (mac: string) => {
  try {
    let hexMac = "0x";
    //const re = "/\:/gi";
    const rawMac = mac.split(":");
    //console.log(rawMac, rawMac.length);
    if (rawMac.length != 6) {
      throw new Error("Invalid MAC length, should be 6 bytes always");
    }

    rawMac.forEach(async (byte) => {
      hexMac = `${hexMac}${byte}`
    })
    return hexMac;
  } catch (error) {
    console.error(
      `ERROR: Cannot convert to hexadecimal MAC. ${error.stack}`
    );
  }
};

export const toHexVersion = async (decVersion: string) => {
  try {
    let hexVersion = "0x";
    const splitVersion = decVersion.split(".");
    if (splitVersion.length != 2) {
      throw new Error("Not valid version. 'XX.XX' only format accepted.");
    }
    splitVersion.forEach(async (byte) => {
      if (byte.length == 1) {
        hexVersion = `${hexVersion}0${parseInt(byte).toString(16)}`;
      } else {
        hexVersion = `${hexVersion}${parseInt(byte).toString(16)}`;
      }
    });
    return hexVersion;
  } catch (error) {
    console.error(
      `ERROR: Cannot convert to hexadecimal version. ${
        (error.stack, error.code)
      }`
    );
  }
};

export const random32Bytes = async () => {
  const randInts = randomBytes(32);//Math.floor(Math.random() * (999999999999999 - 0 + 1) + 0)
  let bytes: string = "0x";
  randInts.forEach(async (intByte) => {
    let byte = intByte.toString(16);
    bytes = byte.length == 1 ? `${bytes}0${byte}` : `${bytes}${byte}`;
  });

  return bytes;
};

export const logObject = (object: any) => {
  return util.inspect(object, { showHidden: false, depth: null });
};
