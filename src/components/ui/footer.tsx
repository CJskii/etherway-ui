import { DiscordIcon } from "@/../assets/icons/Discord";
import { XIcon } from "@/../assets/icons/XIcon";
import logoBlack from "@/../assets/logo-black.svg";
import logoWhite from "@/../assets/logo-white.svg";
import Image from "next/image";
import { Typography } from "./typography";
import { Button } from "./button";
import { Instagram, Plane, PlaneLandingIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TelegramIcon } from "@/../assets/icons/TelegramIcon";
import { GitBookIcon } from "@/../assets/icons/GitBookIcon";
import Link from "next/link";

interface FooterProps {
  isDashboard?: boolean;
}

export function Footer({ isDashboard }: FooterProps) {
  return (
    <div
      className={cn(
        isDashboard
          ? "w-full bg-[#F6F6F6] p-6 py-14 dark:border-neutral-700 dark:bg-[#110E14] md:border-t md:pl-[130px] md:pr-8 lg:pl-[350px]"
          : "bg-background-secondary rounded-t-xl px-6 pb-10 pt-20 dark:bg-white md:p-16 md:py-32",
        "flex flex-col flex-wrap items-start justify-between gap-4 lg:flex-row lg:items-center",
      )}
    >
      <div>
        <Image
          src={logoWhite}
          alt="etherway logo"
          className={cn(
            isDashboard ? "hidden dark:block" : "block dark:hidden",
            "w-40",
          )}
        />
        <Image
          src={logoBlack}
          alt="etherway logo"
          className={cn(
            isDashboard ? "block dark:hidden" : "hidden dark:block",
            "w-40",
          )}
        />
        <Typography
          variant={"paragraph"}
          className={cn(
            isDashboard
              ? "text-black dark:text-white"
              : "text-white dark:text-black",
            " font-light tracking-wide md:max-w-xl ",
          )}
        >
          Discover seamless integration across diverse blockchains with
          Etherway. Effortlessly mint and bridge NFTs and tokens using the
          latest cross-chain technology. Your gateway to simplified cross-chain
          transactions.
        </Typography>
        <Typography
          variant={"paragraph"}
          className={cn(
            isDashboard
              ? "text-black dark:text-white"
              : "text-white dark:text-black",
            " font-light tracking-wide md:max-w-xl ",
          )}
        >
          © {new Date().getFullYear()} Etherway. All rights reserved.
        </Typography>
      </div>

      <div className="text-white dark:text-black flex flex-col justify-center items-start gap-2 py-4">
        <Typography variant={"h4"} className="text-white dark:text-black">
          Resources
        </Typography>
        <Link href={"/guides/faq"}>
          <Typography variant={"footerLink"}>FAQ</Typography>
        </Link>
        <Link href={"/guides/how-to-use"}>
          <Typography variant={"footerLink"}>How to use</Typography>
        </Link>
        <Link href={"/chains"}>
          <Typography variant={"footerLink"}>Supported Chains</Typography>
        </Link>

        <Link href={"https://layerzeroscan.com/"} target="_blank">
          <Typography variant={"footerLink"}>Layerzero Explorer</Typography>
        </Link>
        <Link href={"https://explorer.hyperlane.xyz/"} target="_blank">
          <Typography variant={"footerLink"}>Hyperlane Explorer</Typography>
        </Link>
      </div>

      {!isDashboard && (
        <div className="grid w-full grid-cols-6 xl:grid-cols-1 gap-3 md:max-w-md [&>*]:col-span-3 md:[&>*]:col-span-2 lg:[&>*]:col-span-3 ">
          <Link href={"https://discord.gg/GcS5r5NWfh"} target="_blank">
            <Button variant={"etherwaySecondary"} className="w-full">
              <DiscordIcon className="h-4 w-4 mx-2" />
              Discord
            </Button>
          </Link>
          <Link href={"https://twitter.com/etherway_io"} target="_blank">
            <Button variant={"etherwaySecondary"} className="w-full">
              <XIcon className="h-4 w-4 mx-2" /> Twitter
            </Button>
          </Link>
          <Link href={"https://t.me/+IFXADMbhrSAyNTE0"} target="_blank">
            <Button variant={"etherwaySecondary"} className="w-full">
              <TelegramIcon className="h-4 w-4 mx-2" />
              Telegram
            </Button>
          </Link>
        </div>
      )}
      {isDashboard && (
        <div className=" grid w-full grid-cols-6 gap-3 md:max-w-md [&>*]:col-span-3 md:[&>*]:col-span-2 lg:[&>*]:col-span-3 ">
          <Link href={"https://discord.gg/GcS5r5NWfh"} target="_blank">
            <Button variant={"etherwaySecondary"} className="w-full">
              <DiscordIcon className="h-4 w-4 mx-2" />
              Discord
            </Button>
          </Link>

          <Link href={"https://twitter.com/etherway_io"} target="_blank">
            <Button variant={"etherwaySecondary"} className="w-full">
              <XIcon className="h-4 w-4 mx-2" /> Twitter
            </Button>
          </Link>
          <Link href={"https://t.me/+IFXADMbhrSAyNTE0"} target="_blank">
            <Button variant={"etherwaySecondary"} className="w-full">
              <TelegramIcon className="h-4 w-4 mx-2" />
              Telegram
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
