import * as LZ_ONFT from "./abi/etherwayONFT";
import * as LZ_OFT from "./abi/etherwayOFT";
import * as HL_ONFT from "./abi/etherwayHONFT";
import * as HL_OFT from "./abi/etherwayHOFT";

declare type ContractAddressMap = {
  [protocol: string]: {
    [chainId: string]: {
      [contract: string]: {
        address: string;
        ABI: any;
      };
    };
  };
};

const LAYERZERO_CONTRACTS = {
  // Mumbai
  "80001": {
    ONFT: {
      address: "0x61cF2A58C7E77507A82F25EbB57A27204e295fB7",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x819a96e119FE37646587434E3e95e5e3755aB105",
      ABI: LZ_OFT.abi,
    },
  },

  // Sepolia
  "11155111": {
    ONFT: {
      address: "0x5b4a7e0003e12B96a0c9a0236C77E59D3Dc517F2",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0xd7a065B689Bf271702d16A50F29015adF6DEAAB5",
      ABI: LZ_OFT.abi,
    },
  },

  // BSC Testnet
  "97": {
    ONFT: {
      address: "0xC370C12c776f7087C4DAD60534B166fac0ac00c2",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0xA03BF3Da9941C2DaEc85fc2bf1f8f3AbC1C4840D",
      ABI: LZ_OFT.abi,
    },
  },

  // Fuji
  "43113": {
    ONFT: {
      address: "0xC370C12c776f7087C4DAD60534B166fac0ac00c2",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0xA03BF3Da9941C2DaEc85fc2bf1f8f3AbC1C4840D",
      ABI: LZ_OFT.abi,
    },
  },

  // Blast Testnet
  "168587773": {
    ONFT: {
      address: "0xC370C12c776f7087C4DAD60534B166fac0ac00c2",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0xA03BF3Da9941C2DaEc85fc2bf1f8f3AbC1C4840D",
      ABI: LZ_OFT.abi,
    },
  },

  // MAINNET CHAINS BELOW

  "10": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  "56": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  // "82": {
  //   ONFT: {
  //     address: "0x262EaED1BeB7bEDB62B58ce8B78286E67F838EFD",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0xf3048723631e35D900F192e71A1FdEa112d26513",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  "100": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  // "122": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  "137": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  "169": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  "204": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  "250": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  "324": {
    ONFT: {
      address: "0x826E71f973D0D2Fc9A9ad4Df84E3848d17C3ed44",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0xb9417bC763aEd73dc96fcCB2C837Cb9aaFDdd93E",
      ABI: LZ_OFT.abi,
    },
  },
  // "592": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  // "1088": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  "1101": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  // "1116": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  // "1284": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  // "1285": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  // "1559": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  // "2222": {
  //   ONFT: {
  //     address: "0x744f2b01846d05Fbd1694d36C7d89077B24c3Ea3",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  2525: {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  // "3776": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  // "5000": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  // "7700": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  // "8217": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  "8453": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  // "34443": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  "42161": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  // "42170": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  "42220": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  "43114": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  "59144": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  "81457": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  "534352": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  "7777777": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: LZ_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: LZ_OFT.abi,
    },
  },
  // "1313161554": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  // "1380012617": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
  // "1666600000": {
  //   ONFT: {
  //     address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
  //     ABI: LZ_ONFT.abi,
  //   },
  //   OFT: {
  //     address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
  //     ABI: LZ_OFT.abi,
  //   },
  // },
};

const HYPERLANE_CONTRACTS = {
  // Mumbai
  "80001": {
    ONFT: {
      address: "0x87D276046CF54424a2A01EC0A1dbdCE1E6654C7A",
      ABI: HL_ONFT.abi,
    },
    OFT: {
      address: "0xcBb0E8a1bdD558DE150a9227F22Dac9e4747D105",
      ABI: HL_OFT.abi,
    },
  },

  // Sepolia
  "11155111": {
    ONFT: {
      address: "0xce03146b0Cec3E5f0A2F2Bd5bF8687CD35A57F3c",
      ABI: HL_ONFT.abi,
    },
    OFT: {
      address: "0x06abE64EBB2C0c5A5f4C7f11dBDe836b9d468FdC",
      ABI: HL_OFT.abi,
    },
  },

  // BSC Testnet
  "97": {
    ONFT: {
      address: "0xebEb0616C3b82188856cc21E851cf201b62e4004",
      ABI: HL_ONFT.abi,
    },
    OFT: {
      address: "0x87D276046CF54424a2A01EC0A1dbdCE1E6654C7A",
      ABI: HL_OFT.abi,
    },
  },

  // Fuji
  "43113": {
    ONFT: {
      address: "0xebEb0616C3b82188856cc21E851cf201b62e4004",
      ABI: HL_ONFT.abi,
    },
    OFT: {
      address: "0x87D276046CF54424a2A01EC0A1dbdCE1E6654C7A",
      ABI: HL_OFT.abi,
    },
  },

  // MAINNET BELOW

  "10": {
    ONFT: {
      address: "0x744f2b01846d05Fbd1694d36C7d89077B24c3Ea3",
      ABI: HL_ONFT.abi,
    },
    OFT: {
      address: "0x715bDF3d4989fABe0506d37761C0EE13c908E9Fb",
      ABI: HL_OFT.abi,
    },
  },
  "56": {
    ONFT: {
      address: "0x744f2b01846d05Fbd1694d36C7d89077B24c3Ea3",
      ABI: HL_ONFT.abi,
    },
    OFT: {
      address: "0x715bDF3d4989fABe0506d37761C0EE13c908E9Fb",
      ABI: HL_OFT.abi,
    },
  },
  "100": {
    ONFT: {
      address: "0x744f2b01846d05Fbd1694d36C7d89077B24c3Ea3",
      ABI: HL_ONFT.abi,
    },
    OFT: {
      address: "0x715bDF3d4989fABe0506d37761C0EE13c908E9Fb",
      ABI: HL_OFT.abi,
    },
  },
  "137": {
    ONFT: {
      address: "0x744f2b01846d05Fbd1694d36C7d89077B24c3Ea3",
      ABI: HL_ONFT.abi,
    },
    OFT: {
      address: "0x715bDF3d4989fABe0506d37761C0EE13c908E9Fb",
      ABI: HL_OFT.abi,
    },
  },
  "1101": {
    ONFT: {
      address: "0x4f4f540AB854518fc37DEA8084BB9e2EE0Ba1ac8",
      ABI: HL_ONFT.abi,
    },
    OFT: {
      address: "0x89BAfaD9B675973F374EE541634afb9242d65Ffc",
      ABI: HL_OFT.abi,
    },
  },
  "1284": {
    ONFT: {
      address: "0x715bdf3d4989fabe0506d37761c0ee13c908e9fb",
      ABI: HL_ONFT.abi,
    },
    OFT: {
      address: "0xedEF6BfF33A5d3E8dd3F3C1eD11Fd7bedC5f3bE3",
      ABI: HL_OFT.abi,
    },
  },
  "8453": {
    ONFT: {
      address: "0x744f2b01846d05Fbd1694d36C7d89077B24c3Ea3",
      ABI: HL_ONFT.abi,
    },
    OFT: {
      address: "0x715bDF3d4989fABe0506d37761C0EE13c908E9Fb",
      ABI: HL_OFT.abi,
    },
  },
  "42161": {
    ONFT: {
      address: "0x744f2b01846d05Fbd1694d36C7d89077B24c3Ea3",
      ABI: HL_ONFT.abi,
    },
    OFT: {
      address: "0x715bDF3d4989fABe0506d37761C0EE13c908E9Fb",
      ABI: HL_OFT.abi,
    },
  },
  "42220": {
    ONFT: {
      address: "0x744f2b01846d05Fbd1694d36C7d89077B24c3Ea3",
      ABI: HL_ONFT.abi,
    },
    OFT: {
      address: "0x715bDF3d4989fABe0506d37761C0EE13c908E9Fb",
      ABI: HL_OFT.abi,
    },
  },
  "43114": {
    ONFT: {
      address: "0x744f2b01846d05Fbd1694d36C7d89077B24c3Ea3",
      ABI: HL_ONFT.abi,
    },
    OFT: {
      address: "0x715bDF3d4989fABe0506d37761C0EE13c908E9Fb",
      ABI: HL_OFT.abi,
    },
  },
  "534352": {
    ONFT: {
      address: "0x744f2b01846d05Fbd1694d36C7d89077B24c3Ea3",
      ABI: HL_ONFT.abi,
    },
    OFT: {
      address: "0x715bDF3d4989fABe0506d37761C0EE13c908E9Fb",
      ABI: HL_OFT.abi,
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
