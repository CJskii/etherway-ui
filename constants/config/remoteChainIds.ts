declare type RemoteChainIds = {
  [chainId: string]: {
    layerzero: string;
    hyperlane: string;
    polyhedra: string;
  };
};

const REMOTE_CHAIN_IDS = {
  // Mumbai
  "80001": {
    layerzero: "40109",
    hyperlane: "80001",
    polyhedra: "",
  },

  // Sepolia
  "11155111": {
    layerzero: "40161",
    hyperlane: "11155111",
    polyhedra: "",
  },

  // BSC Testnet
  "97": {
    layerzero: "40102",
    hyperlane: "97",
    polyhedra: "",
  },

  // Fuji
  "43113": {
    layerzero: "40106",
    hyperlane: "43113",
    polyhedra: "",
  },

  // Blast Testnet
  "168587773": {
    layerzero: "40243",
    hyperlane: "",
    polyhedra: "",
  },
};

export default REMOTE_CHAIN_IDS as RemoteChainIds;
