// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Signer } from "@ethersproject/abstract-signer";
import { ghre } from "./utils";
import * as fs from "async-file";
import { INetworkDeployment, IRegularDeployment, IUpgradeDeployment } from "../models/Deploy";
import { isAddress, keccak256 } from "ethers/lib/utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Contract } from "ethers";
import {
  ProxyAdmin,
  ProxyAdmin__factory,
  TransparentUpgradeableProxy__factory as TUP__factory,
} from "../typechain-types";
import { TransactionReceipt } from "@ethersproject/providers";

// gas default options
export const GAS_OPT = {
  gasLimit: "0x23c3ffff", //"0xffffffff",
  gasPrice: "0x00",
};
const PROXY_ADMIN_NAME = process.env.PROXY_ADMIN_NAME ? process.env.PROXY_ADMIN_NAME : "ProxyAdmin";

export const deploy = async (contractName: string, deployer: Signer, args: unknown[]) => {
  const ethers = ghre.ethers;
  const factory = await ethers.getContractFactory(contractName, deployer);
  const contract = await (await factory.deploy(...args, GAS_OPT)).deployed();
  console.log(`
    Regular contract deployed:
      - Address: ${contract.logic}
      - Arguments: ${args}
  `);
  await saveDeployment({
    address: contract.address,
    contractName: contractName,
    deployTimestamp: await getContractTimestamp(contract),
    deployTxHash: contract.deployTransaction.hash,
    byteCodeHash: keccak256(factory.bytecode),
  } as IRegularDeployment);
};

export const deployUpgradeable = async (
  contractName: string,
  deployer: Signer,
  args: unknown[],
  proxyAdmin?: string | ProxyAdmin
) => {
  const ethers = ghre.ethers;
  //* Proxy Admin
  // save or update Proxy Admin in deployments
  let adminDeployment: Promise<IRegularDeployment | undefined> | IRegularDeployment | undefined;
  if (proxyAdmin && typeof proxyAdmin == "string" && isAddress(proxyAdmin)) {
    proxyAdmin = (await ethers.getContractAt(PROXY_ADMIN_NAME, proxyAdmin, deployer)) as ProxyAdmin;
  } else if (proxyAdmin && typeof proxyAdmin == "string") {
    throw new Error("String provided as Proxy Admin's address is not an address");
  } else if (!proxyAdmin && process.env.PROXY_ADMIN_ADDRESS) {
    proxyAdmin = (await ethers.getContractAt(
      PROXY_ADMIN_NAME,
      process.env.PROXY_ADMIN_ADDRESS,
      deployer
    )) as ProxyAdmin;
  } else if (!proxyAdmin) {
    // deploy new Proxy Admin
    console.warn("WARN: no proxy admin provided, deploying new Proxy Admin");
    proxyAdmin = await (await new ProxyAdmin__factory(deployer).deploy(GAS_OPT)).deployed();
    adminDeployment = {
      address: proxyAdmin.address,
      contractName: PROXY_ADMIN_NAME,
      deployTimestamp: await getContractTimestamp(proxyAdmin),
      deployTxHash: proxyAdmin.deployTransaction.hash,
      byteCodeHash: keccak256(ProxyAdmin__factory.bytecode),
    };
  } else {
    // proxy admin given as Contract
    proxyAdmin = proxyAdmin as ProxyAdmin;
  }
  adminDeployment = (await adminDeployment)
    ? adminDeployment
    : getProxyAdminDeployment(proxyAdmin.address);
  //* Actual contracts
  const factory = await ethers.getContractFactory(contractName, deployer);
  const logic = await (await factory.deploy(GAS_OPT)).deployed();
  const timestamp = getContractTimestamp(logic);
  // -- encode function params for TUP
  let initData: string;
  if (args.length > 0) {
    initData = factory.interface.encodeFunctionData("initialize", [...args]);
  } else {
    initData = factory.interface._encodeParams([], []);
  }
  //* TUP - Transparent Upgradeable Proxy
  const tuProxy = await (
    await new TUP__factory(deployer).deploy(logic.address, proxyAdmin.address, initData, GAS_OPT)
  ).deployed();

  console.log(`
    Upgradeable contract deployed:
      - Proxy Admin: ${proxyAdmin.address},
      - Proxy: ${tuProxy.address},
      - Logic: ${logic.address}
      - Arguments: ${args}
  `);
  // store deployment information
  await saveDeployment(
    {
      admin: proxyAdmin.address,
      proxy: tuProxy.address,
      logic: logic.address,
      contractName: contractName,
      deployTimestamp: await timestamp,
      proxyTxHash: tuProxy.deployTransaction.hash,
      logicTxHash: logic.deployTransaction.hash,
      byteCodeHash: keccak256(factory.bytecode),
    } as IUpgradeDeployment,
    (await adminDeployment)
      ? await adminDeployment
      : {
          address: proxyAdmin.address,
          contractName: PROXY_ADMIN_NAME,
          byteCodeHash: keccak256(ProxyAdmin__factory.bytecode),
        }
  );
};

export const upgrade = async (
  contractName: string,
  deployer: Signer,
  args: unknown[],
  proxy?: string,
  proxyAdmin?: string | ProxyAdmin
) => {
  const ethers = ghre.ethers;
  const contractDeploymentP = proxy
    ? (getContractDeployment(proxy) as Promise<IUpgradeDeployment>)
    : (getContractDeployment(contractName) as Promise<IUpgradeDeployment>);
  //* Proxy Admin
  if (proxyAdmin && typeof proxyAdmin == "string" && isAddress(proxyAdmin)) {
    // use given address as ProxyAdmin
    proxyAdmin = (await ethers.getContractAt(PROXY_ADMIN_NAME, proxyAdmin, deployer)) as ProxyAdmin;
  } else if (proxyAdmin && typeof proxyAdmin == "string" /*  && !isAddress(proxyAdmin) */) {
    // given a proxy admin but is not an address nor a ProxyAdmin
    throw new Error("String provided as Proxy Admin's address is not an address");
  } else if (proxyAdmin && typeof proxyAdmin != "string") {
    // use given ProxyAdmin
    proxyAdmin = proxyAdmin as ProxyAdmin;
  } else {
    // no proxy admin provided
    const contractDeployment = (await contractDeploymentP) as IUpgradeDeployment;
    proxyAdmin = (await ethers.getContractAt(
      PROXY_ADMIN_NAME,
      contractDeployment.admin ? contractDeployment.admin : process.env.PROXY_ADMIN_ADDRESS!,
      deployer
    )) as ProxyAdmin;
  }
  //* Actual contracts
  const factory = await ethers.getContractFactory(contractName, deployer);
  const newLogic = await (await factory.deploy(GAS_OPT)).deployed();
  const timestamp = getContractTimestamp(newLogic);
  // -- encode function params for TUP
  let initData: string;
  if (args.length > 0) {
    initData = factory.interface.encodeFunctionData("initialize", [...args]);
  } else {
    initData = factory.interface._encodeParams([], []);
  }
  //* TUP - Transparent Upgradeable Proxy
  const contractDeployment = (await contractDeploymentP) as IUpgradeDeployment;
  let receipt: TransactionReceipt;
  if (!contractDeployment.proxy) {
    throw new Error("ERROR: contract retrieved is not upgradeable");
  } else if (args.length > 0) {
    receipt = await (
      await proxyAdmin.upgradeAndCall(contractDeployment.proxy, newLogic.address, initData, GAS_OPT)
    ).wait();
  } else {
    receipt = await (
      await proxyAdmin.upgrade(contractDeployment.proxy, newLogic.address, GAS_OPT)
    ).wait();
  }
  console.log(`
    Contract upgraded:
      - Proxy Admin: ${proxyAdmin.address},
      - Proxy: ${contractDeployment.proxy},
      - Previous Logic: ${contractDeployment.logic}
      - New Logic: ${newLogic.address}
      - Arguments: ${args}
  `);
  // store deployment information
  contractDeployment.logic = newLogic.address;
  contractDeployment.contractName = contractName;
  contractDeployment.logicTxHash = newLogic.deployTransaction.hash;
  contractDeployment.byteCodeHash = keccak256(factory.bytecode);
  contractDeployment.upgradeTimestamp = await timestamp;
  await saveDeployment(contractDeployment);
};

export const saveDeployment = async (
  deployment: IRegularDeployment | IUpgradeDeployment,
  proxyAdmin?: IRegularDeployment
) => {
  let { networkIndex, netDeployment, deployments } = await getActualNetDeployment();
  // if no deployed yet in this network
  if (networkIndex == undefined) {
    const provider = ghre.ethers.provider;
    netDeployment = {
      network: {
        name: provider.network.name,
        chainId: provider.network.chainId,
      },
      smartContracts: {
        proxyAdmins: proxyAdmin ? [proxyAdmin] : [],
        contracts: [deployment],
      },
    };
    // add to network deployments array
    deployments.push(netDeployment);
  } else if (netDeployment) {
    // if deployed before in this network
    //* proxy admin
    if (proxyAdmin && netDeployment.smartContracts.proxyAdmins) {
      // if new proxyAdmin and some proxy admin already registered
      const oldIndex = netDeployment.smartContracts.proxyAdmins.findIndex(
        (proxy) => proxy.address == proxyAdmin.address
      );
      if (oldIndex != -1) {
        // found, update proxyAdmin
        netDeployment.smartContracts.proxyAdmins[oldIndex] = proxyAdmin;
      } else {
        // not found, push new proxyAdmin
        netDeployment.smartContracts.proxyAdmins.push(proxyAdmin);
      }
    } else if (proxyAdmin) {
      // network deployment but no Proxy admins
      netDeployment.smartContracts.proxyAdmins = [proxyAdmin];
    }
    //* smart contract
    const upgradeThis = netDeployment.smartContracts.contracts.findIndex(
      (contract) =>
        (contract as IUpgradeDeployment).proxy &&
        (contract as IUpgradeDeployment).proxy == (deployment as IUpgradeDeployment).proxy
    );
    if (upgradeThis != -1) {
      // found, update upgradeable deployment
      netDeployment.smartContracts.contracts[upgradeThis] = deployment;
    } else {
      // not found or not upgradeable
      netDeployment.smartContracts.contracts.push(deployment);
    }
    // replace (update) network deployment
    deployments[networkIndex] = netDeployment;
  }

  // store/write deployments JSON file
  await fs.writeFile(process.env.DEPLOYMENTS_PATH!, JSON.stringify(deployments));
};

const getProxyAdminDeployment = async (address?: string) => {
  const { networkIndex, netDeployment, deployments } = await getActualNetDeployment();

  if (networkIndex == undefined || !netDeployment) {
    throw new Error("ERROR: there is no deployment for this network");
  } else if (netDeployment.smartContracts.proxyAdmins) {
    if (address && isAddress(address)) {
      return netDeployment.smartContracts.proxyAdmins?.find(
        (proxyAdmin) => proxyAdmin.address === address
      );
    } else if (address) {
      throw new Error("String provided as Proxy Admin's address is not an address");
    } else {
      // no address, get first Proxy Admin
      return netDeployment.smartContracts.proxyAdmins[0];
    }
  } else {
    throw new Error("ERROR: there is no Proxy Admin deployed in this network");
  }
};

const getContractDeployment = async (addressOrName: string) => {
  const { networkIndex, netDeployment, deployments } = await getActualNetDeployment();

  if (networkIndex == undefined || !netDeployment) {
    throw new Error("ERROR: there is no deployment for this network");
  } else if (!netDeployment.smartContracts.contracts) {
    throw new Error("ERROR: there is no contracts deployed in this network");
  } else if (isAddress(addressOrName)) {
    return netDeployment.smartContracts.contracts.find(
      (contract) =>
        (contract as IUpgradeDeployment).proxy == addressOrName ||
        (contract as IRegularDeployment).address == addressOrName
    );
  } else {
    // if contract came provided get last deployment with this name
    const contractsFound = netDeployment.smartContracts.contracts.filter(
      (contract) => contract.contractName == addressOrName
    );
    return contractsFound.pop();
  }
};

const getActualNetDeployment = async (hre?: HardhatRuntimeEnvironment) => {
  const provider = hre ? hre.ethers.provider : ghre.ethers.provider;
  provider.network ? undefined : await provider.getNetwork();
  const path = process.env.DEPLOYMENTS_PATH!;
  let deployments: INetworkDeployment[] = [];
  // if the file exists, get previous data
  if (await fs.exists(path)) {
    deployments = JSON.parse(await fs.readFile(path));
  } else {
    console.warn("WARN: no deplyments file, createing a new one...");
  }
  // check if network is available in the deployments file
  const networkIndex = deployments.findIndex(
    (netDepl) =>
      netDepl.network.name == provider.network.name &&
      netDepl.network.chainId == provider.network.chainId
  );
  let netDeployment: INetworkDeployment | undefined;
  if (networkIndex !== -1) {
    netDeployment = deployments[networkIndex];
    return {
      networkIndex: networkIndex,
      netDeployment: netDeployment,
      deployments: deployments,
    };
  } else {
    return {
      deployments: deployments,
    };
  }
};

const getContractTimestamp = async (
  contract: Contract,
  deployTxHash?: string,
  hre?: HardhatRuntimeEnvironment
) => {
  const provider = hre ? hre.ethers.provider : ghre.ethers.provider;

  let receipt: TransactionReceipt;
  if (contract.deployTransaction && contract.deployTransaction.hash) {
    receipt = await provider.getTransactionReceipt(contract.deployTransaction.hash);
  } else if (deployTxHash && isAddress(deployTxHash)) {
    receipt = await provider.getTransactionReceipt(deployTxHash);
  } else {
    console.error("ERROR: cannot get Tx from contract or parameter");
    return undefined;
  }
  if (receipt && receipt.blockHash) {
    const timestampSeconds = (await provider.getBlock(receipt.blockHash)).timestamp;
    return new Date(timestampSeconds * 1000).toISOString();
  } else {
    console.error("ERROR: cannot get Tx Block Hash");
    return undefined;
  }
};
