"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Typography } from "./ui/typography";

import Image from "next/image";
import { Button } from "./ui/button";

import { useState } from "react";

interface InteractionModalProps {
  props: {
    modalTitle: string;
    modalDescription: string;
    modalButtonText: string;
    modalButtonOnClick: () => void;
  };
}

const InteractionModal = ({ props }: InteractionModalProps) => {
  //   const {
  //     selectedNetwork,
  //     onNetworkSelect,
  //     filteredChains,
  //     dialogTitle,
  //     dialogDescription,
  //     commandHeading,
  //   } = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button className="" onClick={props.modalButtonOnClick}>
        Open Modal
      </button>
      <Dialog>
        <DialogTrigger>
          <Button variant="default">Show details</Button>
        </DialogTrigger>

        <DialogContent className="rounded-xl bg-gradient border-0 flex flex-col justify-center items-between min-h-[500px]">
          {/* SVG Checkmark */}
          <svg
            className="w-6 h-6 text-green-500 absolute top-10 left-10 z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {/* NFT Image */}
          <div className="flex-grow relative w-full">
            <Image
              src="https://ipfs.io/ipfs/QmWhssC8rz2ma2gLpXCKYfxpP17ouYqdjWuUzRMeKwK4Mx/Etherway_x_Layerzero.png"
              layout="fill"
              objectFit="cover"
              alt="NFT"
              className="rounded-xl border-2 border-[#92FDBD]"
            />
          </div>
          {/* Text and Button */}
          <div className="flex flex-col items-center gap-2">
            <Typography
              variant="smallTitle"
              className="text-center dark:text-black"
            >
              NFT successfully minted continue to bridge
            </Typography>
            <Button
              className="dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
              onClick={props.modalButtonOnClick}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InteractionModal;
