import NFTMint from "@/components/nft/mint";
import { Layout } from "@/components/dashboard/layout";
import HeadComponent from "@/common/elements/HeadComponent";

const ONFTMint = () => {
  const params = {
    contractProvider: { type: "layerzero", contract: "ONFT" },
    stepDescription: "Mint ONFT",
  };

  return (
    <Layout className="px-0 pt-28 pb-16 min-h-[90vh]">
      <HeadComponent
        title="Etherway: Mint - Mint Your ONFTs and Bridge Them Across Multiple Chains"
        description="Etherway's Mint page: Where seamless ONFT creation meets LayerZero's interoperability. Start minting and bridging your ONFTs across multiple chains effortlessly."
      />
      <NFTMint params={params} />
    </Layout>
  );
};

export default ONFTMint;
