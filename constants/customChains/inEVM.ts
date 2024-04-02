import { Chain } from "@rainbow-me/rainbowkit";

export const inEVM: Chain = {
  id: 2525,
  name: "inEVM",
  iconUrl: "/chain-icons/inEVM.svg",
  iconBackground: "#000000",
  nativeCurrency: {
    name: "Injective",
    symbol: "INJ",
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ["https://mainnet.rpc.inevm.com/http"] },
    default: { http: ["https://mainnet.rpc.inevm.com/http"] },
  },
  blockExplorers: {
    default: {
      name: "Injective EVM Explorer",
      url: "https://explorer.inevm.com/",
    },
  },
  testnet: false,
};
