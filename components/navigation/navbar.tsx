import logoDark from "@/assets/dark-logo.svg";
import logoLight from "@/assets/light-logo.svg";
import logo from "@/assets/logo-symbol.svg";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggler } from "../ui/toggle-theme";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { HeaderSheet } from "./header-sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConnectWalletButton } from "../ui/connect-button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  ListItem,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Typography } from "../ui/typography";
import { Separator } from "@radix-ui/react-separator";
import React from "react";

interface NavLinks {
  label: string;
  paths: {
    href: string;
    label: string;
  }[];
}

const productLinks = [
  {
    label: "Layerzero",
    paths: [
      {
        href: "/layerzero/onft-mint",
        label: "Mint ONFT",
        description: "Create your own ONFTs for use across multiple chains.",
      },
      {
        href: "/layerzero/onft-bridge",
        label: "Bridge ONFT",
        description:
          "Seamlessly transfer your ONFTs between supported networks.",
      },
      {
        href: "/layerzero/oft-mint-bridge",
        label: "Mint & Bridge OFT",
        description:
          "Mint new OFTs and bridge them for cross-chain functionality.",
      },
    ],
  },
  {
    label: "Hyperlane",
    paths: [
      {
        href: "/hyperlane/nft-mint",
        label: "Mint hNFT",
        description:
          "Mint Hyperlane NFTs to explore cross-chain asset capabilities.",
      },
      {
        href: "/hyperlane/nft-bridge",
        label: "Bridge hNFT",
        description:
          "Connect and transfer your hNFTs between supported networks.",
      },
      {
        href: "/hyperlane/token-mint-bridge",
        label: "Mint & Bridge ERC20",
        description:
          "Mint ERC20 tokens and bridge them to other chains with ease.",
      },
    ],
  },
];

const otherLinks = [
  {
    label: "Airdrop Marketplace",
    href: "/dashboard",
  },
  {
    label: "Gas Refuel",
    href: "/layerzero/gas-refuel",
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
  },
];

export function Header() {
  return (
    <div className="fixed z-50 flex w-full justify-between items-center border-b border-neutral-400/50 bg-white/50 p-4 backdrop-blur-xl dark:bg-black/50 md:px-16 md:py-4">
      <div className="flex-1 hidden md:block">
        <Link href="/" className="flex items-center justify-start">
          <Image
            src={logoDark}
            alt="etherway logo"
            className="block w-40 dark:hidden"
          />
          <Image
            src={logoLight}
            alt="etherway logo"
            className="hidden w-40 dark:block"
          />
        </Link>
      </div>
      <Link href={"/"} className="md:hidden">
        <Image
          src={logo}
          alt="Icon"
          className="block md:hidden"
          width={30}
          height={30}
        />
      </Link>
      <div className="flex-1 justify-center hidden items-center gap-3 lg:flex">
        {/* <NavLinks /> */}
        <NaviLinks />
      </div>

      <div className="flex-1  justify-end items-center gap-3 hidden  lg:flex">
        <ThemeToggler />
        <ConnectWalletButton />
        {/* <Link href={"/contact-us"}>
          <Button className="bg-gradient rounded-xl font-normal  text-white hover:opacity-90">
          Contact Us
          </Button>
        </Link> */}
      </div>

      <div className="block lg:hidden">
        <HeaderSheet />
      </div>
    </div>
  );
}

export function NaviLinks() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="">Products</NavigationMenuTrigger>
          <NavigationMenuContent className="flex">
            {productLinks.map((navLink, index) => (
              <ul
                key={index}
                className="flex flex-col w-[200px] gap-3 p-4 md:w-[250px] md:grid-cols-2 lg:w-[300px] "
              >
                <Typography variant="navbarTitle" className="">
                  {navLink.label}
                </Typography>
                {navLink.paths.map((path, index) => (
                  <React.Fragment key={path.label}>
                    <ListItem title={path.label} href={path.href} className="">
                      {path.description}
                    </ListItem>
                    {index !== navLink.paths.length - 1 && (
                      <Separator
                        orientation="horizontal"
                        className="dark:border-[#E8E8E8]/20 border-[1px] border-black/20"
                      />
                    )}
                  </React.Fragment>
                ))}
              </ul>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>

        {otherLinks.map((navLink, index) => (
          <NavigationMenuItem key={index}>
            <Link href={navLink.href} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {navLink.label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function MobileNavLinks() {
  return (
    <>
      {otherLinks.map((navLink, index) => (
        <React.Fragment key={index}>
          <Link href={navLink.href} passHref>
            <Button className="w-full" variant={"navbarMobile"}>
              {navLink.label}
            </Button>
          </Link>
        </React.Fragment>
      ))}
      {productLinks.map((navLink, index) => (
        <React.Fragment key={index}>
          <Typography key={index} variant="navbarTitle">
            {navLink.label}
          </Typography>
          {navLink.paths.map((path, index) => (
            <React.Fragment key={index}>
              <Link href={path.href} passHref>
                <Button className="w-full" variant={"navbarMobile"}>
                  {path.label}
                </Button>
              </Link>
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </>
  );
}
