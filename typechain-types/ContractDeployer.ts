/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface ContractDeployerInterface extends utils.Interface {
  functions: {
    "deploy(address,bytes,bytes,bytes32,bytes30,bytes2)": FunctionFragment;
    "upgrade(address,address,bytes,bytes,bytes32,bytes2)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "deploy",
    values: [string, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "upgrade",
    values: [string, string, BytesLike, BytesLike, BytesLike, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "deploy", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "upgrade", data: BytesLike): Result;

  events: {};
}

export interface ContractDeployer extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ContractDeployerInterface;

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
    deploy(
      registry: string,
      bytecode: BytesLike,
      data: BytesLike,
      salt: BytesLike,
      name: BytesLike,
      version: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    upgrade(
      registry: string,
      proxy: string,
      bytecode: BytesLike,
      data: BytesLike,
      salt: BytesLike,
      version: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  deploy(
    registry: string,
    bytecode: BytesLike,
    data: BytesLike,
    salt: BytesLike,
    name: BytesLike,
    version: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  upgrade(
    registry: string,
    proxy: string,
    bytecode: BytesLike,
    data: BytesLike,
    salt: BytesLike,
    version: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    deploy(
      registry: string,
      bytecode: BytesLike,
      data: BytesLike,
      salt: BytesLike,
      name: BytesLike,
      version: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    upgrade(
      registry: string,
      proxy: string,
      bytecode: BytesLike,
      data: BytesLike,
      salt: BytesLike,
      version: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    deploy(
      registry: string,
      bytecode: BytesLike,
      data: BytesLike,
      salt: BytesLike,
      name: BytesLike,
      version: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    upgrade(
      registry: string,
      proxy: string,
      bytecode: BytesLike,
      data: BytesLike,
      salt: BytesLike,
      version: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    deploy(
      registry: string,
      bytecode: BytesLike,
      data: BytesLike,
      salt: BytesLike,
      name: BytesLike,
      version: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    upgrade(
      registry: string,
      proxy: string,
      bytecode: BytesLike,
      data: BytesLike,
      salt: BytesLike,
      version: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
