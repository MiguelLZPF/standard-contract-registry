/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  ContractDeployer,
  ContractDeployerInterface,
} from "../../../artifacts/contracts/ContractDeployer";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IContractRegistry",
        name: "initRegistry",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "registry",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "proxyOrLogic",
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
    name: "ContractDeployed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "contract IContractRegistry",
        name: "registry",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "bytecode",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "uint16",
        name: "version",
        type: "uint16",
      },
    ],
    name: "deployContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161088a38038061088a83398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610084565b60006020828403121561006657600080fd5b81516001600160a01b038116811461007d57600080fd5b9392505050565b6107f7806100936000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80633aa3df6c14610030575b600080fd5b61004361003e36600461055c565b610045565b005b6001600160a01b038616610062576000546001600160a01b031695505b858361009457854260405160200161007b92919061061d565b6040516020818303038152906040528051906020012093505b60006100c360008689896040516020016100af92919061063f565b604051602081830303815290604052610339565b90506000816001600160a01b0316803b806020016040519081016040528181526000908060200190933c805160209091012060405163f2fde38b60e01b81523360048201529091506001600160a01b0383169063f2fde38b90602401600060405180830381600087803b15801561013957600080fd5b505af192505050801561014a575060015b5060405163199b256960e31b81526004810186905233602482015261271060448201526000906001600160a01b038b169063ccd92b4890606401600060405180830381865afa1580156101a1573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526101c991908101906106d6565b509050801561025e576040516340a40e9d60e01b8152600481018790526001600160a01b03848116602483018190526044830152336064830181905261ffff8816608484015260a4830185905260c48301528b16906340a40e9d9060e401600060405180830381600087803b15801561024157600080fd5b505af1158015610255573d6000803e3d6000fd5b505050506102df565b6040516308b6674360e11b8152600481018790526001600160a01b0384811660248301819052604483015261ffff87166064830152608482018490523360a48301528b169063116cce869060c401600060405180830381600087803b1580156102c657600080fd5b505af11580156102da573d6000803e3d6000fd5b505050505b604080516001600160a01b0386811682526020820185905261ffff8816929086169189917e60efd136254ce44bc32bb474aa1526e3a1ac84c0d4473c0b3fb4407c5b747a910160405180910390a450505050505050505050565b6000834710156103905760405162461bcd60e51b815260206004820152601d60248201527f437265617465323a20696e73756666696369656e742062616c616e636500000060448201526064015b60405180910390fd5b81516000036103e15760405162461bcd60e51b815260206004820181905260248201527f437265617465323a2062797465636f6465206c656e677468206973207a65726f6044820152606401610387565b8282516020840186f590506001600160a01b03811661043e5760405162461bcd60e51b8152602060048201526019602482015278437265617465323a204661696c6564206f6e206465706c6f7960381b6044820152606401610387565b9392505050565b6001600160a01b038116811461045a57600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b604051610100810167ffffffffffffffff811182821017156104975761049761045d565b60405290565b604051601f8201601f1916810167ffffffffffffffff811182821017156104c6576104c661045d565b604052919050565b600067ffffffffffffffff8211156104e8576104e861045d565b50601f01601f191660200190565b600082601f83011261050757600080fd5b813561051a610515826104ce565b61049d565b81815284602083860101111561052f57600080fd5b816020850160208301376000918101602001919091529392505050565b61ffff8116811461045a57600080fd5b60008060008060008060c0878903121561057557600080fd5b863561058081610445565b9550602087013567ffffffffffffffff8082111561059d57600080fd5b6105a98a838b016104f6565b965060408901359150808211156105bf57600080fd5b506105cc89828a016104f6565b945050606087013592506080870135915060a08701356105eb8161054c565b809150509295509295509295565b60005b838110156106145781810151838201526020016105fc565b50506000910152565b6000835161062f8184602088016105f9565b9190910191825250602001919050565b600083516106518184602088016105f9565b8351908301906106658183602088016105f9565b01949350505050565b805161067981610445565b919050565b80516106798161054c565b600082601f83011261069a57600080fd5b81516106a8610515826104ce565b8181528460208386010111156106bd57600080fd5b6106ce8260208301602087016105f9565b949350505050565b600080604083850312156106e957600080fd5b825180151581146106f957600080fd5b602084015190925067ffffffffffffffff8082111561071757600080fd5b90840190610100828703121561072c57600080fd5b610734610473565b825181526107446020840161066e565b60208201526107556040840161066e565b60408201526107666060840161066e565b60608201526107776080840161067e565b608082015260a083015160a082015260c08301518281111561079857600080fd5b6107a488828601610689565b60c08301525060e083015160e0820152809350505050925092905056fea2646970667358221220ef8243223abc7ca6f3c99bf694f916106ccc62f144883548959769d30bc1f2ad64736f6c63430008110033";

type ContractDeployerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ContractDeployerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ContractDeployer__factory extends ContractFactory {
  constructor(...args: ContractDeployerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    initRegistry: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractDeployer> {
    return super.deploy(
      initRegistry,
      overrides || {}
    ) as Promise<ContractDeployer>;
  }
  override getDeployTransaction(
    initRegistry: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(initRegistry, overrides || {});
  }
  override attach(address: string): ContractDeployer {
    return super.attach(address) as ContractDeployer;
  }
  override connect(signer: Signer): ContractDeployer__factory {
    return super.connect(signer) as ContractDeployer__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ContractDeployerInterface {
    return new utils.Interface(_abi) as ContractDeployerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ContractDeployer {
    return new Contract(address, _abi, signerOrProvider) as ContractDeployer;
  }
}
