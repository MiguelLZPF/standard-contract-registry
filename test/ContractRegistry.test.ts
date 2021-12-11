import { isAddress } from "@ethersproject/address";
import { Wallet } from "@ethersproject/wallet";
import { expect } from "chai";
import { step } from "mocha-steps";
import { ethers } from "hardhat";
import * as fs from "async-file";
import { GAS_OPT } from "../scripts/deploy";
import {
  ContractRegistry,
  ContractRegistry__factory,
  ExampleStorage,
  ExampleStorage__factory,
} from "../typechain";
import { keccak256 } from "@ethersproject/keccak256";
import { randomBytes } from "crypto";
import { stringToBytesFixed } from "../scripts/utils";

// Specific Constants
// -- revert Messages
const REVERT_MESSAGES = {
  initializable: { initialized: "Initializable: contract is already initialized" },
  register: {
    paramLogic: "Logic address is nedded",
    paramName: "Name must be unique or null",
    alreadyRegistered: "Contract already registered",
  },
  /*presented: {
    invalid: "This VP is not valid at this time",
    invState: "Must be in REGISTERED state",
    allowedVerifier: "Must be an allowed verifier to receive this VP",
  },
  consumed: {
    invState: "Must be in PRESENTED state",
    sameVerifier: "Only the same verifier can mark as consumed",
  },
  cancel: {
    invState: "Must be in REGISTERED state",
    samePreseter: "Only the presenter who registered the VP can cancel it",
  }, */
};
const CONTRACT_REGISTRY_NAME = "ContractRegistry";
const EXAMPLE_STORAGE_NAME = "ExampleStorage";

// -- Wallets
let admin: Wallet;
let users: Wallet[] = [];
// -- Contracts
let contractRegistry: ContractRegistry;
let exampleStorage: ExampleStorage;

describe("Contract Registry - Deploy and Initialization", async function () {
  before("Create random test wallets", async () => {
    try {
      admin = Wallet.createRandom();
      for (let u = 0; u < +process.env.TEST_USER_NUMBER!; u++) {
        users[u] = Wallet.createRandom();
      }
    } catch (error) {
      throw new Error(`Error creating or reading wallets from keystore. ${error}`);
    }
  });
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
  const nameBytes = stringToBytesFixed(EXAMPLE_STORAGE_NAME, 30);
  const versionBytes = new Uint8Array(2);

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
        await stringToBytesFixed(CONTRACT_REGISTRY_NAME, 30), // <--
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
        contractRegistry.address, // <--
        await nameBytes,
        new Uint8Array(2),
        keccak256(randomBytes(10)),
        GAS_OPT
      )
    ).to.be.revertedWith(REVERT_MESSAGES.register.alreadyRegistered);
  });
  /* console.log(
    await contractRegistry.getAdminContracts(),
    await contractRegistry.getRecord(contractRegistry.address)
  ); */
});
