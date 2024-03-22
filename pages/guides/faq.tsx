import dynamic from "next/dynamic";
import HeadComponent from "../../common/elements/HeadComponent";
import { Layout } from "@/components/dashboard/layout";
import { Typography } from "@/components/ui/typography";
import QnA from "@/components/guides/question-answer";

const FAQ = () => {
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
              {/* {Questions.map((qna, index) => (
            <QnA key={index} question={qna.question} answer={qna.answer} />
          ))} */}
            </div>

            {/* <Footer /> */}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default FAQ;
