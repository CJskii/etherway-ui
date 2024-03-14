import HeadComponent from "../../common/elements/HeadComponent";
import TokenBridge from "../../components/Token/TokenBridge";
import { Layout } from "@/components/dashboard/layout";

const OFT = () => {
  return (
    <Layout>
      <HeadComponent
        title="Mintly: OFT Bridge - Bridge Your OFT Tokens Across Multiple Chains"
        description="Mintly's OFT Bridge: Where seamless OFT bridging meets LayerZero's interoperability. Start bridging your OFT tokens across multiple chains effortlessly."
      />
      <TokenBridge contractProvider={{ type: "hyperlane", contract: "OFT" }} />
    </Layout>
  );
};

export default OFT;
