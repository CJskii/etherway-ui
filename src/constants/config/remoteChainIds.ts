import layerzero from "@/../assets/dashboard/layerzero.svg";
declare type RemoteChainIds = {
  [chainId: string]: {
    layerzero: string;
    hyperlane: string;
    polyhedra: string;
  };
};

const REMOTE_CHAIN_IDS = {
  /**
   * TESTNET CHAINS
   */

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

  /**
   * MAINNET CHAINS
   */

  // OP Mainnet
  "10": {
    layerzero: "30111",
    hyperlane: "10",
    polyhedra: "",
  },
  // BSC Mainnet
  "56": {
    layerzero: "30102",
    hyperlane: "56",
    polyhedra: "",
  },
  // Meter
  // "82": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
  // Gnosis
  "100": {
    layerzero: "30145",
    hyperlane: "100",
    polyhedra: "",
  },
  // Fuse
  // "122": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
  // Polygon
  "137": {
    layerzero: "30109",
    hyperlane: "137",
    polyhedra: "",
  },
  // Manta
  "169": {
    layerzero: "30217",
    hyperlane: "169",
    polyhedra: "",
  },
  // opBNB
  "204": {
    layerzero: "30202",
    hyperlane: "204",
    polyhedra: "",
  },
  // Fantom
  "250": {
    layerzero: "30112",
    hyperlane: "250",
    polyhedra: "",
  },
  // zkSync
  "324": {
    layerzero: "30165",
    hyperlane: "324",
    polyhedra: "",
  },
  // Astar
  // "592": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
  // Metis
  // "1088": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
  // Polygon-zkEVM
  "1101": {
    layerzero: "30158",
    hyperlane: "1101",
    polyhedra: "",
  },
  //CoreDao
  // "1116": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },

  // Moonbeam
  "1284": {
    layerzero: "40126",
    hyperlane: "1284",
    polyhedra: "",
  },
  // Moonriver
  // "1285": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
  // Tenet
  // "1559": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
  // Injective
  2525: {
    layerzero: "30234",
    hyperlane: "2525",
    polyhedra: "",
  },
  // Kava
  // "2222": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
  // Astar-zkEVM
  // "3776": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
  // Mantle
  // "5000": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
  // Canto
  // "7700": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
  // Klaytn
  // "8217": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
  // Base
  "8453": {
    layerzero: "30184",
    hyperlane: "8453",
    polyhedra: "",
  },
  // Mode
  // "34443": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
  // Arbitrum One
  "42161": {
    layerzero: "30110",
    hyperlane: "42161",
    polyhedra: "",
  },
  // Arbitrum-Nova
  // "42170": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
  // Celo
  "42220": {
    layerzero: "30125",
    hyperlane: "42220",
    polyhedra: "",
  },
  // Avalanche
  "43114": {
    layerzero: "30106",
    hyperlane: "43114",
    polyhedra: "",
  },
  // Linea
  "59144": {
    layerzero: "30183",
    hyperlane: "59144",
    polyhedra: "",
  },
  // Blast
  "81457": {
    layerzero: "30243",
    hyperlane: "81457",
    polyhedra: "",
  },
  // Scroll
  "534352": {
    layerzero: "30214",
    hyperlane: "534352",
    polyhedra: "",
  },
  // Zora
  "7777777": {
    layerzero: "30195",
    hyperlane: "7777777",
    polyhedra: "",
  },
  // Aurora
  // "1313161554":  {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
  // Rarible
  // "1380012617": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
  // Harmony
  // "1666600000": {
  //   layerzero: "",
  //   hyperlane: "",
  //   polyhedra: "",
  // },
};

export default REMOTE_CHAIN_IDS as RemoteChainIds;
