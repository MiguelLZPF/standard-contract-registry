/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BytesLike,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  ContractRegistry,
  ContractRegistryInterface,
} from "../../contracts/ContractRegistry";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract ICodeTrust",
        name: "initCodeTrust",
        type: "address",
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
      {
        internalType: "bytes32",
        name: "logicCodeHash",
        type: "bytes32",
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

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620018fa380380620018fa833981016040819052620000349162000460565b6200003f3362000091565b600180546001600160a01b0319166001600160a01b0386161790558262000077576f436f6e7472616374526567697374727960801b92505b62000087833080858533620000e1565b50505050620004bf565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b0384166200013d5760405162461bcd60e51b815260206004820152601760248201527f4c6f6769632061646472657373206973206e656464656400000000000000000060448201526064015b60405180910390fd5b6001600160a01b03851662000150578394505b61270f61ffff84161115620001a85760405162461bcd60e51b815260206004820152601f60248201527f56657273696f6e206d757374206265206c6f776572207468616e203939393900604482015260640162000134565b6001600160a01b0381166000908152600360209081526040808320600283528184208a855283528184208184528285205461ffff16855290925290912060058101541580156200020557506003810154600160a01b900461ffff16155b620002535760405162461bcd60e51b815260206004820152601e60248201527f416c726561647920726567697374657265642c20757365207570646174650000604482015260640162000134565b60026000846001600160a01b03166001600160a01b03168152602001908152602001600020600089815260200190815260200160002060008661ffff1661ffff1681526020019081526020016000209050878160000181905550868160010160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550858160020160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550828160030160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550848160030160146101000a81548161ffff021916908361ffff16021790555083816004018190555042816005018190555081600201548260010160008a815260200190815260200160002081905550878260020181905550848260000160008a815260200190815260200160002060006101000a81548161ffff021916908361ffff1602179055508060030160149054906101000a900461ffff1661ffff168160010160009054906101000a90046001600160a01b03166001600160a01b031682600001547fb8064287be8e96c6334f8cff70015f26aa567834bc9455bdc54f6d163a1013768460020160009054906101000a90046001600160a01b031685600401546040516200044e9291906001600160a01b03929092168252602082015260400190565b60405180910390a45050505050505050565b600080600080608085870312156200047757600080fd5b84516001600160a01b03811681146200048f57600080fd5b60208601516040870151919550935061ffff81168114620004af57600080fd5b6060959095015193969295505050565b61142b80620004cf6000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c80638da5cb5b116100665780638da5cb5b146100db578063ccd92b48146100fb578063e76637ce1461017c578063f2fde38b14610191578063ff69bc33146101a457600080fd5b8063116cce861461009857806340a40e9d146100ad578063715018a6146100c0578063842f95f0146100c8575b600080fd5b6100ab6100a63660046111a6565b6101ac565b005b6100ab6100bb36600461120c565b6102bf565b6100ab6103cf565b6100ab6100d6366004611284565b6103e3565b6000546040516001600160a01b0390911681526020015b60405180910390f35b61010e6101093660046112b0565b6105db565b60408051921515835281516020808501919091528201516001600160a01b03908116848301529082015181166060808501919091528201511660808084019190915281015161ffff1660a08084019190915281015160c080840191909152015160e0820152610100016100f2565b61018461062b565b6040516100f291906112ec565b6100ab61019f366004611330565b610640565b6101846106b9565b6001600160a01b0381166101bd5750335b6001600160a01b03811633148061025857506001546001600160a01b0316634f940270336040516001600160e01b031960e084901b1681526001600160a01b039182166004820152908416602482015260006044820152606401602060405180830381865afa158015610234573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102589190611352565b6102a95760405162461bcd60e51b815260206004820152601b60248201527f43616c6c2066726f6d20756e747275737465642061646472657373000000000060448201526064015b60405180910390fd5b6102b78686868686866106d0565b505050505050565b6001600160a01b0381166102d05750335b6001600160a01b03811633148061036b57506001546001600160a01b0316634f940270336040516001600160e01b031960e084901b1681526001600160a01b039182166004820152908416602482015260006044820152606401602060405180830381865afa158015610347573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061036b9190611352565b6103b75760405162461bcd60e51b815260206004820152601b60248201527f43616c6c2066726f6d20756e747275737465642061646472657373000000000060448201526064016102a0565b6103c687878787878787610a42565b50505050505050565b6103d7610da3565b6103e16000610dfd565b565b336001600160a01b0382161580159061040e5750806001600160a01b0316826001600160a01b031614155b61044e5760405162461bcd60e51b815260206004820152601160248201527024b73b30b634b2103732bb9030b236b4b760791b60448201526064016102a0565b6001600160a01b03811660009081526003602090815260408083206002835281842087855283528184208184528285205461ffff168552909252822060058101549192909190036104e15760405162461bcd60e51b815260206004820152601e60248201527f436f6e7472616374207265636f7264206e6f742072656769737465726564000060448201526064016102a0565b8054600182015460028301546003840154600485015461051c94936001600160a01b03908116931691600160a01b900461ffff1690896106d0565b6105268286610e4d565b6001600160a01b0383811660008181526002602081815260408084208b855282528084208883528185205461ffff16855282528084208481556001810180546001600160a01b031990811690915593810180549094169093556003830180546001600160b01b03191690556004830184905560059092019290925551888152928716927f6467ef979e83be7da4c6bdb4513ae6309dbf5cd9ca8f5474d2f77ef171f5b903910160405180910390a35050505050565b6040805160e081018252600080825260208201819052918101829052606081018290526080810182905260a0810182905260c0810182905261061e858585610f19565b915091505b935093915050565b606061063b33611031565b611031565b905090565b610648610da3565b6001600160a01b0381166106ad5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016102a0565b6106b681610dfd565b50565b606061063b6106366000546001600160a01b031690565b6001600160a01b0384166107265760405162461bcd60e51b815260206004820152601760248201527f4c6f6769632061646472657373206973206e656464656400000000000000000060448201526064016102a0565b6001600160a01b038516610738578394505b61270f61ffff8416111561078e5760405162461bcd60e51b815260206004820152601f60248201527f56657273696f6e206d757374206265206c6f776572207468616e20393939390060448201526064016102a0565b6001600160a01b0381166000908152600360209081526040808320600283528184208a855283528184208184528285205461ffff16855290925290912060058101541580156107ea57506003810154600160a01b900461ffff16155b6108365760405162461bcd60e51b815260206004820152601e60248201527f416c726561647920726567697374657265642c2075736520757064617465000060448201526064016102a0565b60026000846001600160a01b03166001600160a01b03168152602001908152602001600020600089815260200190815260200160002060008661ffff1661ffff1681526020019081526020016000209050878160000181905550868160010160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550858160020160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550828160030160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550848160030160146101000a81548161ffff021916908361ffff16021790555083816004018190555042816005018190555081600201548260010160008a815260200190815260200160002081905550878260020181905550848260000160008a815260200190815260200160002060006101000a81548161ffff021916908361ffff1602179055508060030160149054906101000a900461ffff1661ffff168160010160009054906101000a90046001600160a01b03166001600160a01b031682600001547fb8064287be8e96c6334f8cff70015f26aa567834bc9455bdc54f6d163a1013768460020160009054906101000a90046001600160a01b03168560040154604051610a309291906001600160a01b03929092168252602082015260400190565b60405180910390a45050505050505050565b86610a845760405162461bcd60e51b8152602060048201526012602482015271149958dbdc99081b985b59481b995959195960721b60448201526064016102a0565b6001600160a01b0381166000908152600360209081526040808320600283528184208b855283528184208184528285205461ffff16855290925282206005810154919290919003610b175760405162461bcd60e51b815260206004820152601c60248201527f4e6f7420726567697374657265642c207573652072656769737465720000000060448201526064016102a0565b8461ffff16600003610b41576003810154610b3e90600160a01b900461ffff16600161138a565b94505b600381015461ffff808716600160a01b9092041610610b985760405162461bcd60e51b815260206004820152601360248201527224b73b30b634b2103732bb903b32b939b4b7b760691b60448201526064016102a0565b6001600160a01b0380841660009081526002602090815260408083208d8452825280832061ffff8a168452909152902090891615610bf2576001810180546001600160a01b0319166001600160a01b038b16179055610c19565b60018083015490820180546001600160a01b0319166001600160a01b039092169190911790555b6001600160a01b03881615610c4a576002810180546001600160a01b0319166001600160a01b038a16179055610c71565b60028083015490820180546001600160a01b0319166001600160a01b039092169190911790555b6001600160a01b03871615610ca2576003810180546001600160a01b0319166001600160a01b038916179055610cc9565b60038083015490820180546001600160a01b0319166001600160a01b039092169190911790555b8415610cdb5760048101859055610ce6565b600480830154908201555b8154815560038101805461ffff60a01b1916600160a01b61ffff89811682029290921780845542600586015560008e81526020888152604091829020805493859004861661ffff19909416939093179092559354600186015486546002880154600489015488516001600160a01b0392831681529586015294909204909416949290931692917fb8064287be8e96c6334f8cff70015f26aa567834bc9455bdc54f6d163a101376910160405180910390a450505050505050505050565b6000546001600160a01b031633146103e15760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016102a0565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60028201546000818152600184016020526040902054610e83575060009081526001820160205260408120819055600290910155565b60008181526001840160205260409020548214610efd5780610ee75760405162461bcd60e51b815260206004820152601f60248201527f5265636f72644e616d65206e6f7420666f756e6420666f722073656e6465720060448201526064016102a0565b6000908152600183016020526040902054610e83565b6000918252600192909201602052604080822054928252902055565b6040805160e081018252600080825260208201819052918101829052606081018290526080810182905260a0810182905260c0810182905261270f61ffff84161115610f8a576001600160a01b038416600090815260036020908152604080832088845290915290205461ffff1692505b506001600160a01b038084166000908152600260208181526040808420898552825280842061ffff8089168652908352818520825160e0810184528154815260018201548816948101949094529384015486169183019190915260038301549485166060830152600160a01b9094049093166080840152600481015460a08401526005015460c0830181905290036110255760009150610623565b60019150935093915050565b6001600160a01b0381166000908152600360205260408120600201546060915b8115801590611061575061271081105b156110a45780611070816113b0565b6001600160a01b03861660009081526003602090815260408083209683526001909601905293909320549291506110519050565b6001600160a01b03841660009081526003602052604081206002015492508167ffffffffffffffff8111156110db576110db6113c9565b604051908082528060200260200182016040528015611104578160200160208202803683370190505b50905060005b8281101561116f5783828281518110611125576111256113df565b6020908102919091018101919091526001600160a01b0387166000908152600382526040808220968252600190960190915293909320549280611167816113b0565b91505061110a565b50949350505050565b80356001600160a01b038116811461118f57600080fd5b919050565b803561ffff8116811461118f57600080fd5b60008060008060008060c087890312156111bf57600080fd5b863595506111cf60208801611178565b94506111dd60408801611178565b93506111eb60608801611194565b92506080870135915061120060a08801611178565b90509295509295509295565b600080600080600080600060e0888a03121561122757600080fd5b8735965061123760208901611178565b955061124560408901611178565b945061125360608901611178565b935061126160808901611194565b925060a0880135915061127660c08901611178565b905092959891949750929550565b6000806040838503121561129757600080fd5b823591506112a760208401611178565b90509250929050565b6000806000606084860312156112c557600080fd5b833592506112d560208501611178565b91506112e360408501611194565b90509250925092565b6020808252825182820181905260009190848201906040850190845b8181101561132457835183529284019291840191600101611308565b50909695505050505050565b60006020828403121561134257600080fd5b61134b82611178565b9392505050565b60006020828403121561136457600080fd5b8151801515811461134b57600080fd5b634e487b7160e01b600052601160045260246000fd5b600061ffff8083168185168083038211156113a7576113a7611374565b01949350505050565b6000600182016113c2576113c2611374565b5060010190565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fdfea2646970667358221220a9ad6cd6ebb724777d573dbaaefc9b0251d4f915a0fac634325bf2a665a96cb464736f6c634300080e0033";

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

  override deploy(
    initCodeTrust: PromiseOrValue<string>,
    name: PromiseOrValue<BytesLike>,
    version: PromiseOrValue<BigNumberish>,
    logicCodeHash: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractRegistry> {
    return super.deploy(
      initCodeTrust,
      name,
      version,
      logicCodeHash,
      overrides || {}
    ) as Promise<ContractRegistry>;
  }
  override getDeployTransaction(
    initCodeTrust: PromiseOrValue<string>,
    name: PromiseOrValue<BytesLike>,
    version: PromiseOrValue<BigNumberish>,
    logicCodeHash: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      initCodeTrust,
      name,
      version,
      logicCodeHash,
      overrides || {}
    );
  }
  override attach(address: string): ContractRegistry {
    return super.attach(address) as ContractRegistry;
  }
  override connect(signer: Signer): ContractRegistry__factory {
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
