import { isAddress } from "@ethersproject/address";
import { Wallet } from "@ethersproject/wallet";
import { expect, should } from "chai";
import { step } from "mocha-steps";
import { ethers } from "hardhat";
import {
  ADMIN_WALL_PASS,
  KEYSTORE_ADMIN,
  KEYSTORE_TEST,
  TEST_WALL_PASS,
  USER_NUMBER,
} from "../scripts/createAccountPool";
import * as fs from "async-file";
import { GAS_OPT } from "../scripts/deploy";
import { ContractRegistry, ContractRegistry__factory } from "../typechain";
import { keccak256 } from "@ethersproject/keccak256";
import { randomBytes } from "crypto";
import { concat, zeroPad } from "@ethersproject/bytes";

// Specific Constants
// -- revert Messages
const REVERT_MESSAGES = {
  initializable: { initialized: "Initializable: contract is already initialized" },
  register: {
    paramProxy: "Proxy address is nedded",
    multipleSenders: "Cannot registrate hashes from multiple senders",
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

// -- Wallets
let admin: Wallet;
let users: Wallet[] = [];
// -- Contracts
let contractRegistry: ContractRegistry;

describe("Contract Registry - Deploy and Initialization", async function () {
  before("Check initial wallets", async () => {
    try {
      admin = Wallet.fromEncryptedJsonSync(
        await fs.readFile(KEYSTORE_ADMIN),
        ADMIN_WALL_PASS
      ).connect(ethers.provider);
      let usersP = [];
      for (let u = 0; u < USER_NUMBER; u++) {
        // insert "0" if less than 10
        if (u < 10) {
          usersP.push(
            Wallet.fromEncryptedJson(
              await fs.readFile(`${KEYSTORE_TEST}/user_0${u}.json`),
              TEST_WALL_PASS
            )
          );
        } else {
          usersP.push(
            Wallet.fromEncryptedJson(
              await fs.readFile(`${KEYSTORE_TEST}/user_${u}.json`),
              TEST_WALL_PASS
            )
          );
        }
      }
      for (const userP of usersP) {
        users.push((await userP).connect(ethers.provider));
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
  it("Should FAIL to register without proxy address", async () => {
    const nameInBytes = Uint8Array.from(Buffer.from("TEST NOT PROXY PARAM", "utf-8"));
    await expect(
      contractRegistry
        .connect(users[0])
        .register(
          ethers.constants.AddressZero,
          ethers.constants.AddressZero,
          concat([nameInBytes, new Uint8Array(30 - nameInBytes.byteLength)]),
          new Uint8Array(2),
          keccak256(randomBytes(10)),
          GAS_OPT
        )
    ).to.be.revertedWith(REVERT_MESSAGES.register.paramProxy);
    console.log(await contractRegistry.getAdminContracts(), await contractRegistry.getRecord(contractRegistry.address));
  });
});
