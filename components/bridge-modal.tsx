"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Typography } from "./ui/typography";
import Image from "next/image";
import { Button } from "./ui/button";
import { useRouter } from "next/router";

interface BridgeModalProps {
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

const BridgeModal = ({ props }: BridgeModalProps) => {
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
            We&apos;re working hard to bridge your NFT
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
            There was an error while bridging your NFT
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
              NFT Sent
            </Typography>
            <Typography variant="small" className="text-center dark:text-black">
              Please allow few minutes for the transaction to finalise on the
              destination network
            </Typography>
            {/* <Typography variant="small" className="text-center dark:text-black">
              TX ID: We can get this from the response
            </Typography> */}
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

  const modalHeight =
    nftId && !isLoading && errorMessage == "" ? "600px" : "auto";

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

export default BridgeModal;
