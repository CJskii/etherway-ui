import { Chain } from "@rainbow-me/rainbowkit";

export const astar: Chain = {
  id: 592,
  name: "Astar",
  // network: "astar-mainnet",
  iconUrl: "/chain-icons/astar.svg",
  iconBackground: "#000000",
  nativeCurrency: {
    name: "Astar",
    symbol: "ASTR",
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ["https://astar.api.onfinality.io/public"] },
    default: { http: ["https://astar.api.onfinality.io/public"] },
  },
  blockExplorers: {
    default: { name: "Astar Subscan", url: "https://astar.subscan.io/" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 761794,
    },
  },
  testnet: false,
};
