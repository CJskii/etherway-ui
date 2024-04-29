import ellipse1 from "@/assets/ellipse1.svg";
import ellipse2 from "@/assets/ellipse2.svg";
import layerzero from "@/assets/layerzero-logo.svg";
import hyperlane from "@/assets/hyperlane-logo.svg";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { Typography } from "../ui/typography";
import { Button } from "../ui/button";
import Link from "next/link";

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
    link: "/gas-refuel",
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
    <div className="flex min-h-screen flex-col justify-start pt-20 md:justify-between md:pt-40">
      {/* <Image
        src={ellipse1}
        alt="ellipse1"
        className="absolute right-0 z-0 mt-16 h-auto w-9/12 md:-mt-16 md:w-3/12"
      />
      <Image
        src={ellipse2}
        alt="ellipse2"
        className="absolute left-0 z-0 -mt-28 hidden w-52 md:block"
      /> */}

      <div>
        <div className="z-10 space-y-6 p-6 pb-6 md:p-16">
          <Typography className="max-w-xs text-4xl font-extrabold leading-snug tracking-wide md:max-w-3xl md:text-7xl md:leading-none">
            Uniting <span className="text-secondary">Blockchain</span>{" "}
            Ecosystems on One Platform
          </Typography>
          <div className="flex items-center gap-3">
            {/* <Button variant={"etherway"}>Launch Airdrop</Button> */}
            <Link href={"/layerzero/onft-mint"}>
              <Button variant={"etherway"}>LayerZero</Button>
            </Link>
            <Link href={"/hyperlane/nft-mint"}>
              <Button variant={"ghost"} className="md:w-32">
                Hyperlane <ChevronRightIcon />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4">
          {products.map((product) => (
            <ProductCard
              title={product.title}
              description={product.description}
              link={product.link}
              bg={product.bg}
              key={product.title}
            />
          ))}
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
              alt="wormhole-logo"
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

const ProductCard = ({
  title,
  description,
  link,
  bg,
}: {
  title: string;
  description: string;
  link: string;
  bg: string;
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
            <span className="block font-semibold text-2xl text-white font-raleway">
              {title}
            </span>
            <p className="text-base text-white font-raleway">{description}</p>
          </div>
          {/* SVG Background here */}
        </div>
      </div>
    </Link>
  );
};
