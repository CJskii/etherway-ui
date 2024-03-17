import dynamic from "next/dynamic";
import HeadComponent from "../common/elements/HeadComponent";

const FaqSection = dynamic(() => import("../components/Faq/FaqSection"), {
  loading: () => <span className="loading loading-dots loading-lg"></span>,
  ssr: false,
});

const FAQ = () => {
  return (
    <>
      <HeadComponent
        title="Etherway: FAQ - Get All Your Queries About Etherway's Omnichain Platform, ONFT Minting, and Cross-Chain Bridging Resolved."
        description="Get all your queries about Etherway's omnichain platform, ONFT minting, and cross-chain bridging resolved. Our FAQ section provides detailed answers to help you navigate Etherway with ease."
      />
      <FaqSection />
    </>
  );
};

export default FAQ;
