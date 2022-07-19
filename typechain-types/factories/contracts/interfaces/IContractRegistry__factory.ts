/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IContractRegistry,
  IContractRegistryInterface,
} from "../../../contracts/interfaces/IContractRegistry";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "oldAdmin",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "proxy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "logic",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "version",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "logicCodeHash",
        type: "bytes32",
      },
    ],
    name: "NewRecord",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "changeRegisteredAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyRecords",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "latestRecords",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "version",
        type: "uint16",
      },
    ],
    name: "getProxyAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "version",
        type: "uint16",
      },
    ],
    name: "getRecord",
    outputs: [
      {
        internalType: "bool",
        name: "found",
        type: "bool",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "proxy",
            type: "address",
          },
          {
            internalType: "address",
            name: "logic",
            type: "address",
          },
          {
            internalType: "address",
            name: "admin",
            type: "address",
          },
          {
            internalType: "uint16",
            name: "version",
            type: "uint16",
          },
          {
            internalType: "bytes32",
            name: "logicCodeHash",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct ContractRecord",
        name: "record",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSystemRecords",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "latestRecords",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "proxy",
        type: "address",
      },
      {
        internalType: "address",
        name: "logic",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "version",
        type: "uint16",
      },
      {
        internalType: "bytes32",
        name: "logicCodeHash",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "proxy",
        type: "address",
      },
      {
        internalType: "address",
        name: "logic",
        type: "address",
      },
      {
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "version",
        type: "uint16",
      },
      {
        internalType: "bytes32",
        name: "logicCodeHash",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "update",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IContractRegistry__factory {
  static readonly abi = _abi;
  static createInterface(): IContractRegistryInterface {
    return new utils.Interface(_abi) as IContractRegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IContractRegistry {
    return new Contract(address, _abi, signerOrProvider) as IContractRegistry;
  }
}
