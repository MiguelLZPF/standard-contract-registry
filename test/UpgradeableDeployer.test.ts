// import * as hre from "hardhat";
// import { isAddress } from "@ethersproject/address";
// import { Wallet } from "@ethersproject/wallet";
// import { expect } from "chai";
// import { step } from "mocha-steps";
// import {
//   CodeTrust__factory,
//   ContractRegistry,
//   ContractRegistry__factory,
//   ExampleOwner,
//   ExampleOwnerV2__factory,
//   ExampleOwner__factory,
//   ICodeTrust,
//   IContractRegistry,
//   UpgradeableDeployer,
//   UpgradeableDeployer__factory,
// } from "../typechain-types";
// import { keccak256 } from "@ethersproject/keccak256";
// import { ADDR_ZERO, delay, GAS_OPT, getTimeStamp, initHRE, stringToStringHexFixed } from "../scripts/utils";
// import { INetwork } from "../models/Deploy";
// import { JsonRpcProvider } from "@ethersproject/providers";
// import { ENV } from "../configuration";
// import {
//   IExpectedRecord,
//   checkRecord,
//   versionDotToNum,
//   versionNumToDot,
// } from "../scripts/contractRegistry";
// import { Contract, ContractReceipt } from "ethers";
// import { deployedBytecode as CODETRUST_DEP_CODE } from "../artifacts/contracts/external/CodeTrust.sol/CodeTrust.json";
// import { deployedBytecode as REGISTRY_DEP_CODE } from "../artifacts/contracts/ContractRegistry.sol/ContractRegistry.json";
// import { deployedBytecode as UPGR_DEPLOYER_DEP_CODE } from "../artifacts/contracts/UpgradeableDeployer.sol/UpgradeableDeployer.json";
// import { deployedBytecode as OWNER_DEP_CODE } from "../artifacts/contracts/Example_Owner.sol/ExampleOwner.json";
// import { deployedBytecode as OWNERV2_DEP_CODE } from "../artifacts/contracts/Example_Owner_V2.sol/ExampleOwnerV2.json";

// // Generic Constants
// let PROVIDER: JsonRpcProvider;
// let NETWORK: INetwork;

// // Specific Constants
// // -- revert Messages
// const REVERT_MESSAGES = {
//   initializable: { initialized: "Initializable: contract is already initialized" },
//   erc1967: { paramBytecode: "ERC1967: new implementation is not a contract" },
// };

// let CODETRUST_NAME_HEXSTRING: string;
// let CONTRACT_REGISTRY_NAME_HEXSTRING: string;
// let UPGRADEABLE_DEPLOYER_NAME_HEXSTRING: string;
// let EXAMPLE_OWNER_NAME_HEXSTRING: string;
// const NAME_HEXSTRING_ZERO = new Uint8Array(32);
// const MAX_VERSION = 9999;

// // Specific Variables
// // -- Wallets
// let admin: Wallet;
// let users: Wallet[] = [];
// // -- Contracts
// let codeTrust: ICodeTrust;
// let contractRegistry: ContractRegistry;
// let upgrDeplAdmin: UpgradeableDeployer;
// let upgrDeplUser0: UpgradeableDeployer;
// let exampleOwner: ExampleOwner;
// // -- utils
// let lastReceipt: ContractReceipt | undefined;
// let lastRegisteredAt: number, lastUpdatedAt: number;
// before("Initialize test environment and const/var", async () => {
//   // set global HardhatRuntimeEnvironment to use the same provider in scripts
//   ({ gProvider: PROVIDER, gCurrentNetwork: NETWORK } = await initHRE(hre));
//   // Create random test wallets
//   try {
//     admin = Wallet.createRandom().connect(PROVIDER);
//     for (let u = 0; u < ENV.KEYSTORE.test.userNumber; u++) {
//       users[u] = Wallet.createRandom().connect(PROVIDER);
//       console.log(`
//         User N=${u}: 
//           - Address: ${users[u].address},
//           - Public Key: ${users[u].publicKey},
//           - Private Key: ${users[u].privateKey}
//       `);
//     }
//     // Contract names as hexadecimal string with fixed length
//     CODETRUST_NAME_HEXSTRING = await stringToStringHexFixed(ENV.CONTRACT.codeTrust.name, 32);
//     CONTRACT_REGISTRY_NAME_HEXSTRING = await stringToStringHexFixed(
//       ENV.CONTRACT.contractRegistry.name,
//       32
//     );
//     UPGRADEABLE_DEPLOYER_NAME_HEXSTRING = await stringToStringHexFixed(
//       ENV.CONTRACT.upgradeableDeployer.name,
//       32
//     );
//     EXAMPLE_OWNER_NAME_HEXSTRING = await stringToStringHexFixed(ENV.CONTRACT.exampleOwner.name, 32);
//   } catch (error) {
//     throw new Error(`Error creating or reading wallets from keystore. ${error}`);
//   }
// });

// describe("Upgradeable Deployer - Deploy and Initialization - Admin", () => {
//   before("Init variables", async () => {
//     lastRegisteredAt = await getTimeStamp();
//     lastUpdatedAt = await getTimeStamp();
//   });

//   step("Should deploy CodeTrust", async () => {
//     codeTrust = await (await new CodeTrust__factory(admin).deploy(GAS_OPT)).deployed();
//     lastReceipt = await codeTrust.deployTransaction.wait();
//     expect(isAddress(codeTrust.address)).to.be.true;
//     console.log("CodeTrust contract deployed at: ", codeTrust.address);
//     expect(lastReceipt).not.to.be.undefined;
//     lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
//     lastReceipt = undefined;
//   });

//   step("Should deploy ContractRegistry", async () => {
//     contractRegistry = await (
//       await new ContractRegistry__factory(admin).deploy(
//         codeTrust.address,
//         NAME_HEXSTRING_ZERO,
//         0,
//         keccak256(REGISTRY_DEP_CODE),
//         GAS_OPT
//       )
//     ).deployed();
//     lastReceipt = await contractRegistry.deployTransaction.wait();
//     expect(isAddress(contractRegistry.address)).to.be.true;
//     console.log("Contract Registry deployed at: ", contractRegistry.address);
//     expect(lastReceipt).not.to.be.undefined;
//     lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
//     lastReceipt = undefined;
//   });

//   it("Should subscribe ContractRegistry EVENTS", async () => {
//     // Contract Registered
//     contractRegistry.on(
//       contractRegistry.filters.NewRecord(),
//       async (name, proxy, logic, version, logicCodeHash, event) => {
//         const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
//         const versionStr = await versionNumToDot(version);
//         const blockTime = (await event.getBlock()).timestamp;
//         console.log(
//           `New Record: { Name: ${nameString}, Proxy: ${proxy}, Logic: ${logic}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
//             event.blockNumber
//           } (${event.blockHash}) timestamp: ${new Date(
//             blockTime * 1000
//           ).toISOString()} (${blockTime})`
//         );
//       }
//     );
//     // // Contract Updated
//     // contractRegistry.on(
//     //   contractRegistry.filters.Updated(),
//     //   async (name, proxy, logic, version, logicCodeHash, event) => {
//     //     const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
//     //     const versionStr = await versionNumToDot(version);
//     //     const blockTime = (await event.getBlock()).timestamp;
//     //     console.log(
//     //       `New Contract Updated: { Name: ${nameString}, Proxy: ${proxy}, Logic: ${logic}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
//     //         event.blockNumber
//     //       } (${event.blockHash}) timestamp: ${new Date(
//     //         blockTime * 1000
//     //       ).toISOString()} (${blockTime})`
//     //     );
//     //   }
//     // );
//     // Admin Changed
//     contractRegistry.on(
//       contractRegistry.filters.AdminChanged(),
//       async (name, oldAdmin, newAdmin, event) => {
//         const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
//         const blockTime = (await event.getBlock()).timestamp;
//         console.log(
//           `New Admin Changed: { Record Name: ${nameString}, Old Admin: ${oldAdmin}, New Admin: ${newAdmin}} at Block ${
//             event.blockNumber
//           } (${event.blockHash}) timestamp: ${new Date(
//             blockTime * 1000
//           ).toISOString()} (${blockTime})`
//         );
//       }
//     );
//   });

//   step("Should check if ContractRegistry is registered", async () => {
//     await checkRecord(contractRegistry.address, CONTRACT_REGISTRY_NAME_HEXSTRING, admin.address, {
//       found: true,
//       proxy: contractRegistry.address,
//       logic: contractRegistry.address,
//       admin: admin.address,
//       name: CONTRACT_REGISTRY_NAME_HEXSTRING,
//       version: 0,
//       logicCodeHash: keccak256(REGISTRY_DEP_CODE),
//       timestamp: lastRegisteredAt,
//     } as IExpectedRecord);
//   });

//   step("Should register CodeTrust Contract Record ", async () => {
//     lastReceipt = await (
//       await contractRegistry.register(
//         CODETRUST_NAME_HEXSTRING,
//         codeTrust.address,
//         codeTrust.address,
//         await versionDotToNum("01.00"),
//         keccak256(CODETRUST_DEP_CODE),
//         admin.address,
//         GAS_OPT
//       )
//     ).wait();
//     expect(lastReceipt).not.to.be.undefined;
//     lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
//     lastReceipt = undefined;
//   });

//   step("Should check if CodeTrust Record is registered", async () => {
//     await checkRecord(
//       contractRegistry.address,
//       CODETRUST_NAME_HEXSTRING,
//       admin.address,
//       {
//         found: true,
//         proxy: codeTrust.address,
//         logic: codeTrust.address,
//         admin: admin.address,
//         name: CODETRUST_NAME_HEXSTRING,
//         version: await versionDotToNum("01.00"),
//         logicCodeHash: keccak256(CODETRUST_DEP_CODE),
//         timestamp: lastRegisteredAt,
//       } as IExpectedRecord,
//       await versionDotToNum("01.00")
//     );
//   });

//   step("Should deploy admin's UpgradeableDeployer", async () => {
//     upgrDeplAdmin = await (
//       await new UpgradeableDeployer__factory(admin).deploy(contractRegistry.address, GAS_OPT)
//     ).deployed();
//     expect(isAddress(upgrDeplAdmin.address)).to.be.true;
//     lastReceipt = await upgrDeplAdmin.deployTransaction.wait();
//     expect(isAddress(upgrDeplAdmin.address)).to.be.true;
//     console.log("Admin's UpgradeableDeployer deployed at: ", upgrDeplAdmin.address);
//     expect(lastReceipt).not.to.be.undefined;
//     lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
//     lastReceipt = undefined;
//   });

//   step("Should register admin's UpgradeableDeployer Contract Record ", async () => {
//     lastReceipt = await (
//       await contractRegistry.register(
//         UPGRADEABLE_DEPLOYER_NAME_HEXSTRING,
//         upgrDeplAdmin.address,
//         upgrDeplAdmin.address,
//         await versionDotToNum("01.00"),
//         keccak256(UPGR_DEPLOYER_DEP_CODE),
//         admin.address,
//         GAS_OPT
//       )
//     ).wait();
//     expect(lastReceipt).not.to.be.undefined;
//     lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
//     lastReceipt = undefined;
//   });

//   step("Should check if admin's UpgradeableDeployer is registered", async () => {
//     await checkRecord(
//       contractRegistry.address,
//       UPGRADEABLE_DEPLOYER_NAME_HEXSTRING,
//       admin.address,
//       {
//         found: true,
//         proxy: upgrDeplAdmin.address,
//         logic: upgrDeplAdmin.address,
//         admin: admin.address,
//         name: UPGRADEABLE_DEPLOYER_NAME_HEXSTRING,
//         version: await versionDotToNum("01.00"),
//         logicCodeHash: keccak256(UPGR_DEPLOYER_DEP_CODE),
//         timestamp: lastRegisteredAt,
//       } as IExpectedRecord
//     );
//   });

//   it("Should subscribe UpgradeableDeployer EVENTS", async () => {
//     // Contract Deployed
//     upgrDeplAdmin.on(
//       upgrDeplAdmin.filters.ContractDeployed(),
//       async (registry, name, proxyOrLogic, version, logicCodeHash, event) => {
//         const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
//         const versionStr = await versionNumToDot(version);
//         const blockTime = (await event.getBlock()).timestamp;
//         console.log(
//           `New Contract Deployed: { Registry: ${registry}, Name: ${nameString}, ProxyOrLogic: ${proxyOrLogic}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
//             event.blockNumber
//           } (${event.blockHash}) timestamp: ${new Date(
//             blockTime * 1000
//           ).toISOString()} (${blockTime})`
//         );
//       }
//     );
//     // Contract Upgraded
//     upgrDeplAdmin.on(
//       upgrDeplAdmin.filters.ContractUpgraded(),
//       async (registry, name, proxy, version, logicCodeHash, event) => {
//         const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
//         const versionStr = await versionNumToDot(version);
//         const blockTime = (await event.getBlock()).timestamp;
//         console.log(
//           `New Contract Upgraded: { Registry: ${registry}, Name: ${nameString}, Proxy: ${proxy}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
//             event.blockNumber
//           } (${event.blockHash}) timestamp: ${new Date(
//             blockTime * 1000
//           ).toISOString()} (${blockTime})`
//         );
//       }
//     );
//   });

//   // No need to initialize Contract Deployer, it is not upgradeable

//   after("Wait for events", async () => {
//     await delay(5000); // 2 sec
//   });
// });

// describe("Upgradeable Deployer - Deploy and Initialization - User 0", () => {
//   before("Init variables", async () => {
//     lastRegisteredAt = await getTimeStamp();
//     lastUpdatedAt = await getTimeStamp();
//     contractRegistry = contractRegistry.connect(users[0]);
//   });

//   step("Should be able to check addresses of System CodeTrust and ContractRegistry", async () => {
//     const systemCodeTrust = await contractRegistry
//       .connect(users[0])
//       .getRecord(CODETRUST_NAME_HEXSTRING, admin.address, MAX_VERSION + 1);
//     const systemContractRegistry = await contractRegistry
//       .connect(users[0])
//       .getRecord(CONTRACT_REGISTRY_NAME_HEXSTRING, admin.address, MAX_VERSION + 1);
//     expect(isAddress(systemCodeTrust.record.logic)).to.be.true;
//   });

//   step("Should deploy user0's UpgradeableDeployer", async () => {
//     upgrDeplUser0 = await (
//       await new UpgradeableDeployer__factory(users[0]).deploy(contractRegistry.address, GAS_OPT)
//     ).deployed();
//     expect(isAddress(upgrDeplUser0.address)).to.be.true;
//     lastReceipt = await upgrDeplUser0.deployTransaction.wait();
//     expect(isAddress(upgrDeplUser0.address)).to.be.true;
//     console.log("User0's UpgradeableDeployer deployed at: ", upgrDeplUser0.address);
//     expect(lastReceipt).not.to.be.undefined;
//     lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
//     lastReceipt = undefined;
//   });

//   step("Should register user0's UpgradeableDeployer Contract Record ", async () => {
//     lastReceipt = await (
//       await contractRegistry.register(
//         UPGRADEABLE_DEPLOYER_NAME_HEXSTRING,
//         upgrDeplUser0.address,
//         upgrDeplUser0.address,
//         await versionDotToNum("01.00"),
//         keccak256(UPGR_DEPLOYER_DEP_CODE),
//         users[0].address,
//         GAS_OPT
//       )
//     ).wait();
//     expect(lastReceipt).not.to.be.undefined;
//     lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
//     lastReceipt = undefined;
//   });

//   step("Should check if user0's UpgradeableDeployer is registered", async () => {
//     await checkRecord(
//       contractRegistry.address,
//       UPGRADEABLE_DEPLOYER_NAME_HEXSTRING,
//       users[0].address,
//       {
//         found: true,
//         proxy: upgrDeplUser0.address,
//         logic: upgrDeplUser0.address,
//         admin: users[0].address,
//         name: UPGRADEABLE_DEPLOYER_NAME_HEXSTRING,
//         version: await versionDotToNum("01.00"),
//         logicCodeHash: keccak256(UPGR_DEPLOYER_DEP_CODE),
//         timestamp: lastRegisteredAt,
//       } as IExpectedRecord
//     );
//   });

//   it("Should subscribe UpgradeableDeployer EVENTS", async () => {
//     // Contract Deployed
//     upgrDeplAdmin.on(
//       upgrDeplAdmin.filters.ContractDeployed(),
//       async (registry, name, proxyOrLogic, version, logicCodeHash, event) => {
//         const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
//         const versionStr = await versionNumToDot(version);
//         const blockTime = (await event.getBlock()).timestamp;
//         console.log(
//           `New Contract Deployed: { Registry: ${registry}, Name: ${nameString}, ProxyOrLogic: ${proxyOrLogic}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
//             event.blockNumber
//           } (${event.blockHash}) timestamp: ${new Date(
//             blockTime * 1000
//           ).toISOString()} (${blockTime})`
//         );
//       }
//     );
//     // Contract Upgraded
//     upgrDeplAdmin.on(
//       upgrDeplAdmin.filters.ContractUpgraded(),
//       async (registry, name, proxy, version, logicCodeHash, event) => {
//         const nameString = Buffer.from(name.substring(2), "hex").toString("utf-8");
//         const versionStr = await versionNumToDot(version);
//         const blockTime = (await event.getBlock()).timestamp;
//         console.log(
//           `New Contract Upgraded: { Registry: ${registry}, Name: ${nameString}, Proxy: ${proxy}, Version: ${versionStr}, Logic code hash: ${logicCodeHash}} at Block ${
//             event.blockNumber
//           } (${event.blockHash}) timestamp: ${new Date(
//             blockTime * 1000
//           ).toISOString()} (${blockTime})`
//         );
//       }
//     );
//   });

//   // No need to initialize Contract Deployer, it is not upgradeable

//   after("Wait for events", async () => {
//     await delay(5000); // 2 sec
//   });
// });

// describe("Upgradeable Deployer - Use case", () => {
//   before("Init variables", async () => {
//     // set default signer for this flow
//     codeTrust = codeTrust.connect(users[0]);
//     contractRegistry = contractRegistry.connect(users[0]);
//     upgrDeplUser0 = upgrDeplUser0.connect(users[0]);
//     // Should trust upgradeable deployer contract
//     await (await codeTrust.trustCodeAt(upgrDeplUser0.address, 360, GAS_OPT)).wait();
//   });
//   //* DEPLOY
//   it("Should FAIL to deploy without bytecode", async () => {
//     await expect(
//       upgrDeplUser0.deployContract(
//         contractRegistry.address,
//         "0x0000000000000000000000", //! <--
//         new Uint8Array(0),
//         new Uint8Array(32),
//         EXAMPLE_OWNER_NAME_HEXSTRING,
//         0,
//         GAS_OPT
//       )
//     ).to.be.revertedWith(REVERT_MESSAGES.erc1967.paramBytecode);
//   });
//   step("Should deploy Example Owner contract", async () => {
//     lastReceipt = await (
//       await upgrDeplUser0.deployContract(
//         contractRegistry.address,
//         ExampleOwner__factory.bytecode,
//         new Uint8Array(0),
//         new Uint8Array(32),
//         EXAMPLE_OWNER_NAME_HEXSTRING,
//         0,
//         GAS_OPT
//       )
//     ).wait();
//     expect(lastReceipt).not.to.be.undefined;
//     // update block timestamp
//     lastRegisteredAt = lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
//     // save contract instance
//     exampleOwner = new Contract(
//       (
//         await contractRegistry.getRecord(
//           EXAMPLE_OWNER_NAME_HEXSTRING,
//           users[0].address,
//           MAX_VERSION + 1
//         )
//       ).record.proxy,
//       ExampleOwner__factory.abi,
//       users[0]
//     ) as ExampleOwner;
//     lastReceipt = undefined;
//   });
//   step("Should check if Example Owner is registered", async () => {
//     // use contract object to use user0.address in call
//     await checkRecord(contractRegistry, EXAMPLE_OWNER_NAME_HEXSTRING, users[0].address, {
//       found: true,
//       proxy: exampleOwner.address,
//       logic: await upgrDeplUser0.callStatic.getProxyImplementation(exampleOwner.address),
//       admin: users[0].address,
//       name: EXAMPLE_OWNER_NAME_HEXSTRING,
//       version: await versionDotToNum("00.00"),
//       logicCodeHash: keccak256(OWNER_DEP_CODE),
//       rat: lastRegisteredAt,
//       uat: lastUpdatedAt,
//     } as IExpectedRecord);
//   });

//   //* Upgrade
//   step("Should upgrade Example Owner contract", async () => {
//     //console.log(await contractRegistry.getRecordByName(EXAMPLE_OWNER_NAME_HEXSTRING, contractDeployer.address));
//     lastReceipt = await (
//       await upgrDeplUser0.upgradeContract(
//         contractRegistry.address,
//         EXAMPLE_OWNER_NAME_HEXSTRING,
//         ExampleOwnerV2__factory.bytecode,
//         new Uint8Array(0),
//         new Uint8Array(32),
//         await versionDotToNum("01.00"),
//         ADDR_ZERO,
//         GAS_OPT
//       )
//     ).wait();
//     expect(lastReceipt).not.to.be.undefined;
//     // update block timestamp
//     lastUpdatedAt = await getTimeStamp(lastReceipt.blockHash);
//     lastReceipt = undefined;
//   });
//   step("Should check if Example Owner is upgraded", async () => {
//     // use contract object to use user0.address in call
//     await checkRecord(contractRegistry, EXAMPLE_OWNER_NAME_HEXSTRING, users[0].address, {
//       found: true,
//       proxy: exampleOwner.address,
//       logic: await upgrDeplUser0.callStatic.getProxyImplementation(exampleOwner.address),
//       admin: users[0].address,
//       name: EXAMPLE_OWNER_NAME_HEXSTRING,
//       version: await versionDotToNum("01.00"),
//       logicCodeHash: keccak256(OWNERV2_DEP_CODE),
//       rat: lastRegisteredAt,
//       uat: lastUpdatedAt,
//     } as IExpectedRecord);
//   });

//   after("Wait for events", async () => {
//     await delay(5000); // 2 sec
//   });
// });
