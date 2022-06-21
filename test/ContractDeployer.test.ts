import * as hre from "hardhat";
import { isAddress } from "@ethersproject/address";
import { Wallet } from "@ethersproject/wallet";
import { expect } from "chai";
import { step } from "mocha-steps";
import {
  ContractDeployer,
  ContractDeployer__factory,
  ContractRegistry,
  ContractRegistry__factory,
  ExampleOwner,
  ExampleOwnerV2__factory,
  ExampleOwner__factory,
  IContractRegistry,
} from "../typechain-types";
import { keccak256 } from "@ethersproject/keccak256";
import { delay, GAS_OPT, getTimeStamp, initHRE, stringToStringHexFixed } from "../scripts/utils";
import { INetwork } from "../models/Deploy";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ENV } from "../configuration";
import {
  IExpectedRecord,
  checkRecord,
  versionDotToNum,
  versionNumToDot,
} from "../scripts/contractRegistry";
import { Contract } from "ethers";

// Generic Constants
let PROVIDER: JsonRpcProvider;
let NETWORK: INetwork;

// Specific Constants
// -- revert Messages
const REVERT_MESSAGES = {
  initializable: { initialized: "Initializable: contract is already initialized" },
  erc1967: { paramBytecode: "ERC1967: new implementation is not a contract" },
};

let CONTRACT_REGISTRY_NAME_HEXSTRING: string;
let CONTRACT_DEPLOYER_NAME_HEXSTRING: string;
let EXAMPLE_OWNER_NAME_HEXSTRING: string;

// Specific Variables
// -- Wallets
let admin: Wallet;
let users: Wallet[] = [];
// -- Contracts
let contractRegistry: ContractRegistry;
let contractDeployerAdmin: ContractDeployer;
let contractDeployerUser0: ContractDeployer;
let exampleOwner: ExampleOwner;
// -- utils
let lastRegisteredAt: number, lastUpdatedAt: number;
before("Initialize test environment and const/var", async () => {
  // set global HardhatRuntimeEnvironment to use the same provider in scripts
  ({ gProvider: PROVIDER, gCurrentNetwork: NETWORK } = await initHRE(hre));
  // Create random test wallets
  try {
    admin = Wallet.createRandom().connect(PROVIDER);
    for (let u = 0; u < ENV.KEYSTORE.test.userNumber; u++) {
      users[u] = Wallet.createRandom().connect(PROVIDER);
      console.log(`
        User N=${u}: 
          - Address: ${users[u].address},
          - Public Key: ${users[u].publicKey},
          - Private Key: ${users[u].privateKey}
      `);
    }
    // Contract names as hexadecimal string with fixed length
    CONTRACT_REGISTRY_NAME_HEXSTRING = await stringToStringHexFixed(
      ENV.CONTRACT.contractRegistry.name,
      32
    );
    CONTRACT_DEPLOYER_NAME_HEXSTRING = await stringToStringHexFixed(
      ENV.CONTRACT.contractDeployer.name,
      32
    );
    EXAMPLE_OWNER_NAME_HEXSTRING = await stringToStringHexFixed(ENV.CONTRACT.exampleOwner.name, 32);
  } catch (error) {
    throw new Error(`Error creating or reading wallets from keystore. ${error}`);
  }
});

describe("Contract Deployer - Deploy and Initialization", async function () {
  before("Init variables", async () => {
    lastRegisteredAt = await getTimeStamp();
    lastUpdatedAt = await getTimeStamp();
  });

  step("Should deploy contract registry", async () => {
    contractRegistry = await (
      await new ContractRegistry__factory(admin).deploy(
        CONTRACT_REGISTRY_NAME_HEXSTRING,
        0,
        keccak256(ContractRegistry__factory.bytecode),
        GAS_OPT
      )
    ).deployed();
    expect(isAddress(contractRegistry.address)).to.be.true;
    console.log("Contract Registry deployed at: ", contractRegistry.address);
    // update block timestamp
    const receipt = await contractRegistry.deployTransaction.wait();
    lastRegisteredAt = lastUpdatedAt = await getTimeStamp(receipt.blockHash);
  });

  step("Should check if ContractRegistry is registered", async () => {
    await checkRecord(contractRegistry.address, contractRegistry.address, {
      found: true,
      proxy: contractRegistry.address,
      logic: contractRegistry.address,
      admin: admin.address,
      name: CONTRACT_REGISTRY_NAME_HEXSTRING,
      version: await versionDotToNum("00.00"),
      logicCodeHash: keccak256(ContractRegistry__factory.bytecode),
      rat: lastRegisteredAt,
      uat: lastUpdatedAt,
    } as IExpectedRecord);
  });

  step("Should deploy admin's contract deployer", async () => {
    contractDeployerAdmin = await (
      await new ContractDeployer__factory(admin).deploy(
        contractRegistry.address,
        new Uint8Array(32),
        keccak256(ContractDeployer__factory.bytecode),
        GAS_OPT
      )
    ).deployed();
    expect(isAddress(contractDeployerAdmin.address)).to.be.true;
    console.log("Contract Deployer deployed at: ", contractDeployerAdmin.address);
    // update block timestamp
    lastRegisteredAt = lastUpdatedAt = await getTimeStamp((await PROVIDER.getBlock("latest")).hash);
  });

  step("Should check if Admin's ContractDeployer is registered", async () => {
    await checkRecord(contractRegistry.address, contractDeployerAdmin.address, {
      found: true,
      proxy: contractDeployerAdmin.address,
      logic: contractDeployerAdmin.address,
      admin: admin.address,
      name: CONTRACT_DEPLOYER_NAME_HEXSTRING,
      version: await versionDotToNum("00.00"),
      logicCodeHash: keccak256(ContractDeployer__factory.bytecode),
      rat: lastRegisteredAt,
      uat: lastUpdatedAt,
    } as IExpectedRecord);
  });

  it("Should subscribe contract EVENTS", async () => {
    // Contract Registered
    contractRegistry.on(
      contractRegistry.filters.Registered(),
      async (proxy, name, version, logicCodeHash, event) => {
        const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
        const versionStr = await versionNumToDot(version);
        const blockTime = (await event.getBlock()).timestamp;
        console.log(
          `New Contract Registered: { Proxy: ${proxy}, Name: ${nameString}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
            event.blockNumber
          } (${event.blockHash}) timestamp: ${new Date(
            blockTime * 1000
          ).toISOString()} (${blockTime})`
        );
      }
    );
    // Contract Updated
    contractRegistry.on(
      contractRegistry.filters.Updated(),
      async (proxy, name, version, logicCodeHash, event) => {
        const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
        const versionStr = await versionNumToDot(version);
        const blockTime = (await event.getBlock()).timestamp;
        console.log(
          `New Contract Updated: { Proxy: ${proxy}, Name: ${nameString}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
            event.blockNumber
          } (${event.blockHash}) timestamp: ${new Date(
            blockTime * 1000
          ).toISOString()} (${blockTime})`
        );
      }
    );
    // Admin Changed
    contractRegistry.on(
      contractRegistry.filters.AdminChanged(),
      async (oldAdmin, newAdmin, name, event) => {
        const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
        const blockTime = (await event.getBlock()).timestamp;
        console.log(
          `New Admin Changed: { Old Admin: ${oldAdmin}, New Admin: ${newAdmin}, Record Name: ${nameString}} at Block ${
            event.blockNumber
          } (${event.blockHash}) timestamp: ${new Date(
            blockTime * 1000
          ).toISOString()} (${blockTime})`
        );
      }
    );
    // DEPLOYER
    // Contract Deployed
    contractDeployer.on(
      contractDeployer.filters.ContractDeployed(),
      async (registry, proxy, name, version, logicCodeHash, event) => {
        const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
        const versionStr = await versionNumToDot(version);
        const blockTime = (await event.getBlock()).timestamp;
        console.log(
          `New Contract Deployed: { Registry: ${registry}, Proxy: ${proxy}, Name: ${nameString}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
            event.blockNumber
          } (${event.blockHash}) timestamp: ${new Date(
            blockTime * 1000
          ).toISOString()} (${blockTime})`
        );
      }
    );
    // Contract Upgraded
    contractDeployer.on(
      contractDeployer.filters.ContractUpgraded(),
      async (registry, proxy, version, logicCodeHash, event) => {
        const versionStr = await versionNumToDot(version);
        const blockTime = (await event.getBlock()).timestamp;
        console.log(
          `New Contract Upgraded: { Registry: ${registry}, Proxy: ${proxy}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
            event.blockNumber
          } (${event.blockHash}) timestamp: ${new Date(
            blockTime * 1000
          ).toISOString()} (${blockTime})`
        );
      }
    );
  });

  // No need to initialize Contract Deployer, it is not upgradeable

  after("Wait for events", async () => {
    await delay(5000); // 2 sec
  });
});

describe("Contract Deployer - Use case", async () => {
  before("Init variables", async () => {
    // set default signer for this flow
    contractRegistry = contractRegistry.connect(users[0]);
    
    contractDeployer = contractDeployer.connect(users[0]);
  });
  //* DEPLOY
  it("Should FAIL to deploy without bytecode", async () => {
    await expect(
      contractDeployer.deployContract(
        contractRegistry.address,
        "0x0000000000000000000000", //! <--
        new Uint8Array(0),
        new Uint8Array(32),
        EXAMPLE_OWNER_NAME_HEXSTRING,
        0,
        GAS_OPT
      )
    ).to.be.revertedWith(REVERT_MESSAGES.erc1967.paramBytecode);
  });
  step("Should deploy Example Owner contract", async () => {
    const receipt = await (
      await contractDeployer.deployContract(
        contractRegistry.address,
        ExampleOwner__factory.bytecode,
        new Uint8Array(0),
        new Uint8Array(32),
        EXAMPLE_OWNER_NAME_HEXSTRING,
        0,
        GAS_OPT
      )
    ).wait();
    expect(receipt).not.to.be.undefined;
    // update block timestamp
    lastRegisteredAt = lastUpdatedAt = await getTimeStamp(receipt.blockHash);
    // save contract instance
    exampleOwner = new Contract(
      (
        await contractRegistry.getRecordByName(
          EXAMPLE_OWNER_NAME_HEXSTRING,
          contractDeployer.address
        )
      ).record.proxy,
      ExampleOwner__factory.abi,
      users[0]
    ) as ExampleOwner;
    //console.log(await contractRegistry.getRecordByName(EXAMPLE_OWNER_NAME_HEXSTRING, users[0].address));
  });
  step("Should check if Example Owner is registered", async () => {
    // use contract object to use user0.address in call
    await checkRecord(contractRegistry as unknown as IContractRegistry, exampleOwner.address, {
      found: true,
      proxy: exampleOwner.address,
      logic: await contractDeployer.callStatic.getProxyImplementation(exampleOwner.address),
      admin: users[0].address,
      name: EXAMPLE_OWNER_NAME_HEXSTRING,
      version: await versionDotToNum("00.00"),
      logicCodeHash: keccak256(ExampleOwner__factory.bytecode),
      rat: lastRegisteredAt,
      uat: lastUpdatedAt,
    } as IExpectedRecord);
  });

  //* Upgrade
  step("Should upgrade Example Owner contract", async () => {
    let receipt = await (
      await contractRegistry.changeRegisteredAdmin(
        exampleOwner.address,
        contractDeployer.address,
        GAS_OPT
      )
    ).wait();
    //console.log(await contractRegistry.getRecordByName(EXAMPLE_OWNER_NAME_HEXSTRING, contractDeployer.address));
    receipt = await (
      await contractDeployer.upgradeContract(
        contractRegistry.address,
        exampleOwner.address,
        ExampleOwnerV2__factory.bytecode,
        new Uint8Array(0),
        new Uint8Array(32),
        await versionDotToNum("01.00"),
        GAS_OPT
      )
    ).wait();
    expect(receipt).not.to.be.undefined;
    // update block timestamp
    lastUpdatedAt = await getTimeStamp(receipt.blockHash);
  });
  step("Should check if Example Owner is upgraded", async () => {
    // use contract object to use user0.address in call
    await checkRecord(contractRegistry as unknown as IContractRegistry, exampleOwner.address, {
      found: true,
      proxy: exampleOwner.address,
      logic: await contractDeployer.callStatic.getProxyImplementation(exampleOwner.address),
      admin: users[0].address,
      name: EXAMPLE_OWNER_NAME_HEXSTRING,
      version: await versionDotToNum("01.00"),
      logicCodeHash: keccak256(ExampleOwnerV2__factory.bytecode),
      rat: lastRegisteredAt,
      uat: lastUpdatedAt,
    } as IExpectedRecord);
  });

  after("Wait for events", async () => {
    await delay(5000); // 2 sec
  });
});
