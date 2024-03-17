import "../styles/globals.css";
import { Inter, Raleway } from "next/font/google";

// import "@fontsource/ibm-plex-mono";
import type { AppProps } from "next/app";
import { GoogleAnalytics } from "@next/third-parties/google";

// import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig, theme } from "../constants/config/wagmiConfig";
// import { WagmiConfig } from "wagmi";

import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import useReferalCode from "../common/hooks/useReferalCode";

import Alert from "../common/elements/Alert";
import { ThemeProvider } from "@/components/ui/theme-provider";
// import Provider from "@/components/dashboard/provider";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

import React from "react";

const queryClient = new QueryClient();

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to Etherway",
});

import { activeChains } from "@/constants/config/chainsConfig";
import Script from "next/script";

export const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

const inter = Inter({ subsets: ["latin"] });

// const Navbar = dynamic(() => import("../common/components/elements/Navbar"), {
//   loading: () => <span className="loading loading-dots loading-lg"></span>,
//   ssr: true,
// });

// const Footer = dynamic(() => import("../common/components/elements/Footer"), {
//   loading: () => <span className="loading loading-dots loading-lg"></span>,
//   ssr: false,
// });

// const alertProps = {
//   title:
//     "Share your thoughts in our quick survey and enter the draw for 50 USDC - it's your chance to make an impact and win!",
//   link: "https://mintly.deform.cc/survey",
// };

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  const router = useRouter();
  useReferalCode(router);
  return (
    <>
      {/* <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
         `}
      </Script> */}
      {/* <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} /> */}

      {/* TODO: Remove wagmi and rainbowkit provider  */}
      {/* Figure out how to pass existing chain setup to thirdweb provider  */}
      <WagmiProvider config={wagmiConfig}>
        <SessionProvider refetchInterval={0} session={pageProps.session}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitSiweNextAuthProvider
              getSiweMessageOptions={getSiweMessageOptions}
            >
              <RainbowKitProvider>
                {/* <ThirdwebProvider
            supportedChains={mainnetChainsThirdWeb}
            clientId={process.env.THIRDWEB_CLIENT_ID || ""}
            supportedWallets={[
              metamaskWallet({ recommended: true }),
              coinbaseWallet(),
              walletConnect(),
              localWallet(),
              embeddedWallet({
                auth: {
                  options: ["email", "google", "apple"],
                },
              }),
              trustWallet(),
              rainbowWallet(),
            ]}
            authConfig={{
              authUrl: "/api/auth",
              domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
            }}
          > */}
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <div className={`${raleway.variable}`}>
                    <Component {...pageProps} />
                  </div>
                </ThemeProvider>
                {/* </ThirdwebProvider> */}
              </RainbowKitProvider>
            </RainbowKitSiweNextAuthProvider>
          </QueryClientProvider>
        </SessionProvider>
      </WagmiProvider>
      {/* <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={theme}>
          <div className="flex flex-col justify-between items-center min-h-screen font-plex-mono">
            <div className="flex flex-col justify-center items-center w-full">
              <Alert {...alertProps} />
              <Navbar />
            </div>

            <main className="flex flex-col justify-center items-center gap-4 py-8 px-4 rounded-lg my-4 w-full min-h-full">
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
        </RainbowKitProvider>
      </WagmiConfig> */}
    </>
  );
}

export default MyApp;
