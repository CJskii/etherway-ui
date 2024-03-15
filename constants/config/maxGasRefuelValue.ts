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
};

export default GAS_REFUEL_VALUE_JSON as MaxRefuelMap;
