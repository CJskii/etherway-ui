"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Typography } from "../ui/typography";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { ChainData } from "@0xsquid/squid-types";
import { AnimatedBeam } from "../magicui/animated-beam";
import Arbitrum from "../../public/chain-icons/arbitrum.svg";
import Avalanche from "../../public/chain-icons/avalanche.svg";

interface StatusModalProps {
  props: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    isLoading: boolean;
    modalTitle: string;
    modalDescription: string;
    modalButtonText: string;
    errorMessage: string | undefined;
    setErrorMessage: (value: string) => void;
    fromNetwork: ChainData;
    toNetwork: ChainData;
  };
}

const StatusModal = ({ props }: StatusModalProps) => {
  const {
    isOpen: open,
    setIsOpen: setOpen,
    isLoading,
    modalTitle,
    modalDescription,
    modalButtonText,
    errorMessage,
    setErrorMessage,
    fromNetwork,
    toNetwork,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLImageElement>(null);
  const div2Ref = useRef<HTMLImageElement>(null);

  const router = useRouter();

  const renderModalContent = () => {
    if (isLoading) {
      return (
        <>
          <div className="flex flex-col justify-center items-center gap-6 h-full">
            <Typography variant="h4" className="text-center dark:text-black">
              We&apos;re working hard to bridge your tokens
            </Typography>

            <Typography variant="small" className="text-center dark:text-black">
              This might take a few seconds...
            </Typography>
          </div>
          <div
            ref={containerRef}
            className="relative flex h-full w-2/3 justify-between self-center"
          >
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={div1Ref}
              toRef={div2Ref}
            />
            <Image
              ref={div1Ref}
              // src={fromNetwork.chainIconURI}
              src={Arbitrum}
              alt="Arbitrum"
              width={40}
              height={40}
              className="z-10 h-10 w-10 rounded-full shadow-xl"
            />
            <Image
              ref={div2Ref}
              // src={toNetwork.chainIconURI}
              src={Avalanche}
              alt="Avalanche"
              width={40}
              height={40}
              className="z-10 h-10 w-10 rounded-full shadow-xl"
            />
          </div>
        </>
      );
    } else if (errorMessage) {
      return (
        <>
          <Typography
            variant="smallTitle"
            className="text-center dark:text-black"
          >
            There was an error while bridging your tokens
          </Typography>
          <Typography variant="small" className="text-center dark:text-black">
            {errorMessage}
          </Typography>

          <Typography
            variant="small"
            className="text-center dark:text-black font-normal pt-4"
          >
            If this is reocurring error, please contact us in Discord for help
          </Typography>
        </>
      );
    } else {
      return (
        <>
          <div className="flex flex-col items-center gap-4">
            <Typography
              variant="smallTitle"
              className="text-center dark:text-black"
            >
              Tokens Sent
            </Typography>
            <Typography variant="small" className="text-center dark:text-black">
              Please allow few minutes for the transaction to finalise on the
              destination network
            </Typography>
            <Button
              className="dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </>
      );
    }
  };

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
          className={`rounded-xl bg-gradient border-0 flex flex-col justify-center items-between  ${
            errorMessage ? "border-4 border-red-500" : ""
          }`}
        >
          {renderModalContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StatusModal;
