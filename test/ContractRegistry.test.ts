import * as hre from "hardhat";
import { isAddress } from "@ethersproject/address";
import { Wallet } from "@ethersproject/wallet";
import { expect } from "chai";
import { step } from "mocha-steps";
import { ethers } from "hardhat";
import {
  ContractRegistry,
  ContractRegistry__factory,
  ExampleStorage,
  ExampleStorage__factory,
} from "../typechain-types";
import { keccak256 } from "@ethersproject/keccak256";
import { randomBytes } from "crypto";
import { GAS_OPT, initHRE, stringToBytesFixed } from "../scripts/utils";
import { INetwork } from "../models/Deploy";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ENV } from "../process.env";

// Generic Constants
let PROVIDER: JsonRpcProvider;
let NETWORK: INetwork;

// Specific Constants
// -- revert Messages
const REVERT_MESSAGES = {
  initializable: { initialized: "Initializable: contract is already initialized" },
  register: {
    paramLogic: "Logic address is nedded",
    paramName: "Name must be unique or null",
    alreadyRegistered: "Contract already registered",
  },
};

// Specific Variables
// -- Wallets
let admin: Wallet;
let users: Wallet[] = [];
// -- Contracts
let contractRegistry: ContractRegistry;
let exampleStorage: ExampleStorage;

before("Initialize test environment", async () => {
  // set global HardhatRuntimeEnvironment to use the same provider in scripts
  ({ gProvider: PROVIDER, gCurrentNetwork: NETWORK } = await initHRE(hre));
  // Create random test wallets
  try {
    admin = Wallet.createRandom().connect(PROVIDER);
    for (let u = 0; u < ENV.WALLET.TEST.USER_NUMBER; u++) {
      users[u] = Wallet.createRandom().connect(PROVIDER);
    }
  } catch (error) {
    throw new Error(`Error creating or reading wallets from keystore. ${error}`);
  }
});

describe("Contract Registry - Deploy and Initialization", async function () {
  step("Should deploy contract registry", async () => {
    contractRegistry = await (
      await new ContractRegistry__factory(admin).deploy(GAS_OPT)
    ).deployed();
    expect(isAddress(contractRegistry.address)).to.be.true;
    console.log("Contract Registry deployed at: ", contractRegistry.address);
  });

  it("Should subscribe contract EVENTS", async () => {
    // Contract Registered
    contractRegistry.on(
      contractRegistry.filters.Registered(),
      (proxy, name, version, logicCodeHash) => {
        const nameString = Buffer.from(name, "hex").toString("utf-8");
        const versionStr = Buffer.from(version, "hex").toString();
        console.log(
          `New Contract Registered: { Proxy: ${proxy}, Name: ${nameString}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}}`
        );
      }
    );
    // Contract Updated
    contractRegistry.on(
      contractRegistry.filters.Updated(),
      (proxy, name, version, logicCodeHash) => {
        const nameString = Buffer.from(name, "hex").toString("utf-8");
        const versionStr = Buffer.from(version, "hex").toString();
        console.log(
          `New Contract Updated: { Proxy: ${proxy}, Name: ${nameString}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}}`
        );
      }
    );
  });

  step("Should initialize contract", async () => {
    expect(
      await (
        await contractRegistry.initialize(
          ethers.constants.AddressZero,
          new Uint8Array(30),
          new Uint8Array(2),
          keccak256(ContractRegistry__factory.bytecode),
          GAS_OPT
        )
      ).wait()
    ).not.to.be.undefined;
  });

  it("Should FAIL initializing same contract again", async () => {
    await expect(
      contractRegistry.initialize(
        ethers.constants.AddressZero,
        new Uint8Array(30),
        new Uint8Array(2),
        keccak256(ContractRegistry__factory.bytecode),
        GAS_OPT
      )
    ).to.be.revertedWith(REVERT_MESSAGES.initializable.initialized);
  });
});

describe("Contract Registry - Regular use case", async () => {
  let nameBytes: Promise<Uint8Array>, anotherNameBytes: Promise<Uint8Array>;
  const versionBytes = new Uint8Array(2);

  before("Init variables", async () => {
    // encode to bytes of length 30 using UTF-8
    nameBytes = stringToBytesFixed(ENV.CONTRACT.CONTRACT_REGISTRY.NAME, 30);
    anotherNameBytes = stringToBytesFixed(ENV.CONTRACT.CONTRACT_REGISTRY.NAME + "_01", 30);
  });
  before("Deploy example contract", async () => {
    exampleStorage = await (await new ExampleStorage__factory(admin).deploy(GAS_OPT)).deployed();
    expect(isAddress(exampleStorage.address)).to.be.true;
    console.log("Example Storage deployed at: ", exampleStorage.address);
  });

  it("Should FAIL to register without logic address", async () => {
    await expect(
      contractRegistry.connect(users[0]).register(
        ethers.constants.AddressZero,
        ethers.constants.AddressZero, // <--
        await nameBytes,
        versionBytes,
        keccak256(randomBytes(10)),
        GAS_OPT
      )
    ).to.be.revertedWith(REVERT_MESSAGES.register.paramLogic);
  });
  it("Should FAIL to register without name", async () => {
    await expect(
      contractRegistry.connect(users[0]).register(
        ethers.constants.AddressZero,
        exampleStorage.address,
        await stringToBytesFixed("", 30), // <--
        new Uint8Array(2),
        keccak256(randomBytes(10)),
        GAS_OPT
      )
    ).to.be.revertedWith(REVERT_MESSAGES.register.paramName);
  });
  it("Should FAIL to register with USED name", async () => {
    await expect(
      contractRegistry.connect(users[0]).register(
        ethers.constants.AddressZero,
        exampleStorage.address,
        await stringToBytesFixed(ENV.CONTRACT.CONTRACT_REGISTRY.NAME, 30), //! <--
        new Uint8Array(2),
        keccak256(randomBytes(10)),
        GAS_OPT
      )
    ).to.be.revertedWith(REVERT_MESSAGES.register.paramName);
  });
  it("Should FAIL to register with USED address", async () => {
    await expect(
      contractRegistry.connect(users[0]).register(
        ethers.constants.AddressZero,
        contractRegistry.address, //! <--
        await anotherNameBytes, // another name is needed to trigger this revert
        new Uint8Array(2),
        keccak256(randomBytes(10)),
        GAS_OPT
      )
    ).to.be.revertedWith(REVERT_MESSAGES.register.alreadyRegistered);
    /* console.log(
      await contractRegistry.getAdminContracts(),
      await contractRegistry.getRecord(contractRegistry.address)
    ); */
  });
});
