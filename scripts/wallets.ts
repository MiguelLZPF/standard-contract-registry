// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import * as fs from "async-file";
import { Wallet } from "@ethersproject/wallet";

export const generateWalletBatch = async (
  relativePath: string,
  password: string,
  batchSize?: number,
  entropy?: Buffer
) => {
  // parameter assignment
  relativePath = relativePath ? relativePath : "";
  batchSize = batchSize ? batchSize : +process.env.DEF_WALLET_BATCH_SIZE!;
  password = password ? password : process.env.DEF_WALLET_PASS!;
  // generate if not exists
  let wallets: Promise<Wallet>[] = [];
  for (let u = 0; u < batchSize; u++) {
    // insert "0" if less than 10
    const finalPath = u < 10 ? `${relativePath}0${u}.json` : `${relativePath}${u}.json`;
    if (!(await fs.exists(finalPath))) {
      wallets.push(generateWallet(finalPath, password, entropy));
    } else {
      console.log(`Wallet already exists at ${finalPath}`);
    }
  }
  return await Promise.all(wallets);
};

export const generateWallet = async (
  relativePath: string,
  password: string,
  entropy?: Buffer,
  privateKey?: string,
  mnemonic?: string
) => {
  const path = process.env.KEYSTORE_ROOT!.concat(relativePath);
  password = password ? password : process.env.DEF_WALLET_PASS!;
  const checking = checKeystoreDir();
  let wallet: Wallet;
  if (privateKey) {
    wallet = new Wallet(privateKey);
  } else if (mnemonic) {
    wallet = Wallet.fromMnemonic(mnemonic);
  } else {
    wallet = Wallet.createRandom({ extraEntropy: entropy });
  }
  const encWallet = await wallet.encrypt(password);
  await checking;
  await fs.writeFile(path, encWallet);
  console.log(`New Wallet created and stored with address: ${wallet.address} as ${path}`);
  return wallet;
};

const checKeystoreDir = async () => {
  // make directory ./keystore if needed
  if (!(await fs.exists(process.env.KEYSTORE_ROOT!))) {
    await fs.mkdir(process.env.KEYSTORE_ROOT!);
  }
};
