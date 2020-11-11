import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import { HardhatUserConfig } from "hardhat/types";

// This is a sample Buidler task. To learn how to create your own go to
// https://buidler.dev/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, bre) => {
  const accounts = await bre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress());
  }
});

const config:HardhatUserConfig = {
  solidity: {
    version: "0.7.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
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
    timeout: 999999,
  },
};

export default config;