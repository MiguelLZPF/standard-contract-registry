import * as hre from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { expect } from "chai";
import { step } from "mocha-steps";
import { isAddress } from "@ethersproject/address";
import { Wallet } from "@ethersproject/wallet";
import { keccak256 } from "@ethersproject/keccak256";
import { formatBytes32String, toUtf8Bytes } from "@ethersproject/strings";
import { JsonRpcProvider, Block } from "@ethersproject/providers";
import { hexValue, Mnemonic } from "ethers/lib/utils";
import { ContractReceipt } from "ethers";
import { randomBytes } from "crypto";
import { CONTRACT, GAS_OPT, KEYSTORE, TEST } from "configuration";
import { ADDR_ZERO, delay, getTimeStamp, setGlobalHRE } from "scripts/utils";
import { generateWalletBatch } from "scripts/wallets";
import { INetwork } from "models/Deploy";
import {
  IExpectedRecord,
  checkRecord,
  versionDotToNum,
  versionNumToDot,
} from "scripts/contractRegistry";
import * as CODETRUST_ARTIFACT from "node_modules/decentralized-code-trust/artifacts/contracts/CodeTrust.sol/CodeTrust.json";
import * as CONTRACT_REGISTRY_ARTIFACT from "artifacts/contracts/ContractRegistry.sol/ContractRegistry.json";
import * as STORAGE_ARTIFACT from "artifacts/contracts/Example_Storage.sol/ExampleStorage.json";
import * as OWNER_ARTIFACT from "artifacts/contracts/Example_Owner.sol/ExampleOwner.json";
import * as BALLOT_ARTIFACT from "artifacts/contracts/Example_Ballot.sol/ExampleBallot.json";
import {
  CodeTrust__factory,
  ContractRegistry__factory,
  ExampleBallot,
  ExampleBallot__factory,
  ExampleOwner,
  ExampleOwner__factory,
  ExampleStorage,
  ExampleStorage__factory,
  ICodeTrust,
  IContractRegistry,
} from "typechain-types";

// Generic Constants
let ethers: HardhatRuntimeEnvironment["ethers"];
let provider: JsonRpcProvider;
let network: INetwork;

// Specific Constants
const CODETRUST_DEP_CODE = CODETRUST_ARTIFACT.deployedBytecode;
const REGISTRY_DEP_CODE = CONTRACT_REGISTRY_ARTIFACT.deployedBytecode;
const STORAGE_DEP_CODE = STORAGE_ARTIFACT.deployedBytecode;
const OWNER_DEP_CODE = OWNER_ARTIFACT.deployedBytecode;
const BALLOT_DEP_CODE = BALLOT_ARTIFACT.deployedBytecode;
// -- revert Messages
const REVERT_MESSAGES = {
  // initializable: { initialized: "Initializable: contract is already initialized" },
  register: {
    untrustedAddress: "Call from untrusted address",
    paramLogic: "Logic address is nedded",
    paramVersionLower: "Version must be lower than 9999",
    alreadyRegistered: "Already registered, use update",
  },
  update: {
    untrustedAddress: "Call from untrusted address",
    paramName: "Record name needed",
    paramVersionInvalid: "Invalid new version",
    notRegistered: "Not registered, use register",
  },
  changeAdmin: {
    invalidNewAdmin: "Invalid new admin",
    notRegistered: "Contract record not registered",
  },
};

let CODETRUST_NAME_HEXSTRING: string;
let CONTRACT_REGISTRY_NAME_HEXSTRING: string;
let EXAMPLE_BALLOT_NAME_HEXSTRING: string;
let EXAMPLE_OWNER_NAME_HEXSTRING: string;
let EXAMPLE_STORAGE_NAME_HEXSTRING: string;
const NAME_HEXSTRING_ZERO = formatBytes32String("");

// Specific Variables
// -- Wallets
let accounts: Wallet[] = [];
let admin: Wallet;
let users: Wallet[] = [];
// -- Factories
let codeTrustFactory: Promise<CodeTrust__factory>;
let contractRegistryFactory: Promise<ContractRegistry__factory>;
let exampleBallotFactory: Promise<ExampleBallot__factory>;
let exampleOwnerFactory: Promise<ExampleOwner__factory>;
let exampleStorageFactory: Promise<ExampleStorage__factory>;
// -- Contracts
let codeTrust: ICodeTrust;
let contractRegistry: IContractRegistry;
let exampleBallot: ExampleBallot;
let exampleOwner: ExampleOwner;
let exampleStorage: ExampleStorage;
// -- utils
let lastReceipt: ContractReceipt | undefined;
let lastBlock: Block;
let lastRegisteredAt: number, lastUpdatedAt: number;

describe("Contract Registry", () => {
  before("Initialize test environment and const/var", async () => {
    // set global HardhatRuntimeEnvironment to use the same provider in scripts
    ({ gEthers: ethers, gProvider: provider, gCurrentNetwork: network } = await setGlobalHRE(hre));
    lastBlock = await provider.getBlock("latest");
    console.log(`Connected to network: ${network.name} (latest block: ${lastBlock.number})`);
    // Generate TEST.accountNumber wallets
    accounts = await generateWalletBatch(
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
    // set account names
    admin = accounts[0];
    for (let u = 1; u < accounts.length; u++) {
      users[u - 1] = accounts[u];
    }
    // Contract names as hexadecimal string with fixed length
    CODETRUST_NAME_HEXSTRING = formatBytes32String(CONTRACT.codeTrust.name);
    CONTRACT_REGISTRY_NAME_HEXSTRING = formatBytes32String(CONTRACT.contractRegistry.name);
    EXAMPLE_BALLOT_NAME_HEXSTRING = formatBytes32String(CONTRACT.exampleBallot.name);
    EXAMPLE_OWNER_NAME_HEXSTRING = formatBytes32String(CONTRACT.exampleOwner.name);
    EXAMPLE_STORAGE_NAME_HEXSTRING = formatBytes32String(CONTRACT.exampleStorage.name);
    // Get all factories now
    codeTrustFactory = ethers.getContractFactoryFromArtifact(
      CODETRUST_ARTIFACT,
      admin
    ) as Promise<CodeTrust__factory>;
    contractRegistryFactory = ethers.getContractFactoryFromArtifact(
      CONTRACT_REGISTRY_ARTIFACT,
      admin
    ) as Promise<ContractRegistry__factory>;
    exampleBallotFactory = ethers.getContractFactoryFromArtifact(
      BALLOT_ARTIFACT,
      admin
    ) as Promise<ExampleBallot__factory>;
    exampleOwnerFactory = ethers.getContractFactoryFromArtifact(
      OWNER_ARTIFACT,
      admin
    ) as Promise<ExampleOwner__factory>;
    exampleStorageFactory = ethers.getContractFactoryFromArtifact(
      STORAGE_ARTIFACT,
      admin
    ) as Promise<ExampleStorage__factory>;
  });

  describe("Deploy and Initialization", function () {
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

    after("Wait for events", async () => {
      await delay(5000); // 2 sec
    });
  });

  describe("Regular deployment use case", () => {
    before("Init variables", async () => {
      // set default signer for this flow
      codeTrust = codeTrust.connect(users[0]);
      contractRegistry = contractRegistry.connect(users[0]);
    });
    before("Deploy example ballot contract", async () => {
      exampleBallot = await (
        await (
          await exampleBallotFactory
        ).deploy(
          [formatBytes32String("one"), formatBytes32String("two"), formatBytes32String("three")],
          GAS_OPT.max
        )
      ).deployed();
      expect(isAddress(exampleBallot.address)).to.be.true;
      console.log(
        "Example Ballot deployed at: ",
        exampleBallot.address,
        " gas used: ",
        (await exampleBallot.deployTransaction.wait()).gasUsed
      );
    });
    before("Deploy example owner contract", async () => {
      exampleOwner = await (await (await exampleOwnerFactory).deploy(GAS_OPT.max)).deployed();
      expect(isAddress(exampleOwner.address)).to.be.true;
      console.log(
        "Example Owner deployed at: ",
        exampleOwner.address,
        " gas used: ",
        (await exampleOwner.deployTransaction.wait()).gasUsed
      );
    });
    before("Deploy example storage contract", async () => {
      exampleStorage = await (await (await exampleStorageFactory).deploy(GAS_OPT.max)).deployed();
      expect(isAddress(exampleStorage.address)).to.be.true;
      console.log(
        "Example Storage deployed at: ",
        exampleStorage.address,
        " gas used: ",
        (await exampleStorage.deployTransaction.wait()).gasUsed
      );
    });
    // REGISTER
    it("Should FAIL to register without logic address", async () => {
      await expect(
        contractRegistry.register(
          NAME_HEXSTRING_ZERO,
          ethers.constants.AddressZero,
          ethers.constants.AddressZero, //! <--
          0,
          keccak256(randomBytes(10)),
          users[0].address,
          GAS_OPT.max
        )
      ).to.be.revertedWith(REVERT_MESSAGES.register.paramLogic);
    });
    it("Should FAIL to register with invalid Version", async () => {
      await expect(
        contractRegistry.register(
          NAME_HEXSTRING_ZERO,
          exampleStorage.address,
          exampleStorage.address,
          10000, //! <--
          keccak256(randomBytes(10)),
          users[0].address,
          GAS_OPT.max
        )
      ).to.be.revertedWith(REVERT_MESSAGES.register.paramVersionLower);
    });
    it("Should FAIL to register as other admin", async () => {
      await expect(
        contractRegistry.register(
          NAME_HEXSTRING_ZERO,
          ethers.constants.AddressZero,
          ethers.constants.AddressZero,
          10000,
          keccak256(randomBytes(10)),
          users[1].address, //! <--
          GAS_OPT.max
        )
      ).to.be.revertedWith(REVERT_MESSAGES.register.untrustedAddress);
    });
    step("Should register Example Storage contract", async () => {
      lastReceipt = await (
        await contractRegistry.register(
          EXAMPLE_STORAGE_NAME_HEXSTRING,
          exampleStorage.address,
          exampleStorage.address,
          await versionDotToNum("01.00"),
          keccak256(STORAGE_DEP_CODE),
          users[0].address,
          GAS_OPT.max
        )
      ).wait();
      expect(lastReceipt).not.to.be.undefined;
      // update block timestamp
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });
    // GET RECORD
    step("Should check if Example Storage is registered", async () => {
      // use contract object to use user0.address in call
      await checkRecord(contractRegistry, EXAMPLE_STORAGE_NAME_HEXSTRING, users[0].address, {
        found: true,
        proxy: exampleStorage.address,
        logic: exampleStorage.address,
        admin: users[0].address,
        name: EXAMPLE_STORAGE_NAME_HEXSTRING,
        version: await versionDotToNum("01.00"),
        logicCodeHash: keccak256(STORAGE_DEP_CODE),
        timestamp: lastRegisteredAt,
      } as IExpectedRecord);
    });
    it("Should FAIL to register with USED name/key", async () => {
      await expect(
        contractRegistry.register(
          EXAMPLE_STORAGE_NAME_HEXSTRING, //! <--
          exampleStorage.address,
          exampleStorage.address,
          0,
          keccak256(STORAGE_DEP_CODE),
          users[0].address,
          GAS_OPT.max
        )
      ).to.be.revertedWith(REVERT_MESSAGES.register.alreadyRegistered);
    });
    // UPDATE
    it("Should FAIL to update without name", async () => {
      await expect(
        contractRegistry.update(
          NAME_HEXSTRING_ZERO, //! <--
          ADDR_ZERO,
          ADDR_ZERO,
          ADDR_ZERO,
          10000,
          keccak256(randomBytes(10)),
          ADDR_ZERO,
          GAS_OPT.max
        )
      ).to.be.revertedWith(REVERT_MESSAGES.update.paramName);
    });
    it("Should FAIL to update with a name not registered", async () => {
      await expect(
        contractRegistry.update(
          CONTRACT_REGISTRY_NAME_HEXSTRING, //! <--
          ADDR_ZERO,
          ADDR_ZERO,
          ADDR_ZERO,
          10000,
          keccak256(randomBytes(10)),
          ADDR_ZERO,
          GAS_OPT.max
        )
      ).to.be.revertedWith(REVERT_MESSAGES.update.notRegistered);
    });
    it("Should FAIL to update with an invalid New version", async () => {
      await expect(
        contractRegistry.update(
          EXAMPLE_STORAGE_NAME_HEXSTRING,
          ADDR_ZERO,
          ADDR_ZERO,
          ADDR_ZERO,
          await versionDotToNum("00.01"), //! <--
          keccak256(randomBytes(10)),
          ADDR_ZERO,
          GAS_OPT.max
        )
      ).to.be.revertedWith(REVERT_MESSAGES.update.paramVersionInvalid);
    });
    it("Should FAIL to update with an untrusted address", async () => {
      await expect(
        contractRegistry
          .connect(users[2]) //! <--
          .update(
            EXAMPLE_STORAGE_NAME_HEXSTRING,
            exampleStorage.address,
            exampleStorage.address,
            ADDR_ZERO,
            await versionDotToNum("01.01"),
            keccak256(STORAGE_DEP_CODE + "000100"),
            users[0].address,
            GAS_OPT.max
          )
      ).to.be.revertedWith(REVERT_MESSAGES.update.untrustedAddress);
    });
    step("Should update Example Storage contract", async () => {
      lastReceipt = await (
        await contractRegistry.update(
          EXAMPLE_STORAGE_NAME_HEXSTRING,
          exampleStorage.address,
          exampleStorage.address,
          ADDR_ZERO,
          await versionDotToNum("01.01"),
          keccak256(STORAGE_DEP_CODE + "000100"),
          users[0].address,
          GAS_OPT.max
        )
      ).wait();
      expect(lastReceipt).not.to.be.undefined;
      // update block timestamp
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });
    step("Should check if Example Storage is updated", async () => {
      // use contract object to use user0.address in call
      await checkRecord(contractRegistry, EXAMPLE_STORAGE_NAME_HEXSTRING, users[0].address, {
        found: true,
        proxy: exampleStorage.address,
        logic: exampleStorage.address,
        admin: users[0].address,
        name: EXAMPLE_STORAGE_NAME_HEXSTRING,
        version: await versionDotToNum("01.01"),
        logicCodeHash: keccak256(STORAGE_DEP_CODE + "000100"),
        timestamp: lastRegisteredAt,
      } as IExpectedRecord);
    });
    // CHANGE REGISTERED ADMIN
    it("Should FAIL to change admin witout new admin address", async () => {
      await expect(
        contractRegistry.changeRegisteredAdmin(
          EXAMPLE_STORAGE_NAME_HEXSTRING, // Not used
          ADDR_ZERO, //! <--
          GAS_OPT.max
        )
      ).to.be.revertedWith(REVERT_MESSAGES.changeAdmin.invalidNewAdmin);
    });
    it("Should FAIL to change admin to same admin", async () => {
      await expect(
        contractRegistry.changeRegisteredAdmin(
          EXAMPLE_STORAGE_NAME_HEXSTRING,
          users[0].address, //! <--
          GAS_OPT.max
        )
      ).to.be.revertedWith(REVERT_MESSAGES.changeAdmin.invalidNewAdmin);
    });
    it("Should FAIL to change admin of unregistered contract", async () => {
      await expect(
        contractRegistry.changeRegisteredAdmin(
          NAME_HEXSTRING_ZERO, //! <--
          users[1].address, // Not used'
          GAS_OPT.max
        )
      ).to.be.revertedWith(REVERT_MESSAGES.changeAdmin.notRegistered);
    });
    it("Should change admin of example contract", async () => {
      lastReceipt = await (
        await contractRegistry.changeRegisteredAdmin(
          EXAMPLE_STORAGE_NAME_HEXSTRING,
          users[1].address,
          GAS_OPT.max
        )
      ).wait();
      expect(lastReceipt).not.to.be.undefined;
      // update block timestamp
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });
    step("Should check if Example Storage has changed admin", async () => {
      // use contract object to use user0.address in call
      await checkRecord(contractRegistry, EXAMPLE_STORAGE_NAME_HEXSTRING, users[1].address, {
        found: true,
        proxy: exampleStorage.address,
        logic: exampleStorage.address,
        admin: users[1].address,
        name: EXAMPLE_STORAGE_NAME_HEXSTRING,
        version: await versionDotToNum("01.01"),
        logicCodeHash: keccak256(STORAGE_DEP_CODE + "000100"),
        timestamp: lastRegisteredAt,
      } as IExpectedRecord);
      await checkRecord(contractRegistry, EXAMPLE_STORAGE_NAME_HEXSTRING, users[0].address, {
        found: false,
      } as IExpectedRecord);
    });
    // EXTRA DATA
    it("Should edit extraData of example contract", async () => {
      await checkRecord(contractRegistry, EXAMPLE_STORAGE_NAME_HEXSTRING, users[1].address, {
        found: true,
        proxy: exampleStorage.address,
        logic: exampleStorage.address,
        admin: users[1].address,
        name: EXAMPLE_STORAGE_NAME_HEXSTRING,
        version: await versionDotToNum("01.01"),
        logicCodeHash: keccak256(STORAGE_DEP_CODE + "000100"),
        extraData: "0x",
        timestamp: lastRegisteredAt,
      } as IExpectedRecord);
      const data = JSON.stringify({
        id: "asdf01234",
        network: 1234,
      });
      lastReceipt = await (
        await contractRegistry
          .connect(users[1])
          .editExtraData(EXAMPLE_STORAGE_NAME_HEXSTRING, toUtf8Bytes(data), GAS_OPT.max)
      ).wait();
      expect(lastReceipt).not.to.be.undefined;
      // update block timestamp
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
      await checkRecord(contractRegistry, EXAMPLE_STORAGE_NAME_HEXSTRING, users[1].address, {
        found: true,
        proxy: exampleStorage.address,
        logic: exampleStorage.address,
        admin: users[1].address,
        name: EXAMPLE_STORAGE_NAME_HEXSTRING,
        version: await versionDotToNum("01.01"),
        logicCodeHash: keccak256(STORAGE_DEP_CODE + "000100"),
        extraData: hexValue(toUtf8Bytes(data)),
      } as IExpectedRecord);
    });
    // REGULAR LIST
    step("Should register Example Ballot contract", async () => {
      lastReceipt = await (
        await contractRegistry.register(
          EXAMPLE_BALLOT_NAME_HEXSTRING,
          exampleBallot.address,
          exampleBallot.address,
          0,
          keccak256(BALLOT_DEP_CODE),
          users[0].address,
          GAS_OPT.max
        )
      ).wait();
      expect(lastReceipt).not.to.be.undefined;
      // update block timestamp
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });
    step("Should register Example Owner contract", async () => {
      lastReceipt = await (
        await contractRegistry.register(
          EXAMPLE_OWNER_NAME_HEXSTRING,
          exampleOwner.address,
          exampleOwner.address,
          0,
          keccak256(OWNER_DEP_CODE),
          users[0].address,
          GAS_OPT.max
        )
      ).wait();
      expect(lastReceipt).not.to.be.undefined;
      // update block timestamp
      lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
      lastReceipt = undefined;
    });
    // GET LIST
    step("Should get system contracts", async () => {
      const namesByAdmin = await contractRegistry.connect(admin).getMyRecords();
      const namesBySystem = await contractRegistry.getSystemRecords();
      // console.log(namesByAdmin, namesBySystem);
      expect(namesByAdmin.length).to.equal(2).to.equal(namesBySystem.length);
      expect(namesByAdmin[0]).to.equal(CODETRUST_NAME_HEXSTRING).to.equal(namesBySystem[0]);
      expect(namesByAdmin[1]).to.equal(CONTRACT_REGISTRY_NAME_HEXSTRING).to.equal(namesBySystem[1]);
    });
    step("Should get user 0 contracts", async () => {
      const names = await contractRegistry.getMyRecords();
      // console.log(names);
      expect(names.length).to.equal(2);
      expect(names[0]).to.equal(EXAMPLE_OWNER_NAME_HEXSTRING);
      expect(names[1]).to.equal(EXAMPLE_BALLOT_NAME_HEXSTRING);
    });
    step("Should get user 1 contracts", async () => {
      const names = await contractRegistry.connect(users[1]).getMyRecords();
      // console.log(names);
      expect(names.length).to.equal(1);
      expect(names[0]).to.equal(EXAMPLE_STORAGE_NAME_HEXSTRING);
    });
    after("Wait for events", async () => {
      await delay(5000); // 2 sec
    });
  });
});
