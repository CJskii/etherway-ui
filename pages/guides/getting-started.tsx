import HeadComponent from "@/common/elements/HeadComponent";
import { Layout } from "@/components/dashboard/layout";
import { Typography } from "@/components/ui/typography";

import { BellRing, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cardsData = [
  {
    title: "LayerZero",
    description: "Discover products built utilizing LayerZero",
    links: [
      {
        title: "ONFT Mint",
        description: "Mint NFTs on Ethereum",
        link: "/layerzero/onft-mint",
      },
      {
        title: "ONFT Bridge",
        description: "Cross-chain bridge",
        link: "/layerzero/onft-bridge",
      },
      {
        title: "OFT Mint & Bridge",
        description: "Mint NFTs on Ethereum",
        link: "/layerzero/oft-mint-bridge",
      },
    ],
  },
  {
    title: "Hyperlane",
    description: "Discover products built utilizing Hyperlane",
    links: [
      {
        title: "hNFT Mint",
        description: "Mint NFTs on various chains",
        link: "/hyperlane/nft-mint",
      },
      {
        title: "hNFT Bridge",
        description: "Cross-chain bridge",
        link: "/hyperlane/nft-bridge",
      },
      {
        title: "ERC20 Token Mint & Bridge",
        description: "Mint NFTs on various chains",
        link: "/hyperlane/nft-mint-bridge",
      },
    ],
  },

  {
    title: "Gas Refuel",
    description: "Discover products built utilizing Gas Refuel",
    links: [
      {
        title: "Mint NFTs on Ethereum",
        description: "Mint NFTs on Ethereum",
        link: "/gas-refuel/mint-nfts",
      },
    ],
  },
  {
    title: "Dashboard",
    description: "Discover products built utilizing Dashboard",
    links: [
      {
        title: "Mint NFTs on Ethereum",
        description: "Mint NFTs on Ethereum",
        link: "/dashboard/mint-nfts",
      },
    ],
  },
];

type CardProps = React.ComponentProps<typeof Card>;

interface CardExtendedProps extends CardProps {
  title: string;
  description: string;
  links: {
    title: string;
    description: string;
    link: string;
  }[];
}

export function CardDemo({ className, ...props }: CardExtendedProps) {
  const { title, description, links } = props;

  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          {links.map((link, index) => (
            <div
              key={index}
              className=" grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{link.title}</p>
                <p className="text-sm text-muted-foreground">
                  {link.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Check className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
      </CardFooter>
    </Card>
  );
}

const GettingStarted = () => {
  return (
    <Layout>
      <HeadComponent title="Etherway: Getting started" />
      <section className="py-10 sm:py-16 lg:py-24">
        <Typography variant="h1" className="text-center">
          Getting Started
        </Typography>

        <div className="pt-16">
          <Typography variant="h2" className="mt-8">
            Products
          </Typography>
          <div className="flex justify-start items-start gap-12">
            <div>
              <Typography variant="blockquote" className="mt-8 text-2xl">
                LayerZero
              </Typography>
              <Typography variant="paragraph" className="mt-4 text-2xl">
                ONFT Mint
              </Typography>
              <Typography variant="paragraph" className="mt-4 text-2xl">
                ONFT Bridge
              </Typography>
              <Typography variant="paragraph" className="mt-4 text-2xl">
                OFT Mint & Bridge
              </Typography>
            </div>
            <div>{/* <CardDemo /> */}</div>
            <div>
              <Typography variant="blockquote" className="mt-8 text-2xl">
                Gas Refuel
              </Typography>
              <Typography variant="paragraph" className="mt-4 text-2xl">
                Mint NFTs on Ethereum
              </Typography>
            </div>
            <div>
              <Typography variant="blockquote" className="mt-8 text-2xl">
                Dashboard
              </Typography>
              <Typography variant="paragraph" className="mt-4 text-2xl">
                Mint NFTs on Ethereum
              </Typography>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GettingStarted;
