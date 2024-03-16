import NFTBridge from "@/components/ui/nft-bridge";
import { Layout } from "@/components/dashboard/layout";

const HyperlaneNFTBridge = () => {
  const params = {
    contractProvider: { type: "hyperlane", contract: "ONFT" },
    stepDescription: "Bridge hNFT",
  };

  return (
    <Layout className="px-0 pt-24 pb-8 min-h-[90vh]">
      <NFTBridge params={params} />
    </Layout>
  );
};

export default HyperlaneNFTBridge;
