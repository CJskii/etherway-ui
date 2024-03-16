import React, { useEffect } from "react";
import { Typography } from "@/components/ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeftRight, ArrowUpDown } from "lucide-react";
import DashboardCard from "@/components/dashboard/dashboard-card";

import NetworkModal from "./networkModal";
import { useNetworkSelection } from "@/common/hooks/useNetworkSelection";
import { getValidToNetworks } from "@/common/utils/getters/getValidToNetworks";
import { Network } from "@/common/types/network";

interface TokenMintAndBridgeProps {
  params: {
    contractProvider: { type: string; contract: string };
    headerDescription: string;
    stepDescription: {
      mint: string;
      bridge: string;
    };
  };
}

export default function TokenMintAndBridge({
  params,
}: TokenMintAndBridgeProps) {
  // TODO: The idea here is that we're going to display FROM and TO network selection modals with search bar functionality to the user
  // We will display user balance in his wallet for the current chain
  // In order to make bridge user balance has to be greater than 0

  // So the user will need to mint tokens first, this should automatically update his balance with the the minted tokens
  // Then the user should select FROM and TO network, enter the amount of tokens he wants to bridge and click on the bridge button

  // If user is on the correct network we will call bridge function and send metamask popup
  // If user isn't connected to this network we will request network change
  // If user wallet isn't connected we will request to connect a wallet

  const { contractProvider, headerDescription, stepDescription } = params;
  const { type, contract } = contractProvider;

  const [selectedChain1, setSelectedChain1] = React.useState<string>("");
  const [selectedChain2, setSelectedChain2] = React.useState<string>("");

  const isValidToNetwork = (toNetwork: Network) => {
    const validToNetworks = getValidToNetworks({
      fromNetwork,
      type,
      contract,
    }) as string[];

    return validToNetworks.includes(toNetwork.name);
  };
  const {
    selectedNetwork: fromNetwork,
    onNetworkSelect: setFromNetwork,
    searchTerm: fromSearchTerm,
    onSearchChange: setFromSearchTerm,
    filteredChains: fromFilteredChains,
    networksByProvider: networksByProvider,
    onClose: onFromClose,
  } = useNetworkSelection(contractProvider);

  const {
    selectedNetwork: toNetwork,
    onNetworkSelect: setToNetwork,
    searchTerm: toSearchTerm,
    onSearchChange: setToSearchTerm,
    filteredChains: toFilteredChains,
    onClose: onToClose,
  } = useNetworkSelection(contractProvider, isValidToNetwork);

  const fromBridgeProps = {
    selectedNetwork: fromNetwork,
    onNetworkSelect: setFromNetwork,
    searchTerm: fromSearchTerm,
    onSearchChange: setFromSearchTerm,
    filteredChains: fromFilteredChains,
    networksByProvider: networksByProvider,
    onClose: onFromClose,
    dialogTitle: "Select a network",
    dialogDescription: "Select the network you want to bridge from",
    commandHeading: "Select a network",
  };

  const toBridgeProps = {
    selectedNetwork: toNetwork,
    onNetworkSelect: setToNetwork,
    searchTerm: toSearchTerm,
    onSearchChange: setToSearchTerm,
    filteredChains: toFilteredChains,
    onClose: onToClose,
    dialogTitle: "Select a network",
    dialogDescription: "Select the network you want to bridge to",
    commandHeading: "Select a network",
  };

  function swapSelectedChain() {
    setSelectedChain1(selectedChain2);
    setSelectedChain2(selectedChain1);
  }

  const handleMintButton = () => {
    console.log("Mint button clicked");
  };

  const handleBridgeButton = () => {
    console.log("Bridge button clicked");
  };

  const handleMaxButton = () => {
    console.log("Max button clicked");
  };

  useEffect(() => {
    // If the currently selected "To" network is not valid after the "From" network changes, reset it.
    if (!isValidToNetwork(toNetwork)) {
      const validNetworks = getValidToNetworks({
        fromNetwork,
        type,
        contract,
      }) as string[];
      const defaultNetwork = networksByProvider.find((network) =>
        validNetworks.includes(network.name),
      );

      defaultNetwork
        ? setToNetwork(defaultNetwork as Network)
        : setToNetwork(networksByProvider[0] as Network);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromNetwork, toNetwork, setToNetwork]);

  return (
    <div className=" z-10 py-20 md:py-16 flex items-center justify-center min-h-[90vh]">
      <div className="bg-gradient my-auto md:rounded-xl md:w-8/12 lg:w-5/12 w-full items-start">
        <div className="p-8 md:py-10 md:px-16 flex flex-col gap-8">
          <Typography variant={"h3"} className=" dark:text-black text-center">
            {headerDescription}
          </Typography>
          <DashboardCard className="px-6 py-4 mx-auto w-max  bg-white/30">
            <Typography
              variant={"smallTitle"}
              className="dark:text-black font-semibold"
            >
              Your Balance: 0
            </Typography>
          </DashboardCard>
          <div className=" flex items-center md:flex-row flex-col justify-between gap-4 md:gap-6">
            <NetworkModal props={fromBridgeProps} />
            <div
              onClick={swapSelectedChain}
              className=" active:scale-90 transition-all ease-in-out cursor-pointer"
            >
              <ArrowUpDown className="md:hidden block md:h-12 md:w-12" />
              <ArrowLeftRight className="hidden md:block md:h-12 md:w-12" />
            </div>
            <Select
              value={selectedChain2}
              onValueChange={(value) => {
                setSelectedChain2(value);
              }}
            ></Select>
            <NetworkModal props={toBridgeProps} />
          </div>
          <Label className=" space-y-2">
            <Typography
              variant={"smallTitle"}
              className="dark:text-black font-semibold"
            >
              Step 1 : {stepDescription.mint}
            </Typography>
            <div className="relative">
              <Input
                placeholder="Enter amount to mint"
                className="p-6 py-7 rounded-xl dark:bg-white dark:text-black"
              />
              <Button
                size={"sm"}
                className="absolute right-4 top-3.5 h-8 dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-lg "
                onClick={handleMintButton}
              >
                Mint
              </Button>
            </div>
          </Label>
          <Label className=" space-y-2">
            <Typography
              variant={"smallTitle"}
              className="dark:text-black font-semibold"
            >
              Step 2 : {stepDescription.bridge}
            </Typography>
            <div className="relative">
              <Input
                placeholder="Enter amount to bridge"
                className="p-6 py-7 rounded-xl dark:bg-white dark:text-black"
              />
              <Button
                size={"sm"}
                className="absolute right-4 top-3.5 h-8 dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-lg "
                onClick={handleMaxButton}
              >
                Max
              </Button>
            </div>
          </Label>

          <Button
            className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
            onClick={handleBridgeButton}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
