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
  PayableOverrides,
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
} from "../common";

export interface UpgradeableDeployerInterface extends utils.Interface {
  functions: {
    "changeProxyAdmin(address,address)": FunctionFragment;
    "deployContract(address,bytes,bytes,bytes32,bytes32,uint16)": FunctionFragment;
    "getProxyAdmin(address)": FunctionFragment;
    "getProxyImplementation(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "upgrade(address,address)": FunctionFragment;
    "upgradeAndCall(address,address,bytes)": FunctionFragment;
    "upgradeContract(address,bytes32,bytes,bytes,bytes32,uint16,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "changeProxyAdmin"
      | "deployContract"
      | "getProxyAdmin"
      | "getProxyImplementation"
      | "owner"
      | "renounceOwnership"
      | "transferOwnership"
      | "upgrade"
      | "upgradeAndCall"
      | "upgradeContract"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "changeProxyAdmin",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
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
  encodeFunctionData(
    functionFragment: "getProxyAdmin",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getProxyImplementation",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "upgrade",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeAndCall",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeContract",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "changeProxyAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deployContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getProxyAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getProxyImplementation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "upgrade", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradeAndCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "upgradeContract",
    data: BytesLike
  ): Result;

  events: {
    "ContractDeployed(address,bytes32,address,uint16,bytes32)": EventFragment;
    "ContractUpgraded(address,bytes32,address,uint16,bytes32)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ContractDeployed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ContractUpgraded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
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

export interface ContractUpgradedEventObject {
  registry: string;
  name: string;
  proxy: string;
  version: number;
  logicCodeHash: string;
}
export type ContractUpgradedEvent = TypedEvent<
  [string, string, string, number, string],
  ContractUpgradedEventObject
>;

export type ContractUpgradedEventFilter =
  TypedEventFilter<ContractUpgradedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface UpgradeableDeployer extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: UpgradeableDeployerInterface;

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
    changeProxyAdmin(
      proxy: PromiseOrValue<string>,
      newAdmin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    deployContract(
      registry: PromiseOrValue<string>,
      bytecode: PromiseOrValue<BytesLike>,
      data: PromiseOrValue<BytesLike>,
      salt: PromiseOrValue<BytesLike>,
      name: PromiseOrValue<BytesLike>,
      version: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getProxyAdmin(
      proxy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getProxyImplementation(
      proxy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    upgrade(
      proxy: PromiseOrValue<string>,
      implementation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    upgradeAndCall(
      proxy: PromiseOrValue<string>,
      implementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    upgradeContract(
      registry: PromiseOrValue<string>,
      name: PromiseOrValue<BytesLike>,
      bytecode: PromiseOrValue<BytesLike>,
      data: PromiseOrValue<BytesLike>,
      salt: PromiseOrValue<BytesLike>,
      version: PromiseOrValue<BigNumberish>,
      newAdmin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  changeProxyAdmin(
    proxy: PromiseOrValue<string>,
    newAdmin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  deployContract(
    registry: PromiseOrValue<string>,
    bytecode: PromiseOrValue<BytesLike>,
    data: PromiseOrValue<BytesLike>,
    salt: PromiseOrValue<BytesLike>,
    name: PromiseOrValue<BytesLike>,
    version: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getProxyAdmin(
    proxy: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  getProxyImplementation(
    proxy: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  upgrade(
    proxy: PromiseOrValue<string>,
    implementation: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  upgradeAndCall(
    proxy: PromiseOrValue<string>,
    implementation: PromiseOrValue<string>,
    data: PromiseOrValue<BytesLike>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  upgradeContract(
    registry: PromiseOrValue<string>,
    name: PromiseOrValue<BytesLike>,
    bytecode: PromiseOrValue<BytesLike>,
    data: PromiseOrValue<BytesLike>,
    salt: PromiseOrValue<BytesLike>,
    version: PromiseOrValue<BigNumberish>,
    newAdmin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    changeProxyAdmin(
      proxy: PromiseOrValue<string>,
      newAdmin: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    deployContract(
      registry: PromiseOrValue<string>,
      bytecode: PromiseOrValue<BytesLike>,
      data: PromiseOrValue<BytesLike>,
      salt: PromiseOrValue<BytesLike>,
      name: PromiseOrValue<BytesLike>,
      version: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getProxyAdmin(
      proxy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    getProxyImplementation(
      proxy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    upgrade(
      proxy: PromiseOrValue<string>,
      implementation: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeAndCall(
      proxy: PromiseOrValue<string>,
      implementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeContract(
      registry: PromiseOrValue<string>,
      name: PromiseOrValue<BytesLike>,
      bytecode: PromiseOrValue<BytesLike>,
      data: PromiseOrValue<BytesLike>,
      salt: PromiseOrValue<BytesLike>,
      version: PromiseOrValue<BigNumberish>,
      newAdmin: PromiseOrValue<string>,
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

    "ContractUpgraded(address,bytes32,address,uint16,bytes32)"(
      registry?: null,
      name?: PromiseOrValue<BytesLike> | null,
      proxy?: PromiseOrValue<string> | null,
      version?: PromiseOrValue<BigNumberish> | null,
      logicCodeHash?: null
    ): ContractUpgradedEventFilter;
    ContractUpgraded(
      registry?: null,
      name?: PromiseOrValue<BytesLike> | null,
      proxy?: PromiseOrValue<string> | null,
      version?: PromiseOrValue<BigNumberish> | null,
      logicCodeHash?: null
    ): ContractUpgradedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    changeProxyAdmin(
      proxy: PromiseOrValue<string>,
      newAdmin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    deployContract(
      registry: PromiseOrValue<string>,
      bytecode: PromiseOrValue<BytesLike>,
      data: PromiseOrValue<BytesLike>,
      salt: PromiseOrValue<BytesLike>,
      name: PromiseOrValue<BytesLike>,
      version: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getProxyAdmin(
      proxy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getProxyImplementation(
      proxy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    upgrade(
      proxy: PromiseOrValue<string>,
      implementation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    upgradeAndCall(
      proxy: PromiseOrValue<string>,
      implementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    upgradeContract(
      registry: PromiseOrValue<string>,
      name: PromiseOrValue<BytesLike>,
      bytecode: PromiseOrValue<BytesLike>,
      data: PromiseOrValue<BytesLike>,
      salt: PromiseOrValue<BytesLike>,
      version: PromiseOrValue<BigNumberish>,
      newAdmin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    changeProxyAdmin(
      proxy: PromiseOrValue<string>,
      newAdmin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    deployContract(
      registry: PromiseOrValue<string>,
      bytecode: PromiseOrValue<BytesLike>,
      data: PromiseOrValue<BytesLike>,
      salt: PromiseOrValue<BytesLike>,
      name: PromiseOrValue<BytesLike>,
      version: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getProxyAdmin(
      proxy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getProxyImplementation(
      proxy: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    upgrade(
      proxy: PromiseOrValue<string>,
      implementation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    upgradeAndCall(
      proxy: PromiseOrValue<string>,
      implementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    upgradeContract(
      registry: PromiseOrValue<string>,
      name: PromiseOrValue<BytesLike>,
      bytecode: PromiseOrValue<BytesLike>,
      data: PromiseOrValue<BytesLike>,
      salt: PromiseOrValue<BytesLike>,
      version: PromiseOrValue<BigNumberish>,
      newAdmin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
