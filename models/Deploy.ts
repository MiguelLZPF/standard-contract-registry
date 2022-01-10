import { ENV } from "../process.env";

export interface INetwork {
  chainId: number;
  name: string;
  url: string;
}

export const networks = new Map<number | undefined, INetwork>([
  [
    undefined,
    { chainId: ENV.NETWORK.HARDHAT.CHAINID, name: "hardhat", url: ENV.NETWORK.HARDHAT.URL },
  ], // Default hardhat
  [0, { chainId: ENV.NETWORK.HARDHAT.CHAINID, name: "hardhat", url: ENV.NETWORK.HARDHAT.URL }], // Default hardhat
  [
    ENV.NETWORK.HARDHAT.CHAINID,
    { chainId: ENV.NETWORK.HARDHAT.CHAINID, name: "hardhat", url: ENV.NETWORK.HARDHAT.URL },
  ],
  [
    ENV.NETWORK.GANACHE.CHAINID,
    { chainId: ENV.NETWORK.HARDHAT.CHAINID, name: "ganache", url: ENV.NETWORK.GANACHE.URL },
  ],
]);

export interface IRegularDeployment {
  address: string;
  contractName?: string;
  deployTxHash?: string;
  deployTimestamp?: Date | number | string;
  byteCodeHash?: string;
}

export interface IUpgradeDeployment {
  admin: string;
  proxy: string; // or storage
  logic: string; // or implementation
  contractName?: string;
  proxyTxHash?: string;
  logicTxHash?: string;
  deployTimestamp?: Date | number | string;
  upgradeTimestamp?: Date | number | string;
  byteCodeHash?: string;
}

export interface INetworkDeployment {
  network: {
    name: string;
    chainId: number | string;
  };
  smartContracts: {
    proxyAdmins?: IRegularDeployment[];
    contracts: (IUpgradeDeployment | IRegularDeployment)[];
  };
}
