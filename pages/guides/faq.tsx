import dynamic from "next/dynamic";
import HeadComponent from "../../common/elements/HeadComponent";
import { Layout } from "@/components/dashboard/layout";
import { Typography } from "@/components/ui/typography";
import QnA from "@/components/guides/question-answer";

const FAQ = () => {
  const data = [
    {
      question: "What is Etherway?",
      answer: `Etherway is an omnichain platform that enables users to mint ONFTs, bridge assets across multiple chains, and participate in airdrop hunting. The platform offers a user-friendly interface, low fees, and fast transaction times, making it easy for users to navigate the world of decentralized finance.`,
      step: 1,
    },
    {
      question: "Is it safe to sign in on Etherway?",
      answer: `Yes, it is safe to sign in with your wallet on Etherway. The platform uses secure authentication methods to protect user data and ensure the safety of your assets. Etherway does not store any sensitive information on its servers, and all transactions are processed on the blockchain network.`,
      step: 2,
    },
    {
      question: "What is an ONFT?",
      answer: `ONFT stands for Omnichain Non-Fungible Token. It is a unique digital asset that can be minted through Etherway and bridged across multiple chains. ONFTs are designed to be interoperable, allowing users to access a wide range of chains.`,
      step: 3,
    },
    {
      question: "What is an OFT?",
      answer: ` OFT stands for Omnichain Fungible Token. It is a digital asset that can be minted on Etherway and bridged across multiple chains. OFTs are designed to be interoperable, allowing users to access a wide range of chains.`,
      step: 4,
    },
    {
      question: "What is cross-chain bridging?",
      answer: `Cross-chain bridging is the process of transferring assets from one blockchain to another. Etherway allows users to bridge ONFTs and OFTs across multiple chains, enabling them to seamlessly transfer between various chains.`,
      step: 5,
    },
    {
      question: "What is airdrop hunting?",
      answer: `Airdrop hunting is the process of participating in airdrops to receive free tokens. Etherway offers an airdrop marketplace where users can participate in airdrop hunting and earn rewards for completing tasks.`,
      step: 6,
    },
    {
      question: "What are the perks from XP points?",
      answer: `XP points are earned by interacting with the Etherway platform. Users can earn XP points by minting ONFTs, bridging assets, participating in airdrop hunting, and completing tasks on the platform. XP points can be used to unlock rewards and access exclusive features on Etherway.`,
      step: 7,
    },
    {
      question: "What is Gas Refuel?",
      answer: `Gas Refuel is a feature that allows users to top up their gas fees on all supported networks. Users can deposit native tokens to refill their gas tanks and complete transactions on the network without worrying about running out of gas.`,
      step: 8,
    },
  ];

  return (
    <>
      <HeadComponent
        title="Etherway: FAQ - Get All Your Queries About Etherway's Omnichain Platform, ONFT Minting, and Cross-Chain Bridging Resolved."
        description="Get all your queries about Etherway's omnichain platform, ONFT minting, and cross-chain bridging resolved. Our FAQ section provides detailed answers to help you navigate Etherway with ease."
      />
      <Layout>
        {/* <FaqSection /> */}
        <section className="py-10 bg-base-200 sm:py-16 lg:py-24">
          <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                FAQ
              </h2>
              <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-300">
                Explore the common questions and answers about Etherway
              </p>
            </div>

            <div className="grid grid-cols-1 mt-12 md:mt-20 md:grid-cols-2 gap-y-16 gap-x-20">
              {data.map((item, index) => (
                <QnA
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  step={item.step}
                />
              ))}
            </div>

            {/* <Footer /> */}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default FAQ;
