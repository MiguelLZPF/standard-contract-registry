import { Provider } from "@ethersproject/abstract-provider";
import { expect } from "chai";
import { BigNumberish, BytesLike } from "ethers";
import { ethers } from "hardhat";
import { ghre } from "./utils";
import * as CONTRACT_REGISTRY_ARTIFACT from "artifacts/contracts/ContractRegistry.sol/ContractRegistry.json";
import { IContractRegistry } from "typechain-types";
import { ContractRecordStructOutput } from "typechain-types/artifacts/contracts/interfaces/IContractRegistry";

export interface IExpectedRecord {
  found?: boolean;
  name?: string;
  proxy?: string;
  logic?: string;
  admin?: string;
  version?: BigNumberish;
  logicCodeHash?: BytesLike; // OPT def: 0x00...00
  extraData?: BytesLike; // bytes || byte[]
  timestamp?: number;
}

/**
 * Helper test function to check record of a VP
 * @param contractRegistry VPRegistry SC address
 * @param recordName VP hash that identifies the VP
 * @param expected expected parameters to compare with
 * @param provider (optional) provider to use
 */
export const checkRecord = async (
  contractRegistry: string | IContractRegistry,
  recordName: string,
  recordAdmin: string,
  expected: IExpectedRecord,
  version?: number,
  provider?: Provider
) => {
  // if no provider as parameter, use the hardhat one
  provider = provider ? provider : ghre.ethers.provider;
  // if is an address create contract
  contractRegistry =
    typeof contractRegistry == "string"
      ? ((await ethers.getContractAtFromArtifact(
          CONTRACT_REGISTRY_ARTIFACT,
          contractRegistry
        )) as IContractRegistry) //IContractRegistry__factory.connect(contractRegistry, provider)
      : contractRegistry;

  // Get record by name or proxy address
  let result: [boolean, ContractRecordStructOutput] & {
    found: boolean;
    record: ContractRecordStructOutput;
  };

  result = await contractRegistry.getRecord(recordName, recordAdmin, version || 10000);

  expected.found ? expect(result.found).to.equal(expected.found) : undefined;
  expect(result.record.proxy.length).to.equal(20 * 2 + 2);
  expected.proxy ? expect(result.record.proxy).to.equal(expected.proxy) : undefined;
  expect(result.record.logic.length).to.equal(20 * 2 + 2);
  expected.logic ? expect(result.record.logic).to.equal(expected.logic) : undefined;
  expect(result.record.admin.length).to.equal(20 * 2 + 2);
  expected.admin ? expect(result.record.admin).to.equal(expected.admin) : undefined;
  expect(result.record.name.length).to.equal(32 * 2 + 2);
  expected.name ? expect(result.record.name).to.equal(expected.name) : undefined;
  expect(result.record.version).to.be.lessThanOrEqual(9999);
  expected.version ? expect(result.record.version).to.equal(expected.version) : undefined;
  expect(result.record.logicCodeHash.length).to.equal(32 * 2 + 2);
  expected.logicCodeHash
    ? expect(result.record.logicCodeHash).to.equal(expected.logicCodeHash)
    : undefined;
  expected.extraData ? expect(result.record.extraData).to.equal(expected.extraData) : undefined;
  expected.timestamp ? expect(result.record.timestamp).to.equal(expected.timestamp) : undefined;
};

export const versionNumToDot = async (versionNum: number) => {
  const versionString = versionNum.toString();
  const zeroPad = "000";
  const finalVersion = zeroPad.substring(0, 4 - versionString.length) + versionString;
  return `${finalVersion.substring(0, 2)}.${finalVersion.substring(2, 4)}`;
};

export const versionDotToNum = async (versionDot: string) => {
  return +(versionDot.substring(0, 2) + versionDot.substring(3, 5));
};
