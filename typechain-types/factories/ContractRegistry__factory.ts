/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ContractRegistry,
  ContractRegistryInterface,
} from "../ContractRegistry";

const _abi = [
  {
    anonymous: false,
    inputs: [
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
      {
        indexed: false,
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
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
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "proxy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes2",
        name: "version",
        type: "bytes2",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "logicCodeHash",
        type: "bytes32",
      },
    ],
    name: "Registered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "proxy",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes2",
        name: "version",
        type: "bytes2",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "logicCodeHash",
        type: "bytes32",
      },
    ],
    name: "Updated",
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
        name: "contractNames",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "proxy",
        type: "address",
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
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "bytes2",
            name: "version",
            type: "bytes2",
          },
          {
            internalType: "uint16",
            name: "index",
            type: "uint16",
          },
          {
            internalType: "bytes32",
            name: "logicCodeHash",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "rat",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "uat",
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
    ],
    name: "getRecordByName",
    outputs: [
      {
        internalType: "bool",
        name: "found",
        type: "bool",
      },
      {
        components: [
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
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "bytes2",
            name: "version",
            type: "bytes2",
          },
          {
            internalType: "uint16",
            name: "index",
            type: "uint16",
          },
          {
            internalType: "bytes32",
            name: "logicCodeHash",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "rat",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "uat",
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
        name: "contractNames",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "proxy",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes2",
        name: "version",
        type: "bytes2",
      },
      {
        internalType: "bytes32",
        name: "logicCodeHash",
        type: "bytes32",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes2",
        name: "version",
        type: "bytes2",
      },
      {
        internalType: "bytes32",
        name: "logicCodeHash",
        type: "bytes32",
      },
    ],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
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
        internalType: "bytes32",
        name: "actualName",
        type: "bytes32",
      },
      {
        internalType: "bytes2",
        name: "version",
        type: "bytes2",
      },
      {
        internalType: "bytes32",
        name: "logicCodeHash",
        type: "bytes32",
      },
    ],
    name: "update",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611432806100206000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80638da5cb5b116100715780638da5cb5b1461011b578063ba220f1814610136578063c1495a8314610149578063e76637ce1461015c578063f2fde38b14610171578063ff69bc331461018457600080fd5b8063274507cf146100ae5780634e33a37e146100d8578063617fba04146100ed578063715018a614610100578063842f95f014610108575b600080fd5b6100c16100bc366004611123565b61018c565b6040516100cf92919061114f565b60405180910390f35b6100eb6100e636600461120e565b6101fd565b005b6100c16100fb366004611263565b610211565b6100eb61022d565b6100eb610116366004611123565b610298565b6033546040516001600160a01b0390911681526020016100cf565b6100eb61014436600461120e565b6104bf565b6100eb610157366004611285565b610528565b6101646105da565b6040516100cf91906112c9565b6100eb61017f366004611263565b6105ef565b6101646106ba565b60006101966110bb565b6001600160a01b0383166101a8573392505b6001600160a01b03838116600090815260666020908152604080832081518084018a9052825180820385018152908301835280519084012084529091529020546101f291166106d1565b915091509250929050565b61020a8585858585610790565b5050505050565b600061021b6110bb565b610224836106d1565b91509150915091565b6033546001600160a01b0316331461028c5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064015b60405180910390fd5b6102966000610b4e565b565b6001600160a01b0381166102ee5760405162461bcd60e51b815260206004820152601860248201527f4e65772061646d696e2061646472657373206e656564656400000000000000006044820152606401610283565b6001600160a01b0381163314156103475760405162461bcd60e51b815260206004820152601f60248201527f4e65772061646d696e206164647265737320657175616c732073656e646572006044820152606401610283565b3360009081526066602090815260408083208151808401879052825180820385018152908301835280519084012084528252808320546001600160a01b031683526065909152902060068101546103da5760405162461bcd60e51b815260206004820152601760248201527610dbdb9d1c9858dd081b9bdd081c9959da5cdd195c9959604a1b6044820152606401610283565b3360009081526067602052604090206004820154610402919062010000900461ffff16610ba0565b6002810180546001600160a01b0390811660009081526067602090815260408083205460048701805461ffff909216620100000263ffff000019909216919091179055868416808452818420805460018101825590855293839020909301889055935493518781529193909216917fa3fe0878f14ac0562f44e158a4ef6b2197ca67011ea6d9c5475731800692dfc0910160405180910390a360020180546001600160a01b0319166001600160a01b039290921691909117905550565b6001600160a01b0385161580156104d557508215155b1561051c573360009081526066602090815260408083208151808401889052825180820385018152908301835280519084012084529091529020546001600160a01b031694505b61020a85858484610c45565b600054610100900460ff1680610541575060005460ff16155b61055d5760405162461bcd60e51b81526004016102839061130d565b600054610100900460ff1615801561057f576000805461ffff19166101011790555b610587610f0a565b6001600160a01b038516610599573094505b836105b5576f436f6e7472616374526567697374727960801b93505b6105c28530868686610790565b801561020a576000805461ff00191690555050505050565b60606105ea33610f85565b610f85565b905090565b6033546001600160a01b031633146106495760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610283565b6001600160a01b0381166106ae5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610283565b6106b781610b4e565b50565b60606105ea6105e56033546001600160a01b031690565b60006106db6110bb565b506001600160a01b03828116600090815260656020908152604091829020825161012081018452815485168152600182015485169281019290925260028101549093169181019190915260038201546060820152600482015460f081901b6001600160f01b031916608083015262010000900461ffff1660a0820152600582015460c0820152600682015460e08201819052600790920154610100820152906107875760009150915091565b60019150915091565b6001600160a01b0384166107e65760405162461bcd60e51b815260206004820152601760248201527f4c6f6769632061646472657373206973206e65646465640000000000000000006044820152606401610283565b6001600160a01b0385166107f8578394505b60008360405160200161080d91815260200190565b60408051601f1981840301815291905280516020909101209050831580159061085757503360009081526066602090815260408083208484529091529020546001600160a01b0316155b6108a35760405162461bcd60e51b815260206004820152601b60248201527f4e616d65206d75737420626520756e69717565206f72206e756c6c00000000006044820152606401610283565b6001600160a01b038616600090815260656020526040902060068101541561090d5760405162461bcd60e51b815260206004820152601b60248201527f436f6e747261637420616c7265616479207265676973746572656400000000006044820152606401610283565b80546001600160a01b038089166001600160a01b0319928316178355600183018054918916919092161790556109403390565b8160020160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550848160030181905550838160040160006101000a81548161ffff021916908360f01c0217905550828160050181905550428160060181905550428160070181905550606760008260020160009054906101000a90046001600160a01b03166001600160a01b03166001600160a01b03168152602001908152602001600020805490508160040160026101000a81548161ffff021916908361ffff1602179055508660666000336001600160a01b03166001600160a01b03168152602001908152602001600020600084815260200190815260200160002060006101000a8154816001600160a01b0302191690836001600160a01b03160217905550606760008260020160009054906101000a90046001600160a01b03166001600160a01b03166001600160a01b0316815260200190815260200160002085908060018154018082558091505060019003906000526020600020016000909190919091505580600501548160040160009054906101000a900460f01b6001600160f01b0319168260000160009054906101000a90046001600160a01b03166001600160a01b03167fc049c29e0170590e0290f639725baf56050a4ce748bcf699cc7a15a5087383d98460030154604051610b3d91815260200190565b60405180910390a450505050505050565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b805b8254610bb090600190611371565b8161ffff161015610c1a5782610bc7826001611388565b61ffff1681548110610bdb57610bdb6113ae565b9060005260206000200154838261ffff1681548110610bfc57610bfc6113ae565b60009182526020909120015580610c12816113c4565b915050610ba2565b5081805480610c2b57610c2b6113e6565b600190038181906000526020600020016000905590555050565b826001600160a01b0316846001600160a01b03161415610ca75760405162461bcd60e51b815260206004820152601860248201527f436f6e7472616374206e6f74207570677261646561626c6500000000000000006044820152606401610283565b6001600160a01b03841660009081526065602052604090206006810154610d0a5760405162461bcd60e51b815260206004820152601760248201527610dbdb9d1c9858dd081b9bdd081c9959da5cdd195c9959604a1b6044820152606401610283565b60018101546001600160a01b0385811691161415610d625760405162461bcd60e51b8152602060048201526015602482015274131bd9da58c8185b1c9958591e481d5c19185d1959605a1b6044820152606401610283565b8181600501541415610db65760405162461bcd60e51b815260206004820152601a60248201527f4c6f676963206861736820616c726561647920757064617465640000000000006044820152606401610283565b600481015460f01b6001600160f01b03199081169084161415610e1b5760405162461bcd60e51b815260206004820152601a60248201527f4e65772076657273696f6e206d757374206265206869676865720000000000006044820152606401610283565b60028101546001600160a01b03163314610e6f5760405162461bcd60e51b81526020600482015260156024820152742cb7ba9030b932903737ba103a34329030b236b4b760591b6044820152606401610283565b6001810180546001600160a01b0319166001600160a01b03868116919091179091556005820183905560048201805461ffff191660f086811c91909117918290554260078501558354600385015460405190815286949390921b6001600160f01b0319169216907fe922a7d364b129d35584e04db696da507e001e0417392cbb1cee7402c37a5dc19060200160405180910390a45050505050565b600054610100900460ff1680610f23575060005460ff16155b610f3f5760405162461bcd60e51b81526004016102839061130d565b600054610100900460ff16158015610f61576000805461ffff19166101011790555b610f69610ff1565b610f7161105b565b80156106b7576000805461ff001916905550565b6001600160a01b038116600090815260676020908152604091829020805483518184028101840190945280845260609392830182828015610fe557602002820191906000526020600020905b815481526020019060010190808311610fd1575b50505050509050919050565b600054610100900460ff168061100a575060005460ff16155b6110265760405162461bcd60e51b81526004016102839061130d565b600054610100900460ff16158015610f71576000805461ffff191661010117905580156106b7576000805461ff001916905550565b600054610100900460ff1680611074575060005460ff16155b6110905760405162461bcd60e51b81526004016102839061130d565b600054610100900460ff161580156110b2576000805461ffff19166101011790555b610f7133610b4e565b6040805161012081018252600080825260208201819052918101829052606081018290526080810182905260a0810182905260c0810182905260e0810182905261010081019190915290565b80356001600160a01b038116811461111e57600080fd5b919050565b6000806040838503121561113657600080fd5b8235915061114660208401611107565b90509250929050565b821515815281516001600160a01b039081166020808401919091528301511660408083019190915282015161014082019061119560608401826001600160a01b03169052565b506060830151608083015260808301516111bb60a08401826001600160f01b0319169052565b5060a083015161ffff811660c08401525060c083015160e083015260e083015161010081818501528085015161012085015250509392505050565b80356001600160f01b03198116811461111e57600080fd5b600080600080600060a0868803121561122657600080fd5b61122f86611107565b945061123d60208701611107565b935060408601359250611252606087016111f6565b949793965091946080013592915050565b60006020828403121561127557600080fd5b61127e82611107565b9392505050565b6000806000806080858703121561129b57600080fd5b6112a485611107565b9350602085013592506112b9604086016111f6565b9396929550929360600135925050565b6020808252825182820181905260009190848201906040850190845b81811015611301578351835292840192918401916001016112e5565b50909695505050505050565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b634e487b7160e01b600052601160045260246000fd5b6000828210156113835761138361135b565b500390565b600061ffff8083168185168083038211156113a5576113a561135b565b01949350505050565b634e487b7160e01b600052603260045260246000fd5b600061ffff808316818114156113dc576113dc61135b565b6001019392505050565b634e487b7160e01b600052603160045260246000fdfea2646970667358221220f16d9682f0bba01edce37665cf6495dc03e9cb2f1b9182ce3bf509ef7c6acff664736f6c634300080a0033";

type ContractRegistryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ContractRegistryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ContractRegistry__factory extends ContractFactory {
  constructor(...args: ContractRegistryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractRegistry> {
    return super.deploy(overrides || {}) as Promise<ContractRegistry>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ContractRegistry {
    return super.attach(address) as ContractRegistry;
  }
  connect(signer: Signer): ContractRegistry__factory {
    return super.connect(signer) as ContractRegistry__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ContractRegistryInterface {
    return new utils.Interface(_abi) as ContractRegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ContractRegistry {
    return new Contract(address, _abi, signerOrProvider) as ContractRegistry;
  }
}
