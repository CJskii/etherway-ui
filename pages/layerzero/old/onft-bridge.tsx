import { useRouter } from "next/router";
// import Bridging from "../components/Bridge/Bridging";
import dynamic from "next/dynamic";
import HeadComponent from "../../../common/elements/HeadComponent";
import { Layout } from "@/components/dashboard/layout";

const Bridging = dynamic(() => import("../../../components/Bridge/Bridging"), {
  loading: () => <span className="loading loading-dots loading-lg"></span>,
  ssr: true,
});

const ONFTBridge = () => {
  const router = useRouter();
  let nftId = router.query.nftId?.toString() || "";
  const mintNetwork = router.query.network?.toString() || "";

  return (
    <Layout>
      <HeadComponent
        title="Mintly: ONFT Bridge - Seamlessly Bridge Your Omnichain Non-Fungible Tokens (ONFTs) with Mintly's Advanced ONFT Bridge"
        description="Seamlessly bridge your Omnichain Non-Fungible Tokens (ONFTs) with Mintly's advanced ONFT Bridge. Experience the ease of cross-chain transfers, enhancing your digital asset's interoperability through LayerZero."
      />
      <Bridging
        passedNftId={nftId}
        mintNetwork={mintNetwork}
        contractProvider={{ type: "layerzero", contract: "ONFT" }}
        stepDescription={"Bridge ONFT"}
      />
    </Layout>
  );
};

export default ONFTBridge;
