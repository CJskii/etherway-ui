import featured from "@/assets/homepage-background/featured.svg";
import logoLight from "@/assets/light-logo.svg";
import { Typography } from "@/components/ui/typography";
import { SparkleIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNetworkSelection } from "@/common/hooks/useNetworkSelection";

import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import { useSwitchNetwork } from "wagmi";
import { useAccount, useNetwork } from "wagmi";

import { handleMinting } from "@/common/utils/interaction/handlers/handleMinting";

import NetworkModal from "./networkModal";

interface NFTMintProps {
  params: {
    contractProvider: { type: string; contract: string };
    stepDescription: string;
  };
}

export default function NFTMint({ params }: NFTMintProps) {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  const { switchNetwork } = useSwitchNetwork();

  const { address } = useAccount();
  const { chain } = useNetwork();

  const { contractProvider, stepDescription } = params;

  const [isInvited, setIsInvited] = useState(false);
  const [referredBy, setReferredBy] = useState("");

  // TODO: The idea here is that we're going to display a custom network selection modal with search bar functionality to the user
  // The user will select the network and click on the mint button
  // If user is on the correct network we will call mint function and send metamask popup
  // If user isn't connected to this network we will request network change
  // If user wallet isn't connected we will request to connect a wallet

  const {
    selectedNetwork: mintNetwork,
    onNetworkSelect: setMintNetwork,
    searchTerm: fromSearchTerm,
    onSearchChange: setFromSearchTerm,
    filteredChains: fromFilteredChains,
    onClose: onFromClose,
  } = useNetworkSelection(contractProvider);

  const isConnected = address !== undefined && address !== null;
  const isCorrectNetwork = mintNetwork.id === (chain?.id ?? "");

  const handleMintButton = async () => {
    console.log("Mint button clicked");

    if (!isConnected && openConnectModal) {
      openConnectModal();
      return;
    } else if (!isCorrectNetwork && switchNetwork) {
      switchNetwork(mintNetwork.id);
      return;
    } else {
      await handleMinting({ mintNetwork, contractProvider });
    }
  };

  const networkModalProps = {
    selectedNetwork: mintNetwork,
    onNetworkSelect: setMintNetwork,
    filteredChains: fromFilteredChains,
    dialogTitle: "Select Mint Network",
    dialogDescription:
      "Ensure your wallet is connected to the selected network.",
    commandHeading: "Available networks",
  };

  return (
    <div className=" z-10 py-10 md:py-16  flex items-center justify-center">
      <div className="bg-gradient my-auto grid grid-cols-12 rounded-xl md:w-9/12 items-start">
        <div className="col-span-full md:col-span-5 relative flex items-start justify-start">
          <div className=" md:rounded-tl-xl absolute top-0 w-full py-2 px-5 bg-gradient-to-t from-black/0 via-black/50 to-black flex items-center flex-wrap gap-y-4 gap-x-6">
            <Image src={logoLight} alt="mintly logo" className="w-40" />
          </div>
          <Image
            src={featured}
            alt="featured"
            className=" h-[600px] w-full object-cover rounded-xl "
          />
          <div className=" md:rounded-bl-xl absolute bottom-0 py-14 px-8 bg-gradient-to-b from-black/5  to-black flex items-center flex-wrap gap-y-4 gap-x-6 text-white">
            <div className=" flex items-center gap-2">
              <SparkleIcon className=" w-5 h-5" />
              <Typography variant={"smallTitle"}>
                Multi-Network Support
              </Typography>
            </div>
            <div className=" flex items-center gap-2">
              <SparkleIcon className=" w-5 h-5" />
              <Typography variant={"smallTitle"}>Distinct Visuals</Typography>
            </div>
            <div className=" flex items-center gap-2">
              <SparkleIcon className=" w-5 h-5" />
              <Typography variant={"smallTitle"}>Instant Transfers</Typography>
            </div>
            <div className=" flex items-center gap-2">
              <SparkleIcon className=" w-5 h-5" />
              <Typography variant={"smallTitle"}>LayerZero Driven</Typography>
            </div>
          </div>
        </div>
        <div className="col-span-full md:col-span-7 px-8 py-10 md:p-14 space-y-6 flex flex-col">
          <Typography variant={"h3"} className=" dark:text-black">
            Step 1 : {stepDescription}
          </Typography>
          <NetworkModal props={networkModalProps} />
          {/* <Select>
            <SelectTrigger className="bg-white p-6 dark:bg-white dark:text-black dark:border-0">
              <SelectValue placeholder="Select chain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="solana">Solana</SelectItem>
              <SelectItem value="polkadot">Polkadot</SelectItem>
            </SelectContent>
          </Select> */}
          <Button
            className=" dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
            onClick={handleMintButton}
          >
            Mint
          </Button>
        </div>
      </div>
    </div>
  );
}
