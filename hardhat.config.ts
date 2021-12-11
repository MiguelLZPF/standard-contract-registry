import * as dotenv from "dotenv";
import * as fs from "async-file";
import { HardhatUserConfig, subtask, task, types } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { generateWallet, generateWalletBatch } from "./scripts/wallets";
import { Wallet } from "@ethersproject/wallet";
import { defaultPath, HDNode } from "@ethersproject/hdnode";
import { deploy, deployUpgradeable, upgrade } from "./scripts/deploy";
import { setGHRE } from "./scripts/utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";

dotenv.config();

//! TASKS
//* Generate Wallets
// https://hardhat.org/guides/create-task.html
task("generate-wallets", "Generates wallets needed for test etc")
  .addPositionalParam("type", "Type of generation [single, batch]", "single", types.string)
  .addParam(
    "relativePath",
    "Path relative to KEYSTORE_ROOT to store the wallets",
    undefined,
    types.string
  )
  .addOptionalParam("password", "Wallet password", undefined, types.string)
  .addOptionalParam("entropy", "Wallet entropy", undefined, types.string)
  .addOptionalParam(
    "privateKey",
    "Private key to generate wallet from. Hexadecimal String format",
    undefined,
    types.string
  )
  .addOptionalParam("mnemonic", "Mnemonic phrase to generate wallet from", undefined, types.string)
  .addOptionalParam(
    "batchSize",
    "Number of user wallets to be generated for testing purposes",
    undefined,
    types.int
  )
  .setAction(async (taskArgs) => {
    console.log(taskArgs);
    if (taskArgs.type.toLowerCase() == "batch") {
      await generateWalletBatch(
        taskArgs.relativePath!,
        taskArgs.password!,
        taskArgs.batchSize,
        taskArgs.entropy ? Buffer.from(taskArgs.entropy) : undefined
      );
    } else {
      await generateWallet(
        taskArgs.relativePath!,
        taskArgs.password!,
        taskArgs.entropy ? Buffer.from(taskArgs.entropy) : undefined,
        taskArgs.privateKey,
        taskArgs.mnemonic
      );
    }
  });

task("get-mnemonic", "Recover mnemonic phrase from an encrypted wallet")
  .addPositionalParam("path", "Full path where the encrypted wallet is located")
  .addPositionalParam("password", "Password to decrypt the wallet")
  .setAction(async ({ path, password }) => {
    const wallet = Wallet.fromEncryptedJsonSync(await fs.readFile(path), password);
    console.log(wallet.mnemonic);
  });

task("deploy", "Deploy smart contracts on '--network'")
  .addFlag("upgradeable", "Deploy as upgradeable")
  .addPositionalParam(
    "contractName",
    "Name of the contract to deploy",
    "Example_Storage",
    types.string
  )
  .addParam(
    "relativePath",
    "Path relative to KEYSTORE_ROOT to store the wallets",
    undefined,
    types.string
  )
  .addParam("password", "Password to decrypt the wallet")
  .addOptionalParam(
    "proxyAdmin",
    "Address of a deloyed Proxy Admin. Only if --upgradeable deployment",
    undefined,
    types.string
  )
  .setAction(
    async (
      { upgradeable, contractName, relativePath, password, proxyAdmin },
      hre: HardhatRuntimeEnvironment
    ) => {
      const signer = Wallet.fromEncryptedJsonSync(
        await fs.readFile(process.env.KEYSTORE_ROOT!.concat(relativePath)),
        password
      ).connect(hre.ethers.provider);
      setGHRE(hre);
      if (upgradeable) {
        await deployUpgradeable(contractName, signer, [], proxyAdmin);
      } else {
        await deploy(contractName, signer, []);
      }
    }
  );

task("upgrade", "Upgrade smart contracts on '--network'")
  .addPositionalParam(
    "contractName",
    "Name of the contract to deploy",
    "Example_Storage",
    types.string
  )
  .addParam(
    "relativePath",
    "Path relative to KEYSTORE_ROOT to store the wallets",
    undefined,
    types.string
  )
  .addParam("password", "Password to decrypt the wallet")
  .addOptionalParam("proxy", "Address of the TUP proxy", undefined, types.string)
  .addOptionalParam("proxyAdmin", "Address of a deloyed Proxy Admin", undefined, types.string)
  .addOptionalParam("args", "Contract initialize function's arguments if any", undefined)
  .setAction(
    async (
      { contractName, relativePath, password, proxy, proxyAdmin },
      hre: HardhatRuntimeEnvironment
    ) => {
      const signer = Wallet.fromEncryptedJsonSync(
        await fs.readFile(process.env.KEYSTORE_ROOT!.concat(relativePath)),
        password
      ).connect(hre.ethers.provider);
      setGHRE(hre);
      await upgrade(contractName, signer, [], proxy, proxyAdmin);
    }
  );

task("quick-test", "Random quick testing function", async (taskArgs, hre) => {
  // do anything here and test it quickly
});
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "istanbul",
    },
  },
  networks: {
    hardhat: {
      chainId: 69,
      blockGasLimit: 0x23c3ffff,
      gasPrice: 0,
      hardfork: "istanbul",
    },
    ganache: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      blockGasLimit: 600047615,
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
  typechain: {
    externalArtifacts: ["@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol"],
  },
};

export default config;
