/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  ExampleStorage,
  ExampleStorageInterface,
} from "../../../../artifacts/contracts/Example_Storage.sol/ExampleStorage";

const _abi = [
  {
    inputs: [],
    name: "retrieve",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "num",
        type: "uint256",
      },
    ],
    name: "store",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052348015600f57600080fd5b5060ac8061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80632e64cec11460375780636057361d14604c575b600080fd5b60005460405190815260200160405180910390f35b605c6057366004605e565b600055565b005b600060208284031215606f57600080fd5b503591905056fea26469706673582212207bdb67d9e2701434e09caa93e3a6e44abb162bc5203563cba79742fc358aad6664736f6c63430008130033";

type ExampleStorageConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ExampleStorageConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ExampleStorage__factory extends ContractFactory {
  constructor(...args: ExampleStorageConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ExampleStorage> {
    return super.deploy(overrides || {}) as Promise<ExampleStorage>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ExampleStorage {
    return super.attach(address) as ExampleStorage;
  }
  override connect(signer: Signer): ExampleStorage__factory {
    return super.connect(signer) as ExampleStorage__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ExampleStorageInterface {
    return new utils.Interface(_abi) as ExampleStorageInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ExampleStorage {
    return new Contract(address, _abi, signerOrProvider) as ExampleStorage;
  }
}
