import * as hre from "hardhat";
import { isAddress } from "@ethersproject/address";
import { Wallet } from "@ethersproject/wallet";
import { expect } from "chai";
import { step } from "mocha-steps";
import { ethers } from "hardhat";
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
  ProxyAdmin,
} from "../typechain-types";
import { keccak256 } from "@ethersproject/keccak256";
import { randomBytes } from "crypto";
import {
  ADDR_ZERO,
  delay,
  GAS_OPT,
  getTimeStamp,
  initHRE,
  stringToStringHexFixed,
} from "../scripts/utils";
import { INetwork } from "../models/Deploy";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ENV } from "../configuration";
import {
  IExpectedRecord,
  checkRecord,
  versionDotToNum,
  versionNumToDot,
} from "../scripts/contractRegistry";
import { ContractReceipt } from "ethers";
import { deployedBytecode as CODETRUST_DEP_CODE } from "../artifacts/contracts/external/CodeTrust.sol/CodeTrust.json";
import { deployedBytecode as REGISTRY_DEP_CODE } from "../artifacts/contracts/ContractRegistry.sol/ContractRegistry.json";
import { deployedBytecode as STORAGE_DEP_CODE } from "../artifacts/contracts/Example_Storage.sol/ExampleStorage.json";
import { deployedBytecode as OWNER_DEP_CODE } from "../artifacts/contracts/Example_Owner.sol/ExampleOwner.json";
import { deployedBytecode as BALLOT_DEP_CODE } from "../artifacts/contracts/Example_Ballot.sol/ExampleBallot.json";

// Generic Constants
let PROVIDER: JsonRpcProvider;
let NETWORK: INetwork;

// Specific Constants
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
let ANOTHER_NAME_HEXSTRING: string;
const NAME_HEXSTRING_ZERO = new Uint8Array(32);

// Specific Variables
// -- Wallets
let admin: Wallet;
let users: Wallet[] = [];
// -- Contracts
let codeTrust: ICodeTrust;
let contractRegistry: IContractRegistry;
let exampleBallot: ExampleBallot;
let exampleOwner: ExampleOwner;
let exampleStorage: ExampleStorage;
// -- upgrade
let proxyAdmin: ProxyAdmin;
// -- utils
let lastReceipt: ContractReceipt | undefined;
let lastRegisteredAt: number, lastUpdatedAt: number;
before("Initialize test environment and const/var", async () => {
  // set global HardhatRuntimeEnvironment to use the same provider in scripts
  ({ gProvider: PROVIDER, gCurrentNetwork: NETWORK } = await initHRE(hre));
  // Create random test wallets
  try {
    admin = Wallet.createRandom().connect(PROVIDER);
    for (let u = 0; u < ENV.KEYSTORE.test.userNumber; u++) {
      users[u] = Wallet.createRandom().connect(PROVIDER);
    }
    // Contract names as hexadecimal string with fixed length
    CODETRUST_NAME_HEXSTRING = await stringToStringHexFixed(ENV.CONTRACT.codeTrust.name, 32);
    CONTRACT_REGISTRY_NAME_HEXSTRING = await stringToStringHexFixed(
      ENV.CONTRACT.contractRegistry.name,
      32
    );
    EXAMPLE_BALLOT_NAME_HEXSTRING = await stringToStringHexFixed(
      ENV.CONTRACT.exampleBallot.name,
      32
    );
    EXAMPLE_OWNER_NAME_HEXSTRING = await stringToStringHexFixed(ENV.CONTRACT.exampleOwner.name, 32);
    EXAMPLE_STORAGE_NAME_HEXSTRING = await stringToStringHexFixed(
      ENV.CONTRACT.exampleStorage.name,
      32
    );
    ANOTHER_NAME_HEXSTRING = await stringToStringHexFixed(
      ENV.CONTRACT.exampleBallot.name + "_BAD!!!!",
      32
    );
  } catch (error) {
    throw new Error(`Error creating or reading wallets from keystore. ${error}`);
  }
});

describe("Contract Registry - Deploy and Initialization", function () {
  before("Init variables", async () => {
    lastRegisteredAt = await getTimeStamp();
    lastUpdatedAt = await getTimeStamp();
  });

  step("Should deploy CodeTrust", async () => {
    codeTrust = await (await new CodeTrust__factory(admin).deploy(GAS_OPT)).deployed();
    lastReceipt = await codeTrust.deployTransaction.wait();
    expect(isAddress(codeTrust.address)).to.be.true;
    console.log("CodeTrust contract deployed at: ", codeTrust.address);
    expect(lastReceipt).not.to.be.undefined;
    lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
    lastReceipt = undefined;
  });

  step("Should deploy ContractRegistry", async () => {
    contractRegistry = await (
      await new ContractRegistry__factory(admin).deploy(
        codeTrust.address,
        NAME_HEXSTRING_ZERO,
        0,
        keccak256(REGISTRY_DEP_CODE),
        GAS_OPT
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
        GAS_OPT
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

describe("Contract Registry - Regular deployment use case", () => {
  before("Init variables", async () => {
    // set default signer for this flow
    codeTrust = codeTrust.connect(users[0]);
    contractRegistry = contractRegistry.connect(users[0]);
  });
  before("Deploy example ballot contract", async () => {
    exampleBallot = await (
      await new ExampleBallot__factory(admin).deploy(
        [
          await stringToStringHexFixed("one", 32),
          await stringToStringHexFixed("two", 32),
          await stringToStringHexFixed("three", 32),
        ],
        GAS_OPT
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
    exampleOwner = await (await new ExampleOwner__factory(admin).deploy(GAS_OPT)).deployed();
    expect(isAddress(exampleOwner.address)).to.be.true;
    console.log(
      "Example Owner deployed at: ",
      exampleOwner.address,
      " gas used: ",
      (await exampleOwner.deployTransaction.wait()).gasUsed
    );
  });
  before("Deploy example storage contract", async () => {
    exampleStorage = await (await new ExampleStorage__factory(admin).deploy(GAS_OPT)).deployed();
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
        GAS_OPT
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
        GAS_OPT
      )
    ).to.be.revertedWith(REVERT_MESSAGES.register.paramVersionLower);
  });
  it("Should FAIL to register with as other admin", async () => {
    await expect(
      contractRegistry.register(
        NAME_HEXSTRING_ZERO,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        10000,
        keccak256(randomBytes(10)),
        users[1].address, //! <--
        GAS_OPT
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
        GAS_OPT
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
        GAS_OPT
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
        GAS_OPT
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
        GAS_OPT
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
        GAS_OPT
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
          GAS_OPT
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
        GAS_OPT
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
        GAS_OPT
      )
    ).to.be.revertedWith(REVERT_MESSAGES.changeAdmin.invalidNewAdmin);
  });
  it("Should FAIL to change admin to same admin", async () => {
    await expect(
      contractRegistry.changeRegisteredAdmin(
        EXAMPLE_STORAGE_NAME_HEXSTRING,
        users[0].address, //! <--
        GAS_OPT
      )
    ).to.be.revertedWith(REVERT_MESSAGES.changeAdmin.invalidNewAdmin);
  });
  it("Should FAIL to change admin of unregistered contract", async () => {
    await expect(
      contractRegistry.changeRegisteredAdmin(
        NAME_HEXSTRING_ZERO, //! <--
        users[1].address, // Not used'
        GAS_OPT
      )
    ).to.be.revertedWith(REVERT_MESSAGES.changeAdmin.notRegistered);
  });
  it("Should change admin of example contract", async () => {
    lastReceipt = await (
      await contractRegistry.changeRegisteredAdmin(
        EXAMPLE_STORAGE_NAME_HEXSTRING,
        users[1].address,
        GAS_OPT
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
        GAS_OPT
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
        GAS_OPT
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

// describe("Contract Registry - Upgradeable deployment use case", async () => {
//   before("Init variables", async () => {
//     // set default signer for this flow
//     contractRegistry = contractRegistry.connect(users[2]);
//   });

//   before("Deploy example storage contract", async () => {
//     proxyAdmin = await (await new ProxyAdmin__factory(users[2]).deploy(GAS_OPT)).deployed();
//     const factory = await ethers.getContractFactory(ENV.CONTRACT.exampleStorage.name, users[2]);
//     const logic = await (await factory.deploy(GAS_OPT)).deployed();
//     const initData = factory.interface._encodeParams([], []);
//     //* TUP - Transparent Upgradeable Proxy
//     const tuProxy = await (
//       await new TUP__factory(users[2]).deploy(logic.address, proxyAdmin.address, initData, GAS_OPT)
//     ).deployed();
//     exampleStorage = new Contract(
//       tuProxy.address,
//       ExampleStorage__factory.abi,
//       users[2]
//     ) as ExampleStorage;
//     expect(isAddress(exampleStorage.address)).to.be.true;
//     console.log("Example Storage deployed at: ", exampleStorage.address);
//   });
//   // REGISTER
//   step("Should register Example Storage upgradeable contract", async () => {
//     const receipt = await (
//       await contractRegistry.register(
//         exampleStorage.address,
//         await proxyAdmin.getProxyImplementation(exampleStorage.address),
//         EXAMPLE_STORAGE_NAME_HEXSTRING,
//         0,
//         keccak256(ExampleStorage__factory.bytecode),
//         GAS_OPT
//       )
//     ).wait();
//     expect(receipt).not.to.be.undefined;
//     // update block timestamp
//     lastRegisteredAt = lastUpdatedAt = await getTimeStamp(receipt.blockHash);
//   });
//   // GET RECORD
//   step("Should check if Example Storage is registered", async () => {
//     // use contract object to use user0.address in call
//     await checkRecord(contractRegistry as unknown as IContractRegistry, exampleStorage.address, {
//       found: true,
//       proxy: exampleStorage.address,
//       logic: await proxyAdmin.getProxyImplementation(exampleStorage.address),
//       admin: users[2].address,
//       name: EXAMPLE_STORAGE_NAME_HEXSTRING,
//       version: await versionDotToNum("00.00"),
//       logicCodeHash: keccak256(ExampleStorage__factory.bytecode),
//       rat: lastRegisteredAt,
//       uat: lastUpdatedAt,
//     } as IExpectedRecord);
//   });
//   // UPDATE
//   it("Should FAIL to update unregistered deployment", async () => {
//     await expect(
//       contractRegistry.update(
//         await proxyAdmin.getProxyImplementation(exampleStorage.address), //! <--
//         ADDR_ZERO,
//         NAME_HEXSTRING_ZERO,
//         await versionDotToNum("01.00"),
//         keccak256(ExampleStorage__factory.bytecode) // Not used
//       )
//     ).to.be.revertedWith(REVERT_MESSAGES.update.notRegistered);
//   });
//   it("Should FAIL to update with same logic address", async () => {
//     await expect(
//       contractRegistry.update(
//         exampleStorage.address,
//         await proxyAdmin.getProxyImplementation(exampleStorage.address), //! <--
//         NAME_HEXSTRING_ZERO, // Not used
//         await versionDotToNum("01.00"), // Not used
//         keccak256(ExampleStorage__factory.bytecode) // Not used
//       )
//     ).to.be.revertedWith(REVERT_MESSAGES.update.paramLogic);
//   });
//   it("Should FAIL to update with same logic code hash", async () => {
//     // deploy a new logic/implementation contract
//     const factory = await ethers.getContractFactory(ENV.CONTRACT.exampleStorage.name, users[2]);
//     const logic = await (await factory.deploy()).deployed();
//     // change logic reference in proxyAdmin
//     await proxyAdmin.upgrade(exampleStorage.address, logic.address);
//     await expect(
//       contractRegistry.update(
//         exampleStorage.address,
//         await proxyAdmin.getProxyImplementation(exampleStorage.address),
//         NAME_HEXSTRING_ZERO, // Not used
//         await versionDotToNum("01.00"), // Not used
//         keccak256(ExampleStorage__factory.bytecode), //! <--
//         GAS_OPT
//       )
//     ).to.be.revertedWith(REVERT_MESSAGES.update.paramLogicCodeHash);
//   });
//   it("Should FAIL to update with same version", async () => {
//     await expect(
//       contractRegistry.update(
//         exampleStorage.address,
//         await proxyAdmin.getProxyImplementation(exampleStorage.address),
//         NAME_HEXSTRING_ZERO, // Not used
//         await versionDotToNum("00.00"),
//         keccak256(ExampleStorage__factory.bytecode + "012345") // Not used
//       )
//     ).to.be.revertedWith(REVERT_MESSAGES.update.versionLower);
//   });
//   it("Should FAIL to update from other 'admin'", async () => {
//     await expect(
//       contractRegistry.connect(users[0]).update(
//         //! <--
//         exampleStorage.address,
//         await proxyAdmin.getProxyImplementation(exampleStorage.address),
//         NAME_HEXSTRING_ZERO,
//         await versionDotToNum("01.00"),
//         keccak256(ExampleStorage__factory.bytecode + "012345")
//       )
//     ).to.be.revertedWith(REVERT_MESSAGES.update.notAdmin);
//   });
//   step("Should update Example Storage upgradeable contract", async () => {
//     const factory = await ethers.getContractFactory(ENV.CONTRACT.exampleStorage.name, users[2]);
//     const logic = await (await factory.deploy(GAS_OPT)).deployed();
//     await proxyAdmin.upgrade(exampleStorage.address, logic.address, GAS_OPT);
//     const receipt = await (
//       await contractRegistry.update(
//         exampleStorage.address,
//         logic.address,
//         NAME_HEXSTRING_ZERO,
//         await versionDotToNum("01.00"),
//         keccak256(ExampleStorage__factory.bytecode + "012345"),
//         GAS_OPT
//       )
//     ).wait();
//     expect(receipt).not.to.be.undefined;
//     // update block timestamp
//     lastUpdatedAt = await getTimeStamp(receipt.blockHash);
//   });
//   // GET RECORD
//   step("Should check if Example Storage is updated", async () => {
//     // use contract object to use user0.address in call
//     await checkRecord(contractRegistry as unknown as IContractRegistry, exampleStorage.address, {
//       found: true,
//       proxy: exampleStorage.address,
//       logic: await proxyAdmin.getProxyImplementation(exampleStorage.address),
//       admin: users[2].address,
//       name: EXAMPLE_STORAGE_NAME_HEXSTRING,
//       version: await versionDotToNum("01.00"),
//       logicCodeHash: keccak256(ExampleStorage__factory.bytecode + "012345"),
//       rat: lastRegisteredAt,
//       uat: lastUpdatedAt,
//     } as IExpectedRecord);
//   });
//   after("Wait for events", async () => {
//     await delay(5000); // 2 sec
//   });
// });
