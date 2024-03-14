declare type GasLimitMap = {
  [chainId: string]: {
    mint: number;
    bridge: number;
    lzOptionsGas?: number;
  };
};

const GAS_LIMIT_JSON = {
  // Mumbai
  "80001": {
    mint: 1000000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },

  // Sepolia
  "11155111": {
    mint: 1000000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },

  // BSC Testnet
  "97": {
    mint: 1000000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },

  // Fuji
  "43113": {
    mint: 1000000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },

  // Blast Testnet
  "168587773": {
    mint: 1000000,
    bridge: 1000000,
    lzOptionsGas: 250000,
  },
};

export default GAS_LIMIT_JSON as GasLimitMap;
