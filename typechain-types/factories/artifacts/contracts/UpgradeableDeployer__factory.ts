/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  UpgradeableDeployer,
  UpgradeableDeployerInterface,
} from "../../../artifacts/contracts/UpgradeableDeployer";

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
        name: "proxy",
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
    name: "ContractUpgraded",
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
        internalType: "contract TransparentUpgradeableProxy",
        name: "proxy",
        type: "address",
      },
      {
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "changeProxyAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
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
  {
    inputs: [
      {
        internalType: "contract TransparentUpgradeableProxy",
        name: "proxy",
        type: "address",
      },
    ],
    name: "getProxyAdmin",
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
        internalType: "contract TransparentUpgradeableProxy",
        name: "proxy",
        type: "address",
      },
    ],
    name: "getProxyImplementation",
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
        internalType: "contract TransparentUpgradeableProxy",
        name: "proxy",
        type: "address",
      },
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "upgrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract TransparentUpgradeableProxy",
        name: "proxy",
        type: "address",
      },
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IContractRegistry",
        name: "registry",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
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
        internalType: "uint16",
        name: "version",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "upgradeContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161210438038061210483398101604081905261002f916100ad565b6100383361005d565b600180546001600160a01b0319166001600160a01b03929092169190911790556100dd565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100bf57600080fd5b81516001600160a01b03811681146100d657600080fd5b9392505050565b612018806100ec6000396000f3fe6080604052600436106200009d5760003560e01c80639623609d11620000605780639623609d146200016357806399a88ec4146200017a578063f2fde38b146200019f578063f3b7dead14620001c4578063fee853e014620001e957600080fd5b8063204e1c7a14620000a25780633aa3df6c14620000df578063715018a614620001065780637eff275e146200011e5780638da5cb5b1462000143575b600080fd5b348015620000af57600080fd5b50620000c7620000c136600462000b9b565b6200020e565b604051620000d6919062000bbb565b60405180910390f35b348015620000ec57600080fd5b5062000104620000fe36600462000cdb565b620002a5565b005b3480156200011357600080fd5b5062000104620004d8565b3480156200012b57600080fd5b50620001046200013d36600462000d82565b620004f0565b3480156200015057600080fd5b506000546001600160a01b0316620000c7565b620001046200017436600462000dc0565b62000560565b3480156200018757600080fd5b50620001046200019936600462000d82565b620005d5565b348015620001ac57600080fd5b5062000104620001be36600462000b9b565b6200060d565b348015620001d157600080fd5b50620000c7620001e336600462000b9b565b62000690565b348015620001f657600080fd5b50620001046200020836600462000e29565b620006b7565b6000806000836001600160a01b03166040516200023590635c60da1b60e01b815260040190565b600060405180830381855afa9150503d806000811462000272576040519150601f19603f3d011682016040523d82523d6000602084013e62000277565b606091505b5091509150816200028757600080fd5b808060200190518101906200029d919062000ee6565b949350505050565b620002af620009be565b6001600160a01b038616620002cd576001546001600160a01b031695505b858362000302578542604051602001620002e992919062000f2c565b6040516020818303038152906040528051906020012093505b6000620003126000868962000a1a565b90506000813088604051620003279062000b77565b620003359392919062000f7e565b604051809103906000f08015801562000352573d6000803e3d6000fd5b5090506000826001600160a01b0316803b806020016040519081016040528181526000908060200190933c805190602001209050816001600160a01b031663f2fde38b6200039d3390565b6040518263ffffffff1660e01b8152600401620003bb919062000bbb565b600060405180830381600087803b158015620003d657600080fd5b505af1925050508015620003e8575060015b506001600160a01b038a1663116cce868784868986336040516001600160e01b031960e089901b16815260048101969096526001600160a01b039485166024870152928416604486015261ffff909116606485015260848401521660a482015260c401600060405180830381600087803b1580156200046657600080fd5b505af11580156200047b573d6000803e3d6000fd5b5050604080516001600160a01b0388811682526020820186905261ffff8a1694508616925089917e60efd136254ce44bc32bb474aa1526e3a1ac84c0d4473c0b3fb4407c5b747a910160405180910390a450505050505050505050565b620004e2620009be565b620004ee600062000b27565b565b620004fa620009be565b6040516308f2839760e41b81526001600160a01b03831690638f283970906200052890849060040162000bbb565b600060405180830381600087803b1580156200054357600080fd5b505af115801562000558573d6000803e3d6000fd5b505050505050565b6200056a620009be565b60405163278f794360e11b81526001600160a01b03841690634f1ef2869034906200059c908690869060040162000fb5565b6000604051808303818588803b158015620005b657600080fd5b505af1158015620005cb573d6000803e3d6000fd5b5050505050505050565b620005df620009be565b604051631b2ce7f360e11b81526001600160a01b03831690633659cfe6906200052890849060040162000bbb565b62000617620009be565b6001600160a01b038116620006825760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b6200068d8162000b27565b50565b6000806000836001600160a01b031660405162000235906303e1469160e61b815260040190565b620006c1620009be565b6001600160a01b038716620006df576001546001600160a01b031696505b8660006001600160a01b03821663ccd92b4889336040516001600160e01b031960e085901b16815260048101929092526001600160a01b031660248201526127106044820152606401600060405180830381865afa15801562000746573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405262000770919081019062001046565b602081015190925090508086620007d85788826001600160a01b0316803b806020016040519081016040528181526000908060200190933c8342604051602001620007bf949392919062001141565b6040516020818303038152906040528051906020012096505b6000620007e86000898c62000a1a565b60408051600080825260208201909252919250508051906020012089805190602001201462000824576200081e82828b62000560565b62000830565b620008308282620005d5565b6000816001600160a01b0316803b806020016040519081016040528181526000908060200190933c805190602001209050836001600160a01b031663f2fde38b620008783390565b6040518263ffffffff1660e01b815260040162000896919062000bbb565b600060405180830381600087803b158015620008b157600080fd5b505af1925050508015620008c3575060015b506001600160a01b038d166340a40e9d8d86858b8d87336040516001600160e01b031960e08a901b16815260048101979097526001600160a01b0395861660248801529385166044870152918416606486015261ffff16608485015260a48401521660c482015260e401600060405180830381600087803b1580156200094857600080fd5b505af11580156200095d573d6000803e3d6000fd5b5050604080516001600160a01b038a811682526020820186905261ffff8d169450881692508f917fb2ed963efb0fada8bac866bcd62c557839424e7c067263587483165bf5a3dfb8910160405180910390a450505050505050505050505050565b6000546001600160a01b03163314620004ee5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640162000679565b60008347101562000a6e5760405162461bcd60e51b815260206004820152601d60248201527f437265617465323a20696e73756666696369656e742062616c616e6365000000604482015260640162000679565b815160000362000ac15760405162461bcd60e51b815260206004820181905260248201527f437265617465323a2062797465636f6465206c656e677468206973207a65726f604482015260640162000679565b8282516020840186f590506001600160a01b03811662000b205760405162461bcd60e51b8152602060048201526019602482015278437265617465323a204661696c6564206f6e206465706c6f7960381b604482015260640162000679565b9392505050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610e4d806200119683390190565b6001600160a01b03811681146200068d57600080fd5b60006020828403121562000bae57600080fd5b813562000b208162000b85565b6001600160a01b0391909116815260200190565b634e487b7160e01b600052604160045260246000fd5b60405161010081016001600160401b038111828210171562000c0b5762000c0b62000bcf565b60405290565b604051601f8201601f191681016001600160401b038111828210171562000c3c5762000c3c62000bcf565b604052919050565b60006001600160401b0382111562000c605762000c6062000bcf565b50601f01601f191660200190565b600082601f83011262000c8057600080fd5b813562000c9762000c918262000c44565b62000c11565b81815284602083860101111562000cad57600080fd5b816020850160208301376000918101602001919091529392505050565b61ffff811681146200068d57600080fd5b60008060008060008060c0878903121562000cf557600080fd5b863562000d028162000b85565b955060208701356001600160401b038082111562000d1f57600080fd5b62000d2d8a838b0162000c6e565b9650604089013591508082111562000d4457600080fd5b5062000d5389828a0162000c6e565b945050606087013592506080870135915060a087013562000d748162000cca565b809150509295509295509295565b6000806040838503121562000d9657600080fd5b823562000da38162000b85565b9150602083013562000db58162000b85565b809150509250929050565b60008060006060848603121562000dd657600080fd5b833562000de38162000b85565b9250602084013562000df58162000b85565b915060408401356001600160401b0381111562000e1157600080fd5b62000e1f8682870162000c6e565b9150509250925092565b600080600080600080600060e0888a03121562000e4557600080fd5b873562000e528162000b85565b96506020880135955060408801356001600160401b038082111562000e7657600080fd5b62000e848b838c0162000c6e565b965060608a013591508082111562000e9b57600080fd5b5062000eaa8a828b0162000c6e565b9450506080880135925060a088013562000ec48162000cca565b915060c088013562000ed68162000b85565b8091505092959891949750929550565b60006020828403121562000ef957600080fd5b815162000b208162000b85565b60005b8381101562000f2357818101518382015260200162000f09565b50506000910152565b6000835162000f4081846020880162000f06565b9190910191825250602001919050565b6000815180845262000f6a81602086016020860162000f06565b601f01601f19169290920160200192915050565b6001600160a01b0384811682528316602082015260606040820181905260009062000fac9083018462000f50565b95945050505050565b6001600160a01b03831681526040602082018190526000906200029d9083018462000f50565b805162000fe88162000b85565b919050565b805162000fe88162000cca565b600082601f8301126200100c57600080fd5b81516200101d62000c918262000c44565b8181528460208386010111156200103357600080fd5b6200029d82602083016020870162000f06565b600080604083850312156200105a57600080fd5b825180151581146200106b57600080fd5b60208401519092506001600160401b03808211156200108957600080fd5b9084019061010082870312156200109f57600080fd5b620010a962000be5565b82518152620010bb6020840162000fdb565b6020820152620010ce6040840162000fdb565b6040820152620010e16060840162000fdb565b6060820152620010f46080840162000fed565b608082015260a083015160a082015260c0830151828111156200111657600080fd5b620011248882860162000ffa565b60c08301525060e083015160e08201528093505050509250929050565b6000855162001155818460208a0162000f06565b8551908301906200116b818360208a0162000f06565b60609590951b6bffffffffffffffffffffffff19169401938452505060148201526034019291505056fe608060405260405162000e4d38038062000e4d833981016040819052620000269162000497565b828162000036828260006200004d565b50620000449050826200008a565b505050620005ca565b6200005883620000e5565b600082511180620000665750805b1562000085576200008383836200012760201b6200022e1760201c565b505b505050565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f620000b562000156565b604080516001600160a01b03928316815291841660208301520160405180910390a1620000e2816200018f565b50565b620000f08162000244565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b60606200014f838360405180606001604052806027815260200162000e2660279139620002f8565b9392505050565b60006200018060008051602062000e0683398151915260001b6200037760201b620001ea1760201c565b546001600160a01b0316919050565b6001600160a01b038116620001fa5760405162461bcd60e51b815260206004820152602660248201527f455243313936373a206e65772061646d696e20697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b806200022360008051602062000e0683398151915260001b6200037760201b620001ea1760201c565b80546001600160a01b0319166001600160a01b039290921691909117905550565b6200025a816200037a60201b6200025a1760201c565b620002be5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401620001f1565b80620002237f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b6200037760201b620001ea1760201c565b6060600080856001600160a01b03168560405162000317919062000577565b600060405180830381855af49150503d806000811462000354576040519150601f19603f3d011682016040523d82523d6000602084013e62000359565b606091505b5090925090506200036d8683838762000389565b9695505050505050565b90565b6001600160a01b03163b151590565b60608315620003fd578251600003620003f5576001600160a01b0385163b620003f55760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401620001f1565b508162000409565b62000409838362000411565b949350505050565b815115620004225781518083602001fd5b8060405162461bcd60e51b8152600401620001f1919062000595565b80516001600160a01b03811681146200045657600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b838110156200048e57818101518382015260200162000474565b50506000910152565b600080600060608486031215620004ad57600080fd5b620004b8846200043e565b9250620004c8602085016200043e565b60408501519092506001600160401b0380821115620004e657600080fd5b818601915086601f830112620004fb57600080fd5b8151818111156200051057620005106200045b565b604051601f8201601f19908116603f011681019083821181831017156200053b576200053b6200045b565b816040528281528960208487010111156200055557600080fd5b6200056883602083016020880162000471565b80955050505050509250925092565b600082516200058b81846020870162000471565b9190910192915050565b6020815260008251806020840152620005b681604085016020870162000471565b601f01601f19169190910160400192915050565b61082c80620005da6000396000f3fe60806040526004361061004e5760003560e01c80633659cfe6146100655780634f1ef286146100855780635c60da1b146100985780638f283970146100c9578063f851a440146100e95761005d565b3661005d5761005b6100fe565b005b61005b6100fe565b34801561007157600080fd5b5061005b6100803660046106be565b610118565b61005b6100933660046106d9565b610155565b3480156100a457600080fd5b506100ad6101bc565b6040516001600160a01b03909116815260200160405180910390f35b3480156100d557600080fd5b5061005b6100e43660046106be565b6101ed565b3480156100f557600080fd5b506100ad61020d565b610106610269565b6101166101116102fe565b610308565b565b61012061032c565b6001600160a01b0316330361014d5761014a8160405180602001604052806000815250600061035f565b50565b61014a6100fe565b61015d61032c565b6001600160a01b031633036101b4576101af8383838080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506001925061035f915050565b505050565b6101af6100fe565b60006101c661032c565b6001600160a01b031633036101e2576101dd6102fe565b905090565b6101ea6100fe565b90565b6101f561032c565b6001600160a01b0316330361014d5761014a8161038a565b600061021761032c565b6001600160a01b031633036101e2576101dd61032c565b606061025383836040518060600160405280602781526020016107d0602791396103de565b9392505050565b6001600160a01b03163b151590565b61027161032c565b6001600160a01b031633036101165760405162461bcd60e51b815260206004820152604260248201527f5472616e73706172656e745570677261646561626c6550726f78793a2061646d60448201527f696e2063616e6e6f742066616c6c6261636b20746f2070726f78792074617267606482015261195d60f21b608482015260a4015b60405180910390fd5b60006101dd610456565b3660008037600080366000845af43d6000803e808015610327573d6000f35b3d6000fd5b60007fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035b546001600160a01b0316919050565b6103688361047e565b6000825111806103755750805b156101af57610384838361022e565b50505050565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f6103b361032c565b604080516001600160a01b03928316815291841660208301520160405180910390a161014a816104be565b6060600080856001600160a01b0316856040516103fb9190610780565b600060405180830381855af49150503d8060008114610436576040519150601f19603f3d011682016040523d82523d6000602084013e61043b565b606091505b509150915061044c86838387610567565b9695505050505050565b60007f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc610350565b610487816105e6565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6001600160a01b0381166105235760405162461bcd60e51b815260206004820152602660248201527f455243313936373a206e65772061646d696e20697320746865207a65726f206160448201526564647265737360d01b60648201526084016102f5565b807fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035b80546001600160a01b0319166001600160a01b039290921691909117905550565b606083156105d45782516000036105cd576105818561025a565b6105cd5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016102f5565b50816105de565b6105de8383610678565b949350505050565b6105ef8161025a565b6106515760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b60648201526084016102f5565b807f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc610546565b8151156106885781518083602001fd5b8060405162461bcd60e51b81526004016102f5919061079c565b80356001600160a01b03811681146106b957600080fd5b919050565b6000602082840312156106d057600080fd5b610253826106a2565b6000806000604084860312156106ee57600080fd5b6106f7846106a2565b9250602084013567ffffffffffffffff8082111561071457600080fd5b818601915086601f83011261072857600080fd5b81358181111561073757600080fd5b87602082850101111561074957600080fd5b6020830194508093505050509250925092565b60005b8381101561077757818101518382015260200161075f565b50506000910152565b6000825161079281846020870161075c565b9190910192915050565b60208152600082518060208401526107bb81604085016020870161075c565b601f01601f1916919091016040019291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220557373ec903fd3bc4b75a2c6285870c5d4a0ead46cf8edd41db562a58981cc1264736f6c63430008110033b53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220de08133afbaa572200318e0fccd54adf87db4f7d755963dd5bcad1b1f5e0e21464736f6c63430008110033";

type UpgradeableDeployerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: UpgradeableDeployerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class UpgradeableDeployer__factory extends ContractFactory {
  constructor(...args: UpgradeableDeployerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    initRegistry: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<UpgradeableDeployer> {
    return super.deploy(
      initRegistry,
      overrides || {}
    ) as Promise<UpgradeableDeployer>;
  }
  override getDeployTransaction(
    initRegistry: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(initRegistry, overrides || {});
  }
  override attach(address: string): UpgradeableDeployer {
    return super.attach(address) as UpgradeableDeployer;
  }
  override connect(signer: Signer): UpgradeableDeployer__factory {
    return super.connect(signer) as UpgradeableDeployer__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): UpgradeableDeployerInterface {
    return new utils.Interface(_abi) as UpgradeableDeployerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): UpgradeableDeployer {
    return new Contract(address, _abi, signerOrProvider) as UpgradeableDeployer;
  }
}
