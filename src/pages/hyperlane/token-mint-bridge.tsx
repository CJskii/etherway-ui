import TokenMintAndBridge from "@/src/components/token/mint-bridge";
import { Layout } from "@/src/components/dashboard/layout";
import HeadComponent from "@/src/components/head-component";

const HyperlaneTokenMintBridge = () => {
  const params = {
    contractProvider: { type: "hyperlane", contract: "OFT" },
    headerDescription: "hOFT Bridge",
    stepDescription: {
      mint: "Mint",
      bridge: "Bridge",
    },
  };

  return (
    <Layout className="px-0 pt-24 pb-8 min-h-[90vh]">
      <HeadComponent
        title="Etherway: hOFT Mint & Bridge - Cross-Chain Transactions with hOFTs"
        description="Seamlessly mint and bridge hOFTs across multiple chains with Etherway's hOFT Mint & Bridge. Discover the power of cross-chain transactions and unlock the potential of decentralized future."
      />
      <TokenMintAndBridge params={params} />
    </Layout>
  );
};

export default HyperlaneTokenMintBridge;
