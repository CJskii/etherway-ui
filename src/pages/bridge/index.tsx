import { Layout } from "@/components/dashboard/layout";
import { SquidBridge } from "@/components/squid/bridge";
import HeadComponent from "@/components/head-component";

const SquidBridgePage = () => {
  return (
    <Layout className="px-0 pt-24 pb-8 min-h-[90vh]">
      <HeadComponent
        title="Etherway: Bridge - Cross-Chain Token Transactions Made Easy"
        description="Explore seamless bridging across multiple blockchains with Etherway. Enhance your digital assets' interoperability and unlock a decentralized future. Start transacting today!"
      />
      <SquidBridge />
    </Layout>
  );
};

export default SquidBridgePage;
