import NFTBridge from "@/components/nft/bridge";
import { Layout } from "@/components/dashboard/layout";
import HeadComponent from "@/components/head-component";

const ONFTBridge = () => {
  const params = {
    contractProvider: { type: "layerzero", contract: "ONFT" },
    stepDescription: "Bridge ONFT",
  };

  return (
    <Layout className="px-0 pt-24 pb-8 min-h-[90vh]">
      <HeadComponent
        title="Etherway: ONFT Bridge - Cross-Chain Transactions with ONFTs"
        description=" Seamlessly bridge ONFTs across multiple chains with Etherway's ONFT Bridge. Discover the power of cross-chain transactions and unlock the potential of decentralized future."
      />

      <NFTBridge params={params} />
    </Layout>
  );
};

export default ONFTBridge;
