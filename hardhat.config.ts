import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-solhint";
import "hardhat-contract-sizer";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: {
    version: "0.7.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100
      }
    }
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      gasPrice: parseInt("0x00"),
      gas: parseInt("0xffffffffff"),
      blockGasLimit: parseInt("0xffffffffff"),
    },
    ganachecli: {
      url: "http://127.0.0.1:8545",
      gasPrice: parseInt("0x00"),
      gas: parseInt("0xffffffffff"),
      blockGasLimit: parseInt("0xffffffffff"),
    },
  },
  mocha: {
    timeout: "none"
  },
  contractSizer:{
    alphaSort: false,
    runOnCompile: true,
    disambiguatePaths: false
  }
} as HardhatUserConfig;