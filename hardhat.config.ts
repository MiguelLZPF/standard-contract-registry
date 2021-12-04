import * as dotenv from "dotenv";

import { HardhatUserConfig, task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { generateAccounts } from "./scripts/accounts";

dotenv.config();

//! TASKS
// https://hardhat.org/guides/create-task.html
task("generate-accounts", "Generates all wallets needed for test etc")
  .addOptionalParam("adminPassword", "Admin wallet password", undefined, types.string)
  .addOptionalParam("adminEntropy", "Admin wallet entropy [Buffer]", undefined, types.string)
  .addOptionalParam(
    "adminPrivKey",
    "Private key to generate wallet from. Hexadecimal String format",
    undefined,
    types.string
  )
  .addOptionalParam(
    "adminMnemonic",
    "Mnemonic phrase to generate admin wallet from",
    undefined,
    types.string
  )
  .addOptionalParam(
    "userNumber",
    "Number of user wallets to be generated for testing purposes",
    undefined,
    types.int
  )
  .addOptionalParam("testPassword", "Test wallets password", undefined, types.string)
  .addOptionalParam("testEntropy", "Test wallets entropy", undefined, types.string)
  .setAction(async ({adminPassword}) => {
    await generateAccounts(adminPassword);
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      blockGasLimit: 0x23c3ffff,
      gasPrice: 0,
      hardfork: "istanbul",
    },
  },
  contractSizer: {
    runOnCompile: true,
  },
  gasReporter: {
    enabled: true,
    currency: "EUR",
  },
};

export default config;
