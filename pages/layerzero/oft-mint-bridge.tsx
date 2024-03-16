import TokenMintAndBridge from "@/components/token-bridge";
import { Layout } from "@/components/dashboard/layout";

const OFTMintBridge = () => {
  const params = {
    contractProvider: { type: "layerzero", contract: "OFT" },
    headerDescription: "OFT Bridge",
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

export default OFTMintBridge;
