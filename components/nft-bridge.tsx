import React, { useEffect, useState } from "react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useNetworkSelection } from "@/common/hooks/useNetworkSelection";
import { Network } from "@/common/types/network";
import { getValidToNetworks } from "@/common/utils/getters/getValidToNetworks";
import { handleBridging } from "@/common/utils/interaction/handlers/handleBridging";

import NetworkModal from "./networkModal";
import { handleErrors } from "@/common/utils/interaction/handlers/handleErrors";

import { useAccount, useSwitchChain } from "wagmi";

interface NFTBridgeProps {
  params: {
    contractProvider: { type: string; contract: string };
    stepDescription: string;
  };
}

export default function NFTBridge({ params }: NFTBridgeProps) {
  // TODO: The idea here is that we're going to display FROM and TO network selection modals with search bar functionality to the user
  // We will only display the networks that are supported by the contract && in combination that is being supported by layerzero endpoints
  // ^^^ this is still something that I need to look into

  // The user will select FROM network and TO network, enter the NFT ID and click on the bridge button
  // (if user is navigating directly from the minting page we want to pass minted NFT ID as a value to the URL and enter this for him)

  // If user is on the correct network we will call bridge function and send metamask popup
  // If user isn't connected to this network we will request network change
  // If user wallet isn't connected we will request to connect a wallet

  const { contractProvider, stepDescription } = params;
  const { type, contract } = contractProvider;
  const { openConnectModal } = useConnectModal();
  const { chains, switchChain } = useSwitchChain();
  const account = useAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [nftId, setNftId] = useState("");
  const [showBridgingModal, setShowBridgingModal] = useState(false);
  // const [wrongNetwork, setWrongNetwork] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const isConnected = account !== undefined && account !== null;
  const isCorrectNetwork = fromNetwork.id === (account.chainId ?? "");

  const handleBridgeButton = async () => {
    if (!isConnected && openConnectModal) {
      openConnectModal();
      return;
    } else if (!isCorrectNetwork && switchChain) {
      switchChain({ chainId: fromNetwork.id });
      return;
    } else {
      const TOKEN_ID = nftId;
      try {
        setIsLoading(true);
        setShowBridgingModal(true);
        console.log(
          `Sending NFT #${TOKEN_ID} from ${fromNetwork.name} to ${toNetwork.name}`,
        );

        const result = await handleBridging({
          TOKEN_ID,
          fromNetwork,
          toNetwork,
          contractProvider,
          address: account.address ? account.address : "",
        });

        const txHash = result ? result.hash : "";

        setNftId("");
        setIsLoading(false);
        setTxHash(txHash);
      } catch (e) {
        console.error(e);
        setIsLoading(false);
        handleErrors({ e, setErrorMessage });
      }
    }
  };

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

  useEffect(() => {
    // If the currently selected "To" network is not valid after the "From" network changes, reset it.
    // TODO: Make this a reusable hook or function
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
      <div className="bg-gradient my-auto md:rounded-xl md:w-7/12 lg:w-5/12 w-full items-start">
        <div className="p-8 md:p-14 md:px-16 flex flex-col gap-6">
          <Typography variant={"h3"} className=" dark:text-black text-center">
            Step 2 : {stepDescription}
          </Typography>

          <div className="flex flex-col">
            <Label className=" space-y-2">
              <Typography variant={"large"} className="dark:text-black">
                Bridge From
              </Typography>
            </Label>

            <NetworkModal props={fromBridgeProps} />
          </div>

          <div className="flex flex-col">
            <Label className=" space-y-2 w-full ">
              <Typography variant={"large"} className="dark:text-black">
                Bridge To
              </Typography>
            </Label>
            <NetworkModal props={toBridgeProps} />
          </div>

          <Label className=" space-y-2">
            <Typography variant={"large"} className="dark:text-black">
              NFT ID
            </Typography>
            <Input
              placeholder="ID"
              className="p-6 rounded-xl dark:bg-white dark:text-black"
            />
          </Label>

          <Button
            className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
            onClick={handleBridgeButton}
          >
            Bridge
          </Button>
        </div>
      </div>
    </div>
  );
}
