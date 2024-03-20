import dynamic from "next/dynamic";
import HeadComponent from "../../common/elements/HeadComponent";
import { Layout } from "@/components/dashboard/layout";
import { Typography } from "@/components/ui/typography";
import QnA from "@/components/guides/question-answer";
import FaqSection from "@/components/Faq/FaqSection";

const FAQ = () => {
  return (
    <>
      <HeadComponent
        title="Etherway: FAQ - Get All Your Queries About Etherway's Omnichain Platform, ONFT Minting, and Cross-Chain Bridging Resolved."
        description="Get all your queries about Etherway's omnichain platform, ONFT minting, and cross-chain bridging resolved. Our FAQ section provides detailed answers to help you navigate Etherway with ease."
      />
      <Layout>
        <FaqSection />
      </Layout>
    </>
  );
};

export default FAQ;
