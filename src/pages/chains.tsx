import { activeChains } from "../constants/config/chainsConfig";
import Image, { StaticImageData } from "next/image";
import { useAccount } from "wagmi";
import HeadComponent from "../components/head-component";
import { Layout } from "@/components/dashboard/layout";
import { Typography } from "@/components/ui/typography";
import ellipseCurved from "@/../assets/ellipse-curved.svg";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

interface ChainDetailCardProps {
  name: string;
  image: string | StaticImageData;
  nativeCurrency: string;
  exploreURL: string;
}

const Chains = () => {
  const account = useAccount();

  return (
    <>
      <HeadComponent
        title="Etherway: Supported Chains - Discover the Wide Range of Blockchain Networks Supported by Etherway."
        description="Discover the wide range of blockchain networks supported by Etherway, designed for seamless cross-chain interoperability. Dive into the details of each chain, understanding their unique offerings and native currencies for smarter cross-chain interactions."
      />
      <Layout
        className="py-24 md:w-11/12 mx-auto min-h-[90vh] "
        showGrid={false}
        showGradient={false}
      >
        <div className=" ">
          <div className="flex items-center md:justify-between md:flex-row flex-col">
            <div className="z-10 space-y-6 p-3 md:p-16">
              <Typography className="max-w-xs text-4xl font-bold leading-snug tracking-wide md:max-w-3xl md:text-6xl md:leading-none">
                Supported <span className="text-secondary">Chains</span>{" "}
              </Typography>
              <Typography
                variant={"paragraph"}
                className=" md:max-w-xl text-lg"
              >
                Explore the wide range of blockchain networks supported by
                Etherway, designed for seamless cross-chain interoperability.
              </Typography>
              <div className="flex gap-2">
                <Link href={"/layerzero/onft-mint"}>
                  <Button
                    variant={"etherway"}
                    className="md:w-32"
                    // href={"/dashboard"}
                  >
                    LayerZero
                  </Button>
                </Link>
                <Link href={"/hyperlane/nft-mint"}>
                  <Button
                    variant={"etherway"}
                    className="md:w-32"
                    // href={"/dashboard"}
                  >
                    Hyperlane
                  </Button>
                </Link>
                {/* <Button
                  variant={"etherway"}
                  className="md:w-32"
                  // href={"/dashboard"}
                >
                  Polyhedra
                </Button> */}
              </div>
            </div>
            <div className=" relative">
              <Image src={ellipseCurved} alt="ellipseCurved" />
              <DashboardCard className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/30 rounded-full flex flex-col items-center justify-center w-60 h-60 md:h-72 md:w-72">
                <Typography className="max-w-xs text-4xl font-bold leading-snug tracking-wide md:max-w-3xl md:text-6xl md:leading-none">
                  {activeChains.length}
                </Typography>
                <Typography variant={"paragraph"}>supported Chains</Typography>
              </DashboardCard>
            </div>
          </div>
        </div>
        <div className=" pb-24 pt-12  grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {activeChains.map((chain, idx) => (
            <div key={idx}>
              <ChainDetailCard
                image={chain.iconUrl ? chain.iconUrl : "/placeholder.png"}
                name={chain.name}
                nativeCurrency={chain.nativeCurrency.symbol}
                exploreURL={
                  account.address
                    ? `${chain.blockExplorers.default.url}/address/${account.address}`
                    : chain.blockExplorers.default.url
                }
              />
            </div>
          ))}
        </div>
      </Layout>
    </>
  );
};

export default Chains;

export const ChainDetailCard = ({
  image,
  name,
  nativeCurrency,
  exploreURL,
}: ChainDetailCardProps) => {
  return (
    <Card className=" bg-primary p-6 space-y-8">
      <div className=" flex items-center gap-3">
        <Avatar>
          <Image src={image as string} alt="logo" width={100} height={100} />
          <AvatarFallback className=" capitalize">
            {name[0] + name[1]}
          </AvatarFallback>
        </Avatar>
        <Typography variant={"large"} className="text-center">
          {name}
        </Typography>
      </div>
      <div className=" flex w-full items-center justify-between">
        <Typography variant={"smallTitle"}>
          Native currency: {nativeCurrency}
        </Typography>
        <Link
          href={exploreURL}
          target="_blank"
          className={cn(
            `${buttonVariants({ variant: "default", size: "sm" })} dark:bg-black dark:text-white dark:hover:bg-black/90 rounded-xl`,
          )}
        >
          Explore
        </Link>
      </div>
    </Card>
  );
};
