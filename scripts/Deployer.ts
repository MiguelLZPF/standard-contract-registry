import { Signer, Wallet } from "ethers";
import { ethers } from "hardhat";
import { FactoryOptions } from "hardhat/types";
import { GAS_OPT } from "../scripts/Utils";

export const deployLibs = async (from: Signer | Wallet) => {
  try {
    const factOpt: FactoryOptions = {
      signer: from,
    };
    return await (await deploy("Strings", factOpt))!.deployed();
  } catch (error) {
    console.error(`Cannot deploy libraries. ${error.stack}`);
  }
};

export const deploy = async (
  contractName: string,
  factoryOpt: FactoryOptions,
  deployParams?: unknown[]
) => {
  try {
    deployParams = deployParams ? deployParams : [];

    console.log(
      `deploying '${contractName}(${deployParams})' with '${await factoryOpt.signer!.getAddress()}' account`
    );
    // Deploy contractnpx
    const contractFactory = await ethers.getContractFactory(
      contractName,
      factoryOpt
    );

    const contractInterface = await contractFactory.deploy(
      ...deployParams,
      GAS_OPT
    );
    return await contractInterface.deployed();
  } catch (error) {
    console.error(`ERROR: Cannot deploy Contract. ${error.stack}`);
  }
};

export const deployNinit = async (
  contractName: string,
  admin: Signer,
  deployer?: Signer,
  factoryOpt?: FactoryOptions,
  initParams?: unknown[]
) => {
  try {
    initParams = initParams ? initParams : [];
    // use always factoryOpts
    if (factoryOpt && deployer) {
      factoryOpt.signer = deployer;
    } else if (deployer) {
      factoryOpt = {
        signer: deployer,
      };
    } else if (factoryOpt) {
      deployer = factoryOpt.signer;
    } else {
      throw new Error(
        "bad parameters given, need at least one from or factoryOpt"
      );
    }
    const adminAddr = await admin.getAddress();
    console.log(
      `deploying and initializing '${contractName}(${initParams})' with '${await deployer!.getAddress()}' account`
    );
    // Deploy contract
    const contractFactory = ethers.getContractFactory(contractName, factoryOpt);
    const proxyFactory = ethers.getContractFactory(
      "AdminUpgradeabilityProxy",
      deployer
    );

    const contractInterface = await (await contractFactory).deploy(GAS_OPT);
    const data = contractInterface.interface.encodeFunctionData(
      "initialize",
      initParams
    );
    const proxyInterface = await (
      await (await proxyFactory).deploy(
        contractInterface.address,
        adminAddr,
        data,
        GAS_OPT
      )
    ).deployed();

    return contractInterface.attach(proxyInterface.address);
  } catch (error) {
    console.error(
      `ERROR: Cannot deploy or initialize Contract. ${error.stack}`
    );
  }
};

export const deployNinitRegistry = async (
  factoryOpt: FactoryOptions,
  proxyAdmin: string,
  initParams?: unknown[]
) => {
  try {
    initParams = initParams ? initParams : [];
    // Deploy contracts
    const registryFactory = ethers.getContractFactory("ContractRegistry", factoryOpt);
    const tupFactory = ethers.getContractFactory(
      "TrasparentUpgradeableProxy",
      factoryOpt
    );
    console.log(` 1. deploying registry logic...`);
    const registryInterface = (
      await (await registryFactory).deploy()
    ).deployed();
    const data = (
      await registryFactory
    ).interface.encodeFunctionData("initialize", [...initParams]);
    //console.log(`Encoded data: ${data}`);
    // Deploy TUProxy, connects to registry logic, sets admin to proxy admin and init registry
    // all from "from"
    console.log(
      ` 2. deploying registry TUP proxy and init registry with data: '${data}'`
    );
    const tupInterface = await (
      await (await tupFactory).deploy(
        (await registryInterface).address,
        proxyAdmin,
        data,
        GAS_OPT
      )
    ).deployed();
    console.log(` 3. Contracts deployed using deployNinitRegistry`);

    // Contract with address TUP and interface Registry

    const registry = ethers.getContractAt(
      "ContractRegistry",
      tupInterface.address,
      factoryOpt.signer
    );
    return registry;
  } catch (error) {
    console.error(
      `ERROR: Cannot deploy or initialize Contract. ${error.stack}`
    );
  }
};
