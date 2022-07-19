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
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface ICodeTrustInterface extends utils.Interface {
  functions: {
    "isTrusted(address,address,uint256)": FunctionFragment;
    "revokeTrustAt(address)": FunctionFragment;
    "trustCodeAt(address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "isTrusted" | "revokeTrustAt" | "trustCodeAt"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "isTrusted",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeTrustAt",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "trustCodeAt",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(functionFragment: "isTrusted", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "revokeTrustAt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "trustCodeAt",
    data: BytesLike
  ): Result;

  events: {};
}

export interface ICodeTrust extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ICodeTrustInterface;

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
    isTrusted(
      trustedContract: PromiseOrValue<string>,
      by: PromiseOrValue<string>,
      extTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    revokeTrustAt(
      trustedContract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    trustCodeAt(
      trustedContract: PromiseOrValue<string>,
      expiration: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  isTrusted(
    trustedContract: PromiseOrValue<string>,
    by: PromiseOrValue<string>,
    extTimestamp: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  revokeTrustAt(
    trustedContract: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  trustCodeAt(
    trustedContract: PromiseOrValue<string>,
    expiration: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    isTrusted(
      trustedContract: PromiseOrValue<string>,
      by: PromiseOrValue<string>,
      extTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    revokeTrustAt(
      trustedContract: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    trustCodeAt(
      trustedContract: PromiseOrValue<string>,
      expiration: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    isTrusted(
      trustedContract: PromiseOrValue<string>,
      by: PromiseOrValue<string>,
      extTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    revokeTrustAt(
      trustedContract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    trustCodeAt(
      trustedContract: PromiseOrValue<string>,
      expiration: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    isTrusted(
      trustedContract: PromiseOrValue<string>,
      by: PromiseOrValue<string>,
      extTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    revokeTrustAt(
      trustedContract: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    trustCodeAt(
      trustedContract: PromiseOrValue<string>,
      expiration: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
