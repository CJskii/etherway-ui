import TokenMintAndBridge from "@/components/ui/token-bridge";
import { Layout } from "@/components/dashboard/layout";

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
      <TokenMintAndBridge params={params} />
    </Layout>
  );
};

export default HyperlaneTokenMintBridge;
