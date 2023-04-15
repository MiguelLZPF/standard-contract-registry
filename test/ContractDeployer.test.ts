import * as hre from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { expect } from "chai";
import { step } from "mocha-steps";
import { isAddress } from "@ethersproject/address";
import { Wallet } from "@ethersproject/wallet";
import { keccak256 } from "@ethersproject/keccak256";
import { formatBytes32String } from "@ethersproject/strings";
import { JsonRpcProvider, Block } from "@ethersproject/providers";
import { ContractReceipt } from "ethers";
import { Mnemonic } from "ethers/lib/utils";
import { CONTRACTS, GAS_OPT, KEYSTORE, TEST } from "configuration";
import { ADDR_ZERO, delay, getTimeStamp, setGlobalHRE } from "scripts/utils";
import {
  IExpectedRecord,
  checkRecord,
  versionDotToNum,
  versionNumToDot,
} from "scripts/contractRegistry";
import {
  CodeTrust__factory,
  ContractDeployer__factory,
  ContractRegistry__factory,
  ExampleOwner,
  ICodeTrust,
  IContractDeployer,
  IContractRegistry,
} from "typechain-types";
import { INetwork } from "models/Configuration";
import { readFileSync } from "fs";
import { generateWallets } from "scripts/wallets";
import { deploy } from "scripts/deploy";

// Generic Constants
let ethers: HardhatRuntimeEnvironment["ethers"];
let provider: JsonRpcProvider;
let network: INetwork;

// Specific Constants
const CODETRUST_ARTIFACT = JSON.parse(readFileSync(CONTRACTS.get("CodeTrust")!.artifact, "utf-8"));
const CONTRACT_REGISTRY_ARTIFACT = JSON.parse(
  readFileSync(CONTRACTS.get("ContractRegistry")!.artifact, "utf-8")
);
const CONTRACT_DEPLOYER_ARTIFACT = JSON.parse(
  readFileSync(CONTRACTS.get("ContractDeployer")!.artifact, "utf-8")
);
const OWNER_ARTIFACT = JSON.parse(
  readFileSync(CONTRACTS.get("ExampleOwner")!.artifact, "utf-8")
);
const CODETRUST_DEP_CODE = CODETRUST_ARTIFACT.deployedBytecode;
const REGISTRY_DEP_CODE = CONTRACT_REGISTRY_ARTIFACT.deployedBytecode;
const DEPLOYER_DEP_CODE = CONTRACT_DEPLOYER_ARTIFACT.deployedBytecode;
const OWNER_DEP_CODE = OWNER_ARTIFACT.deployedBytecode;
// -- revert Messages
const REVERT_MESSAGES = {
  initializable: { initialized: "Initializable: contract is already initialized" },
  create2: {
    paramBytecode0: "Create2: bytecode length is zero",
    paramBytecodeNoContract: "function call to a non-contract account",
  },
};

let CODETRUST_NAME_HEXSTRING: string;
let CONTRACT_REGISTRY_NAME_HEXSTRING: string;
let CONTRACT_DEPLOYER_NAME_HEXSTRING: string;
let EXAMPLE_OWNER_NAME_HEXSTRING: string;
const NAME_HEXSTRING_ZERO = formatBytes32String("");

// Specific Variables
// -- Wallets
let accounts: Wallet[] = [];
let admin: Wallet;
let users: Wallet[] = [];
// -- Factories
let codeTrustFactory: Promise<CodeTrust__factory>;
let contractRegistryFactory: Promise<ContractRegistry__factory>;
let contractDeployerFactory: Promise<ContractDeployer__factory>;
// -- Contracts
let codeTrust: ICodeTrust;
let contractRegistry: IContractRegistry;
let contractDeployer: IContractDeployer;
let exampleOwner: ExampleOwner;
// -- utils
let lastReceipt: ContractReceipt | undefined;
let lastBlock: Block;
let lastRegisteredAt: number, lastUpdatedAt: number;

describe("Contract Deployer", () => {
  before("Initialize test environment and const/var", async () => {
    // set global HardhatRuntimeEnvironment to use the same provider in scripts
    ({ gProvider: provider, gNetwork: network } = await setGlobalHRE(hre));
    lastBlock = await provider.getBlock("latest");
    console.log(`Connected to network: ${network.name} (latest block: ${lastBlock.number})`);
    // Generate TEST.accountNumber wallets
    accounts = await generateWallets(
      undefined,
      undefined,
      TEST.accountNumber,
      undefined,
      {
        phrase: KEYSTORE.default.mnemonic.phrase,
        path: KEYSTORE.default.mnemonic.basePath,
        locale: KEYSTORE.default.mnemonic.locale,
      } as Mnemonic,
      true
    );
    admin = accounts[0];
    for (let u = 1; u < TEST.accountNumber; u++) {
      users[u - 1] = accounts[u];
    }
    // Contract names as hexadecimal string with fixed length
    CODETRUST_NAME_HEXSTRING = formatBytes32String(CONTRACTS.get("CodeTrust")!.name);
    CONTRACT_REGISTRY_NAME_HEXSTRING = formatBytes32String(CONTRACTS.get("ContractRegistry")!.name);
    CONTRACT_DEPLOYER_NAME_HEXSTRING = formatBytes32String(CONTRACTS.get("ContractDeployer")!.name);
    EXAMPLE_OWNER_NAME_HEXSTRING = formatBytes32String(CONTRACTS.get("ExampleOwner")!.name);
    // Get all factories now
    codeTrustFactory = ethers.getContractFactoryFromArtifact(
      CODETRUST_ARTIFACT,
      admin
    ) as Promise<CodeTrust__factory>;
    contractRegistryFactory = ethers.getContractFactoryFromArtifact(
      CONTRACT_REGISTRY_ARTIFACT,
      admin
    ) as Promise<ContractRegistry__factory>;
    contractDeployerFactory = ethers.getContractFactoryFromArtifact(
      CONTRACT_DEPLOYER_ARTIFACT,
      admin
    ) as Promise<ContractDeployer__factory>;
  });

  describe("Deploy and Initialization", async function () {
    before("Init variables", async () => {
      lastRegisteredAt = await getTimeStamp();
      lastUpdatedAt = await getTimeStamp();
    });

    step("Should deploy CodeTrust", async () => {
      const deployResult = await deploy(
        "CodeTrust",
        admin,
        undefined,
        undefined,
        GAS_OPT.max,
        false
      );
      codeTrust = deployResult.contractInstance as ICodeTrust;
      expect(isAddress(codeTrust.address)).to.be.true;
      expect(codeTrust.address).not.to.equal(ADDR_ZERO);
      console.log("CodeTrust contract deployed at: ", codeTrust.address);
      lastReceipt = await provider.getTransactionReceipt(deployResult.deployment.deployTxHash!);
      expect(lastReceipt).not.to.be.undefined;
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });

    step("Should deploy ContractRegistry", async () => {
      contractRegistry = await (
        await (
          await contractRegistryFactory
        ).deploy(
          codeTrust.address,
          NAME_HEXSTRING_ZERO,
          0,
          keccak256(REGISTRY_DEP_CODE),
          GAS_OPT.max
        )
      ).deployed();
      lastReceipt = await contractRegistry.deployTransaction.wait();
      expect(isAddress(contractRegistry.address)).to.be.true;
      console.log("Contract Registry deployed at: ", contractRegistry.address);
      expect(lastReceipt).not.to.be.undefined;
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });

    step("Should check if ContractRegistry is registered", async () => {
      await checkRecord(contractRegistry.address, CONTRACT_REGISTRY_NAME_HEXSTRING, admin.address, {
        found: true,
        proxy: contractRegistry.address,
        logic: contractRegistry.address,
        admin: admin.address,
        name: CONTRACT_REGISTRY_NAME_HEXSTRING,
        version: 0,
        logicCodeHash: keccak256(REGISTRY_DEP_CODE),
        timestamp: lastRegisteredAt,
      } as IExpectedRecord);
    });

    step("Should register CodeTrust Contract Record ", async () => {
      lastReceipt = await (
        await contractRegistry.register(
          CODETRUST_NAME_HEXSTRING,
          codeTrust.address,
          codeTrust.address,
          await versionDotToNum("01.00"),
          keccak256(CODETRUST_DEP_CODE),
          admin.address,
          GAS_OPT.max
        )
      ).wait();
      expect(lastReceipt).not.to.be.undefined;
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });

    step("Should check if CodeTrust Record is registered", async () => {
      await checkRecord(
        contractRegistry.address,
        CODETRUST_NAME_HEXSTRING,
        admin.address,
        {
          found: true,
          proxy: codeTrust.address,
          logic: codeTrust.address,
          admin: admin.address,
          name: CODETRUST_NAME_HEXSTRING,
          version: await versionDotToNum("01.00"),
          logicCodeHash: keccak256(CODETRUST_DEP_CODE),
          timestamp: lastRegisteredAt,
        } as IExpectedRecord,
        await versionDotToNum("01.00")
      );
    });

    step("Should deploy ContractDeployer", async () => {
      contractDeployer = await (
        await (await contractDeployerFactory).deploy(contractRegistry.address, GAS_OPT.max)
      ).deployed();
      lastReceipt = await contractDeployer.deployTransaction.wait();
      expect(isAddress(contractDeployer.address)).to.be.true;
      console.log("Contract Deployer deployed at: ", contractDeployer.address);
      // update block timestamp
      expect(lastReceipt).not.to.be.undefined;
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });

    step("Should register ContractDeployer Contract Record ", async () => {
      lastReceipt = await (
        await contractRegistry.register(
          CONTRACT_DEPLOYER_NAME_HEXSTRING,
          contractDeployer.address,
          contractDeployer.address,
          await versionDotToNum("01.00"),
          keccak256(DEPLOYER_DEP_CODE),
          admin.address,
          GAS_OPT.max
        )
      ).wait();
      expect(lastReceipt).not.to.be.undefined;
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });

    step("Should check if ContractDeployer Record is registered", async () => {
      await checkRecord(
        contractRegistry.address,
        CONTRACT_DEPLOYER_NAME_HEXSTRING,
        admin.address,
        {
          found: true,
          proxy: contractDeployer.address,
          logic: contractDeployer.address,
          admin: admin.address,
          name: CONTRACT_DEPLOYER_NAME_HEXSTRING,
          version: await versionDotToNum("01.00"),
          logicCodeHash: keccak256(DEPLOYER_DEP_CODE),
          timestamp: lastRegisteredAt,
        } as IExpectedRecord,
        await versionDotToNum("01.00")
      );
    });

    it("Should subscribe contract EVENTS", async () => {
      // Contract Registered
      contractRegistry.on(
        contractRegistry.filters.NewRecord(),
        async (name, proxy, logic, version, logicCodeHash, event) => {
          const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
          const versionStr = await versionNumToDot(version);
          const blockTime = (await event.getBlock()).timestamp;
          console.log(
            `New Record: { Name: ${nameString}, Proxy: ${proxy}, Logic: ${logic}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
              event.blockNumber
            } (${event.blockHash}) timestamp: ${new Date(
              blockTime * 1000
            ).toISOString()} (${blockTime})`
          );
        }
      );
      // // Contract Updated
      // contractRegistry.on(
      //   contractRegistry.filters.Updated(),
      //   async (name, proxy, logic, version, logicCodeHash, event) => {
      //     const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
      //     const versionStr = await versionNumToDot(version);
      //     const blockTime = (await event.getBlock()).timestamp;
      //     console.log(
      //       `New Contract Updated: { Name: ${nameString}, Proxy: ${proxy}, Logic: ${logic}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
      //         event.blockNumber
      //       } (${event.blockHash}) timestamp: ${new Date(
      //         blockTime * 1000
      //       ).toISOString()} (${blockTime})`
      //     );
      //   }
      // );
      // Admin Changed
      contractRegistry.on(
        contractRegistry.filters.AdminChanged(),
        async (name, oldAdmin, newAdmin, event) => {
          const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
          const blockTime = (await event.getBlock()).timestamp;
          console.log(
            `New Admin Changed: { Record Name: ${nameString}, Old Admin: ${oldAdmin}, New Admin: ${newAdmin}} at Block ${
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
        async (registry, name, proxy, version, logicCodeHash, event) => {
          const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
          const versionStr = await versionNumToDot(version);
          const blockTime = (await event.getBlock()).timestamp;
          console.log(
            `New Contract Deployed: { Registry: ${registry}, Name: ${nameString}, Proxy: ${proxy}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
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

  describe("Main Test", async () => {
    before("Init variables", async () => {
      // set default signer for this flow
      codeTrust = codeTrust.connect(users[0]);
      contractRegistry = contractRegistry.connect(users[0]);
      contractDeployer = contractDeployer.connect(users[0]);
    });
    //* DEPLOY
    it("Should FAIL to deploy without bytecode", async () => {
      await expect(
        contractDeployer.deployContract(
          contractRegistry.address,
          "0x", //! <--
          new Uint8Array(0),
          new Uint8Array(32),
          EXAMPLE_OWNER_NAME_HEXSTRING,
          0,
          GAS_OPT.max
        )
      ).to.be.revertedWith(REVERT_MESSAGES.create2.paramBytecode0);
    });
    it("Should FAIL to deploy with invalid bytecode", async () => {
      expect(
        contractDeployer.deployContract(
          contractRegistry.address,
          "0x0000000000000000000000",
          new Uint8Array(0),
          new Uint8Array(32),
          EXAMPLE_OWNER_NAME_HEXSTRING,
          0,
          GAS_OPT.max
        )
      ).to.be.reverted;
    });
    step("Should deploy Example Owner contract", async () => {
      await (await codeTrust.trustCodeAt(contractDeployer.address, 360, GAS_OPT.max)).wait();
      const receipt = await (
        await contractDeployer.deployContract(
          contractRegistry.address,
          OWNER_ARTIFACT.bytecode,
          new Uint8Array(0),
          new Uint8Array(32),
          EXAMPLE_OWNER_NAME_HEXSTRING,
          await versionDotToNum("01.00"),
          GAS_OPT.max
        )
      ).wait();
      expect(receipt).not.to.be.undefined;
      // update block timestamp
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(receipt.blockHash);
      // save contract instance
      const recordResp = await contractRegistry.getRecord(
        EXAMPLE_OWNER_NAME_HEXSTRING,
        users[0].address,
        10000
      );
      exampleOwner = (await ethers.getContractAtFromArtifact(
        OWNER_ARTIFACT,
        recordResp.record.proxy,
        users[0]
      )) as ExampleOwner;
      lastReceipt = undefined;
    });
    step("Should check if Example Owner is registered", async () => {
      // use contract object to use user0.address in call
      await checkRecord(contractRegistry, EXAMPLE_OWNER_NAME_HEXSTRING, users[0].address, {
        found: true,
        proxy: exampleOwner.address,
        logic: exampleOwner.address,
        admin: users[0].address,
        name: EXAMPLE_OWNER_NAME_HEXSTRING,
        version: await versionDotToNum("01.00"),
        logicCodeHash: keccak256(OWNER_DEP_CODE),
        rat: lastRegisteredAt,
        uat: lastUpdatedAt,
      } as IExpectedRecord);
    });
    //* DEPLOY and UPDATE
    step("Should deploy NEW Example Owner contract", async () => {
      const receipt = await (
        await contractDeployer.deployContract(
          contractRegistry.address,
          OWNER_ARTIFACT.bytecode,
          new Uint8Array(0),
          new Uint8Array(32),
          EXAMPLE_OWNER_NAME_HEXSTRING,
          await versionDotToNum("01.05"),
          GAS_OPT.max
        )
      ).wait();
      expect(receipt).not.to.be.undefined;
      // update block timestamp
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(receipt.blockHash);
      // save contract instance
      const recordResp = await contractRegistry.getRecord(
        EXAMPLE_OWNER_NAME_HEXSTRING,
        users[0].address,
        10000
      );
      exampleOwner = (await ethers.getContractAtFromArtifact(
        OWNER_ARTIFACT,
        recordResp.record.proxy,
        users[0]
      )) as ExampleOwner;
    });
    step("Should check if NEW Version Example Owner is registered", async () => {
      // use contract object to use user0.address in call
      await checkRecord(contractRegistry, EXAMPLE_OWNER_NAME_HEXSTRING, users[0].address, {
        found: true,
        proxy: exampleOwner.address,
        logic: exampleOwner.address,
        admin: users[0].address,
        name: EXAMPLE_OWNER_NAME_HEXSTRING,
        version: await versionDotToNum("01.05"),
        logicCodeHash: keccak256(OWNER_DEP_CODE),
        rat: lastRegisteredAt,
        uat: lastUpdatedAt,
      } as IExpectedRecord);
    });
    after("Wait for events", async () => {
      await delay(5000); // 2 sec
    });
  });
});
