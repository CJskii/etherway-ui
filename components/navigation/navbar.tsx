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

interface NavLinks {
  label: string;
  paths: {
    href: string;
    label: string;
  }[];
}

const navLinks: NavLinks[] = [
  {
    label: "Layerzero",
    paths: [
      {
        href: "/layerzero/onft-mint",
        label: "",
      },
      {
        href: "/layerzero/onft-bridge",
        label: "",
      },
      {
        href: "https://layerzeroscan.com/",
        label: "",
      },
      {
        href: "#",
        label: "",
      },
    ],
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

      <div className="flex-1 justify-center hidden items-center gap-3 md:flex">
        <NavLinks />
      </div>

      <div className="flex-1  justify-end items-center gap-3 hidden  md:flex">
        <ThemeToggler />
        <ConnectWalletButton />
        {/* <Link href={"/contact-us"}>
          <Button className="bg-gradient rounded-xl font-normal  text-white hover:opacity-90">
          Contact Us
          </Button>
        </Link> */}
      </div>

      <div className="block md:hidden">
        <HeaderSheet />
      </div>
    </div>
  );

  // return (
  //   <div className="fixed z-50 flex w-full justify-between items-center border-b border-neutral-400/50 bg-white/50 p-4 backdrop-blur-xl dark:bg-black/50 md:px-16 md:py-4">
  //
  //     <div className="flex-1 hidden md:block">
  //       <Link href="/" className="flex items-center justify-start">
  //
  //         <Image
  //           src={logoDark}
  //           alt="etherway logo"
  //           className="block w-40 dark:hidden"
  //         />
  //         <Image
  //           src={logoLight}
  //           alt="etherway logo"
  //           className="hidden w-40 dark:block"
  //         />
  //       </Link>
  //     </div>

  //
  //     <div className="flex-1 justify-center hidden items-center gap-3 md:flex">
  //       <NavLinks />
  //     </div>

  //
  //     <div className="flex-1  justify-end items-center gap-3 hidden  md:flex">
  //       <ThemeToggler />
  //       <ConnectWalletButton />
  //     </div>

  //
  //     <div className="block md:hidden">
  //       <HeaderSheet />
  //     </div>
  //   </div>
  // );
}

export function NavLinks() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="w-full">
          <Button className="" variant={"navbar"}>
            Layerzero
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-0 bg-[#E8E8E8]/70 dark:bg-black/30 backdrop-blur-xl">
          <Link href={"/layerzero/onft-mint"}>
            <DropdownMenuItem className=" cursor-pointer">
              ONFT Mint
            </DropdownMenuItem>
          </Link>

          <Link href={"/layerzero/onft-bridge"}>
            <DropdownMenuItem className=" cursor-pointer">
              ONFT Bridge
            </DropdownMenuItem>
          </Link>
          <Link aria-disabled href={"/layerzero/oft-mint-bridge"}>
            <DropdownMenuItem>OFT & Mint Bridge</DropdownMenuItem>
          </Link>
          <Link href={"https://layerzeroscan.com/"} target="_blank">
            <DropdownMenuItem className=" cursor-pointer">
              Explorer
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild className="w-full">
          <Button className="" variant={"navbar"}>
            Hyperlane
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-0 bg-[#E8E8E8]/70 dark:bg-black/30 backdrop-blur-xl">
          <Link href={"/hyperlane/nft-mint"}>
            <DropdownMenuItem className=" cursor-pointer">
              hNFT Mint
            </DropdownMenuItem>
          </Link>
          <Link href={"/hyperlane/nft-bridge"}>
            <DropdownMenuItem className=" cursor-pointer">
              hNFT Bridge
            </DropdownMenuItem>
          </Link>
          <Link href={"/hyperlane/token-mint-bridge"}>
            <DropdownMenuItem className=" cursor-pointer">
              ERC20 & Mint Bridge
            </DropdownMenuItem>
          </Link>
          <Link href={"https://explorer.hyperlane.xyz"}>
            <DropdownMenuItem className=" cursor-pointer">
              Explorer
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="w-full">
          <Button className="" variant={"navbar"}>
            Resources
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-0 bg-[#E8E8E8]/70 dark:bg-black/30 backdrop-blur-xl">
          <Link href={"/guides/how-to-use"}>
            <DropdownMenuItem className="cursor-pointer">
              How to use
            </DropdownMenuItem>
          </Link>
          <Link href={"/chains"}>
            <DropdownMenuItem className="cursor-pointer">
              Supported chains
            </DropdownMenuItem>
          </Link>
          <Link href={"/guides/faq"}>
            <DropdownMenuItem className="cursor-pointer">FAQ</DropdownMenuItem>
          </Link>
          {/* href={"/blogs"} */}
          <Link href={""}>
            <DropdownMenuItem disabled className="cursor-pointer">
              Blogs
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
      <Link
        href={"/dashboard"}
        className={cn(buttonVariants({ variant: "navbar" }))}
      >
        Airdrop Marketplace
      </Link>
    </>
  );
}
