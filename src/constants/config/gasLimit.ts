declare type GasLimitMap = {
  [chainId: string]: {
    mint: 500000;
    bridge: number;
    lzOptionsGas?: number;
  };
};

const GAS_LIMIT_JSON = {
  /**
   * TESTNET CHAINS
   */

  // Mumbai
  "80001": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },

  // Sepolia
  "11155111": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },

  // BSC Testnet
  "97": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },

  // Fuji
  "43113": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },

  // Blast Testnet
  "168587773": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },

  /**
   * MAINNET CHAINS
   */

  // OP Mainnet
  "10": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // BSC Mainnet
  "56": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // Meter
  // "82": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
  // Gnosis
  "100": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // Fuse
  // "122": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
  // Polygon
  "137": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // Manta
  "169": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // opBNB
  "204": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // Fantom
  "250": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // zkSync
  "324": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // Astar
  // "592": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
  // Metis
  // "1088": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
  // Polygon-zkEVM
  "1101": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  //CoreDao
  // "1116": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },

  // Moonbeam
  "1284": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // Moonriver
  // "1285": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
  // Tenet
  // "1559": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
  // Kava
  // "2222": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
  2525: {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // Astar-zkEVM
  // "3776": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
  // Mantle
  // "5000": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
  // Canto
  // "7700": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
  // Klaytn
  // "8217": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
  // Base
  "8453": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // Mode
  // "34443": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
  // Arbitrum One
  "42161": {
    mint: 500000,
    bridge: 1500000,
    lzOptionsGas: 250000,
  },
  // Arbitrum-Nova
  // "42170": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
  // Celo
  "42220": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // Avalanche
  "43114": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // Linea
  "59144": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // Blast
  "81457": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // Scroll
  "534352": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // Zora
  "7777777": {
    mint: 500000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
  // Aurora
  // "1313161554":  {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
  // Rarible
  // "1380012617": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
  // Harmony
  // "1666600000": {
  //    mint: 500000,
  //   bridge: 1000000,
  //   lzOptionsGas: 250000,
  // },
};

export default GAS_LIMIT_JSON as GasLimitMap;
