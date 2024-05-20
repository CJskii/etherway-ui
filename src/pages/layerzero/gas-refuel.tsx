import HeadComponent from "@/components/head-component";
import Gas from "@/components/gas/gas-refuel";
import { Layout } from "@/components/dashboard/layout";

const GasRefuel = () => {
  return (
    <Layout className="px-0 pt-24 pb-8 min-h-[90vh]">
      <HeadComponent
        title="Etherway: Gas Refuel Service - Refuel Your Wallet with Native Tokens"
        description="Stay ahead in your blockchain transactions with Etherway's Gas Refuel service. Efficiently manage your gas reserves, ensuring uninterrupted cross-chain activities with LayerZero technology."
      />
      <Gas contractProvider={{ type: "layerzero", contract: "OFT" }} />
    </Layout>
  );
};

export default GasRefuel;
