"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Typography } from "./ui/typography";
import Image from "next/image";
import { Button } from "./ui/button";
import { useRouter } from "next/router";

interface MintModalProps {
  props: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    isLoading: boolean;
    modalTitle: string;
    modalDescription: string;
    modalButtonText: string;
    errorMessage: string;
    setErrorMessage: (value: string) => void;
    nftId: string;
  };
}

const MintModal = ({ props }: MintModalProps) => {
  const {
    isOpen: open,
    setIsOpen: setOpen,
    isLoading,
    modalTitle,
    modalDescription,
    modalButtonText,
    errorMessage,
    setErrorMessage,
    nftId,
  } = props;

  const router = useRouter();

  const renderModalContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center gap-6 h-full">
          <Typography variant="h4" className="text-center dark:text-black">
            We're working hard to mint your NFT
          </Typography>
          <Typography variant="small" className="text-center dark:text-black">
            This might take a few seconds...
          </Typography>
          <span className="relative flex h-12 w-12">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-90"></span>
            <span className="relative inline-flex rounded-full h-12 w-12 bg-secondary"></span>
          </span>
        </div>
      );
    } else if (errorMessage) {
      return (
        <>
          <Typography
            variant="smallTitle"
            className="text-center dark:text-black"
          >
            There was an error while minting your NFT
          </Typography>
          <Typography variant="small" className="text-center dark:text-black">
            {errorMessage}
          </Typography>

          {/* <Typography variant="small" className="text-center dark:text-black">
            Please try again
          </Typography> */}
        </>
      );
    } else {
      return (
        <>
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

          <div className="flex-grow relative w-full">
            <Image
              src="https://ipfs.io/ipfs/QmWhssC8rz2ma2gLpXCKYfxpP17ouYqdjWuUzRMeKwK4Mx/Etherway_x_Layerzero.png"
              layout="fill"
              objectFit="cover"
              alt="NFT"
              className="rounded-xl border-4 border-[#92FDBD]"
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <Typography
              variant="smallTitle"
              className="text-center dark:text-black"
            >
              NFT ID: #{nftId}
            </Typography>
            <Typography variant="small" className="text-center dark:text-black">
              Successfully minted continue to bridge
            </Typography>
            <Button
              className="dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
              onClick={() => setOpen(false)}
            >
              Continue
            </Button>
          </div>
        </>
      );
    }
  };

  const modalHeight =
    nftId && !isLoading && errorMessage == "" ? "min-h-[600px]" : "auto";

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setErrorMessage("");
        }}
      >
        <DialogContent
          className={`rounded-xl bg-gradient border-0 flex flex-col justify-center items-between ${modalHeight} ${
            errorMessage ? "border-4 border-red-500" : ""
          }`}
        >
          {renderModalContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MintModal;
