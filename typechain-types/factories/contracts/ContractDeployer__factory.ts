/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BytesLike,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  ContractDeployer,
  ContractDeployerInterface,
} from "../../contracts/ContractDeployer";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IContractRegistry",
        name: "initRegistry",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
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
        internalType: "address",
        name: "registry",
        type: "address",
      },
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
        indexed: true,
        internalType: "address",
        name: "registry",
        type: "address",
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
        internalType: "contract TransparentUpgradeableProxy",
        name: "proxy",
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
        internalType: "uint16",
        name: "version",
        type: "uint16",
      },
    ],
    name: "upgradeContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161207038038061207083398101604081905261002f916101b5565b61003833610165565b600180546001600160a01b0319166001600160a01b0385161790558161006f576f21b7b73a3930b1ba2232b83637bcb2b960811b91505b600154604051631267a42960e31b8152306004820181905260248201526044810184905260006064820152608481018390526001600160a01b039091169063933d21489060a401600060405180830381600087803b1580156100d057600080fd5b505af11580156100e4573d6000803e3d6000fd5b50506001546001600160a01b031691506346b18bc9905030336040516001600160e01b031960e085901b1681526001600160a01b03928316600482015291166024820152604401600060405180830381600087803b15801561014557600080fd5b505af1158015610159573d6000803e3d6000fd5b505050505050506101f8565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000806000606084860312156101ca57600080fd5b83516001600160a01b03811681146101e157600080fd5b602085015160409095015190969495509392505050565b611e69806102076000396000f3fe6080604052600436106200009d5760003560e01c80639623609d11620000605780639623609d146200016757806399a88ec4146200017e578063be40c7f314620001a3578063f2fde38b14620001c8578063f3b7dead14620001ed57600080fd5b8063204e1c7a14620000a25780633aa3df6c14620000e3578063715018a6146200010a5780637eff275e14620001225780638da5cb5b1462000147575b600080fd5b348015620000af57600080fd5b50620000c7620000c136600462000af9565b62000212565b6040516001600160a01b03909116815260200160405180910390f35b348015620000f057600080fd5b50620001086200010236600462000be3565b620002a9565b005b3480156200011757600080fd5b5062000108620004d0565b3480156200012f57600080fd5b50620001086200014136600462000c87565b6200050b565b3480156200015457600080fd5b506000546001600160a01b0316620000c7565b620001086200017836600462000cc5565b6200059a565b3480156200018b57600080fd5b50620001086200019d36600462000c87565b62000632565b348015620001b057600080fd5b5062000108620001c236600462000d2f565b6200068e565b348015620001d557600080fd5b5062000108620001e736600462000af9565b620008b1565b348015620001fa57600080fd5b50620000c76200020c36600462000af9565b62000953565b6000806000836001600160a01b03166040516200023990635c60da1b60e01b815260040190565b600060405180830381855afa9150503d806000811462000276576040519150601f19603f3d011682016040523d82523d6000602084013e6200027b565b606091505b5091509150816200028b57600080fd5b80806020019051810190620002a1919062000dd2565b949350505050565b6000546001600160a01b03163314620002df5760405162461bcd60e51b8152600401620002d69062000df2565b60405180910390fd5b6001600160a01b038616620002fd576001546001600160a01b031695505b845160208601208690846200033a5786426040516020016200032192919062000e5a565b6040516020818303038152906040528051906020012094505b60006200034a6000878a6200097a565b905060008130896040516200035f9062000ad5565b6200036d9392919062000eac565b604051809103906000f0801580156200038a573d6000803e3d6000fd5b5090506001600160a01b03811663f2fde38b336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401600060405180830381600087803b158015620003df57600080fd5b505af1925050508015620003f1575060015b50604051631267a42960e31b81526001600160a01b03828116600483015283811660248301526044820188905261ffff87166064830152608482018590528b169063933d21489060a401600060405180830381600087803b1580156200045657600080fd5b505af11580156200046b573d6000803e3d6000fd5b5050604080516001600160a01b038881168252602082018b905291810187905261ffff8916935090841691507fe4b6d22de083d13eeaf04004ae42ae304dc687e85ec636ca51f9b7112e0618479060600160405180910390a350505050505050505050565b6000546001600160a01b03163314620004fd5760405162461bcd60e51b8152600401620002d69062000df2565b62000509600062000a85565b565b6000546001600160a01b03163314620005385760405162461bcd60e51b8152600401620002d69062000df2565b6040516308f2839760e41b81526001600160a01b038281166004830152831690638f283970906024015b600060405180830381600087803b1580156200057d57600080fd5b505af115801562000592573d6000803e3d6000fd5b505050505050565b6000546001600160a01b03163314620005c75760405162461bcd60e51b8152600401620002d69062000df2565b60405163278f794360e11b81526001600160a01b03841690634f1ef286903490620005f9908690869060040162000ee3565b6000604051808303818588803b1580156200061357600080fd5b505af115801562000628573d6000803e3d6000fd5b5050505050505050565b6000546001600160a01b031633146200065f5760405162461bcd60e51b8152600401620002d69062000df2565b604051631b2ce7f360e11b81526001600160a01b038281166004830152831690633659cfe69060240162000562565b6000546001600160a01b03163314620006bb5760405162461bcd60e51b8152600401620002d69062000df2565b6001600160a01b038616620006d9576001546001600160a01b031695505b83516020850120869086908462000718578642604051602001620006ff92919062000e5a565b6040516020818303038152906040528051906020012094505b6000620007286000878a6200097a565b60408051600080825260208201909252919250508051906020012087805190602001201462000764576200075e8982896200059a565b62000770565b62000770898262000632565b6001600160a01b03831663f2fde38b336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401600060405180830381600087803b158015620007c257600080fd5b505af1925050508015620007d4575060015b5060405163cdec094d60e01b81526001600160a01b03848116600483015282811660248301526000604483015261ffff87166064830152608482018490528b169063cdec094d9060a401600060405180830381600087803b1580156200083957600080fd5b505af11580156200084e573d6000803e3d6000fd5b505050508461ffff16836001600160a01b0316856001600160a01b03167f4a4b52a1a8ef43a2e9d4e3bbf315771e7d16d8859a993f144d4bdb6e2e523a47856040516200089d91815260200190565b60405180910390a450505050505050505050565b6000546001600160a01b03163314620008de5760405162461bcd60e51b8152600401620002d69062000df2565b6001600160a01b038116620009455760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401620002d6565b620009508162000a85565b50565b6000806000836001600160a01b031660405162000239906303e1469160e61b815260040190565b60008084471015620009cf5760405162461bcd60e51b815260206004820152601d60248201527f437265617465323a20696e73756666696369656e742062616c616e63650000006044820152606401620002d6565b825160000362000a225760405162461bcd60e51b815260206004820181905260248201527f437265617465323a2062797465636f6465206c656e677468206973207a65726f6044820152606401620002d6565b8383516020850187f590506001600160a01b038116620002a15760405162461bcd60e51b815260206004820152601960248201527f437265617465323a204661696c6564206f6e206465706c6f79000000000000006044820152606401620002d6565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610f2a8062000f0a83390190565b6001600160a01b03811681146200095057600080fd5b60006020828403121562000b0c57600080fd5b813562000b198162000ae3565b9392505050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011262000b4857600080fd5b813567ffffffffffffffff8082111562000b665762000b6662000b20565b604051601f8301601f19908116603f0116810190828211818310171562000b915762000b9162000b20565b8160405283815286602085880101111562000bab57600080fd5b836020870160208301376000602085830101528094505050505092915050565b803561ffff8116811462000bde57600080fd5b919050565b60008060008060008060c0878903121562000bfd57600080fd5b863562000c0a8162000ae3565b9550602087013567ffffffffffffffff8082111562000c2857600080fd5b62000c368a838b0162000b36565b9650604089013591508082111562000c4d57600080fd5b5062000c5c89828a0162000b36565b945050606087013592506080870135915062000c7b60a0880162000bcb565b90509295509295509295565b6000806040838503121562000c9b57600080fd5b823562000ca88162000ae3565b9150602083013562000cba8162000ae3565b809150509250929050565b60008060006060848603121562000cdb57600080fd5b833562000ce88162000ae3565b9250602084013562000cfa8162000ae3565b9150604084013567ffffffffffffffff81111562000d1757600080fd5b62000d258682870162000b36565b9150509250925092565b60008060008060008060c0878903121562000d4957600080fd5b863562000d568162000ae3565b9550602087013562000d688162000ae3565b9450604087013567ffffffffffffffff8082111562000d8657600080fd5b62000d948a838b0162000b36565b9550606089013591508082111562000dab57600080fd5b5062000dba89828a0162000b36565b9350506080870135915062000c7b60a0880162000bcb565b60006020828403121562000de557600080fd5b815162000b198162000ae3565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60005b8381101562000e4457818101518382015260200162000e2a565b8381111562000e54576000848401525b50505050565b6000835162000e6e81846020880162000e27565b9190910191825250602001919050565b6000815180845262000e9881602086016020860162000e27565b601f01601f19169290920160200192915050565b6001600160a01b0384811682528316602082015260606040820181905260009062000eda9083018462000e7e565b95945050505050565b6001600160a01b0383168152604060208201819052600090620002a19083018462000e7e56fe608060405260405162000f2a38038062000f2a833981016040819052620000269162000519565b82816200005560017f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbd620005f9565b60008051602062000ee3833981519152146200007557620000756200061f565b6200008382826000620000e7565b50620000b3905060017fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6104620005f9565b60008051602062000ec383398151915214620000d357620000d36200061f565b620000de8262000124565b50505062000688565b620000f2836200017f565b600082511180620001005750805b156200011f576200011d8383620001c160201b6200022e1760201c565b505b505050565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f6200014f620001f0565b604080516001600160a01b03928316815291841660208301520160405180910390a16200017c8162000229565b50565b6200018a81620002de565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6060620001e9838360405180606001604052806027815260200162000f036027913962000381565b9392505050565b60006200021a60008051602062000ec383398151915260001b6200046760201b620001ea1760201c565b546001600160a01b0316919050565b6001600160a01b038116620002945760405162461bcd60e51b815260206004820152602660248201527f455243313936373a206e65772061646d696e20697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b80620002bd60008051602062000ec383398151915260001b6200046760201b620001ea1760201c565b80546001600160a01b0319166001600160a01b039290921691909117905550565b620002f4816200046a60201b6200025a1760201c565b620003585760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b60648201526084016200028b565b80620002bd60008051602062000ee383398151915260001b6200046760201b620001ea1760201c565b60606001600160a01b0384163b620003eb5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b60648201526084016200028b565b600080856001600160a01b03168560405162000408919062000635565b600060405180830381855af49150503d806000811462000445576040519150601f19603f3d011682016040523d82523d6000602084013e6200044a565b606091505b5090925090506200045d82828662000479565b9695505050505050565b90565b6001600160a01b03163b151590565b606083156200048a575081620001e9565b8251156200049b5782518084602001fd5b8160405162461bcd60e51b81526004016200028b919062000653565b80516001600160a01b0381168114620004cf57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101562000507578181015183820152602001620004ed565b838111156200011d5750506000910152565b6000806000606084860312156200052f57600080fd5b6200053a84620004b7565b92506200054a60208501620004b7565b60408501519092506001600160401b03808211156200056857600080fd5b818601915086601f8301126200057d57600080fd5b815181811115620005925762000592620004d4565b604051601f8201601f19908116603f01168101908382118183101715620005bd57620005bd620004d4565b81604052828152896020848701011115620005d757600080fd5b620005ea836020830160208801620004ea565b80955050505050509250925092565b6000828210156200061a57634e487b7160e01b600052601160045260246000fd5b500390565b634e487b7160e01b600052600160045260246000fd5b6000825162000649818460208701620004ea565b9190910192915050565b602081526000825180602084015262000674816040850160208701620004ea565b601f01601f19169190910160400192915050565b61082b80620006986000396000f3fe60806040526004361061004e5760003560e01c80633659cfe6146100655780634f1ef286146100855780635c60da1b146100985780638f283970146100c9578063f851a440146100e95761005d565b3661005d5761005b6100fe565b005b61005b6100fe565b34801561007157600080fd5b5061005b6100803660046106b5565b610118565b61005b6100933660046106d0565b610155565b3480156100a457600080fd5b506100ad6101bc565b6040516001600160a01b03909116815260200160405180910390f35b3480156100d557600080fd5b5061005b6100e43660046106b5565b6101ed565b3480156100f557600080fd5b506100ad61020d565b610106610269565b6101166101116102fe565b610308565b565b61012061032c565b6001600160a01b0316330361014d5761014a8160405180602001604052806000815250600061035f565b50565b61014a6100fe565b61015d61032c565b6001600160a01b031633036101b4576101af8383838080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506001925061035f915050565b505050565b6101af6100fe565b60006101c661032c565b6001600160a01b031633036101e2576101dd6102fe565b905090565b6101ea6100fe565b90565b6101f561032c565b6001600160a01b0316330361014d5761014a8161038a565b600061021761032c565b6001600160a01b031633036101e2576101dd61032c565b606061025383836040518060600160405280602781526020016107cf602791396103de565b9392505050565b6001600160a01b03163b151590565b61027161032c565b6001600160a01b031633036101165760405162461bcd60e51b815260206004820152604260248201527f5472616e73706172656e745570677261646561626c6550726f78793a2061646d60448201527f696e2063616e6e6f742066616c6c6261636b20746f2070726f78792074617267606482015261195d60f21b608482015260a4015b60405180910390fd5b60006101dd6104bb565b3660008037600080366000845af43d6000803e808015610327573d6000f35b3d6000fd5b60007fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035b546001600160a01b0316919050565b610368836104e3565b6000825111806103755750805b156101af57610384838361022e565b50505050565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f6103b361032c565b604080516001600160a01b03928316815291841660208301520160405180910390a161014a81610523565b60606001600160a01b0384163b6104465760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b60648201526084016102f5565b600080856001600160a01b031685604051610461919061077f565b600060405180830381855af49150503d806000811461049c576040519150601f19603f3d011682016040523d82523d6000602084013e6104a1565b606091505b50915091506104b18282866105cc565b9695505050505050565b60007f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc610350565b6104ec81610605565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6001600160a01b0381166105885760405162461bcd60e51b815260206004820152602660248201527f455243313936373a206e65772061646d696e20697320746865207a65726f206160448201526564647265737360d01b60648201526084016102f5565b807fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035b80546001600160a01b0319166001600160a01b039290921691909117905550565b606083156105db575081610253565b8251156105eb5782518084602001fd5b8160405162461bcd60e51b81526004016102f5919061079b565b6001600160a01b0381163b6106725760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b60648201526084016102f5565b807f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc6105ab565b80356001600160a01b03811681146106b057600080fd5b919050565b6000602082840312156106c757600080fd5b61025382610699565b6000806000604084860312156106e557600080fd5b6106ee84610699565b9250602084013567ffffffffffffffff8082111561070b57600080fd5b818601915086601f83011261071f57600080fd5b81358181111561072e57600080fd5b87602082850101111561074057600080fd5b6020830194508093505050509250925092565b60005b8381101561076e578181015183820152602001610756565b838111156103845750506000910152565b60008251610791818460208701610753565b9190910192915050565b60208152600082518060208401526107ba816040850160208701610753565b601f01601f1916919091016040019291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220bdc71da5b71ee73fb02296dac25d2beabd2e3022ada88705e4e763857deb616564736f6c634300080e0033b53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212203e1d00c7fd3a8429f2ddb0f43b01f5afac183aaaddc82dfcac7274fe1a5107f264736f6c634300080e0033";

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
    name: PromiseOrValue<BytesLike>,
    logicCodeHash: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractDeployer> {
    return super.deploy(
      initRegistry,
      name,
      logicCodeHash,
      overrides || {}
    ) as Promise<ContractDeployer>;
  }
  override getDeployTransaction(
    initRegistry: PromiseOrValue<string>,
    name: PromiseOrValue<BytesLike>,
    logicCodeHash: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      initRegistry,
      name,
      logicCodeHash,
      overrides || {}
    );
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
