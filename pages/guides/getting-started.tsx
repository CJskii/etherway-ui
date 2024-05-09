import HeadComponent from "@/common/elements/HeadComponent";
import { Layout } from "@/components/dashboard/layout";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";

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
        description: "Mint your ONFTs and bridge them across multiple chains",
        url: "/layerzero/onft-mint",
        button: "primary",
      },
      {
        title: "ONFT Bridge",
        description: "Cross-Chain transactions with ONFTs",
        url: "/layerzero/onft-bridge",
        button: "primary",
      },
      {
        title: "OFT Mint & Bridge",
        description: "Cross-Chain transactions with OFTs",
        url: "/layerzero/oft-mint-bridge",
        button: "primary",
      },
    ],
  },
  {
    title: "Hyperlane",
    description: "Discover products built utilizing Hyperlane",
    links: [
      {
        title: "hNFT Mint",
        description: "Mint hNFTs and bridge them across multiple chains",
        url: "/hyperlane/nft-mint",
        button: "primary",
      },
      {
        title: "hNFT Bridge",
        description: "Cross-Chain transactions with hNFTs",
        url: "/hyperlane/nft-bridge",
        button: "primary",
      },
      {
        title: "ERC20 Token Mint & Bridge",
        description: "Mint ERC20 tokens and bridge them across multiple chains",
        url: "/hyperlane/token-mint-bridge",
        button: "primary",
      },
    ],
  },

  {
    title: "Gas Refuel",
    description: "Discover ways to refuel your gas on various chains",
    links: [
      {
        title: "Send Gas",
        description: "Refuel Your Wallet with Native Tokens",
        url: "/layerzero/gas-refuel",
        button: "secondary",
      },
    ],
  },
  {
    title: "Bridge",
    description: "Discover products built utilizing Axelar",
    links: [
      {
        title: "Cross-chain bridge",
        description: "The fastest way to move assets between blockchains",
        url: "/dashboard/mint-nfts",
        button: "secondary",
      },
    ],
  },
  {
    title: "Dashboard",
    description: "The main hub for all your activities",
    links: [
      {
        title: "Airdrop Marketplace",
        description: "Discover latest airdrops and connect with projects",
        url: "/dashboard/mint-nfts",
        button: "secondary",
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
    url: string;
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

// const GettingStarted = () => {
//   return (
//     <Layout>
//       <HeadComponent title="Etherway: Getting started" />
//       <section className="py-10 sm:py-16 lg:py-24">
//         <Typography variant="h1" className="text-center">
//           Getting Started
//         </Typography>

//         <div className="pt-16">
//           <Typography variant="h2" className="mt-8">
//             Products
//           </Typography>
//           <div className="flex justify-start items-start gap-12">
//             {/* <div>
//               <Typography variant="blockquote" className="mt-8 text-2xl">
//                 LayerZero <br></br>{" "}
//                 <Typography variant={"muted"} className="text-sm">
//                   ONFT
//                 </Typography>
//               </Typography>
//               <Typography variant="paragraph" className="mt-4 text-2xl">
//                 ONFT Mint
//               </Typography>
//               <Typography variant="paragraph" className="mt-4 text-2xl">
//                 ONFT Bridge
//               </Typography>
//               <Typography variant="paragraph" className="mt-4 text-2xl">
//                 OFT Mint & Bridge
//               </Typography>
//             </div> */}
//             <div>{/* <CardDemo /> */}</div>
//             {/* {cardsData.map((card, index) => (
//               <div key={index}>
//                 <Typography variant="blockquote" className="mt-8 text-2xl">
//                   {card.title} <br></br>{" "}
//                   <Typography variant={"muted"} className="text-sm">
//                     {card.description}
//                   </Typography>
//                 </Typography>
//                 {card.links.map((link, index) => (
//                   <Link
//                     href={link.url}
//                     key={index}
//                     className="flex flex-col justify-center items-start"
//                   >
//                     <Button variant={"etherway"} className="mt-4">
//                       {link.title}
//                     </Button>
//                   </Link>
//                 ))}
//               </div>
//             ))} */}

//             {/* <div>
//               <Typography variant="blockquote" className="mt-8 text-2xl">
//                 Gas Refuel
//               </Typography>
//               <Typography variant="paragraph" className="mt-4 text-2xl">
//                 Mint NFTs on Ethereum
//               </Typography>
//             </div>
//             <div>
//               <Typography variant="blockquote" className="mt-8 text-2xl">
//                 Dashboard
//               </Typography>
//               <Typography variant="paragraph" className="mt-4 text-2xl">
//                 Mint NFTs on Ethereum
//               </Typography>
//             </div> */}
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// };

const GettingStarted = () => {
  return (
    <Layout>
      <HeadComponent title="Etherway: Getting started" />
      <section className="py-10 bg-base-200 sm:py-16 lg:py-24">
        <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <Typography variant="h1" className="mt-4 text-gray-300">
              Getting Started
            </Typography>
            <Typography variant={"paragraph"} className="mt-4">
              Begin with the following products
            </Typography>
          </div>

          <div className="grid grid-cols-1 mt-12 md:mt-20 md:grid-cols-2 gap-y-16 gap-x-20">
            {cardsData.map((card, index) => (
              <div key={index}>
                <Typography variant="blockquote" className="mt-4 text-3xl">
                  {card.title} <br></br>{" "}
                  <Typography variant={"muted"} className="text-sm mb-8">
                    {card.description}
                  </Typography>
                </Typography>
                {card.links.map((link, index) => (
                  <Link
                    href={link.url}
                    key={index}
                    className="flex flex-col dark:bg-gray-900/30 dark:hover:bg-gray-900/60 justify-center items-start py-2 border-[1px] hover:border-white/60 border-white/30 rounded-xl my-4"
                  >
                    <CardContent className="grid p-4">
                      {/* <div className="flex justify-start items-center">
                        <BellRing className="mr-2 h-4 w-4" />
                        <div>
                          <Typography variant="smallTitle" className="mt-4">
                            {link.title}
                          </Typography>
                          <Typography variant="paragraph" className="mt-0">
                            {link.description}
                          </Typography>
                        </div>
                      </div> */}
                      <div
                        key={index}
                        className=" grid grid-cols-[25px_1fr] items-center pb-4 last:mb-0 last:pb-0"
                      >
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {link.title}
                          </p>
                          <Typography variant={"muted"} className="text-sm">
                            {link.description}
                          </Typography>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {/* <Footer /> */}
        </div>
      </section>
    </Layout>
  );
};

export default GettingStarted;
