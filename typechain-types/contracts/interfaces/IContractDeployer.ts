/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface IContractDeployerInterface extends utils.Interface {
  functions: {
    "deployContract(address,bytes,bytes,bytes32,bytes32,uint16)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "deployContract"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "deployContract",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "deployContract",
    data: BytesLike
  ): Result;

  events: {
    "ContractDeployed(address,bytes32,address,uint16,bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ContractDeployed"): EventFragment;
}

export interface ContractDeployedEventObject {
  registry: string;
  name: string;
  proxyOrLogic: string;
  version: number;
  logicCodeHash: string;
}
export type ContractDeployedEvent = TypedEvent<
  [string, string, string, number, string],
  ContractDeployedEventObject
>;

export type ContractDeployedEventFilter =
  TypedEventFilter<ContractDeployedEvent>;

export interface IContractDeployer extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IContractDeployerInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    deployContract(
      registry: PromiseOrValue<string>,
      bytecode: PromiseOrValue<BytesLike>,
      data: PromiseOrValue<BytesLike>,
      salt: PromiseOrValue<BytesLike>,
      name: PromiseOrValue<BytesLike>,
      version: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  deployContract(
    registry: PromiseOrValue<string>,
    bytecode: PromiseOrValue<BytesLike>,
    data: PromiseOrValue<BytesLike>,
    salt: PromiseOrValue<BytesLike>,
    name: PromiseOrValue<BytesLike>,
    version: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    deployContract(
      registry: PromiseOrValue<string>,
      bytecode: PromiseOrValue<BytesLike>,
      data: PromiseOrValue<BytesLike>,
      salt: PromiseOrValue<BytesLike>,
      name: PromiseOrValue<BytesLike>,
      version: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ContractDeployed(address,bytes32,address,uint16,bytes32)"(
      registry?: null,
      name?: PromiseOrValue<BytesLike> | null,
      proxyOrLogic?: PromiseOrValue<string> | null,
      version?: PromiseOrValue<BigNumberish> | null,
      logicCodeHash?: null
    ): ContractDeployedEventFilter;
    ContractDeployed(
      registry?: null,
      name?: PromiseOrValue<BytesLike> | null,
      proxyOrLogic?: PromiseOrValue<string> | null,
      version?: PromiseOrValue<BigNumberish> | null,
      logicCodeHash?: null
    ): ContractDeployedEventFilter;
  };

  estimateGas: {
    deployContract(
      registry: PromiseOrValue<string>,
      bytecode: PromiseOrValue<BytesLike>,
      data: PromiseOrValue<BytesLike>,
      salt: PromiseOrValue<BytesLike>,
      name: PromiseOrValue<BytesLike>,
      version: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    deployContract(
      registry: PromiseOrValue<string>,
      bytecode: PromiseOrValue<BytesLike>,
      data: PromiseOrValue<BytesLike>,
      salt: PromiseOrValue<BytesLike>,
      name: PromiseOrValue<BytesLike>,
      version: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
