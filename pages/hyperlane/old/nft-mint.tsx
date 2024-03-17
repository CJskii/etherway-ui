import type { NextPage } from "next";
import Minting from "../../../components/Minter/Minting";
import HeadComponent from "../../../common/elements/HeadComponent";
import { Layout } from "@/components/dashboard/layout";

const Mint: NextPage = () => {
  return (
    <Layout>
      <div className=" py-20 ">
        <HeadComponent
          title="Etherway: Mint - Mint Your ONFTs and Bridge Them Across Multiple Chains"
          description="Etherway's Mint page: Where seamless ONFT creation meets LayerZero's interoperability. Start minting and bridging your ONFTs across multiple chains effortlessly."
        />
        <Minting
          contractProvider={{ type: "hyperlane", contract: "ONFT" }}
          stepDescription="Mint hNFT"
        />
      </div>
    </Layout>
  );
};

export default Mint;
