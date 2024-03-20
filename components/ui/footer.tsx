import { DiscordIcon } from "@/assets/icons/Discord";
import { XIcon } from "@/assets/icons/XIcon";
import logoBlack from "@/assets/logo-black.svg";
import logoWhite from "@/assets/logo-white.svg";
import Image from "next/image";
import { Typography } from "./typography";
import { Button } from "./button";
import { Instagram, Plane, PlaneLandingIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TelegramIcon } from "@/assets/icons/TelegramIcon";
import { GitBookIcon } from "@/assets/icons/GitBookIcon";

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
          Lorem ipsum dolor sit amet consectetur. Suscipit ultricies lacus
          tristique a feugiat nunc. Cursus mauris tempor pulvinar risus
          tincidunt. Dictum
        </Typography>
      </div>
      {!isDashboard && (
        <div className=" grid w-full grid-cols-6 gap-3 md:max-w-md [&>*]:col-span-3 md:[&>*]:col-span-2 lg:[&>*]:col-span-3 ">
          <Button variant={"etherwaySecondary"}>
            <DiscordIcon className="h-4 w-4 mx-2" />
            Discord
          </Button>
          <Button variant={"etherwaySecondary"}>
            <XIcon className="h-4 w-4 mx-2" /> Twitter
          </Button>
          {/* <Button variant={"etherwaySecondary"}>
            <Instagram className="h-4 w-4 mx-2" />
            Instagram
          </Button> */}
          <Button variant={"etherwaySecondary"}>
            <TelegramIcon className="h-4 w-4 mx-2" />
            Telegram
          </Button>
          {/* TODO: Add Galxe, Zealy  */}
          {/* <Button variant={"etherwaySecondary"} className="">
            <GitBookIcon className="h-4 w-4 mx-2" />
            GitBook
          </Button> */}
        </div>
      )}
      {isDashboard && (
        <div className=" grid w-full grid-cols-6 gap-3 md:max-w-md [&>*]:col-span-3 md:[&>*]:col-span-2 lg:[&>*]:col-span-3 ">
          <Button variant={"dashboardFooter"}>
            <DiscordIcon className="h-4 w-4 mx-2" />
            Discord
          </Button>
          <Button variant={"dashboardFooter"}>
            <XIcon className="h-4 w-4 mx-2" /> Twitter
          </Button>
          {/* <Button variant={"dashboardFooter"}>
            <Instagram className="h-4 w-4 mx-2" />
            Instagram
          </Button> */}
          <Button variant={"dashboardFooter"}>
            <TelegramIcon className="h-4 w-4 mx-2" />
            Telegram
          </Button>
          {/* TODO: Add Galxe, Zealy  */}
          {/* <Button variant={"dashboardFooter"} className="">
            <GitBookIcon className="h-4 w-4 mx-2" />
            GitBook
          </Button> */}
        </div>
      )}
    </div>
  );
}
