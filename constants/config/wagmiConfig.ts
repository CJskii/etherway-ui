import "@rainbow-me/rainbowkit/styles.css";
import { darkTheme, getDefaultConfig } from "@rainbow-me/rainbowkit";
// import { configureChains, createConfig } from "wagmi";
// import { publicProvider } from "wagmi/providers/public";
import "@fontsource/ibm-plex-mono";
import { getSupportedChains } from "./chainsConfig";
import { mainnet, polygon } from "viem/chains";

const customChains = getSupportedChains();

export const theme = darkTheme({
  accentColor: "#ff57b6",
  accentColorForeground: "#181920",
  borderRadius: "small",
  fontStack: "system",
  overlayBlur: "small",
});

// export const { chains, publicClient, webSocketPublicClient } = configureChains(
//   [...customChains],
//   [publicProvider()],
// );

// const { connectors } = getDefaultWallets({
//   appName: process.env.NEXT_PUBLIC_WALLETCONNECT_APP_NAME || "",
//   projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
//   chains,
// });

const chains = [mainnet, polygon];

console.log(mainnet);

export const wagmiConfig = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

// export const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors,
//   publicClient,
//   webSocketPublicClient,
// });
