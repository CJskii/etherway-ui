import NFTBridge from "@/components/nft/bridge";
import { Layout } from "@/components/dashboard/layout";
import HeadComponent from "@/common/elements/HeadComponent";
import { SquidRouterIFrame } from "@/common/utils/squid";
import { Button } from "@/components/ui/button";
import { useAccount, useWalletClient } from "wagmi";
import { RouteRequest } from "@0xsquid/squid-types";
import {
  RouteType,
  executeSquidRoute,
  getSquidChains,
  getSquidRoute,
  getSquidTokens,
} from "@/common/utils/squid/squidRouter";
import { useState } from "react";
import getProviderOrSigner from "@/common/utils/getters/getProviderOrSigner";
import { Signer } from "ethers";

const SquidBridge = () => {
  const { address } = useAccount();
  const [route, setRoute] = useState<RouteType | undefined>();
  // const { data: walletClient } = useWalletClient();

  const params = {
    contractProvider: { type: "layerzero", contract: "ONFT" },
    stepDescription: "Bridge ONFT",
  };

  const routeParams: RouteRequest = {
    fromChain: "43114", // Avalanche
    fromAmount: "10000000000000000", // 0.1 AVAX
    fromToken: "0xEEeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    toChain: "137", // Polygon
    toToken: "0xEEeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    fromAddress: address,
    toAddress: address,
    slippageConfig: {
      autoMode: 1,
    },
  };
  console.log(routeParams);

  return (
    <Layout className="px-0 pt-24 pb-8 min-h-[90vh]">
      <HeadComponent
        title="Etherway: ONFT Bridge - Cross-Chain Transactions with ONFTs"
        description=" Seamlessly bridge ONFTs across multiple chains with Etherway's ONFT Bridge. Discover the power of cross-chain transactions and unlock the potential of decentralized future."
      />
      {/* <SquidRouterIFrame /> */}
      <div className="z-10 py-20 md:py-16 flex items-center justify-center min-h-[90vh]">
        <Button
          onClick={async () => {
            const _route = await getSquidRoute(routeParams);
            if (_route) {
              setRoute(_route);
            }
          }}
        >
          Get Squid Route
        </Button>
        <Button
          onClick={async () => {
            if (route) {
              const signer = (await getProviderOrSigner(true)) as Signer;
              const _route = await executeSquidRoute(route, signer);
            }
          }}
        >
          Execute
        </Button>
        <br />

        <Button
          onClick={async () => {
            console.log(await getSquidTokens());
            console.log(await getSquidChains());
          }}
        >
          Get
        </Button>
      </div>
    </Layout>
  );
};

export default SquidBridge;
