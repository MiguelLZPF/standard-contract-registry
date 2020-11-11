import { hardhatArguments, ethers } from "hardhat";

import * as fs from "async-file";
import { expect } from "chai";
import { Wallet, Contract, BigNumber, Event, ContractFactory } from "ethers";
import { formatBytes32String } from "ethers/lib/utils";
import {
  createWallet,
  deploy,
  deployNinitRegistry,
  GAS_OPT,
  getEvents,
  logObject,
  provider,
  random32Bytes,
  toHexVersion,
  TransactionResponse,
} from "../scripts/Utils";
import * as Manager from "../artifacts/contracts/Manager.sol/Manager.json";
import { ContractRecord } from "../models/Registry";

describe("Registry", async function () {
  //this.timeout
  // General Contants
  const WALL_NUMBER = 3;
  const WALL_PASS = "password";
  const WALL_ENTROPY = "EnTrOpY";
  // Specific Constants
  // initial hostname
  // initial MAC address
  // initial IP address
  // General variables
  let wallets: Wallet[] = [];
  //let regUpgrader: Wallet | undefined;
  let admin: Wallet | undefined;
  let me: Wallet | undefined;
  // Specific variables
  // -- Contracts
  let proxyAdmin: Contract;
  let registry: Contract; //registryProxy: Contract;
  let manager: Contract;
  // -- Records
  let managerRecord: ContractRecord;

  this.beforeAll(async () => {
    const accounts = await ethers.getSigners();
    /* accounts.forEach(async (signer) => {
      console.log(await signer.getAddress());
    }); */

    if (accounts.length < WALL_NUMBER) {
      console.warn(
        `Warning: the number of wallet created will be greater than the providers accounts length (${accounts.length}),
          so the remaining wallets will have a balance of 0 wei`
      );
    }

    let wallet: Promise<Wallet | undefined>;

    try {
      if (!(await fs.exists("./keystore"))) {
        await fs.mkdir("keystore");
      }
      // Asyncronously creates an array of ACC_NUMBER Wallets
      // Only takes almost the same amount of time to create only one
      let promWallets: Promise<Wallet | undefined>[] = [];
      for (let index = 0; index < WALL_NUMBER; index++) {
        wallet = createWallet(
          `./keystore/wallet_${index}.json`,
          WALL_PASS,
          WALL_ENTROPY
        );
        promWallets.push(wallet);
      }
      wallets = (await Promise.all(promWallets)) as Wallet[];
      // If other networks, coment the If structure first time
      if (hardhatArguments.network == "hardhat") {
        for (let index = 0; index < WALL_NUMBER; index++) {
          if (hardhatArguments.network != "hardhat") {
            await provider.getSigner(index).unlock("");
          }
          await accounts[index].sendTransaction({
            to: wallets[index].address,
            value: BigNumber.from("0x56BC75E2D63100000"), //100 eth
          });
          console.log(`Wallet_${index}:
          - Address: ${wallets[index].address}
          - Balance: ${await wallets[index].getBalance()}`);
        }
      }
      //regUpgrader = wallets[0];
      admin = wallets[0];
      me = wallets[1];
    } catch (error) {
      console.error(error);
    }
  });

  it("Should deploy Proxy Admin contract", async () => {
    console.log("\n ==> Deploying Proxy Admin contract...\n");
    admin = admin!;

    proxyAdmin = (await deploy("ProxyAdmin", admin))!;

    console.log(`Proxy Admin successfully deployed:
      - Proxy Admin address: ${proxyAdmin.address}
      - Proxy Admin's owner: ${await proxyAdmin.callStatic.owner(GAS_OPT)}\n`);

    expect(await proxyAdmin.owner(GAS_OPT)).to.equal(
      await admin.getAddress(),
      `Proxy Admin's owner not equal admin address`
    );
  });

  it("Should deploy Registry contract", async () => {
    console.log("\n ==> Deploying registry contract...\n");
    admin = admin!;

    registry = (await deployNinitRegistry(admin, proxyAdmin.address))!;

    console.log(`Registry successfully deployed:
      - Registry logic address: ${await proxyAdmin.callStatic.getProxyImplementation(
        registry.address,
        GAS_OPT
      )}
      - Registry proxy address: ${registry.address}
      - Registry proxy's admin: ${await proxyAdmin.callStatic.getProxyAdmin(
        registry.address,
        GAS_OPT
      )} \n`);

    const initEvent = (await getEvents(
      registry,
      "Initialized",
      [registry.address, admin.address],
      true
    )) as Event;
    //console.log(initEvent.args);

    expect(await registry.owner()).to.equal(
      admin.address,
      `Registry's owner not equal admin's address`
    );

    expect(
      await proxyAdmin.callStatic.getProxyAdmin(registry.address, GAS_OPT)
    ).to.equal(
      proxyAdmin.address,
      `Registry's admin not equal proxy admin's address`
    );

    expect(initEvent.args?.registry).to.equal(
      registry.address,
      `Registry's address not equal event address`
    );

    expect(initEvent.args?.owner).to.equal(
      admin.address,
      `Event's owner not equal admin's address`
    );
  });

  it("Should set Lan Manager project types", async () => {
    console.log("\n ==> Setting Lan Manager contract Types and Versions... \n");
    const version = toHexVersion("0.1");

    const receipts = await Promise.all([
      ((await registry.setType(
        "Manager", // should change to lower case
        await version,
        GAS_OPT
      )) as TransactionResponse).wait(),
      ((await registry.setType(
        "Network", // should change to lower case
        await version,
        GAS_OPT
      )) as TransactionResponse).wait(),
      ((await registry.setType(
        "Host", // should change to lower case
        await version,
        GAS_OPT
      )) as TransactionResponse).wait(),
    ]);

    const newTypeEvents = Promise.all([
      getEvents(
        registry,
        "NewType",
        [null, null], //["manager", await version],
        true,
        receipts[0].blockNumber,
        receipts[0].blockNumber
      ) as Promise<Event>,
      getEvents(
        registry,
        "NewType",
        [null, null], //["manager", await version],
        true,
        receipts[1].blockNumber,
        receipts[1].blockNumber
      ) as Promise<Event>,
      getEvents(
        registry,
        "NewType",
        [null, null], //["manager", await version],
        true,
        receipts[2].blockNumber,
        receipts[2].blockNumber
      ) as Promise<Event>,
    ]);

    console.log(`Type manager set: 
      - Type: ${logObject((await newTypeEvents)[0].args?.type_)}
      - Version: ${(await newTypeEvents)[0].args?.version}`);
    console.log(`Type network set: 
      - Type: ${logObject((await newTypeEvents)[1].args?.type_)}
      - Version: ${(await newTypeEvents)[1].args?.version}`);
    console.log(`Type host set: 
      - Type: ${logObject((await newTypeEvents)[2].args?.type_)}
      - Version: ${(await newTypeEvents)[2].args?.version}`);

    console.log(await registry.getTypes(GAS_OPT));
  });

  it("Should deploy Manager contract", async () => {
    console.log("\n ==> Deploying Manager contract...\n");
    me = me!;
    // to call contract from my account
    const registryMe = registry.connect(me);
    const data = new ContractFactory(
      Manager.abi,
      Manager.bytecode,
      me
    ).interface.encodeFunctionData("initialize");
    const receipt = await ((await registryMe.deployContract(
      Manager.bytecode,
      data,
      await random32Bytes(),
      "manager",
      GAS_OPT
    )) as TransactionResponse).wait();

    const deployEvent = (await getEvents(
      registryMe,
      "Deployed",
      [null, null, me.address, "manager", null],
      true,
      receipt.blockNumber,
      receipt.blockNumber
    )) as Event;
    console.log(`Manager deployed event: 
      - Proxy: ${deployEvent.args?.proxy}
      - Logic: ${deployEvent.args?.logic}
      - Owner: ${deployEvent.args?.owner}`);

    manager = new Contract(deployEvent.args?.proxy, Manager.abi, me);
    managerRecord = await registryMe.callStatic.getContractRecord(
      manager.address,
      GAS_OPT
    );
    console.log(managerRecord);

    expect(await manager.owner()).to.equal(
      me.address,
      `Manager's owner not equal my address`
    );

    expect(managerRecord.proxy).to.equal(
      deployEvent.args?.proxy,
      `Record's proxy address not equal event's address`
    );

    expect(managerRecord.type_).to.equal(
      "manager",
      `Record type is not manager`
    );
  });

  it("Should change version of manager contract to 0.2", async () => {
    console.log("\n ==> Setting Lan Manager contract Version to 0.2... \n");
    me = me!;
    const oldVersion = toHexVersion("0.1");
    const version = toHexVersion("0.2");

    const receipt = await ((await registry.setVersion(
      "Manager", // should change to lower case
      await version,
      GAS_OPT
    )) as TransactionResponse).wait();

    const verUpdateEvent = (await getEvents(
      registry,
      "VersionUpdated",
      [null, null, null],
      true,
      receipt.blockNumber,
      receipt.blockNumber
    )) as Event;
    console.log(`Version update event: 
    - Type: ${logObject(verUpdateEvent.args?.type_)}
    - oldVer: ${verUpdateEvent.args?.oldVersion}
    - Version: ${verUpdateEvent.args?.newVersion}`);

    expect(await registry.getVersion("manager")).to.equal(await version);
  });

  it("Should upgrade Manager contract", async () => {
    console.log("\n ==> Upgradeing Manager contract...\n");
    me = me!;
    // to call contract from my account
    const registryMe = registry.connect(me);
    const receipt = await ((await registryMe.upgradeContract(
      manager.address,
      Manager.bytecode,
      await random32Bytes(),
      GAS_OPT
    )) as TransactionResponse).wait();

    const upgradedEvent = (await getEvents(
      registryMe,
      "Upgraded",
      [null, null, null, null, null, null, null],
      true,
      receipt.blockNumber,
      receipt.blockNumber
    )) as Event;
    console.log(`Manager deployed event: 
      - Proxy: ${upgradedEvent.args?.proxy}
      - OldLogic: ${upgradedEvent.args?.oldLogic}
      - Logic: ${upgradedEvent.args?.newLogic}
      - Owner: ${upgradedEvent.args?.owner}`);

      //console.log(upgradedEvent);

    /* manager = new Contract(deployEvent.args?.proxy, Manager.abi, me);
    managerRecord = await registryMe.callStatic.getContractRecord(
      manager.address,
      GAS_OPT
    );
    console.log(managerRecord);

    expect(await manager.owner()).to.equal(
      me.address,
      `Manager's owner not equal my address`
    );

    expect(managerRecord.proxy).to.equal(
      deployEvent.args?.proxy,
      `Record's proxy address not equal event's address`
    );

    expect(managerRecord.type_).to.equal(
      "manager",
      `Record type is not manager`
    ); */
  });
});
