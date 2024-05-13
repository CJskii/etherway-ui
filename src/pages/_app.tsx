import "../styles/globals.css";
import { Raleway } from "next/font/google";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Script from "next/script";

import React, { useEffect } from "react";

import useReferalCode from "../hooks/useReferalCode";
import { Toaster } from "@/src/components/ui/sonner";

import { ThemeProvider } from "@/src/components/ui/theme-provider";

import "@rainbow-me/rainbowkit/styles.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { wagmiConfig, theme } from "../constants/config/wagmiConfig";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

import { AuthContextProvider } from "@/src/context/authContext";

const queryClient = new QueryClient();

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to Etherway",
});

export const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  const router = useRouter();
  useReferalCode(router);

  useEffect(() => {
    document.body.style.pointerEvents = "";
  }, [router.pathname]);

  return (
    <>
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script strategy="lazyOnload" id="google-analytics-init">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
         `}
      </Script>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || ""} />

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
                  <AuthContextProvider>
                    <div className={`${raleway.variable}`}>
                      <Component {...pageProps} />
                      <Toaster richColors />
                    </div>
                  </AuthContextProvider>
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
