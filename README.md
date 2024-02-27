# 1. Standard Contract Registry project - SCR

Before run anything, make sure you run `npm install` (and if you have any problem, try removing node_modules and package-lock.json first).

This project aims to provide an easy to use On-Blockchain Standard Contract Registry that can be used to manage multiple groups of smart contracts and its addresses and versions. The main contract is the ContractRegistry, where the actual records are stored. This contract is supported by an optional ContractDeployer, that makes it easier the deployment of generic regular contracts and another UpgradeableDeployer that acts as a ProxyAdmin but it also manages the deployment of upgradeable contracts that deploys and upgrade them, all On-Chain using Create2.

Medium high level details: <https://miguel-lzpf.medium.com/on-chain-standard-contract-registry-325d99f0cb9c>

The structure follows a Hardhat project environment using ethers, waffle and chai. It also use typescript and generates smart contract types using typechain. The --network parameter refers to the network to be used defined in the [hardhat config file](./hardhat.config.ts).

- [1. Standard Contract Registry project - SCR](#1-standard-contract-registry-project---scr)
  - [1.1. Configuration file constants](#11-configuration-file-constants)
  - [1.2. Manage Hardware Wallets](#12-manage-hardware-wallets)
    - [1.2.1. Relevant Constants](#121-relevant-constants)
    - [1.2.2. Generate one Random Wallet](#122-generate-one-random-wallet)
    - [1.2.3. Generate Batch Wallets](#123-generate-batch-wallets)
    - [1.2.4. Generate Wallet from mnemonic phrase](#124-generate-wallet-from-mnemonic-phrase)
    - [1.2.5. Get Wallet mnemonic phrase](#125-get-wallet-mnemonic-phrase)
    - [1.2.6. Get Wallet Information](#126-get-wallet-information)
  - [1.3. Deploy Smart contracts](#13-deploy-smart-contracts)
    - [1.3.1. Relevant Constants](#131-relevant-constants)
    - [1.3.2. Regular Deployment](#132-regular-deployment)
    - [1.3.3. Upgradeable deployment](#133-upgradeable-deployment)
    - [1.3.4. Upgrade deployed Smart Contract](#134-upgrade-deployed-smart-contract)
  - [1.4. Unit Test](#14-unit-test)
    - [1.4.1. Run ContractRegistry test](#141-run-contractregistry-test)
    - [1.4.2. Run ContractDeployer test](#142-run-contractdeployer-test)
    - [1.4.3. Run UpgradeableDeployer test](#143-run-upgradeabledeployer-test)
  - [1.5. Results](#15-results)
    - [1.5.1. Compilation](#151-compilation)
    - [1.5.2. Tests (gas)](#152-tests-gas)

## 1.5. Results

### 1.5.1. Compilation

![image](https://user-images.githubusercontent.com/10762009/183726040-dfc398ff-08b9-41cb-b0a7-855e15513680.png)

### 1.5.2. Tests (gas)

![image](https://user-images.githubusercontent.com/10762009/183726054-c65de528-4786-4fdc-920a-c8fdbf56fcbe.png)
