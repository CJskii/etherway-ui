import dynamic from "next/dynamic";
import HeadComponent from "../../common/elements/HeadComponent";

const Gas = dynamic(() => import("../../components/gas-refuel"), {
  loading: () => <span className="loading loading-dots loading-lg"></span>,
  ssr: true,
});

const GasRefuel = () => {
  return (
    <>
      <HeadComponent
        title="Etherway: Gas Refuel Service - Refuel Your Wallet with Native Tokens"
        description="Stay ahead in your blockchain transactions with Etherway's Gas Refuel service. Efficiently manage your gas reserves, ensuring uninterrupted cross-chain activities with LayerZero technology."
      />
      <Gas contractProvider={{ type: "layerzero", contract: "OFT" }} />
    </>
  );
};

export default GasRefuel;
