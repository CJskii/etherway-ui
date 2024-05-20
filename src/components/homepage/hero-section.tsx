import ellipse1 from "@/../assets/ellipse1.svg";
import ellipse2 from "@/../assets/ellipse2.svg";
import layerzero from "@/../assets/layerzero-logo.svg";
import hyperlane from "@/../assets/hyperlane-logo.svg";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { Typography } from "../ui/typography";
import { Button } from "../ui/button";
import Link from "next/link";
import hyperlaneGroup from "@/../assets/homepage-background/hyperlane-group.svg";
import layerzeroGroup from "@/../assets/homepage-background/layerzero-group.svg";
import bridgeGroup from "@/../assets/homepage-background/bridge-group.svg";
import refuelGroup from "@/../assets/homepage-background/refuel-group.svg";
import { ChevronRight } from "lucide-react";

const products = [
  {
    title: "LayerZero",
    description: "Mint NFTs on Ethereum",
    link: "/layerzero/onft-mint",
    bg: "bg-primary",
  },
  {
    title: "Hyperlane",
    description: "Mint NFTs on Solana",
    link: "/hyperlane/nft-mint",
    bg: "bg-secondary",
  },
  {
    title: "Gas Refuel",
    description: "Refuel your gas on Ethereum",
    link: "/layerzero/gas-refuel",
    bg: "bg-secondary",
  },
  {
    title: "Bridge",
    description: "Cross-chain bridge",
    link: "/bridge",
    bg: "bg-primary",
  },
];

export default function HeroSection() {
  return (
    <div className="flex min-h-screen flex-col justify-start pt-20 md:justify-between md:pt-28">
      <Image
        src={ellipse1}
        alt="ellipse1"
        className="absolute right-0 z-0 mt-16 h-auto w-9/12 md:-mt-16 md:w-3/12"
      />
      <Image
        src={ellipse2}
        alt="ellipse2"
        className="absolute left-0 z-0 -mt-28 hidden w-52 md:block"
      />

      <div className="lg:flex">
        <div className="z-10 space-y-6 p-6 pb-6 md:p-16 lg:w-7/12">
          <Typography className="max-w-xs text-4xl font-extrabold leading-snug tracking-wide md:max-w-3xl md:text-7xl md:leading-none">
            Uniting <span className="text-secondary">Blockchain</span>{" "}
            Ecosystems on One Platform
          </Typography>
          <div className="flex items-center gap-3">
            {/* <Button variant={"etherway"}>Launch Airdrop</Button> */}
            <Link href={"/guides/getting-started"}>
              <Button variant={"etherway"}>
                Get started <ChevronRight />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 md:px-24 md:pb-12 lg:p-4 gap-4 p-4 w-full xl:w-2/6">
          {/* {products.map((product) => (
            <ProductCard
              title={product.title}
              description={product.description}
              link={product.link}
              icon={product.icon}
              bgImage={product.bgImage}
              bg={product.bg}
              key={product.title}
            />
          ))} */}
          <Link href={"/hyperlane/nft-mint"}>
            <div className="bg-secondary relative block rounded-md shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer aspect-square backdrop-blur-[12.3px] overflow-hidden">
              <Image
                src={hyperlaneGroup}
                alt="Background Image"
                className="pointer-events-none select-none"
                fill={true}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center bg-gradient-to-t from-black/60 to-transparent">
                <Typography variant={"heroTiles"} className="md:text-xl">
                  Cross-Chain NFT Minting
                </Typography>
              </div>
            </div>
          </Link>
          <Link href={"/layerzero/onft-mint"}>
            <div className="bg-primary relative block rounded-md shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer aspect-square backdrop-blur-[12.3px] overflow-hidden">
              <Image
                src={layerzeroGroup}
                alt="Background Image"
                className="pointer-events-none select-none"
                fill={true}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center bg-gradient-to-t from-black/60 to-transparent">
                <Typography variant={"heroTiles"} className="md:text-xl">
                  Cross-Chain NFT Minting
                </Typography>
              </div>
            </div>
          </Link>

          <Link href={"/bridge"}>
            <div className="bg-primary relative block rounded-md shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer aspect-square backdrop-blur-[12.3px] overflow-hidden">
              <Image
                src={bridgeGroup}
                alt="Background Image"
                className="pointer-events-none select-none"
                fill={true}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center bg-gradient-to-t from-black/60 to-transparent">
                <Typography variant={"heroTiles"} className="md:text-xl">
                  EVM Cross-Chain Bridge
                </Typography>
              </div>
            </div>
          </Link>
          <Link href={"/layerzero/gas-refuel"}>
            <div className="bg-secondary relative block rounded-md shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer aspect-square backdrop-blur-[12.3px] overflow-hidden">
              <Image
                src={refuelGroup}
                alt="Background Image"
                className="pointer-events-none select-none"
                fill={true}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center bg-gradient-to-t from-black/60 to-transparent">
                <Typography variant={"heroTiles"} className="md:text-xl">
                  Native Token Dropoff
                </Typography>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className=" w-auto md:mb-10">
        <Marquee autoFill pauseOnClick>
          <div className="bg-background-secondary flex w-full items-center py-5">
            <Image
              alt="layerzero-logo"
              src={layerzero}
              className="mx-6"
              width={160}
              height={42}
            />
            <Image
              alt="hyperlane-logo"
              src={hyperlane}
              className="mx-6"
              width={160}
              height={42}
            />
          </div>
        </Marquee>
      </div>
    </div>
  );
}

// NOT IN USE - Product Card Component

const ProductCard = ({
  title, // Assuming this will be text now
  description,
  link,
  bg,
  bgImage, // Pass background image SVG URL
  icon, // Pass icon SVG URL for display
}: {
  title: string;
  description: string;
  link: string;
  bg: string;
  bgImage: string;
  icon: string;
}) => {
  return (
    <Link href={link}>
      <div
        className={`${bg} relative block rounded-md p-4 shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer aspect-square border border-white/10
                      before:absolute before:inset-0 before:-z-10 before:border before:border-white/10 before:bg-white/10 before:shadow-inner before:rounded-md
                      backdrop-blur-[12.3px]`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            {icon && (
              <Image src={icon} alt={title} className="my-2 w-auto h-auto" />
            )}
            <p className="text-base text-white font-raleway">{description}</p>
          </div>

          {bgImage && (
            <div className="absolute inset-0">
              <Image
                src={bgImage}
                alt={`${title} background`}
                layout=""
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
