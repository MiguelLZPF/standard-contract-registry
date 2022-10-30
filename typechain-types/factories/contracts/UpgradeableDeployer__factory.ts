/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  UpgradeableDeployer,
  UpgradeableDeployerInterface,
} from "../../contracts/UpgradeableDeployer";

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
  "0x60806040523480156200001157600080fd5b506040516200398b3803806200398b8339818101604052810190620000379190620001e9565b620000576200004b6200009f60201b60201c565b620000a760201b60201c565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506200021b565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200019d8262000170565b9050919050565b6000620001b18262000190565b9050919050565b620001c381620001a4565b8114620001cf57600080fd5b50565b600081519050620001e381620001b8565b92915050565b6000602082840312156200020257620002016200016b565b5b60006200021284828501620001d2565b91505092915050565b613760806200022b6000396000f3fe6080604052600436106200009e5760003560e01c80639623609d11620000615780639623609d146200018d57806399a88ec414620001ad578063f2fde38b14620001db578063f3b7dead1462000209578063fee853e0146200024d576200009e565b8063204e1c7a14620000a35780633aa3df6c14620000e7578063715018a614620001155780637eff275e146200012f5780638da5cb5b146200015d575b600080fd5b348015620000b057600080fd5b50620000cf6004803603810190620000c9919062000f35565b6200027b565b604051620000de919062000f8c565b60405180910390f35b348015620000f457600080fd5b506200011360048036038101906200010d9190620011ca565b62000316565b005b3480156200012257600080fd5b506200012d620005a1565b005b3480156200013c57600080fd5b506200015b6004803603810190620001559190620012d5565b620005b9565b005b3480156200016a57600080fd5b506200017562000636565b60405162000184919062000f8c565b60405180910390f35b620001ab6004803603810190620001a591906200131c565b6200065f565b005b348015620001ba57600080fd5b50620001d96004803603810190620001d39190620012d5565b620006e0565b005b348015620001e857600080fd5b5062000207600480360381019062000201919062001397565b6200075d565b005b3480156200021657600080fd5b506200023560048036038101906200022f919062000f35565b620007e7565b60405162000244919062000f8c565b60405180910390f35b3480156200025a57600080fd5b50620002796004803603810190620002739190620013c9565b62000882565b005b60008060008373ffffffffffffffffffffffffffffffffffffffff16604051620002a59062001515565b600060405180830381855afa9150503d8060008114620002e2576040519150601f19603f3d011682016040523d82523d6000602084013e620002e7565b606091505b509150915081620002f757600080fd5b808060200190518101906200030d91906200155d565b92505050919050565b6200032062000c31565b600073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff16036200037b57600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1695505b60008690506000801b8403620003b9578542604051602001620003a092919062001636565b6040516020818303038152906040528051906020012093505b6000620003c96000868962000cb6565b90506000813088604051620003de9062000e9a565b620003ec93929190620016b4565b604051809103906000f08015801562000409573d6000803e3d6000fd5b50905060008273ffffffffffffffffffffffffffffffffffffffff16803b806020016040519081016040528181526000908060200190933c8051906020012090508173ffffffffffffffffffffffffffffffffffffffff1663f2fde38b6200047062000dce565b6040518263ffffffff1660e01b81526004016200048e919062000f8c565b600060405180830381600087803b158015620004a957600080fd5b505af1925050508015620004bb575060015b508973ffffffffffffffffffffffffffffffffffffffff1663116cce868784868986620004e762000dce565b6040518763ffffffff1660e01b81526004016200050a969594939291906200171a565b600060405180830381600087803b1580156200052557600080fd5b505af11580156200053a573d6000803e3d6000fd5b505050508461ffff168273ffffffffffffffffffffffffffffffffffffffff16877e60efd136254ce44bc32bb474aa1526e3a1ac84c0d4473c0b3fb4407c5b747a87856040516200058d92919062001787565b60405180910390a450505050505050505050565b620005ab62000c31565b620005b7600062000dd6565b565b620005c362000c31565b8173ffffffffffffffffffffffffffffffffffffffff16638f283970826040518263ffffffff1660e01b8152600401620005fe919062000f8c565b600060405180830381600087803b1580156200061957600080fd5b505af11580156200062e573d6000803e3d6000fd5b505050505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6200066962000c31565b8273ffffffffffffffffffffffffffffffffffffffff16634f1ef2863484846040518463ffffffff1660e01b8152600401620006a7929190620017b4565b6000604051808303818588803b158015620006c157600080fd5b505af1158015620006d6573d6000803e3d6000fd5b5050505050505050565b620006ea62000c31565b8173ffffffffffffffffffffffffffffffffffffffff16633659cfe6826040518263ffffffff1660e01b815260040162000725919062000f8c565b600060405180830381600087803b1580156200074057600080fd5b505af115801562000755573d6000803e3d6000fd5b505050505050565b6200076762000c31565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620007d9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620007d0906200186f565b60405180910390fd5b620007e48162000dd6565b50565b60008060008373ffffffffffffffffffffffffffffffffffffffff166040516200081190620018e1565b600060405180830381855afa9150503d80600081146200084e576040519150601f19603f3d011682016040523d82523d6000602084013e62000853565b606091505b5091509150816200086357600080fd5b808060200190518101906200087991906200155d565b92505050919050565b6200088c62000c31565b600073ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff1603620008e757600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1696505b600087905060008873ffffffffffffffffffffffffffffffffffffffff1663ccd92b48896200091562000dce565b6127106040518463ffffffff1660e01b8152600401620009389392919062001945565b61010060405180830381865afa15801562000957573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200097d919062001b01565b91505060008160200151905060008190506000801b8703620009fd57888273ffffffffffffffffffffffffffffffffffffffff16803b806020016040519081016040528181526000908060200190933c8342604051602001620009e4949392919062001b99565b6040516020818303038152906040528051906020012096505b600062000a0d6000898c62000cb6565b9050600067ffffffffffffffff81111562000a2d5762000a2c62001009565b5b6040519080825280601f01601f19166020018201604052801562000a605781602001600182028036833780820191505090505b508051906020012089805190602001201462000a895762000a8382828b6200065f565b62000a96565b62000a958282620006e0565b5b60008173ffffffffffffffffffffffffffffffffffffffff16803b806020016040519081016040528181526000908060200190933c8051906020012090508373ffffffffffffffffffffffffffffffffffffffff1663f2fde38b62000afa62000dce565b6040518263ffffffff1660e01b815260040162000b18919062000f8c565b600060405180830381600087803b15801562000b3357600080fd5b505af192505050801562000b45575060015b508c73ffffffffffffffffffffffffffffffffffffffff166340a40e9d8d86858b8d8762000b7262000dce565b6040518863ffffffff1660e01b815260040162000b96979695949392919062001be7565b600060405180830381600087803b15801562000bb157600080fd5b505af115801562000bc6573d6000803e3d6000fd5b505050508761ffff168473ffffffffffffffffffffffffffffffffffffffff168d7fb2ed963efb0fada8bac866bcd62c557839424e7c067263587483165bf5a3dfb8898560405162000c1a92919062001787565b60405180910390a450505050505050505050505050565b62000c3b62000dce565b73ffffffffffffffffffffffffffffffffffffffff1662000c5b62000636565b73ffffffffffffffffffffffffffffffffffffffff161462000cb4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040162000cab9062001cb4565b60405180910390fd5b565b6000808447101562000cff576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040162000cf69062001d26565b60405180910390fd5b600083510362000d46576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040162000d3d9062001d98565b60405180910390fd5b8383516020850187f59050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160362000dc3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040162000dba9062001e0a565b60405180910390fd5b809150509392505050565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6118fe8062001e2d83390190565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062000ee98262000ebc565b9050919050565b600062000efd8262000edc565b9050919050565b62000f0f8162000ef0565b811462000f1b57600080fd5b50565b60008135905062000f2f8162000f04565b92915050565b60006020828403121562000f4e5762000f4d62000eb2565b5b600062000f5e8482850162000f1e565b91505092915050565b600062000f748262000ebc565b9050919050565b62000f868162000f67565b82525050565b600060208201905062000fa3600083018462000f7b565b92915050565b600062000fb68262000f67565b9050919050565b62000fc88162000fa9565b811462000fd457600080fd5b50565b60008135905062000fe88162000fbd565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620010438262000ff8565b810181811067ffffffffffffffff8211171562001065576200106462001009565b5b80604052505050565b60006200107a62000ea8565b905062001088828262001038565b919050565b600067ffffffffffffffff821115620010ab57620010aa62001009565b5b620010b68262000ff8565b9050602081019050919050565b82818337600083830152505050565b6000620010e9620010e3846200108d565b6200106e565b90508281526020810184848401111562001108576200110762000ff3565b5b62001115848285620010c3565b509392505050565b600082601f83011262001135576200113462000fee565b5b813562001147848260208601620010d2565b91505092915050565b6000819050919050565b620011658162001150565b81146200117157600080fd5b50565b60008135905062001185816200115a565b92915050565b600061ffff82169050919050565b620011a4816200118b565b8114620011b057600080fd5b50565b600081359050620011c48162001199565b92915050565b60008060008060008060c08789031215620011ea57620011e962000eb2565b5b6000620011fa89828a0162000fd7565b965050602087013567ffffffffffffffff8111156200121e576200121d62000eb7565b5b6200122c89828a016200111d565b955050604087013567ffffffffffffffff81111562001250576200124f62000eb7565b5b6200125e89828a016200111d565b94505060606200127189828a0162001174565b93505060806200128489828a0162001174565b92505060a06200129789828a01620011b3565b9150509295509295509295565b620012af8162000f67565b8114620012bb57600080fd5b50565b600081359050620012cf81620012a4565b92915050565b60008060408385031215620012ef57620012ee62000eb2565b5b6000620012ff8582860162000f1e565b92505060206200131285828601620012be565b9150509250929050565b60008060006060848603121562001338576200133762000eb2565b5b6000620013488682870162000f1e565b93505060206200135b86828701620012be565b925050604084013567ffffffffffffffff8111156200137f576200137e62000eb7565b5b6200138d868287016200111d565b9150509250925092565b600060208284031215620013b057620013af62000eb2565b5b6000620013c084828501620012be565b91505092915050565b600080600080600080600060e0888a031215620013eb57620013ea62000eb2565b5b6000620013fb8a828b0162000fd7565b97505060206200140e8a828b0162001174565b965050604088013567ffffffffffffffff81111562001432576200143162000eb7565b5b620014408a828b016200111d565b955050606088013567ffffffffffffffff81111562001464576200146362000eb7565b5b620014728a828b016200111d565b9450506080620014858a828b0162001174565b93505060a0620014988a828b01620011b3565b92505060c0620014ab8a828b01620012be565b91505092959891949750929550565b600081905092915050565b7f5c60da1b00000000000000000000000000000000000000000000000000000000600082015250565b6000620014fd600483620014ba565b91506200150a82620014c5565b600482019050919050565b60006200152282620014ee565b9150819050919050565b620015378162000edc565b81146200154357600080fd5b50565b60008151905062001557816200152c565b92915050565b60006020828403121562001576576200157562000eb2565b5b6000620015868482850162001546565b91505092915050565b600081519050919050565b60005b83811015620015ba5780820151818401526020810190506200159d565b83811115620015ca576000848401525b50505050565b6000620015dd826200158f565b620015e98185620014ba565b9350620015fb8185602086016200159a565b80840191505092915050565b6000819050919050565b6000819050919050565b620016306200162a8262001607565b62001611565b82525050565b6000620016448285620015d0565b91506200165282846200161b565b6020820191508190509392505050565b600082825260208201905092915050565b600062001680826200158f565b6200168c818562001662565b93506200169e8185602086016200159a565b620016a98162000ff8565b840191505092915050565b6000606082019050620016cb600083018662000f7b565b620016da602083018562000f7b565b8181036040830152620016ee818462001673565b9050949350505050565b620017038162001150565b82525050565b62001714816200118b565b82525050565b600060c082019050620017316000830189620016f8565b62001740602083018862000f7b565b6200174f604083018762000f7b565b6200175e606083018662001709565b6200176d6080830185620016f8565b6200177c60a083018462000f7b565b979650505050505050565b60006040820190506200179e600083018562000f7b565b620017ad6020830184620016f8565b9392505050565b6000604082019050620017cb600083018562000f7b565b8181036020830152620017df818462001673565b90509392505050565b600082825260208201905092915050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b600062001857602683620017e8565b91506200186482620017f9565b604082019050919050565b600060208201905081810360008301526200188a8162001848565b9050919050565b7ff851a44000000000000000000000000000000000000000000000000000000000600082015250565b6000620018c9600483620014ba565b9150620018d68262001891565b600482019050919050565b6000620018ee82620018ba565b9150819050919050565b6000819050919050565b6000819050919050565b60006200192d620019276200192184620018f8565b62001902565b6200118b565b9050919050565b6200193f816200190c565b82525050565b60006060820190506200195c6000830186620016f8565b6200196b602083018562000f7b565b6200197a604083018462001934565b949350505050565b60008115159050919050565b620019998162001982565b8114620019a557600080fd5b50565b600081519050620019b9816200198e565b92915050565b600080fd5b600081519050620019d5816200115a565b92915050565b600081519050620019ec81620012a4565b92915050565b60008151905062001a038162001199565b92915050565b62001a148162001607565b811462001a2057600080fd5b50565b60008151905062001a348162001a09565b92915050565b600060e0828403121562001a535762001a52620019bf565b5b62001a5f60e06200106e565b9050600062001a7184828501620019c4565b600083015250602062001a8784828501620019db565b602083015250604062001a9d84828501620019db565b604083015250606062001ab384828501620019db565b606083015250608062001ac984828501620019f2565b60808301525060a062001adf84828501620019c4565b60a08301525060c062001af58482850162001a23565b60c08301525092915050565b600080610100838503121562001b1c5762001b1b62000eb2565b5b600062001b2c85828601620019a8565b925050602062001b3f8582860162001a3a565b9150509250929050565b60008160601b9050919050565b600062001b638262001b49565b9050919050565b600062001b778262001b56565b9050919050565b62001b9362001b8d8262000f67565b62001b6a565b82525050565b600062001ba78287620015d0565b915062001bb58286620015d0565b915062001bc3828562001b7e565b60148201915062001bd582846200161b565b60208201915081905095945050505050565b600060e08201905062001bfe600083018a620016f8565b62001c0d602083018962000f7b565b62001c1c604083018862000f7b565b62001c2b606083018762000f7b565b62001c3a608083018662001709565b62001c4960a0830185620016f8565b62001c5860c083018462000f7b565b98975050505050505050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b600062001c9c602083620017e8565b915062001ca98262001c64565b602082019050919050565b6000602082019050818103600083015262001ccf8162001c8d565b9050919050565b7f437265617465323a20696e73756666696369656e742062616c616e6365000000600082015250565b600062001d0e601d83620017e8565b915062001d1b8262001cd6565b602082019050919050565b6000602082019050818103600083015262001d418162001cff565b9050919050565b7f437265617465323a2062797465636f6465206c656e677468206973207a65726f600082015250565b600062001d80602083620017e8565b915062001d8d8262001d48565b602082019050919050565b6000602082019050818103600083015262001db38162001d71565b9050919050565b7f437265617465323a204661696c6564206f6e206465706c6f7900000000000000600082015250565b600062001df2601983620017e8565b915062001dff8262001dba565b602082019050919050565b6000602082019050818103600083015262001e258162001de3565b905091905056fe6080604052604051620018fe380380620018fe833981810160405281019062000029919062000732565b82816200003f828260006200005b60201b60201c565b505062000052826200009e60201b60201c565b50505062000a9a565b6200006c83620000fc60201b60201c565b6000825111806200007a5750805b1562000099576200009783836200015360201b6200034a1760201c565b505b505050565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f620000cf6200018960201b60201c565b82604051620000e0929190620007be565b60405180910390a1620000f981620001ed60201b60201c565b50565b6200010d81620002dd60201b60201c565b8073ffffffffffffffffffffffffffffffffffffffff167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b60405160405180910390a250565b6060620001818383604051806060016040528060278152602001620018d760279139620003b360201b60201c565b905092915050565b6000620001c47fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d610360001b6200049760201b620003771760201c565b60000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036200025f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620002569062000872565b60405180910390fd5b80620002997fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d610360001b6200049760201b620003771760201c565b60000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b620002f381620004a160201b620003811760201c565b62000335576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200032c906200090a565b60405180910390fd5b806200036f7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b6200049760201b620003771760201c565b60000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6060620003c684620004a160201b60201c565b62000408576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620003ff90620009a2565b60405180910390fd5b6000808573ffffffffffffffffffffffffffffffffffffffff168560405162000432919062000a11565b600060405180830381855af49150503d80600081146200046f576040519150601f19603f3d011682016040523d82523d6000602084013e62000474565b606091505b50915091506200048c828286620004c460201b60201c565b925050509392505050565b6000819050919050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b60608315620004d65782905062000529565b600083511115620004ea5782518084602001fd5b816040517f08c379a000000000000000000000000000000000000000000000000000000000815260040162000520919062000a76565b60405180910390fd5b9392505050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620005718262000544565b9050919050565b620005838162000564565b81146200058f57600080fd5b50565b600081519050620005a38162000578565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620005fe82620005b3565b810181811067ffffffffffffffff8211171562000620576200061f620005c4565b5b80604052505050565b60006200063562000530565b9050620006438282620005f3565b919050565b600067ffffffffffffffff821115620006665762000665620005c4565b5b6200067182620005b3565b9050602081019050919050565b60005b838110156200069e57808201518184015260208101905062000681565b83811115620006ae576000848401525b50505050565b6000620006cb620006c58462000648565b62000629565b905082815260208101848484011115620006ea57620006e9620005ae565b5b620006f78482856200067e565b509392505050565b600082601f830112620007175762000716620005a9565b5b815162000729848260208601620006b4565b91505092915050565b6000806000606084860312156200074e576200074d6200053a565b5b60006200075e8682870162000592565b9350506020620007718682870162000592565b925050604084015167ffffffffffffffff8111156200079557620007946200053f565b5b620007a386828701620006ff565b9150509250925092565b620007b88162000564565b82525050565b6000604082019050620007d56000830185620007ad565b620007e46020830184620007ad565b9392505050565b600082825260208201905092915050565b7f455243313936373a206e65772061646d696e20697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b60006200085a602683620007eb565b91506200086782620007fc565b604082019050919050565b600060208201905081810360008301526200088d816200084b565b9050919050565b7f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60008201527f6f74206120636f6e747261637400000000000000000000000000000000000000602082015250565b6000620008f2602d83620007eb565b9150620008ff8262000894565b604082019050919050565b600060208201905081810360008301526200092581620008e3565b9050919050565b7f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f60008201527f6e74726163740000000000000000000000000000000000000000000000000000602082015250565b60006200098a602683620007eb565b915062000997826200092c565b604082019050919050565b60006020820190508181036000830152620009bd816200097b565b9050919050565b600081519050919050565b600081905092915050565b6000620009e782620009c4565b620009f38185620009cf565b935062000a058185602086016200067e565b80840191505092915050565b600062000a1f8284620009da565b915081905092915050565b600081519050919050565b600062000a428262000a2a565b62000a4e8185620007eb565b935062000a608185602086016200067e565b62000a6b81620005b3565b840191505092915050565b6000602082019050818103600083015262000a92818462000a35565b905092915050565b610e2d8062000aaa6000396000f3fe60806040526004361061004e5760003560e01c80633659cfe6146100675780634f1ef286146100905780635c60da1b146100ac5780638f283970146100d7578063f851a440146101005761005d565b3661005d5761005b61012b565b005b61006561012b565b005b34801561007357600080fd5b5061008e60048036038101906100899190610904565b610145565b005b6100aa60048036038101906100a59190610996565b6101ab565b005b3480156100b857600080fd5b506100c1610248565b6040516100ce9190610a05565b60405180910390f35b3480156100e357600080fd5b506100fe60048036038101906100f99190610904565b61029f565b005b34801561010c57600080fd5b506101156102f3565b6040516101229190610a05565b60405180910390f35b6101336103a4565b61014361013e610423565b610432565b565b61014d610458565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff160361019f5761019a816040518060200160405280600081525060006104af565b6101a8565b6101a761012b565b5b50565b6101b3610458565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff160361023a576102358383838080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505060016104af565b610243565b61024261012b565b5b505050565b6000610252610458565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16036102935761028c610423565b905061029c565b61029b61012b565b5b90565b6102a7610458565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16036102e7576102e2816104db565b6102f0565b6102ef61012b565b5b50565b60006102fd610458565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff160361033e57610337610458565b9050610347565b61034661012b565b5b90565b606061036f8383604051806060016040528060278152602001610dd160279139610527565b905092915050565b6000819050919050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b6103ac610458565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1603610419576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161041090610ac9565b60405180910390fd5b6104216105f4565b565b600061042d6105f6565b905090565b3660008037600080366000845af43d6000803e8060008114610453573d6000f35b3d6000fd5b60006104867fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d610360001b610377565b60000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6104b88361064d565b6000825111806104c55750805b156104d6576104d4838361034a565b505b505050565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f610504610458565b82604051610513929190610ae9565b60405180910390a16105248161069c565b50565b606061053284610381565b610571576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161056890610b84565b60405180910390fd5b6000808573ffffffffffffffffffffffffffffffffffffffff16856040516105999190610c1e565b600060405180830381855af49150503d80600081146105d4576040519150601f19603f3d011682016040523d82523d6000602084013e6105d9565b606091505b50915091506105e982828661077c565b925050509392505050565b565b60006106247f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b610377565b60000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b610656816107e3565b8073ffffffffffffffffffffffffffffffffffffffff167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b60405160405180910390a250565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361070b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161070290610ca7565b60405180910390fd5b806107387fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d610360001b610377565b60000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6060831561078c578290506107dc565b60008351111561079f5782518084602001fd5b816040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107d39190610d1c565b60405180910390fd5b9392505050565b6107ec81610381565b61082b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161082290610db0565b60405180910390fd5b806108587f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b610377565b60000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006108d1826108a6565b9050919050565b6108e1816108c6565b81146108ec57600080fd5b50565b6000813590506108fe816108d8565b92915050565b60006020828403121561091a5761091961089c565b5b6000610928848285016108ef565b91505092915050565b600080fd5b600080fd5b600080fd5b60008083601f84011261095657610955610931565b5b8235905067ffffffffffffffff81111561097357610972610936565b5b60208301915083600182028301111561098f5761098e61093b565b5b9250929050565b6000806000604084860312156109af576109ae61089c565b5b60006109bd868287016108ef565b935050602084013567ffffffffffffffff8111156109de576109dd6108a1565b5b6109ea86828701610940565b92509250509250925092565b6109ff816108c6565b82525050565b6000602082019050610a1a60008301846109f6565b92915050565b600082825260208201905092915050565b7f5472616e73706172656e745570677261646561626c6550726f78793a2061646d60008201527f696e2063616e6e6f742066616c6c6261636b20746f2070726f7879207461726760208201527f6574000000000000000000000000000000000000000000000000000000000000604082015250565b6000610ab3604283610a20565b9150610abe82610a31565b606082019050919050565b60006020820190508181036000830152610ae281610aa6565b9050919050565b6000604082019050610afe60008301856109f6565b610b0b60208301846109f6565b9392505050565b7f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f60008201527f6e74726163740000000000000000000000000000000000000000000000000000602082015250565b6000610b6e602683610a20565b9150610b7982610b12565b604082019050919050565b60006020820190508181036000830152610b9d81610b61565b9050919050565b600081519050919050565b600081905092915050565b60005b83811015610bd8578082015181840152602081019050610bbd565b83811115610be7576000848401525b50505050565b6000610bf882610ba4565b610c028185610baf565b9350610c12818560208601610bba565b80840191505092915050565b6000610c2a8284610bed565b915081905092915050565b7f455243313936373a206e65772061646d696e20697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000610c91602683610a20565b9150610c9c82610c35565b604082019050919050565b60006020820190508181036000830152610cc081610c84565b9050919050565b600081519050919050565b6000601f19601f8301169050919050565b6000610cee82610cc7565b610cf88185610a20565b9350610d08818560208601610bba565b610d1181610cd2565b840191505092915050565b60006020820190508181036000830152610d368184610ce3565b905092915050565b7f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60008201527f6f74206120636f6e747261637400000000000000000000000000000000000000602082015250565b6000610d9a602d83610a20565b9150610da582610d3e565b604082019050919050565b60006020820190508181036000830152610dc981610d8d565b905091905056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212203e88ef57d87e6b14b9cf9ca624b1ec20a3e6c886239b474431b5030e73963d5d64736f6c634300080d0033416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212207adeac2d0ae1fdf4a028a28ddfd2a579cf5b366f63e64c3e4a8526e464006aff64736f6c634300080d0033";

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
