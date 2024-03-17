export type RpcUrls = {
  http: readonly string[];
  webSocket?: readonly string[];
};

export interface Network {
  id: number;
  network?: string;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    [key: string]: RpcUrls;
    default: RpcUrls;
  };
  iconUrl?: string;
  blockExplorers?: any;
  contracts?: {
    [key: string]: any;
  };
  testnet?: boolean;
  remoteChainId?: number;
  lzEndpointAddress?: string;
  deployedContracts?: DeployedContracts;
  params?: NetworkParams;
}

type NetworkParams = {
  gasLimit: {
    mint: number | string;
    bridge: number | string;
    lzOptionsGas?: number | string;
  };
  layerzero: {
    remoteChainId: number | string;
    maxRefuelGas: number | string;
  };
  hyperlane: {
    remoteChainId: number | string;
    maxRefuelGas: number | string;
  };
  polyhedra: {
    remoteChainId: number | string;
    maxRefuelGas: number | string;
  };
};

type DeployedContracts = {
  layerzero: {
    [key: string]: {
      address: string;
      ABI: any[];
    };
  };
  hyperlane: {
    [key: string]: {
      address: string;
      ABI: any[];
    };
  };
};

// the key will be always there but array might be empty
export type ExtendedNetwork = Network & {
  contractProviders: {
    [key: string]: string[];
  };
};

export interface NetworkModalProps {
  selectedNetwork: Network;
  onNetworkSelect: (network: any) => void;
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  filteredChains: any[];
  dialogId: string;
  onClose: (dialogId: string) => void;
  title: string;
}
