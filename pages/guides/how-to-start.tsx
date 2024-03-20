import dynamic from "next/dynamic";
import HeadComponent from "../../common/elements/HeadComponent";
import { Layout } from "@/components/dashboard/layout";
import { Typography } from "@/components/ui/typography";
import QnA from "@/components/guides/question-answer";

const HowToStart = () => {
  return (
    <Layout
      className="py-24 md:w-11/12 mx-auto min-h-[90vh]"
      showGrid={true}
      showGradient={true}
    >
      <HeadComponent
        title="Getting Started with Etherway - Your Guide to ONFT Minting and Cross-Chain Transactions"
        description="Begin your journey with Etherway's innovative omnichain platform. Learn how to mint ONFTs, engage in cross-chain bridging, and unlock the potential of decentralized finance. Discover step-by-step instructions and expert tips to navigate the Etherway ecosystem."
      />

      {/* <div className="flex items-center md:justify-between md:flex-row flex-col">  </div> */}
      <div className="z-10 space-y-6 p-3 md:p-16">
        <Typography
          variant="h1"
          className="max-w-xs text-4xl font-bold leading-snug tracking-wide md:max-w-3xl md:text-6xl md:leading-none"
        >
          How to use <span className="text-secondary">Etherway</span>
        </Typography>
        <Typography variant={"paragraph"} className=" md:max-w-xl text-lg">
          Your Guide to ONFT Minting and Cross-Chain Transactions
        </Typography>

        {/* Video PLACEHOLDER */}
        {/* <div className="flex justify-center items-center bg-black rounded-xl mb-8">
          <div className="text-white text-center">
            <video controls width="750" className="rounded-xl">
              <source src="path-to-video" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div> */}

        <div className="mb-8">
          <Typography variant="h3" className="text-left mb-4">
            Written Guide
          </Typography>

          <div className="flex flex-col gap-8">
            <QnA
              question="What is Etherway and what does it offer to users?"
              answer="Etherway is a platform that helps users to be eligible for a variety of upcoming airdrops. It offers utilities like NFT minting, NFT bridging, and tokens across over 40 chains, utilizing the latest cross chain technology."
              step={1}
            />
            {/* <QnA
              question="How does Etherway integrate with blockchain technologies?"
              answer="Etherway is an omnichain solution that leverages Layerzero V2 and Hyperlane technologies. Its primary focus is to facilitate transactions of OFT (Omnichain Fungible Tokens) and ONFT (Omnichain Non-Fungible Tokens) across more than 40 different networks, ensuring a smooth user experience through a mobile-friendly UI and a supportive community."
              step={2}
            /> */}
            <QnA
              question="What are the key features of Etherway?"
              answer="Etherway offers a variety of features, including ONFT minting, cross-chain bridging, and the ability to participate in airdrops. It also provides a user-friendly interface, a supportive community, and a mobile-friendly UI."
              step={3}
            />
          </div>
        </div>
      </div>

      {/* <div className="flex justify-center items-center">
        <Typography variant="h4" className="text-center">
          Placeholder
        </Typography>
      </div> */}
    </Layout>
  );
};

export default HowToStart;
