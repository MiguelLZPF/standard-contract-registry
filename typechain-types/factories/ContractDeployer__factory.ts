/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ContractDeployer,
  ContractDeployerInterface,
} from "../ContractDeployer";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
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
        internalType: "bytes30",
        name: "name",
        type: "bytes30",
      },
      {
        internalType: "bytes2",
        name: "version",
        type: "bytes2",
      },
    ],
    name: "deploy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "registry",
        type: "address",
      },
      {
        internalType: "address payable",
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
        internalType: "bytes2",
        name: "version",
        type: "bytes2",
      },
    ],
    name: "upgrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506118b5806100206000396000f3fe60806040523480156200001157600080fd5b50600436106200003a5760003560e01c80633eaa3856146200003f5780637a78dc3e1462000058575b600080fd5b6200005662000050366004620006cb565b6200006f565b005b62000056620000693660046200077a565b62000324565b600a845111620000c15760405162461bcd60e51b815260206004820152601860248201527742797465636f64652063616e6e6f7420626520656d70747960401b60448201526064015b60405180910390fd5b8351602085012082620000fc578442604051602001620000e392919062000857565b6040516020818303038152906040528051906020012092505b60006200010c60008588620004cb565b6040805160008082526020820190925291925050805190602001208580519060200120146200019f5760405163278f794360e11b81526001600160a01b03881690634f1ef28690620001659084908990600401620008a9565b600060405180830381600087803b1580156200018057600080fd5b505af115801562000195573d6000803e3d6000fd5b50505050620001fd565b604051631b2ce7f360e11b81526001600160a01b038281166004830152881690633659cfe690602401600060405180830381600087803b158015620001e357600080fd5b505af1158015620001f8573d6000803e3d6000fd5b505050505b6040516308f2839760e41b81526001600160a01b038281166004830152881690638f28397090602401600060405180830381600087803b1580156200024157600080fd5b505af115801562000256573d6000803e3d6000fd5b505060405163f2fde38b60e01b81523360048201526001600160a01b038a16925063f2fde38b9150602401600060405180830381600087803b1580156200029c57600080fd5b505af1925050508015620002ae575060015b5060405163174441e360e31b81526001600160a01b0389169063ba220f1890620002e6908a90859060009089908990600401620008cf565b600060405180830381600087803b1580156200030157600080fd5b505af115801562000316573d6000803e3d6000fd5b505050505050505050505050565b600a855111620003725760405162461bcd60e51b815260206004820152601860248201527742797465636f64652063616e6e6f7420626520656d70747960401b6044820152606401620000b8565b8451602086012083620003ad5785426040516020016200039492919062000857565b6040516020818303038152906040528051906020012093505b6000620003bd60008689620004cb565b90506000813388604051620003d290620005db565b620003e0939291906200090f565b604051809103906000f080158015620003fd573d6000803e3d6000fd5b5060405163f2fde38b60e01b81523360048201529091506001600160a01b0382169063f2fde38b90602401600060405180830381600087803b1580156200044357600080fd5b505af192505050801562000455575060015b50604051632719d1bf60e11b81526001600160a01b038a1690634e33a37e906200048c90849086908a908a908a90600401620008cf565b600060405180830381600087803b158015620004a757600080fd5b505af1158015620004bc573d6000803e3d6000fd5b50505050505050505050505050565b60008084471015620005205760405162461bcd60e51b815260206004820152601d60248201527f437265617465323a20696e73756666696369656e742062616c616e63650000006044820152606401620000b8565b8251620005705760405162461bcd60e51b815260206004820181905260248201527f437265617465323a2062797465636f6465206c656e677468206973207a65726f6044820152606401620000b8565b8383516020850187f590506001600160a01b038116620005d35760405162461bcd60e51b815260206004820152601960248201527f437265617465323a204661696c6564206f6e206465706c6f79000000000000006044820152606401620000b8565b949350505050565b610f39806200094783390190565b6001600160a01b0381168114620005ff57600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200062a57600080fd5b813567ffffffffffffffff8082111562000648576200064862000602565b604051601f8301601f19908116603f0116810190828211818310171562000673576200067362000602565b816040528381528660208588010111156200068d57600080fd5b836020870160208301376000602085830101528094505050505092915050565b80356001600160f01b031981168114620006c657600080fd5b919050565b60008060008060008060c08789031215620006e557600080fd5b8635620006f281620005e9565b955060208701356200070481620005e9565b9450604087013567ffffffffffffffff808211156200072257600080fd5b620007308a838b0162000618565b955060608901359150808211156200074757600080fd5b506200075689828a0162000618565b935050608087013591506200076e60a08801620006ad565b90509295509295509295565b60008060008060008060c087890312156200079457600080fd5b8635620007a181620005e9565b9550602087013567ffffffffffffffff80821115620007bf57600080fd5b620007cd8a838b0162000618565b96506040890135915080821115620007e457600080fd5b50620007f389828a0162000618565b94505060608701359250608087013561ffff19811681146200081457600080fd5b91506200076e60a08801620006ad565b60005b838110156200084157818101518382015260200162000827565b8381111562000851576000848401525b50505050565b600083516200086b81846020880162000824565b9190910191825250602001919050565b600081518084526200089581602086016020860162000824565b601f01601f19169290920160200192915050565b6001600160a01b0383168152604060208201819052600090620005d3908301846200087b565b6001600160a01b03958616815293909416602084015261ffff199190911660408301526001600160f01b0319166060820152608081019190915260a00190565b6001600160a01b038481168252831660208201526060604082018190526000906200093d908301846200087b565b9594505050505056fe608060405260405162000f3938038062000f39833981016040819052620000269162000507565b82816200005560017f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbd620005e7565b60008051602062000ef2833981519152146200007557620000756200060d565b6200008382826000620000e7565b50620000b3905060017fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6104620005e7565b60008051602062000ed283398151915214620000d357620000d36200060d565b620000de8262000124565b50505062000676565b620000f2836200017f565b600082511180620001005750805b156200011f576200011d8383620001c160201b620002601760201c565b505b505050565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f6200014f620001f0565b604080516001600160a01b03928316815291841660208301520160405180910390a16200017c8162000229565b50565b6200018a81620002de565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6060620001e9838360405180606001604052806027815260200162000f126027913962000381565b9392505050565b60006200021a60008051602062000ed283398151915260001b6200045e60201b620002081760201c565b546001600160a01b0316919050565b6001600160a01b038116620002945760405162461bcd60e51b815260206004820152602660248201527f455243313936373a206e65772061646d696e20697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b80620002bd60008051602062000ed283398151915260001b6200045e60201b620002081760201c565b80546001600160a01b0319166001600160a01b039290921691909117905550565b620002f4816200046160201b6200028c1760201c565b620003585760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b60648201526084016200028b565b80620002bd60008051602062000ef283398151915260001b6200045e60201b620002081760201c565b6060833b620003e25760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b60648201526084016200028b565b600080856001600160a01b031685604051620003ff919062000623565b600060405180830381855af49150503d80600081146200043c576040519150601f19603f3d011682016040523d82523d6000602084013e62000441565b606091505b5090925090506200045482828662000467565b9695505050505050565b90565b3b151590565b6060831562000478575081620001e9565b825115620004895782518084602001fd5b8160405162461bcd60e51b81526004016200028b919062000641565b80516001600160a01b0381168114620004bd57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b83811015620004f5578181015183820152602001620004db565b838111156200011d5750506000910152565b6000806000606084860312156200051d57600080fd5b6200052884620004a5565b92506200053860208501620004a5565b60408501519092506001600160401b03808211156200055657600080fd5b818601915086601f8301126200056b57600080fd5b815181811115620005805762000580620004c2565b604051601f8201601f19908116603f01168101908382118183101715620005ab57620005ab620004c2565b81604052828152896020848701011115620005c557600080fd5b620005d8836020830160208801620004d8565b80955050505050509250925092565b6000828210156200060857634e487b7160e01b600052601160045260246000fd5b500390565b634e487b7160e01b600052600160045260246000fd5b6000825162000637818460208701620004d8565b9190910192915050565b602081526000825180602084015262000662816040850160208701620004d8565b601f01601f19169190910160400192915050565b61084c80620006866000396000f3fe60806040526004361061004e5760003560e01c80633659cfe6146100655780634f1ef286146100855780635c60da1b146100985780638f283970146100c9578063f851a440146100e95761005d565b3661005d5761005b6100fe565b005b61005b6100fe565b34801561007157600080fd5b5061005b6100803660046106d6565b610118565b61005b6100933660046106f1565b61015f565b3480156100a457600080fd5b506100ad6101d0565b6040516001600160a01b03909116815260200160405180910390f35b3480156100d557600080fd5b5061005b6100e43660046106d6565b61020b565b3480156100f557600080fd5b506100ad610235565b610106610292565b610116610111610331565b61033b565b565b61012061035f565b6001600160a01b0316336001600160a01b031614156101575761015481604051806020016040528060008152506000610392565b50565b6101546100fe565b61016761035f565b6001600160a01b0316336001600160a01b031614156101c8576101c38383838080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525060019250610392915050565b505050565b6101c36100fe565b60006101da61035f565b6001600160a01b0316336001600160a01b03161415610200576101fb610331565b905090565b6102086100fe565b90565b61021361035f565b6001600160a01b0316336001600160a01b0316141561015757610154816103bd565b600061023f61035f565b6001600160a01b0316336001600160a01b03161415610200576101fb61035f565b606061028583836040518060600160405280602781526020016107f060279139610411565b9392505050565b3b151590565b61029a61035f565b6001600160a01b0316336001600160a01b031614156101165760405162461bcd60e51b815260206004820152604260248201527f5472616e73706172656e745570677261646561626c6550726f78793a2061646d60448201527f696e2063616e6e6f742066616c6c6261636b20746f2070726f78792074617267606482015261195d60f21b608482015260a4015b60405180910390fd5b60006101fb6104e5565b3660008037600080366000845af43d6000803e80801561035a573d6000f35b3d6000fd5b60007fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035b546001600160a01b0316919050565b61039b8361050d565b6000825111806103a85750805b156101c3576103b78383610260565b50505050565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f6103e661035f565b604080516001600160a01b03928316815291841660208301520160405180910390a16101548161054d565b6060833b6104705760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610328565b600080856001600160a01b03168560405161048b91906107a0565b600060405180830381855af49150503d80600081146104c6576040519150601f19603f3d011682016040523d82523d6000602084013e6104cb565b606091505b50915091506104db8282866105f6565b9695505050505050565b60007f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc610383565b6105168161062f565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6001600160a01b0381166105b25760405162461bcd60e51b815260206004820152602660248201527f455243313936373a206e65772061646d696e20697320746865207a65726f206160448201526564647265737360d01b6064820152608401610328565b807fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035b80546001600160a01b0319166001600160a01b039290921691909117905550565b60608315610605575081610285565b8251156106155782518084602001fd5b8160405162461bcd60e51b815260040161032891906107bc565b803b6106935760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610328565b807f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc6105d5565b80356001600160a01b03811681146106d157600080fd5b919050565b6000602082840312156106e857600080fd5b610285826106ba565b60008060006040848603121561070657600080fd5b61070f846106ba565b9250602084013567ffffffffffffffff8082111561072c57600080fd5b818601915086601f83011261074057600080fd5b81358181111561074f57600080fd5b87602082850101111561076157600080fd5b6020830194508093505050509250925092565b60005b8381101561078f578181015183820152602001610777565b838111156103b75750506000910152565b600082516107b2818460208701610774565b9190910192915050565b60208152600082518060208401526107db816040850160208701610774565b601f01601f1916919091016040019291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220fcee7c9fa17d26e0802da1ea0626feff0bc07fc68bd3a6598d645e52854e9b6a64736f6c634300080a0033b53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220a9f7b9ebe4ffb94bd81c588278e869b25b07244e99811ee216ff7fd6382eef7464736f6c634300080a0033";

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

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractDeployer> {
    return super.deploy(overrides || {}) as Promise<ContractDeployer>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ContractDeployer {
    return super.attach(address) as ContractDeployer;
  }
  connect(signer: Signer): ContractDeployer__factory {
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
