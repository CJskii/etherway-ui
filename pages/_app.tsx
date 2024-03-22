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
import { Toaster } from "@/components/ui/sonner";

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

export const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

const inter = Inter({ subsets: ["latin"] });

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

      <WagmiProvider config={wagmiConfig}>
        <SessionProvider refetchInterval={0} session={pageProps.session}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitSiweNextAuthProvider
              getSiweMessageOptions={getSiweMessageOptions}
            >
              <RainbowKitProvider theme={theme}>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <div className={`${raleway.variable}`}>
                    <Component {...pageProps} />
                    <Toaster richColors />
                  </div>
                </ThemeProvider>
              </RainbowKitProvider>
            </RainbowKitSiweNextAuthProvider>
          </QueryClientProvider>
        </SessionProvider>
      </WagmiProvider>
    </>
  );
}

export default MyApp;
