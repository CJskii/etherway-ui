import "@rainbow-me/rainbowkit/styles.css";
import { darkTheme, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { getSupportedChains } from "./chainsConfig";

const customChains = getSupportedChains();

export const theme = darkTheme({
  accentColor: "#FF8F8F",
  accentColorForeground: "#181920",
  borderRadius: "small",
  fontStack: "system",
  overlayBlur: "small",
});

export const wagmiConfig = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_WALLETCONNECT_APP_NAME || "",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: customChains as any,
  ssr: true,
});
