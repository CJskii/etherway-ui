import * as LZ_ONFT_ABI from "./abi/etherwayONFT";
import * as LZ_OFT_ABI from "./abi/etherwayOFT";
import * as HL_ONFT_ABI from "./abi/etherwayHONFT";
import * as HL_OFT_ABI from "./abi/etherwayHOFT";

declare type ContractAddressMap = {
  [chainId: number]: {
    [contract: string]: {
      address: string;
      ABI: any;
    };
  };
};

const LAYERZERO_CONTRACTS = {
  // Mumbai
  80001: {
    ONFT: {
      address: "0x61cF2A58C7E77507A82F25EbB57A27204e295fB7",
      ABI: LZ_ONFT_ABI,
    },
    OFT: {
      address: "0x819a96e119FE37646587434E3e95e5e3755aB105",
      ABI: LZ_OFT_ABI,
    },
  },

  // Sepolia
  11155111: {
    ONFT: {
      address: "0x5b4a7e0003e12B96a0c9a0236C77E59D3Dc517F2",
      ABI: LZ_ONFT_ABI,
    },
    OFT: {
      address: "0xd7a065B689Bf271702d16A50F29015adF6DEAAB5",
      ABI: LZ_OFT_ABI,
    },
  },

  // BSC Testnet
  97: {
    ONFT: {
      address: "0xC370C12c776f7087C4DAD60534B166fac0ac00c2",
      ABI: LZ_ONFT_ABI,
    },
    OFT: {
      address: "0xA03BF3Da9941C2DaEc85fc2bf1f8f3AbC1C4840D",
      ABI: LZ_OFT_ABI,
    },
  },

  // Fuji
  43113: {
    ONFT: {
      address: "0xC370C12c776f7087C4DAD60534B166fac0ac00c2",
      ABI: LZ_ONFT_ABI,
    },
    OFT: {
      address: "0xA03BF3Da9941C2DaEc85fc2bf1f8f3AbC1C4840D",
      ABI: LZ_OFT_ABI,
    },
  },

  // Blast Testnet
  168587773: {
    ONFT: {
      address: "0xC370C12c776f7087C4DAD60534B166fac0ac00c2",
      ABI: LZ_ONFT_ABI,
    },
    OFT: {
      address: "0xA03BF3Da9941C2DaEc85fc2bf1f8f3AbC1C4840D",
      ABI: LZ_OFT_ABI,
    },
  },
};

const HYPERLANE_CONTRACTS = {
  // Mumbai
  80001: {
    ONFT: {
      address: "0x87D276046CF54424a2A01EC0A1dbdCE1E6654C7A",
      ABI: HL_ONFT_ABI,
    },
    OFT: {
      address: "0xcBb0E8a1bdD558DE150a9227F22Dac9e4747D105",
      ABI: HL_OFT_ABI,
    },
  },

  // Sepolia
  11155111: {
    ONFT: {
      address: "0xce03146b0Cec3E5f0A2F2Bd5bF8687CD35A57F3c",
      ABI: HL_ONFT_ABI,
    },
    OFT: {
      address: "0x06abE64EBB2C0c5A5f4C7f11dBDe836b9d468FdC",
      ABI: HL_OFT_ABI,
    },
  },

  // BSC Testnet
  97: {
    ONFT: {
      address: "0xebEb0616C3b82188856cc21E851cf201b62e4004",
      ABI: HL_ONFT_ABI,
    },
    OFT: {
      address: "0x87D276046CF54424a2A01EC0A1dbdCE1E6654C7A",
      ABI: HL_OFT_ABI,
    },
  },

  // Fuji
  43113: {
    ONFT: {
      address: "0xebEb0616C3b82188856cc21E851cf201b62e4004",
      ABI: HL_ONFT_ABI,
    },
    OFT: {
      address: "0x87D276046CF54424a2A01EC0A1dbdCE1E6654C7A",
      ABI: HL_OFT_ABI,
    },
  },
};

const POLYHEDRA_CONTRACTS = {};

const CONTRACT_ADDRESS_JSON = {
  LAYERZERO: LAYERZERO_CONTRACTS,
  HYPERLANE: HYPERLANE_CONTRACTS,
  POLYHEDRA: POLYHEDRA_CONTRACTS,
};

export default CONTRACT_ADDRESS_JSON as ContractAddressMap;
