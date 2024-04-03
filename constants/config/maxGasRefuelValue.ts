import layerzero from "@/assets/dashboard/layerzero.svg";
declare type MaxRefuelMap = {
  [chainId: string]: {
    layerzero: number;
    hyperlane: number;
    polyhedra: number;
  };
};

// Max refuel values for each chain
// These values are used to render the MAX button in the refuel component
// The values are in ether

const GAS_REFUEL_VALUE_JSON = {
  // Mumbai
  "80001": {
    layerzero: 1,
    hyperlane: 1,
    polyhedra: 1,
  },

  // Sepolia
  "11155111": {
    layerzero: 1,
    hyperlane: 1,
    polyhedra: 1,
  },

  // BSC Testnet
  "97": {
    layerzero: 1,
    hyperlane: 1,
    polyhedra: 1,
  },

  // Fuji
  "43113": {
    layerzero: 1,
    hyperlane: 1,
    polyhedra: 1,
  },

  // Blast Testnet
  "168587773": {
    layerzero: 1,
    hyperlane: 1,
    polyhedra: 1,
  },

  /**
   * MAINNET CHAINS
   */

  // OP Mainnet
  "10": {
    layerzero: 0.2,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // BSC Mainnet
  "56": {
    layerzero: 1.2,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // Meter
  // "82": {
  //    layerzero: 0.05,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
  // Gnosis
  "100": {
    layerzero: 0.05,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // Fuse
  // "122": {
  //    layerzero: 0.05,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
  // Polygon
  "137": {
    layerzero: 600,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // Manta
  "169": {
    layerzero: 0.05,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // opBNB
  "204": {
    layerzero: 0.05,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // Fantom
  "250": {
    layerzero: 600,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // zkSync
  "324": {
    layerzero: 0.05,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // Astar
  // "592": {
  //    layerzero: 0.05,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
  // Metis
  // "1088": {
  //    layerzero: 0.05,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
  // Polygon-zkEVM
  "1101": {
    layerzero: 0.02,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  //CoreDao
  // "1116": {
  //    layerzero: 0.25,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },

  // Moonbeam
  "1284": {
    layerzero: 8,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // Moonriver
  // "1285": {
  //    layerzero: 0.05,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
  // Tenet
  // "1559": {
  //    layerzero: 0.05,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
  // Kava
  // "2222": {
  //    layerzero: 1,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
  2525: {
    layerzero: 0.05,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // Astar-zkEVM
  // "3776": {
  //    layerzero: 500000,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
  // Mantle
  // "5000": {
  //    layerzero: 0.2,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
  // Canto
  // "7700": {
  //    layerzero: 0.95,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
  // Klaytn
  // "8217": {
  //    layerzero: 0.05,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
  // Base
  "8453": {
    layerzero: 0.05,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // Mode
  // "34443": {
  //    layerzero: 500000,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
  // Arbitrum One
  "42161": {
    layerzero: 0.2,
    hyperlane: 1500000,
    polyhedra: 250000,
  },
  // Arbitrum-Nova
  // "42170": {
  //    layerzero: 0.05,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
  // Celo
  "42220": {
    layerzero: 0.05,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // Avalanche
  "43114": {
    layerzero: 15,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // Linea
  "59144": {
    layerzero: 0.05,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // Blast
  "81457": {
    layerzero: 0.05,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // Scroll
  "534352": {
    layerzero: 0.02,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // Zora
  "7777777": {
    layerzero: 0.05,
    hyperlane: 1000000,
    polyhedra: 250000,
  },
  // Aurora
  // "1313161554":  {
  //    layerzero: 0.05,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
  // Rarible
  // "1380012617": {
  //    layerzero: 500000,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
  // Harmony
  // "1666600000": {
  //    layerzero: 8,
  //   hyperlane: 1000000,
  //   polyhedra: 250000,
  // },
};

export default GAS_REFUEL_VALUE_JSON as MaxRefuelMap;
