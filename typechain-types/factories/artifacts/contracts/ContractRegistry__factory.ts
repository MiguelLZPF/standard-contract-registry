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
import type { PromiseOrValue } from "../../../common";
import type {
  ContractRegistry,
  ContractRegistryInterface,
} from "../../../artifacts/contracts/ContractRegistry";

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
        indexed: true,
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
        internalType: "bytes",
        name: "oldExtraData",
        type: "bytes",
      },
      {
        indexed: true,
        internalType: "bytes",
        name: "newExtraData",
        type: "bytes",
      },
    ],
    name: "ExtraDataUpdated",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "newExtraData",
        type: "bytes",
      },
    ],
    name: "editExtraData",
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
            internalType: "bytes",
            name: "extraData",
            type: "bytes",
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
  "0x60806040523480156200001157600080fd5b5060405162001de938038062001de9833981016040819052620000349162000460565b6200003f3362000091565b600180546001600160a01b0319166001600160a01b0386161790558262000077576f436f6e7472616374526567697374727960801b92505b62000087833080858533620000e1565b50505050620004bf565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b0384166200013d5760405162461bcd60e51b815260206004820152601760248201527f4c6f6769632061646472657373206973206e656464656400000000000000000060448201526064015b60405180910390fd5b6001600160a01b03851662000150578394505b61270f61ffff84161115620001a85760405162461bcd60e51b815260206004820152601f60248201527f56657273696f6e206d757374206265206c6f776572207468616e203939393900604482015260640162000134565b6001600160a01b0381166000908152600360209081526040808320600283528184208a855283528184208184528285205461ffff16855290925290912060068101541580156200020557506003810154600160a01b900461ffff16155b620002535760405162461bcd60e51b815260206004820152601e60248201527f416c726561647920726567697374657265642c20757365207570646174650000604482015260640162000134565b60026000846001600160a01b03166001600160a01b03168152602001908152602001600020600089815260200190815260200160002060008661ffff1661ffff1681526020019081526020016000209050878160000181905550868160010160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550858160020160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550828160030160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550848160030160146101000a81548161ffff021916908361ffff16021790555083816004018190555042816006018190555081600201548260010160008a815260200190815260200160002081905550878260020181905550848260000160008a815260200190815260200160002060006101000a81548161ffff021916908361ffff1602179055508060030160149054906101000a900461ffff1661ffff168160010160009054906101000a90046001600160a01b03166001600160a01b031682600001547fb8064287be8e96c6334f8cff70015f26aa567834bc9455bdc54f6d163a1013768460020160009054906101000a90046001600160a01b031685600401546040516200044e9291906001600160a01b03929092168252602082015260400190565b60405180910390a45050505050505050565b600080600080608085870312156200047757600080fd5b84516001600160a01b03811681146200048f57600080fd5b60208601516040870151919550935061ffff81168114620004af57600080fd5b6060959095015193969295505050565b61191a80620004cf6000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c80639ecbb057116100665780639ecbb05714610106578063ccd92b4814610119578063e76637ce1461013a578063f2fde38b1461014f578063ff69bc331461016257600080fd5b8063116cce86146100a357806340a40e9d146100b8578063715018a6146100cb578063842f95f0146100d35780638da5cb5b146100e6575b600080fd5b6100b66100b1366004611260565b61016a565b005b6100b66100c63660046112c6565b61023c565b6100b6610307565b6100b66100e136600461133e565b61031b565b6000546040516001600160a01b0390911681526020015b60405180910390f35b6100b6610114366004611380565b61052f565b61012c61012736600461143b565b610618565b6040516100fd9291906114c7565b61014261063a565b6040516100fd9190611565565b6100b661015d3660046115a9565b61064f565b6101426106c8565b6001600160a01b03811661017b5750335b6001600160a01b03811633148061020157506001546001600160a01b0316634f940270338360006040518463ffffffff1660e01b81526004016101c0939291906115cb565b602060405180830381865afa1580156101dd573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061020191906115ef565b6102265760405162461bcd60e51b815260040161021d90611611565b60405180910390fd5b6102348686868686866106df565b505050505050565b6001600160a01b03811661024d5750335b6001600160a01b0381163314806102d357506001546001600160a01b0316634f940270338360006040518463ffffffff1660e01b8152600401610292939291906115cb565b602060405180830381865afa1580156102af573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102d391906115ef565b6102ef5760405162461bcd60e51b815260040161021d90611611565b6102fe87878787878787610a4b565b50505050505050565b61030f610d57565b6103196000610db1565b565b336001600160a01b038216158015906103465750806001600160a01b0316826001600160a01b031614155b6103865760405162461bcd60e51b815260206004820152601160248201527024b73b30b634b2103732bb9030b236b4b760791b604482015260640161021d565b6001600160a01b03811660009081526003602090815260408083206002835281842087855283528184208184528285205461ffff168552909252822060068101549192909190036104195760405162461bcd60e51b815260206004820152601e60248201527f436f6e7472616374207265636f7264206e6f7420726567697374657265640000604482015260640161021d565b8054600182015460028301546003840154600485015461045494936001600160a01b03908116931691600160a01b900461ffff1690896106df565b61045e8286610e01565b6001600160a01b038316600090815260026020818152604080842089855282528084208683528185205461ffff16855290915282208281556001810180546001600160a01b031990811690915591810180549092169091556003810180546001600160b01b031916905560048101829055906104dd600583018261119c565b60068201600090555050836001600160a01b0316836001600160a01b0316867f6467ef979e83be7da4c6bdb4513ae6309dbf5cd9ca8f5474d2f77ef171f5b90360405160405180910390a45050505050565b338261054d5760405162461bcd60e51b815260040161021d90611648565b6001600160a01b03811660009081526003602090815260408083206002835281842087855283528184208184528285205461ffff168552909252822060068101549192909190036105b05760405162461bcd60e51b815260040161021d90611674565b836040516105be91906116ab565b6040518091039020816005016040516105d79190611701565b604051908190038120835490917f0c1944b28b15a207c930873413a1e86d4da29dc4b5b5d556f7083e6093b10bc590600090a46005810161023485826117bd565b60006106226111d6565b61062d858585610ecf565b915091505b935093915050565b606061064a33611055565b611055565b905090565b610657610d57565b6001600160a01b0381166106bc5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161021d565b6106c581610db1565b50565b606061064a6106456000546001600160a01b031690565b6001600160a01b03841661072f5760405162461bcd60e51b8152602060048201526017602482015276131bd9da58c81859191c995cdcc81a5cc81b9959191959604a1b604482015260640161021d565b6001600160a01b038516610741578394505b61270f61ffff841611156107975760405162461bcd60e51b815260206004820152601f60248201527f56657273696f6e206d757374206265206c6f776572207468616e203939393900604482015260640161021d565b6001600160a01b0381166000908152600360209081526040808320600283528184208a855283528184208184528285205461ffff16855290925290912060068101541580156107f357506003810154600160a01b900461ffff16155b61083f5760405162461bcd60e51b815260206004820152601e60248201527f416c726561647920726567697374657265642c20757365207570646174650000604482015260640161021d565b60026000846001600160a01b03166001600160a01b03168152602001908152602001600020600089815260200190815260200160002060008661ffff1661ffff1681526020019081526020016000209050878160000181905550868160010160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550858160020160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550828160030160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550848160030160146101000a81548161ffff021916908361ffff16021790555083816004018190555042816006018190555081600201548260010160008a815260200190815260200160002081905550878260020181905550848260000160008a815260200190815260200160002060006101000a81548161ffff021916908361ffff1602179055508060030160149054906101000a900461ffff1661ffff168160010160009054906101000a90046001600160a01b03166001600160a01b031682600001547fb8064287be8e96c6334f8cff70015f26aa567834bc9455bdc54f6d163a1013768460020160009054906101000a90046001600160a01b03168560040154604051610a399291906001600160a01b03929092168252602082015260400190565b60405180910390a45050505050505050565b86610a685760405162461bcd60e51b815260040161021d90611648565b6001600160a01b0381166000908152600360209081526040808320600283528184208b855283528184208184528285205461ffff16855290925282206006810154919290919003610acb5760405162461bcd60e51b815260040161021d90611674565b8461ffff16600003610af5576003810154610af290600160a01b900461ffff166001611893565b94505b600381015461ffff808716600160a01b9092041610610b4c5760405162461bcd60e51b815260206004820152601360248201527224b73b30b634b2103732bb903b32b939b4b7b760691b604482015260640161021d565b6001600160a01b0380841660009081526002602090815260408083208d8452825280832061ffff8a168452909152902090891615610ba6576001810180546001600160a01b0319166001600160a01b038b16179055610bcd565b60018083015490820180546001600160a01b0319166001600160a01b039092169190911790555b6001600160a01b03881615610bfe576002810180546001600160a01b0319166001600160a01b038a16179055610c25565b60028083015490820180546001600160a01b0319166001600160a01b039092169190911790555b6001600160a01b03871615610c56576003810180546001600160a01b0319166001600160a01b038916179055610c7d565b60038083015490820180546001600160a01b0319166001600160a01b039092169190911790555b8415610c8f5760048101859055610c9a565b600480830154908201555b8154815560038101805461ffff60a01b1916600160a01b61ffff89811682029290921780845542600686015560008e81526020888152604091829020805493859004861661ffff19909416939093179092559354600186015486546002880154600489015488516001600160a01b0392831681529586015294909204909416949290931692917fb8064287be8e96c6334f8cff70015f26aa567834bc9455bdc54f6d163a101376910160405180910390a450505050505050505050565b6000546001600160a01b031633146103195760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161021d565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60028201546000818152600184016020526040902054610e37575060009081526001820160205260408120819055600290910155565b60008181526001840160205260409020548214610eb15780610e9b5760405162461bcd60e51b815260206004820152601f60248201527f5265636f72644e616d65206e6f7420666f756e6420666f722073656e64657200604482015260640161021d565b6000908152600183016020526040902054610e37565b6000828152600184016020526040808220548383529120555b505050565b6000610ed96111d6565b61270f61ffff84161115610f12576001600160a01b038416600090815260036020908152604080832088845290915290205461ffff1692505b6001600160a01b0380851660009081526002602081815260408084208a8552825280842061ffff808a168652908352938190208151610100810183528154815260018201548716938101939093529283015485169082015260038201549384166060820152600160a01b9093049091166080830152600481015460a083015260058101805460c084019190610fa6906116c7565b80601f0160208091040260200160405190810160405280929190818152602001828054610fd2906116c7565b801561101f5780601f10610ff45761010080835404028352916020019161101f565b820191906000526020600020905b81548152906001019060200180831161100257829003601f168201915b5050505050815260200160068201548152505090508060e001516000036110495760009150610632565b60019150935093915050565b6001600160a01b0381166000908152600360205260408120600201546060915b8115801590611085575061271081105b156110c85780611094816118b5565b6001600160a01b03861660009081526003602090815260408083209683526001909601905293909320549291506110759050565b6001600160a01b03841660009081526003602052604081206002015492508167ffffffffffffffff8111156110ff576110ff61136a565b604051908082528060200260200182016040528015611128578160200160208202803683370190505b50905060005b828110156111935783828281518110611149576111496118ce565b6020908102919091018101919091526001600160a01b038716600090815260038252604080822096825260019096019091529390932054928061118b816118b5565b91505061112e565b50949350505050565b5080546111a8906116c7565b6000825580601f106111b8575050565b601f0160209004906000526020600020908101906106c59190611219565b604080516101008101825260008082526020820181905291810182905260608082018390526080820183905260a0820183905260c082015260e081019190915290565b5b8082111561122e576000815560010161121a565b5090565b80356001600160a01b038116811461124957600080fd5b919050565b803561ffff8116811461124957600080fd5b60008060008060008060c0878903121561127957600080fd5b8635955061128960208801611232565b945061129760408801611232565b93506112a56060880161124e565b9250608087013591506112ba60a08801611232565b90509295509295509295565b600080600080600080600060e0888a0312156112e157600080fd5b873596506112f160208901611232565b95506112ff60408901611232565b945061130d60608901611232565b935061131b6080890161124e565b925060a0880135915061133060c08901611232565b905092959891949750929550565b6000806040838503121561135157600080fd5b8235915061136160208401611232565b90509250929050565b634e487b7160e01b600052604160045260246000fd5b6000806040838503121561139357600080fd5b82359150602083013567ffffffffffffffff808211156113b257600080fd5b818501915085601f8301126113c657600080fd5b8135818111156113d8576113d861136a565b604051601f8201601f19908116603f011681019083821181831017156114005761140061136a565b8160405282815288602084870101111561141957600080fd5b8260208601602083013760006020848301015280955050505050509250929050565b60008060006060848603121561145057600080fd5b8335925061146060208501611232565b915061146e6040850161124e565b90509250925092565b60005b8381101561149257818101518382015260200161147a565b50506000910152565b600081518084526114b3816020860160208601611477565b601f01601f19169290920160200192915050565b8215158152604060208083018290528351828401528301516001600160a01b039081166060808501919091529184015116608083015282015160009061151860a08401826001600160a01b03169052565b50608083015161ffff811660c08401525060a083015160e083015260c08301516101008084015261154d61014084018261149b565b905060e0840151610120840152809150509392505050565b6020808252825182820181905260009190848201906040850190845b8181101561159d57835183529284019291840191600101611581565b50909695505050505050565b6000602082840312156115bb57600080fd5b6115c482611232565b9392505050565b6001600160a01b039384168152919092166020820152604081019190915260600190565b60006020828403121561160157600080fd5b815180151581146115c457600080fd5b6020808252601b908201527f43616c6c2066726f6d20756e7472757374656420616464726573730000000000604082015260600190565b602080825260129082015271149958dbdc99081b985b59481b995959195960721b604082015260600190565b6020808252601c908201527f4e6f7420726567697374657265642c2075736520726567697374657200000000604082015260600190565b600082516116bd818460208701611477565b9190910192915050565b600181811c908216806116db57607f821691505b6020821081036116fb57634e487b7160e01b600052602260045260246000fd5b50919050565b600080835461170f816116c7565b60018281168015611727576001811461173c5761176b565b60ff198416875282151583028701945061176b565b8760005260208060002060005b858110156117625781548a820152908401908201611749565b50505082870194505b50929695505050505050565b601f821115610eca57600081815260208120601f850160051c8101602086101561179e5750805b601f850160051c820191505b81811015610234578281556001016117aa565b815167ffffffffffffffff8111156117d7576117d761136a565b6117eb816117e584546116c7565b84611777565b602080601f83116001811461182057600084156118085750858301515b600019600386901b1c1916600185901b178555610234565b600085815260208120601f198616915b8281101561184f57888601518255948401946001909101908401611830565b508582101561186d5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b61ffff8181168382160190808211156118ae576118ae61187d565b5092915050565b6000600182016118c7576118c761187d565b5060010190565b634e487b7160e01b600052603260045260246000fdfea2646970667358221220869f995ffe76f861e892f23478a5eb851c7dd1ce0a6458ad734f0bc507c4251464736f6c63430008110033";

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
