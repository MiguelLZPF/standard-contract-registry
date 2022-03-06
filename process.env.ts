import * as dotenv from "dotenv";
import dotendExpand from "dotenv-expand";

const myEnv = dotenv.config({ path: __dirname + "/.env" });
dotendExpand.expand(myEnv);

const getFromEnvFile = (name: string, defaultValue?: string | number, isNumber?: boolean) => {
  const constant = process.env[name];
  if (constant && isNumber) {
    return +constant;
  } else {
    // string
    return constant ? constant : defaultValue;
  }
};

//* Change this values ONLY in .env file
const WALLET = {
  DEFAULT: {
    PASSWORD: getFromEnvFile("WALLET_DEF_PASSWORD", "") as string,
    BATCH_SIZE: getFromEnvFile("WALLET_DEF_BATCH_SIZE", 2, true) as number,
  },
  TEST: {
    MNEMONIC: getFromEnvFile("WALLET_TEST_MNEMONIC", "") as string,
    USER_NUMBER: getFromEnvFile("WALLET_TEST_USER_NUMBER", 2, true) as number,
  },
};

const PATH = {
  KEYSTORE_ROOT: getFromEnvFile("PATH_KEYSTORE_ROOT", "keystore") as string,
  DEPLOYMENTS: getFromEnvFile("PATH_DEPLOYMENTS", "deployments.json") as string,
};

const NETWORK = {
  DEFAULT: {
    SOLIDITY: getFromEnvFile("NET_DEFAULT_SOL", undefined) as string | undefined,
    EVM: getFromEnvFile("NET_DEFAULT_EVM", undefined) as string | undefined,
    GAS_LIMIT: getFromEnvFile("NET_DEFAULT_GAS_LIMIT", 0x23c3ffff, true) as number,
    GAS_PRICE: getFromEnvFile("NET_DEFAULT_GAS_PRICE", 0x00, true) as number,
  },
  HARDHAT: {
    CHAINID: getFromEnvFile("NET_HARDHAT_CHAINID", 69, true) as number,
    URL: getFromEnvFile("NET_HARDHAT_URL", "http://127.0.0.1:8545") as string,
  },
  GANACHE: {
    CHAINID: getFromEnvFile("NET_GANACHE_CHAINID", 1337, true) as number,
    URL: getFromEnvFile("NET_GANACHE_URL", "http://127.0.0.1:8545") as string,
  },
};

const DEPLOY = {
  PROXY_ADMIN: {
    NAME: getFromEnvFile("PROXY_ADMIN_NAME", "ProxyAdmin") as string,
    ADDRESS: getFromEnvFile("PROXY_ADMIN_ADDRESS", undefined) as string | undefined,
  },
};

const CONTRACT = {
  CONTRACT_REGISTRY: {
    NAME: getFromEnvFile("CONTRACT_CONTRACT_REGISTRY_NAME", "ContractRegistry") as string,
  },
  CONTRACT_DEPLOYER: {
    NAME: getFromEnvFile("CONTRACT_CONTRACT_DEPLOYER_NAME", "ContractDeployer") as string,
  },
  EXAMPLE_BALLOT: {
    NAME: getFromEnvFile("CONTRACT_EXAMPLE_STORAGE_NAME", "ExampleBallot") as string,
  },
  EXAMPLE_OWNER: {
    NAME: getFromEnvFile("CONTRACT_EXAMPLE_STORAGE_NAME", "ExampleOwner") as string,
  },
  EXAMPLE_STORAGE: {
    NAME: getFromEnvFile("CONTRACT_EXAMPLE_STORAGE_NAME", "ExampleStorage") as string,
  },
};

export const ENV = {
  WALLET,
  PATH,
  NETWORK,
  DEPLOY,
  CONTRACT,
};
