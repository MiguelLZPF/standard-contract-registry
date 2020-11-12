import { ethers } from "hardhat";

import * as fs from "async-file";
import { Contract, providers, Signer, Wallet } from "ethers";
import { formatBytes32String } from "ethers/lib/utils";
import util from "util";

export const provider = ethers.provider;

export type TransactionResponse = providers.TransactionResponse;
export type TransactionReceipt = providers.TransactionReceipt;

// gas default options
export const GAS_OPT = {
  gasLimit: "0xffffffff",
  gasPrice: "0x00",
};
/**
 *  Async funtion that creates a new wallet and stores it encripted in the path specified.
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
    console.error(`ERROR: Cannot create or retreive wallet: ${error.stack}`);
  }
  return wallet;
};

export const getWallets = async (path?: string) => {
  try {
    path = path ? path : "./keystores";
    let wallets: string[] = [];

    (await fs.readdir(path)).forEach(async (wallet) => {
      wallets.push(await fs.readFile(wallet));
    });

    return wallets;
  } catch (error) {
    console.error(`ERROR: Cannot retreive wallets: ${error.stack}`);
  }
};

export const getWallet = async (from: Signer, password: string) => {
  try {
    const wallets = getWallets();
    const address = from.getAddress();
    (await wallets)!.forEach(async (wallet) => {
      const walletJson = JSON.parse(wallet);
      if (walletJson.address == (await address)) {
        return Wallet.fromEncryptedJsonSync(wallet, password);
      }
    });
  } catch (error) {
    console.error(`ERROR: Cannot retreive wallet: ${error.stack}`);
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
  const randInt = Math.floor(Math.random() * (99999999 - 0 + 1) + 0);
  return formatBytes32String(randInt.toString());
};

export const logObject = (object: any) => {
  return util.inspect(object, { showHidden: false, depth: null });
};
