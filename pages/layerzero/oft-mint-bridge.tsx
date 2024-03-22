import TokenMintAndBridge from "@/components/token-bridge";
import { Layout } from "@/components/dashboard/layout";
import HeadComponent from "@/common/elements/HeadComponent";

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
      <HeadComponent
        title="Etherway: OFT Mint & Bridge - Cross-Chain Transactions with OFTs"
        description="Seamlessly mint and bridge OFTs across multiple chains with Etherway's OFT Mint & Bridge. Discover the power of cross-chain transactions and unlock the potential of decentralized future."
      />
      <TokenMintAndBridge params={params} />
    </Layout>
  );
};

export default OFTMintBridge;
