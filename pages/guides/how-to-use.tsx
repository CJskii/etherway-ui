import dynamic from "next/dynamic";
import HeadComponent from "../../common/elements/HeadComponent";
import { Layout } from "@/components/dashboard/layout";
import { Typography } from "@/components/ui/typography";
import QnA from "@/components/guides/question-answer";

const HowToStart = () => {
  const questionData = [
    {
      question: "What are the benefits of using Etherway?",
      answer: `Etherway offers a variety of benefits to users, including the ability to mint NFTs and fungible tokens, bridge assets across multiple chains, participate in airdrop hunting and earn XP points for interactions. The platform also offers a user-friendly interface, low fees, and fast transaction times. Additionally, Etherway provides users with access to a wide range of protocols and chains, allowing them to take advantage of the latest innovations in the blockchain space.`,
      step: 1,
    },
    {
      question: "How do I mint an NFT on Etherway?",
      answer: `Etherway allows users to mint NFTs by following a few simple steps. First log in to the platform by connecting your wallet and verifying ownership. Then, from the navbar select the protocol of your interest and select the chain you want to mint. Finally, click on the mint button to complete the process. You will be presented with a transaction confirmation, which you can approve to complete the minting process. Once this is done, you will be presented with NFT ID that we will need for the next step and you should able to view minted NFT in your wallet.`,
      step: 2,
    },
    {
      question: "How do I bridge my NFT to another chain?",
      answer: `To bridge your NFT to another chain, you will need to have the NFT ID in hand. This is displayed to you after minting or can be found on the explorer. You can either get to this step directly from the minting modal or select it from the navbar. You will be presented with a list of supported chains to bridge to. Select the source chain you will be bridging from, select target network from the dropdown menu and enter NFT ID that you want to bridge and click on the Bridge button. You will be presented with a transaction confirmation, which you can approve to complete the bridging process. Once this is done, your NFT should shortly arrive on the selected chain.`,
      step: 3,
    },
    {
      question: "How do I mint a Fungible Token on Etherway?",
      answer: `Minting a fungible token on Etherway is similar to minting an NFT. First log in to the platform by connecting your wallet and verifying ownership. Then, from the navbar select the protocol of your interest and select the chain you want to mint. Finally, enter the amount of tokens to mint and click on the mint button to complete the process. You will be presented with a transaction confirmation, which you can approve to complete the minting process.`,
      step: 4,
    },
    {
      question: "How do I bridge my Fungible Token to another chain?",
      answer: `To bridge your fungible token to another chain, you will need to follow similar process as for the NFT. The only difference is that you will need to input the amount of tokens to bridge. You will need to select the source chain you will be bridging from, select target network from the dropdown menu, enter amount of tokens that you want to bridge and click on the Bridge button. You will be presented with a transaction confirmation, which you can approve to complete the bridging process. Once this is done, your token should shortly arrive on the selected chain.`,
      step: 5,
    },
    {
      question: "How do I use Gas Refuel on Etherway? (coming soon)",
      answer: `Gas Refuel is a feature that allows users to drop off native token for gas fees on all supported networks. To use Gas Refuel, you will need to navigate to the gas refuel page and follow the instructions provided to top up your gas on destination network. This will allow you to complete transactions on the network without having to worry about running out of gas.`,
      step: 6,
    },
    {
      question:
        "How do I participate in an airdrop marketplace on Etherway? (coming soon)",
      answer: `To participate in airdrop hunting on Etherway, you will need to have a verified account on the platform. You will need to navigate to the user dashboard and follow the instructions provided, complete the necessary steps to increase your odds of receiving rewards. From the dashboard you will be able to keep track of all the tasks that you have participated in and customize it to your liking.`,
      step: 7,
    },
  ];

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
            {questionData.map((data, index) => (
              <QnA
                key={index}
                question={data.question}
                answer={data.answer}
                step={data.step}
              />
            ))}
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
