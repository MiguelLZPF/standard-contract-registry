// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import * as fs from "async-file";
import { Wallet } from "@ethersproject/wallet";
import { Mnemonic } from "@ethersproject/hdnode";
import { ExternallyOwnedAccount } from "@ethersproject/abstract-signer";
import { SigningKey } from "@ethersproject/signing-key";
import { BytesLike } from "@ethersproject/bytes";

// Constants
// -- wallet related
export const ADMIN_WALL_PASS = "Admin!012";
const ADMIN_WALL_ENTROPY = Buffer.from("admin_entropy");
export const TEST_WALL_PASS = "password";
const TEST_WALL_ENTROPY = Buffer.from("entropy");
// -- path related
const KEYSTORE_ROOT = "keystore";
export const KEYSTORE_ADMIN = `${KEYSTORE_ROOT}/admin.json`;
export const KEYSTORE_TEST = `${KEYSTORE_ROOT}/test`;

export const USER_NUMBER = 2;

async function main() {
  //return await generateAccounts();
}

export const generateAccounts = async (
  adminPassword?: string,
  adminEntropy?: string,
  adminPrivKey?: string,
  adminMnemonic?: string,
  userNumber?: number,
  testPassword?: string,
  testEntropy?: string
) => {
  //* Parameters to Constants
  adminPassword = adminPassword ? adminPassword : ADMIN_WALL_PASS;
  userNumber = userNumber ? userNumber : USER_NUMBER;
  testPassword = testPassword ? testPassword : TEST_WALL_PASS;
  const adminEntropyBuffer = adminEntropy ? Buffer.from(adminEntropy) : ADMIN_WALL_ENTROPY;
  const testEntropyBuffer = testEntropy ? Buffer.from(testEntropy) : TEST_WALL_ENTROPY;
  //* Directories
  // -- make directory ./keystore if needed
  if (!(await fs.exists(KEYSTORE_ROOT))) {
    await fs.mkdir(KEYSTORE_ROOT);
  }
  // -- make directory ./keystore/test if needed
  if (!(await fs.exists(KEYSTORE_TEST))) {
    await fs.mkdir(KEYSTORE_TEST);
  }
  //* Wallets
  // -- create de admin wallet
  if (!(await fs.exists(KEYSTORE_ADMIN)) && adminPrivKey) {
    // -- from private key
    const admin = new Wallet(adminPrivKey);
    await fs.writeFile(KEYSTORE_ADMIN, await admin.encrypt(adminPassword));
    console.log(
      `New Admin Wallet created and stored with address: ${admin.address} as ${KEYSTORE_ADMIN}`
    );
  } else if (!(await fs.exists(KEYSTORE_ADMIN)) && adminMnemonic) {
    // -- from mnemonic phrase
    const admin = Wallet.fromMnemonic(adminMnemonic);
    await fs.writeFile(KEYSTORE_ADMIN, await admin.encrypt(adminPassword));
    console.log(
      `New Admin Wallet created and stored with address: ${admin.address} as ${KEYSTORE_ADMIN}`
    );
  } else if (!(await fs.exists(KEYSTORE_ADMIN))) {
    // -- new one
    await storeNewWallet(KEYSTORE_ADMIN, adminPassword, { entropy: adminEntropyBuffer });
  }
  // create user wallets
  let users = [];
  for (let u = 0; u < userNumber; u++) {
    // insert "0" if less than 10
    if (u < 10 && !(await fs.exists(`${KEYSTORE_TEST}/user_0${u}.json`))) {
      users.push(
        storeNewWallet(`${KEYSTORE_TEST}/user_0${u}.json`, testPassword, {
          entropy: testEntropyBuffer,
        })
      );
    } else if (!(await fs.exists(`${KEYSTORE_TEST}/user_${u}.json`))) {
      users.push(
        storeNewWallet(`${KEYSTORE_TEST}/user_${u}.json`, TEST_WALL_PASS, {
          entropy: testEntropyBuffer,
        })
      );
    }
  }
  await Promise.all(users);
};

const storeNewWallet = async (
  path: string,
  password: string,
  options?: { privKey?: string; entropy?: Buffer }
) => {
  const wallet = options?.privKey
    ? new Wallet(options.privKey)
    : Wallet.createRandom({ extraEntropy: options?.entropy });
  const encWallet = await wallet.encrypt(password);
  await fs.writeFile(path, encWallet);
  console.log(`New Wallet created and stored with address: ${wallet.address} as ${path}`);
  return wallet;
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
