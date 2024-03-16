import NFTBridge from "@/components/nft-bridge";
import { Layout } from "@/components/dashboard/layout";

const ONFTBridge = () => {
  const params = {
    contractProvider: { type: "layerzero", contract: "ONFT" },
    stepDescription: "Bridge ONFT",
  };

  return (
    <Layout className="px-0 pt-24 pb-8 min-h-[90vh]">
      <NFTBridge params={params} />
    </Layout>
  );
};

export default ONFTBridge;
