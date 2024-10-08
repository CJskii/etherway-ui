import { Chain } from "@rainbow-me/rainbowkit";

export const kava: Chain = {
  id: 2222,
  name: "Kava EVM",
  // network: "kava-mainnet",
  iconUrl: "/chain-icons/kava.svg",
  iconBackground: "#000000",
  nativeCurrency: {
    name: "Kava",
    symbol: "KAVA",
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ["https://kava-evm.publicnode.com"] },
    default: { http: ["https://kava-evm.publicnode.com"] },
  },
  blockExplorers: {
    default: { name: "Kava EVM Explorer", url: "https://kavascan.com/" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 3661165,
    },
  },
  testnet: false,
};
