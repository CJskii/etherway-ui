"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Typography } from "../ui/typography";
import Image from "next/image";
import { Button } from "../ui/button";
import React, { useRef } from "react";
import { ChainData } from "@0xsquid/squid-types";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import Arbitrum from "@/../public/chain-icons/arbitrum.svg";
import Avalanche from "@/../public/chain-icons/avalanche.svg";
import { Wallet } from "lucide-react";
import Link from "next/link";

interface StatusModalProps {
  props: {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    isLoading: boolean;
    errorMessage: string | undefined;
    setErrorMessage: (value: string) => void;
    fromNetwork: ChainData | undefined;
    toNetwork: ChainData | undefined;
    modalStatus: ModalStatus;
    axelarURL?: string;
  };
}

export enum ModalStatus {
  APPROVE = "approve",
  AWAIT_TX = "awaitTx",
  SUCCESS = "success",
  NEED_GAS = "needGas",
}

const StatusModal = ({ props }: StatusModalProps) => {
  const {
    isOpen: open,
    setIsOpen: setOpen,
    isLoading,
    errorMessage,
    setErrorMessage,
    fromNetwork,
    toNetwork,
    modalStatus,
    axelarURL,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const awaitFromRef = useRef<HTMLImageElement>(null);
  const awaitToRef = useRef<HTMLImageElement>(null);
  const approveFromRef = useRef<HTMLDivElement>(null);
  const approveToRef = useRef<HTMLImageElement>(null);

  const renderModalContent = () => {
    if (isLoading && modalStatus === ModalStatus.AWAIT_TX) {
      return (
        <>
          <div className="flex flex-col justify-center items-center gap-6 h-full">
            <Typography variant="h4" className="text-center dark:text-black">
              We&apos;re working hard to bridge your tokens
            </Typography>

            <Typography
              variant="extraSmall"
              className="text-center dark:text-black"
            >
              This might take a few seconds...
            </Typography>
          </div>
          <div
            ref={containerRef}
            className="relative flex h-full w-2/3 justify-between self-center mt-4"
          >
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={awaitFromRef}
              toRef={awaitToRef}
            />
            <Image
              ref={awaitFromRef}
              src={fromNetwork ? fromNetwork.chainIconURI : Arbitrum}
              alt={fromNetwork ? fromNetwork.networkName : "Arbitrum"}
              width={40}
              height={40}
              className="z-10 h-10 w-10 rounded-full shadow-xl"
            />
            <Image
              ref={awaitToRef}
              src={toNetwork ? toNetwork.chainIconURI : Avalanche}
              alt={toNetwork ? toNetwork.networkName : "Avalanche"}
              width={40}
              height={40}
              className="z-10 h-10 w-10 rounded-full shadow-xl"
            />
          </div>
        </>
      );
    } else if (isLoading && modalStatus === ModalStatus.APPROVE) {
      return (
        <>
          <div className="flex flex-col justify-center items-center gap-6 h-full">
            <Typography variant="h4" className="text-center dark:text-black">
              Please sign transaction in your wallet
            </Typography>
          </div>
          <div
            className="relative flex w-full max-w-[500px] items-center justify-center overflow-hidden rounded-lg p-10"
            ref={containerRef}
          >
            <div className="flex h-full w-full flex-col items-stretch justify-between gap-10">
              <div className="flex flex-row justify-between">
                <div
                  className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-300/60 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]"
                  ref={approveFromRef}
                >
                  <Wallet className="stroke-yellow-300/70" />
                </div>

                <Image
                  ref={approveToRef}
                  src={fromNetwork ? fromNetwork.chainIconURI : Arbitrum}
                  alt={fromNetwork ? fromNetwork.networkName : "Arbitrum"}
                  width={40}
                  height={40}
                  className="z-10 h-10 w-10 rounded-full shadow-xl"
                />
              </div>
            </div>

            <AnimatedBeam
              containerRef={containerRef}
              fromRef={approveFromRef}
              toRef={approveToRef}
              startYOffset={10}
              endYOffset={10}
              curvature={-20}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={approveFromRef}
              toRef={approveToRef}
              reverse
              startYOffset={-10}
              endYOffset={-10}
              curvature={20}
            />
          </div>
        </>
      );
    } else if (modalStatus === ModalStatus.NEED_GAS) {
      return (
        <>
          <Typography
            variant="smallTitle"
            className="text-center dark:text-black"
          >
            Not enough gas
          </Typography>
          <Typography variant="small" className="text-center dark:text-black">
            Looks like your transaction ran out of gas
          </Typography>

          <Typography
            variant="small"
            className="text-center dark:text-black font-normal pt-4"
          >
            Please check the transaction status on{" "}
            {axelarURL ? (
              <Typography
                variant="extraSmall"
                className="text-center dark:text-black"
              >
                <Link
                  href={axelarURL}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  Axelar Scan
                </Link>
              </Typography>
            ) : (
              "Axelar Scan"
            )}
          </Typography>

          <Button
            className="dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
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
              Success 🎉
            </Typography>
            <Typography
              variant="extraSmall"
              className="text-center dark:text-black"
            >
              Please allow few minutes for the transaction to finalise on the
              destination network
            </Typography>

            {axelarURL && (
              <Typography
                variant="extraSmall"
                className="text-center dark:text-black"
              >
                <Link
                  href={axelarURL}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  Check transaction status on Axelar
                </Link>
              </Typography>
            )}

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
