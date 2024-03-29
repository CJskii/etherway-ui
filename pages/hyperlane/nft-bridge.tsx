import NFTBridge from "@/components/nft/bridge";
import { Layout } from "@/components/dashboard/layout";
import HeadComponent from "@/common/elements/HeadComponent";

const HyperlaneNFTBridge = () => {
  const params = {
    contractProvider: { type: "hyperlane", contract: "ONFT" },
    stepDescription: "Bridge hNFT",
  };

  return (
    <Layout className="px-0 pt-24 pb-8 min-h-[90vh]">
      <HeadComponent
        title="Etherway: hNFT Bridge - Cross-Chain Transactions with hNFTs"
        description="Seamlessly bridge hNFTs across multiple chains with Etherway's hNFT Bridge. Discover the power of cross-chain transactions and unlock the potential of decentralized future."
      />
      <NFTBridge params={params} />
    </Layout>
  );
};

export default HyperlaneNFTBridge;
