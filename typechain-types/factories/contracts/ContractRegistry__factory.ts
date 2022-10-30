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
  "0x60806040523480156200001157600080fd5b50604051620032133803806200321383398181016040528101906200003791906200077e565b620000576200004b620000f660201b60201c565b620000fe60201b60201c565b83600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000801b8303620000c7577f436f6e747261637452656769737472790000000000000000000000000000000092505b620000ec8330308585620000e0620000f660201b60201c565b620001c260201b60201c565b50505050620009a6565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff160362000234576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200022b9062000851565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff16036200026d578394505b61270f61ffff168361ffff161115620002bd576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620002b490620008c3565b60405180910390fd5b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090506000600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600089815260200190815260200160002060008360000160008b815260200190815260200160002060009054906101000a900461ffff1661ffff1661ffff168152602001908152602001600020905060008160050154148015620003bb575060008160030160149054906101000a900461ffff1661ffff16145b620003fd576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620003f49062000935565b60405180910390fd5b600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600089815260200190815260200160002060008661ffff1661ffff1681526020019081526020016000209050878160000181905550868160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550858160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550828160030160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550848160030160146101000a81548161ffff021916908361ffff16021790555083816004018190555042816005018190555081600201548260010160008a815260200190815260200160002081905550878260020181905550848260000160008a815260200190815260200160002060006101000a81548161ffff021916908361ffff1602179055508060030160149054906101000a900461ffff1661ffff168160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1682600001547fb8064287be8e96c6334f8cff70015f26aa567834bc9455bdc54f6d163a1013768460020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1685600401546040516200067492919062000979565b60405180910390a45050505050505050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620006b8826200068b565b9050919050565b6000620006cc82620006ab565b9050919050565b620006de81620006bf565b8114620006ea57600080fd5b50565b600081519050620006fe81620006d3565b92915050565b6000819050919050565b620007198162000704565b81146200072557600080fd5b50565b60008151905062000739816200070e565b92915050565b600061ffff82169050919050565b62000758816200073f565b81146200076457600080fd5b50565b60008151905062000778816200074d565b92915050565b600080600080608085870312156200079b576200079a62000686565b5b6000620007ab87828801620006ed565b9450506020620007be8782880162000728565b9350506040620007d18782880162000767565b9250506060620007e48782880162000728565b91505092959194509250565b600082825260208201905092915050565b7f4c6f6769632061646472657373206973206e6564646564000000000000000000600082015250565b600062000839601783620007f0565b9150620008468262000801565b602082019050919050565b600060208201905081810360008301526200086c816200082a565b9050919050565b7f56657273696f6e206d757374206265206c6f776572207468616e203939393900600082015250565b6000620008ab601f83620007f0565b9150620008b88262000873565b602082019050919050565b60006020820190508181036000830152620008de816200089c565b9050919050565b7f416c726561647920726567697374657265642c20757365207570646174650000600082015250565b60006200091d601e83620007f0565b91506200092a82620008e5565b602082019050919050565b6000602082019050818103600083015262000950816200090e565b9050919050565b6200096281620006ab565b82525050565b620009738162000704565b82525050565b600060408201905062000990600083018562000957565b6200099f602083018462000968565b9392505050565b61285d80620009b66000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c80638da5cb5b116100665780638da5cb5b146100f6578063ccd92b4814610114578063e76637ce14610145578063f2fde38b14610163578063ff69bc331461017f57610093565b8063116cce861461009857806340a40e9d146100b4578063715018a6146100d0578063842f95f0146100da575b600080fd5b6100b260048036038101906100ad9190611ca8565b61019d565b005b6100ce60048036038101906100c99190611d35565b610316565b005b6100d8610491565b005b6100f460048036038101906100ef9190611dd7565b6104a5565b005b6100fe61088a565b60405161010b9190611e26565b60405180910390f35b61012e60048036038101906101299190611e41565b6108b3565b60405161013c929190611f83565b60405180910390f35b61014d6108d4565b60405161015a919061205c565b60405180910390f35b61017d6004803603810190610178919061207e565b6108eb565b005b61018761096e565b604051610194919061205c565b60405180910390f35b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036101dc576101d9610985565b90505b6101e4610985565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614806102c15750600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16634f94027061025e610985565b8360006040518463ffffffff1660e01b815260040161027f939291906120f0565b602060405180830381865afa15801561029c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102c09190612153565b5b610300576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102f7906121dd565b60405180910390fd5b61030e86868686868661098d565b505050505050565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361035557610352610985565b90505b61035d610985565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16148061043a5750600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16634f9402706103d7610985565b8360006040518463ffffffff1660e01b81526004016103f8939291906120f0565b602060405180830381865afa158015610415573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104399190612153565b5b610479576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610470906121dd565b60405180910390fd5b61048887878787878787610e44565b50505050505050565b6104996114a7565b6104a36000611525565b565b60006104af610985565b9050600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415801561051a57508073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b610559576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161055090612249565b60405180910390fd5b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090506000600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000868152602001908152602001600020600083600001600088815260200190815260200160002060009054906101000a900461ffff1661ffff1661ffff16815260200190815260200160002090506000816005015403610673576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161066a906122b5565b60405180910390fd5b6106e381600001548260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168360020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168460030160149054906101000a900461ffff1685600401548961098d565b6106ed82866115e9565b600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000868152602001908152602001600020600083600001600088815260200190815260200160002060009054906101000a900461ffff1661ffff1661ffff1681526020019081526020016000206000808201600090556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556002820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556003820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556003820160146101000a81549061ffff02191690556004820160009055600582016000905550508373ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f6467ef979e83be7da4c6bdb4513ae6309dbf5cd9ca8f5474d2f77ef171f5b9038760405161087b91906122e4565b60405180910390a35050505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60006108bd611b4c565b6108c88585856116f3565b91509150935093915050565b60606108e66108e1610985565b61194c565b905090565b6108f36114a7565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610962576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161095990612371565b60405180910390fd5b61096b81611525565b50565b606061098061097b61088a565b61194c565b905090565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16036109fc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109f3906123dd565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1603610a34578394505b61270f61ffff168361ffff161115610a81576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a7890612449565b60405180910390fd5b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090506000600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600089815260200190815260200160002060008360000160008b815260200190815260200160002060009054906101000a900461ffff1661ffff1661ffff168152602001908152602001600020905060008160050154148015610b7e575060008160030160149054906101000a900461ffff1661ffff16145b610bbd576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bb4906124b5565b60405180910390fd5b600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600089815260200190815260200160002060008661ffff1661ffff1681526020019081526020016000209050878160000181905550868160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550858160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550828160030160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550848160030160146101000a81548161ffff021916908361ffff16021790555083816004018190555042816005018190555081600201548260010160008a815260200190815260200160002081905550878260020181905550848260000160008a815260200190815260200160002060006101000a81548161ffff021916908361ffff1602179055508060030160149054906101000a900461ffff1661ffff168160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1682600001547fb8064287be8e96c6334f8cff70015f26aa567834bc9455bdc54f6d163a1013768460020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168560040154604051610e329291906124d5565b60405180910390a45050505050505050565b6000801b8703610e89576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e809061254a565b60405180910390fd5b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090506000600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008a815260200190815260200160002060008360000160008c815260200190815260200160002060009054906101000a900461ffff1661ffff1661ffff16815260200190815260200160002090506000816005015403610fa3576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f9a906125b6565b60405180910390fd5b60008561ffff1603610fd15760018160030160149054906101000a900461ffff16610fce9190612605565b94505b8461ffff168160030160149054906101000a900461ffff1661ffff161061102d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161102490612689565b60405180910390fd5b6000600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008b815260200190815260200160002060008761ffff1661ffff1681526020019081526020016000209050600073ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff161461111657888160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061117e565b8160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b600073ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff16146111fa57878160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550611262565b8160020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b600073ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff16146112de57868160030160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550611346565b8160030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168160030160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b6000801b851461135e5784816004018190555061136c565b816004015481600401819055505b81600001548160000181905550858160030160146101000a81548161ffff021916908361ffff1602179055504281600501819055508060030160149054906101000a900461ffff168360000160008c815260200190815260200160002060006101000a81548161ffff021916908361ffff1602179055508060030160149054906101000a900461ffff1661ffff168160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1682600001547fb8064287be8e96c6334f8cff70015f26aa567834bc9455bdc54f6d163a1013768460020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1685600401546040516114939291906124d5565b60405180910390a450505050505050505050565b6114af610985565b73ffffffffffffffffffffffffffffffffffffffff166114cd61088a565b73ffffffffffffffffffffffffffffffffffffffff1614611523576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161151a906126f5565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000826002015490506000801b836001016000838152602001908152602001600020540361163f576000801b836001016000848152602001908152602001600020819055506000801b83600201819055506116ee565b5b8183600101600083815260200190815260200160002054146116be576000801b81036116a1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161169890612761565b60405180910390fd5b826001016000828152602001908152602001600020549050611640565b82600101600083815260200190815260200160002054836001016000838152602001908152602001600020819055505b505050565b60006116fd611b4c565b61270f61ffff168361ffff16111561177457600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001600086815260200190815260200160002060009054906101000a900461ffff1692505b600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600086815260200190815260200160002060008461ffff1661ffff1681526020019081526020016000206040518060e0016040529081600082015481526020016001820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016003820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016003820160149054906101000a900461ffff1661ffff1661ffff16815260200160048201548152602001600582015481525050905060008160c001510361193f5760009150611944565b600191505b935093915050565b60606000600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020154905060005b6000801b82141580156119ac575061271081105b15611a1a5780806119bc90612781565b915050600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206001016000838152602001908152602001600020549150611998565b600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060020154915060008167ffffffffffffffff811115611a7b57611a7a6127c9565b5b604051908082528060200260200182016040528015611aa95781602001602082028036833780820191505090505b50905060005b82811015611b405783828281518110611acb57611aca6127f8565b5b602002602001018181525050600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160008581526020019081526020016000205493508080611b3890612781565b915050611aaf565b50809350505050919050565b6040518060e0016040528060008019168152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600061ffff16815260200160008019168152602001600081525090565b600080fd5b6000819050919050565b611bed81611bda565b8114611bf857600080fd5b50565b600081359050611c0a81611be4565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611c3b82611c10565b9050919050565b611c4b81611c30565b8114611c5657600080fd5b50565b600081359050611c6881611c42565b92915050565b600061ffff82169050919050565b611c8581611c6e565b8114611c9057600080fd5b50565b600081359050611ca281611c7c565b92915050565b60008060008060008060c08789031215611cc557611cc4611bd5565b5b6000611cd389828a01611bfb565b9650506020611ce489828a01611c59565b9550506040611cf589828a01611c59565b9450506060611d0689828a01611c93565b9350506080611d1789828a01611bfb565b92505060a0611d2889828a01611c59565b9150509295509295509295565b600080600080600080600060e0888a031215611d5457611d53611bd5565b5b6000611d628a828b01611bfb565b9750506020611d738a828b01611c59565b9650506040611d848a828b01611c59565b9550506060611d958a828b01611c59565b9450506080611da68a828b01611c93565b93505060a0611db78a828b01611bfb565b92505060c0611dc88a828b01611c59565b91505092959891949750929550565b60008060408385031215611dee57611ded611bd5565b5b6000611dfc85828601611bfb565b9250506020611e0d85828601611c59565b9150509250929050565b611e2081611c30565b82525050565b6000602082019050611e3b6000830184611e17565b92915050565b600080600060608486031215611e5a57611e59611bd5565b5b6000611e6886828701611bfb565b9350506020611e7986828701611c59565b9250506040611e8a86828701611c93565b9150509250925092565b60008115159050919050565b611ea981611e94565b82525050565b611eb881611bda565b82525050565b611ec781611c30565b82525050565b611ed681611c6e565b82525050565b6000819050919050565b611eef81611edc565b82525050565b60e082016000820151611f0b6000850182611eaf565b506020820151611f1e6020850182611ebe565b506040820151611f316040850182611ebe565b506060820151611f446060850182611ebe565b506080820151611f576080850182611ecd565b5060a0820151611f6a60a0850182611eaf565b5060c0820151611f7d60c0850182611ee6565b50505050565b600061010082019050611f996000830185611ea0565b611fa66020830184611ef5565b9392505050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6000611fe58383611eaf565b60208301905092915050565b6000602082019050919050565b600061200982611fad565b6120138185611fb8565b935061201e83611fc9565b8060005b8381101561204f5781516120368882611fd9565b975061204183611ff1565b925050600181019050612022565b5085935050505092915050565b600060208201905081810360008301526120768184611ffe565b905092915050565b60006020828403121561209457612093611bd5565b5b60006120a284828501611c59565b91505092915050565b6000819050919050565b6000819050919050565b60006120da6120d56120d0846120ab565b6120b5565b611edc565b9050919050565b6120ea816120bf565b82525050565b60006060820190506121056000830186611e17565b6121126020830185611e17565b61211f60408301846120e1565b949350505050565b61213081611e94565b811461213b57600080fd5b50565b60008151905061214d81612127565b92915050565b60006020828403121561216957612168611bd5565b5b60006121778482850161213e565b91505092915050565b600082825260208201905092915050565b7f43616c6c2066726f6d20756e7472757374656420616464726573730000000000600082015250565b60006121c7601b83612180565b91506121d282612191565b602082019050919050565b600060208201905081810360008301526121f6816121ba565b9050919050565b7f496e76616c6964206e65772061646d696e000000000000000000000000000000600082015250565b6000612233601183612180565b915061223e826121fd565b602082019050919050565b6000602082019050818103600083015261226281612226565b9050919050565b7f436f6e7472616374207265636f7264206e6f7420726567697374657265640000600082015250565b600061229f601e83612180565b91506122aa82612269565b602082019050919050565b600060208201905081810360008301526122ce81612292565b9050919050565b6122de81611bda565b82525050565b60006020820190506122f960008301846122d5565b92915050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b600061235b602683612180565b9150612366826122ff565b604082019050919050565b6000602082019050818103600083015261238a8161234e565b9050919050565b7f4c6f6769632061646472657373206973206e6564646564000000000000000000600082015250565b60006123c7601783612180565b91506123d282612391565b602082019050919050565b600060208201905081810360008301526123f6816123ba565b9050919050565b7f56657273696f6e206d757374206265206c6f776572207468616e203939393900600082015250565b6000612433601f83612180565b915061243e826123fd565b602082019050919050565b6000602082019050818103600083015261246281612426565b9050919050565b7f416c726561647920726567697374657265642c20757365207570646174650000600082015250565b600061249f601e83612180565b91506124aa82612469565b602082019050919050565b600060208201905081810360008301526124ce81612492565b9050919050565b60006040820190506124ea6000830185611e17565b6124f760208301846122d5565b9392505050565b7f5265636f7264206e616d65206e65656465640000000000000000000000000000600082015250565b6000612534601283612180565b915061253f826124fe565b602082019050919050565b6000602082019050818103600083015261256381612527565b9050919050565b7f4e6f7420726567697374657265642c2075736520726567697374657200000000600082015250565b60006125a0601c83612180565b91506125ab8261256a565b602082019050919050565b600060208201905081810360008301526125cf81612593565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061261082611c6e565b915061261b83611c6e565b92508261ffff03821115612632576126316125d6565b5b828201905092915050565b7f496e76616c6964206e65772076657273696f6e00000000000000000000000000600082015250565b6000612673601383612180565b915061267e8261263d565b602082019050919050565b600060208201905081810360008301526126a281612666565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b60006126df602083612180565b91506126ea826126a9565b602082019050919050565b6000602082019050818103600083015261270e816126d2565b9050919050565b7f5265636f72644e616d65206e6f7420666f756e6420666f722073656e64657200600082015250565b600061274b601f83612180565b915061275682612715565b602082019050919050565b6000602082019050818103600083015261277a8161273e565b9050919050565b600061278c82611edc565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036127be576127bd6125d6565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fdfea26469706673582212205ecda1eb76a32178eba078d9b036d1226d3e025465ed80dde3dbefca944f803e64736f6c634300080d0033";

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
