import HeadComponent from "../../../common/elements/HeadComponent";
import TokenBridge from "../../../components/Token/TokenBridge";
import { Layout } from "@/components/dashboard/layout";

const OFT = () => {
  return (
    <Layout>
      <HeadComponent
        title="Etherway: OFT Bridge - Bridge Your OFT Tokens Across Multiple Chains"
        description="Etherway's OFT Bridge: Where seamless OFT bridging meets LayerZero's interoperability. Start bridging your OFT tokens across multiple chains effortlessly."
      />
      <TokenBridge contractProvider={{ type: "layerzero", contract: "OFT" }} />
    </Layout>
  );
};

export default OFT;
