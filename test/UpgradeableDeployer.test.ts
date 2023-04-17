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
import { generateWallets } from "scripts/wallets";
import {
  IExpectedRecord,
  checkRecord,
  versionDotToNum,
  versionNumToDot,
} from "scripts/contractRegistry";
import {
  CodeTrust__factory,
  ContractRegistry__factory,
  ExampleOwner,
  ICodeTrust,
  IContractRegistry,
  IUpgradeableDeployer,
  ProxyAdmin,
  UpgradeableDeployer__factory,
} from "typechain-types";
import { INetwork } from "models/Configuration";
import { readFileSync } from "fs";
import { deploy } from "scripts/deploy";

// Generic Constants
let ethers: HardhatRuntimeEnvironment["ethers"];
let provider: JsonRpcProvider;
let network: INetwork;

// Specific Constants
const PROXY_ADMIN_ARTIFACT = JSON.parse(
  readFileSync(CONTRACTS.get("ProxyAdmin")!.artifact, "utf-8")
);
const CODETRUST_ARTIFACT = JSON.parse(readFileSync(CONTRACTS.get("CodeTrust")!.artifact, "utf-8"));
const CONTRACT_REGISTRY_ARTIFACT = JSON.parse(
  readFileSync(CONTRACTS.get("ContractRegistry")!.artifact, "utf-8")
);
const UPGRADEABLE_DEPLOYER_ARTIFACT = JSON.parse(
  readFileSync(CONTRACTS.get("UpgradeableDeployer")!.artifact, "utf-8")
);
const OWNER_ARTIFACT = JSON.parse(readFileSync(CONTRACTS.get("ExampleOwner")!.artifact, "utf-8"));
const OWNERV2_ARTIFACT = JSON.parse(
  readFileSync(CONTRACTS.get("ExampleOwnerV2")!.artifact, "utf-8")
);
const CODETRUST_DEP_CODE = CODETRUST_ARTIFACT.deployedBytecode;
const REGISTRY_DEP_CODE = CONTRACT_REGISTRY_ARTIFACT.deployedBytecode;
const UPGRADEABLE_DEP_CODE = UPGRADEABLE_DEPLOYER_ARTIFACT.deployedBytecode;
const OWNER_DEP_CODE = OWNER_ARTIFACT.deployedBytecode;
const OWNERV2_DEP_CODE = OWNERV2_ARTIFACT.deployedBytecode;
// -- revert Messages
const REVERT_MESSAGES = {
  initializable: { initialized: "Initializable: contract is already initialized" },
  erc1967: { paramBytecode: "ERC1967: new implementation is not a contract" },
};

let CODETRUST_NAME_HEXSTRING: string;
let CONTRACT_REGISTRY_NAME_HEXSTRING: string;
let UPGRADEABLE_DEPLOYER_NAME_HEXSTRING: string;
let EXAMPLE_OWNER_NAME_HEXSTRING: string;
let EXAMPLE_OWNERV2_NAME_HEXSTRING: string;
const NAME_HEXSTRING_ZERO = formatBytes32String("");
const MAX_VERSION = 9999;

// Specific Variables
// -- Wallets
let accounts: Wallet[] = [];
let admin: Wallet;
let users: Wallet[] = [];
// -- Factories
let codeTrustFactory: Promise<CodeTrust__factory>;
let contractRegistryFactory: Promise<ContractRegistry__factory>;
let upgrDeployerFactory_A: Promise<UpgradeableDeployer__factory>;
let upgrDeployerFactory_U0: Promise<UpgradeableDeployer__factory>;
// -- Contracts
let codeTrust: ICodeTrust;
let contractRegistry: IContractRegistry;
let upgrDeplAdmin: IUpgradeableDeployer;
let upgrDeplUser0: IUpgradeableDeployer;
let exampleOwner: ExampleOwner;
// -- utils
let lastReceipt: ContractReceipt | undefined;
let lastBlock: Block;
let lastRegisteredAt: number, lastUpdatedAt: number;

describe("Upgradeable Deployer", () => {
  before("Initialize test environment and const/var", async () => {
    // set global HardhatRuntimeEnvironment to use the same provider in scripts
    ({ gProvider: provider, gNetwork: network } = await setGlobalHRE(hre));
    ethers = hre.ethers;
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
    UPGRADEABLE_DEPLOYER_NAME_HEXSTRING = formatBytes32String(
      CONTRACTS.get("UpgradeableDeployer")!.name
    );
    EXAMPLE_OWNER_NAME_HEXSTRING = formatBytes32String(CONTRACTS.get("ExampleOwner")!.name);
    EXAMPLE_OWNERV2_NAME_HEXSTRING = formatBytes32String(CONTRACTS.get("ExampleOwner")!.name);
    // Get all factories now
    codeTrustFactory = ethers.getContractFactoryFromArtifact(
      CODETRUST_ARTIFACT,
      admin
    ) as Promise<CodeTrust__factory>;
    contractRegistryFactory = ethers.getContractFactoryFromArtifact(
      CONTRACT_REGISTRY_ARTIFACT,
      admin
    ) as Promise<ContractRegistry__factory>;
    upgrDeployerFactory_A = ethers.getContractFactoryFromArtifact(
      UPGRADEABLE_DEPLOYER_ARTIFACT,
      admin
    ) as Promise<UpgradeableDeployer__factory>;
    upgrDeployerFactory_U0 = ethers.getContractFactoryFromArtifact(
      UPGRADEABLE_DEPLOYER_ARTIFACT,
      users[0]
    ) as Promise<UpgradeableDeployer__factory>;
  });

  describe("Deploy and Initialization - Admin", () => {
    before("Init variables", async () => {
      lastRegisteredAt = await getTimeStamp();
      lastUpdatedAt = await getTimeStamp();
    });

    step("Should deploy CodeTrust", async () => {
      codeTrust = await (await (await codeTrustFactory).deploy(GAS_OPT.max)).deployed();
      lastReceipt = await codeTrust.deployTransaction.wait();
      expect(isAddress(codeTrust.address)).to.be.true;
      console.log("CodeTrust contract deployed at: ", codeTrust.address);
      expect(lastReceipt).not.to.be.undefined;
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });

    step("Should deploy ContractRegistry", async () => {
      const deployResult = await deploy(
        "ContractRegistry",
        admin,
        [codeTrust.address],
        undefined,
        GAS_OPT.max,
        false
      );
      contractRegistry = deployResult.contractInstance as IContractRegistry;
      lastReceipt = await provider.getTransactionReceipt(deployResult.deployment.deployTxHash!);
      expect(isAddress(contractRegistry.address)).to.be.true;
      console.log("Contract Registry deployed at: ", contractRegistry.address);
      expect(lastReceipt).not.to.be.undefined;
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });

    step("Should register itself", async () => {
      lastReceipt = await (
        await contractRegistry.register(
          CONTRACT_REGISTRY_NAME_HEXSTRING,
          contractRegistry.address,
          contractRegistry.address,
          0,
          keccak256(REGISTRY_DEP_CODE),
          admin.address,
          GAS_OPT.max
        )
      ).wait();
      expect(lastReceipt).not.to.be.undefined;
      const events = await contractRegistry.queryFilter(
        contractRegistry.filters.NewRecord(
          CONTRACT_REGISTRY_NAME_HEXSTRING,
          contractRegistry.address,
          undefined,
          0,
          undefined
        ),
        lastReceipt.blockNumber,
        lastReceipt.blockNumber
      );
      expect(events.length).to.equal(1);
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
    });

    it("Should subscribe ContractRegistry EVENTS", async () => {
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

    step("Should deploy admin's UpgradeableDeployer", async () => {
      upgrDeplAdmin = await (
        await (await upgrDeployerFactory_A).deploy(contractRegistry.address, GAS_OPT.max)
      ).deployed();
      expect(isAddress(upgrDeplAdmin.address)).to.be.true;
      lastReceipt = await upgrDeplAdmin.deployTransaction.wait();
      expect(isAddress(upgrDeplAdmin.address)).to.be.true;
      console.log("Admin's UpgradeableDeployer deployed at: ", upgrDeplAdmin.address);
      // update block timestamp
      expect(lastReceipt).not.to.be.undefined;
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });

    step("Should register admin's UpgradeableDeployer Contract Record ", async () => {
      lastReceipt = await (
        await contractRegistry.register(
          UPGRADEABLE_DEPLOYER_NAME_HEXSTRING,
          upgrDeplAdmin.address,
          upgrDeplAdmin.address,
          await versionDotToNum("01.00"),
          keccak256(UPGRADEABLE_DEP_CODE),
          admin.address,
          GAS_OPT.max
        )
      ).wait();
      expect(lastReceipt).not.to.be.undefined;
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });

    step("Should check if admin's UpgradeableDeployer is registered", async () => {
      await checkRecord(
        contractRegistry.address,
        UPGRADEABLE_DEPLOYER_NAME_HEXSTRING,
        admin.address,
        {
          found: true,
          proxy: upgrDeplAdmin.address,
          logic: upgrDeplAdmin.address,
          admin: admin.address,
          name: UPGRADEABLE_DEPLOYER_NAME_HEXSTRING,
          version: await versionDotToNum("01.00"),
          logicCodeHash: keccak256(UPGRADEABLE_DEP_CODE),
          timestamp: lastRegisteredAt,
        } as IExpectedRecord
      );
    });

    it("Should subscribe UpgradeableDeployer EVENTS", async () => {
      // Contract Deployed
      upgrDeplAdmin.on(
        upgrDeplAdmin.filters.ContractDeployed(),
        async (registry, name, proxyOrLogic, version, logicCodeHash, event) => {
          const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
          const versionStr = await versionNumToDot(version);
          const blockTime = (await event.getBlock()).timestamp;
          console.log(
            `New Contract Deployed: { Registry: ${registry}, Name: ${nameString}, ProxyOrLogic: ${proxyOrLogic}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
              event.blockNumber
            } (${event.blockHash}) timestamp: ${new Date(
              blockTime * 1000
            ).toISOString()} (${blockTime})`
          );
        }
      );
      // Contract Upgraded
      upgrDeplAdmin.on(
        upgrDeplAdmin.filters.ContractUpgraded(),
        async (registry, name, proxy, version, logicCodeHash, event) => {
          const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
          const versionStr = await versionNumToDot(version);
          const blockTime = (await event.getBlock()).timestamp;
          console.log(
            `New Contract Upgraded: { Registry: ${registry}, Name: ${nameString}, Proxy: ${proxy}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
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

  describe("Deploy and Initialization - User 0", () => {
    before("Init variables", async () => {
      lastRegisteredAt = await getTimeStamp();
      lastUpdatedAt = await getTimeStamp();
      contractRegistry = contractRegistry.connect(users[0]);
    });

    step("Should be able to check addresses of System CodeTrust and ContractRegistry", async () => {
      const systemCodeTrust = await contractRegistry
        .connect(users[0])
        .getRecord(CODETRUST_NAME_HEXSTRING, admin.address, MAX_VERSION + 1);
      const systemContractRegistry = await contractRegistry
        .connect(users[0])
        .getRecord(CONTRACT_REGISTRY_NAME_HEXSTRING, admin.address, MAX_VERSION + 1);
      expect(isAddress(systemCodeTrust.record.logic)).to.be.true;
    });

    step("Should deploy user0's UpgradeableDeployer", async () => {
      upgrDeplUser0 = await (
        await (await upgrDeployerFactory_U0).deploy(contractRegistry.address, GAS_OPT.max)
      ).deployed();
      expect(isAddress(upgrDeplUser0.address)).to.be.true;
      lastReceipt = await upgrDeplUser0.deployTransaction.wait();
      expect(isAddress(upgrDeplUser0.address)).to.be.true;
      console.log("User0's UpgradeableDeployer deployed at: ", upgrDeplUser0.address);
      // update block timestamp
      expect(lastReceipt).not.to.be.undefined;
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });

    step("Should register user0's UpgradeableDeployer Contract Record ", async () => {
      lastReceipt = await (
        await contractRegistry.register(
          UPGRADEABLE_DEPLOYER_NAME_HEXSTRING,
          upgrDeplUser0.address,
          upgrDeplUser0.address,
          await versionDotToNum("01.00"),
          keccak256(UPGRADEABLE_DEP_CODE),
          users[0].address,
          GAS_OPT.max
        )
      ).wait();
      expect(lastReceipt).not.to.be.undefined;
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });

    step("Should check if user0's UpgradeableDeployer is registered", async () => {
      await checkRecord(
        contractRegistry.address,
        UPGRADEABLE_DEPLOYER_NAME_HEXSTRING,
        users[0].address,
        {
          found: true,
          proxy: upgrDeplUser0.address,
          logic: upgrDeplUser0.address,
          admin: users[0].address,
          name: UPGRADEABLE_DEPLOYER_NAME_HEXSTRING,
          version: await versionDotToNum("01.00"),
          logicCodeHash: keccak256(UPGRADEABLE_DEP_CODE),
          timestamp: lastRegisteredAt,
        } as IExpectedRecord
      );
    });

    it("Should subscribe UpgradeableDeployer EVENTS", async () => {
      // Contract Deployed
      upgrDeplAdmin.on(
        upgrDeplAdmin.filters.ContractDeployed(),
        async (registry, name, proxyOrLogic, version, logicCodeHash, event) => {
          const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
          const versionStr = await versionNumToDot(version);
          const blockTime = (await event.getBlock()).timestamp;
          console.log(
            `New Contract Deployed: { Registry: ${registry}, Name: ${nameString}, ProxyOrLogic: ${proxyOrLogic}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
              event.blockNumber
            } (${event.blockHash}) timestamp: ${new Date(
              blockTime * 1000
            ).toISOString()} (${blockTime})`
          );
        }
      );
      // Contract Upgraded
      upgrDeplAdmin.on(
        upgrDeplAdmin.filters.ContractUpgraded(),
        async (registry, name, proxy, version, logicCodeHash, event) => {
          const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
          const versionStr = await versionNumToDot(version);
          const blockTime = (await event.getBlock()).timestamp;
          console.log(
            `New Contract Upgraded: { Registry: ${registry}, Name: ${nameString}, Proxy: ${proxy}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
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

  describe("Use case", () => {
    before("Init variables", async () => {
      // set default signer for this flow
      codeTrust = codeTrust.connect(users[0]);
      contractRegistry = contractRegistry.connect(users[0]);
      upgrDeplUser0 = upgrDeplUser0.connect(users[0]);
      // Should trust upgradeable deployer contract
      await (await codeTrust.trustCodeAt(upgrDeplUser0.address, 360, GAS_OPT.max)).wait();
    });
    //* DEPLOY
    it("Should FAIL to deploy without bytecode", async () => {
      await expect(
        upgrDeplUser0.deployContract(
          contractRegistry.address,
          "0x0000000000000000000000", //! <--
          new Uint8Array(0),
          new Uint8Array(32),
          EXAMPLE_OWNER_NAME_HEXSTRING,
          0,
          GAS_OPT.max
        )
      ).to.be.reverted;
    });
    step("Should deploy Example Owner contract", async () => {
      lastReceipt = await (
        await upgrDeplUser0.deployContract(
          contractRegistry.address,
          OWNER_ARTIFACT.bytecode,
          new Uint8Array(0),
          new Uint8Array(32),
          EXAMPLE_OWNER_NAME_HEXSTRING,
          0,
          GAS_OPT.max
        )
      ).wait();
      expect(lastReceipt).not.to.be.undefined;
      // update block timestamp
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      // save contract instance
      const recordResp = await contractRegistry.getRecord(
        EXAMPLE_OWNER_NAME_HEXSTRING,
        users[0].address,
        MAX_VERSION + 1
      );
      exampleOwner = (await ethers.getContractAtFromArtifact(
        OWNER_ARTIFACT,
        recordResp.record.proxy,
        users[0]
      )) as ExampleOwner;
      lastReceipt = undefined;
    });
    step("Should check if Example Owner is registered", async () => {
      // generate ProxyAdmin instance
      const proxyAdminHelper = (await ethers.getContractAtFromArtifact(
        PROXY_ADMIN_ARTIFACT,
        upgrDeplUser0.address
      )) as ProxyAdmin;
      // use contract object to use user0.address in call
      await checkRecord(contractRegistry, EXAMPLE_OWNER_NAME_HEXSTRING, users[0].address, {
        found: true,
        proxy: exampleOwner.address,
        logic: await proxyAdminHelper.callStatic.getProxyImplementation(exampleOwner.address),
        admin: users[0].address,
        name: EXAMPLE_OWNER_NAME_HEXSTRING,
        version: await versionDotToNum("00.00"),
        logicCodeHash: keccak256(OWNER_DEP_CODE),
        rat: lastRegisteredAt,
        uat: lastUpdatedAt,
      } as IExpectedRecord);
    });

    //* Upgrade
    step("Should upgrade Example Owner contract", async () => {
      //console.log(await contractRegistry.getRecordByName(EXAMPLE_OWNER_NAME_HEXSTRING, contractDeployer.address));
      lastReceipt = await (
        await upgrDeplUser0.upgradeContract(
          contractRegistry.address,
          EXAMPLE_OWNER_NAME_HEXSTRING,
          OWNERV2_ARTIFACT.bytecode,
          new Uint8Array(0),
          new Uint8Array(32),
          await versionDotToNum("01.00"),
          ADDR_ZERO,
          GAS_OPT.max
        )
      ).wait();
      expect(lastReceipt).not.to.be.undefined;
      // update block timestamp
      lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });
    step("Should check if Example Owner is upgraded", async () => {
      // generate ProxyAdmin instance
      const proxyAdminHelper = (await ethers.getContractAtFromArtifact(
        PROXY_ADMIN_ARTIFACT,
        upgrDeplUser0.address
      )) as ProxyAdmin;
      // use contract object to use user0.address in call
      await checkRecord(contractRegistry, EXAMPLE_OWNER_NAME_HEXSTRING, users[0].address, {
        found: true,
        proxy: exampleOwner.address,
        logic: await proxyAdminHelper.callStatic.getProxyImplementation(exampleOwner.address),
        admin: users[0].address,
        name: EXAMPLE_OWNER_NAME_HEXSTRING,
        version: await versionDotToNum("01.00"),
        logicCodeHash: keccak256(OWNERV2_DEP_CODE),
        rat: lastRegisteredAt,
        uat: lastUpdatedAt,
      } as IExpectedRecord);
    });

    after("Wait for events", async () => {
      await delay(5000); // 2 sec
    });
  });
});
