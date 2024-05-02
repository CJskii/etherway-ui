import NFTMint from "@/src/components/nft/mint";
import { Layout } from "@/src/components/dashboard/layout";
import HeadComponent from "@/src/components/HeadComponent";

const HyperlaneNFTMint = () => {
  const params = {
    contractProvider: { type: "hyperlane", contract: "ONFT" },
    stepDescription: "Mint hNFT",
  };

  return (
    <Layout className="px-0 pt-28 pb-16 min-h-[90vh]">
      <HeadComponent
        title="Etherway: Mint - Mint Your hNFTs and Bridge Them Across Multiple Chains"
        description="Etherway's Mint page: Where seamless hNFT creation meets Hyperlane's interoperability. Start minting and bridging your Hyperlane NFTs across multiple chains effortlessly."
      />
      <NFTMint params={params} />
    </Layout>
  );
};

export default HyperlaneNFTMint;
