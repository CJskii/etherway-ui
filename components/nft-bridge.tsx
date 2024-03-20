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

import BridgeModal from "./bridge-modal";
import { ContractType } from "@prisma/client";
import { updateBridgeData } from "@/common/utils/api/bridge";

interface NFTBridgeProps {
  params: {
    contractProvider: { type: string; contract: string };
    stepDescription: string;
  };
}

export default function NFTBridge({ params }: NFTBridgeProps) {
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
  const [apiError, setApiError] = useState("");

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
    if (nftId === "" || fromNetwork.id === toNetwork.id) return;
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

        const data = await handleBridging({
          TOKEN_ID,
          fromNetwork,
          toNetwork,
          contractProvider,
          address: account.address ? account.address : "",
        });

        if (data?.APIerror) {
          // @ts-ignore
          setApiError(data.APIerror);
        }

        if (data?.response) {
          handleAPIError(data.response);
        }

        // data -> { tx, response , APIError , BridgeError }

        const txHash = data?.tx ? data.tx.hash : "";

        // setNftId("");
        setIsLoading(false);
        setTxHash(txHash);
      } catch (e) {
        console.error(e);
        setIsLoading(false);
        handleErrors({ e, setErrorMessage });
      }
    }
  };

  const tryAPICall = async () => {
    try {
      if (account && account.address) {
        let _contractType: ContractType = ContractType.OFT_ERC20;

        if (contractProvider.type == "layerzero") {
          if (contractProvider.contract == "ONFT") {
            _contractType = ContractType.ONFT_ERC721;
          } else if (contractProvider.contract == "OFT") {
            _contractType = ContractType.OFT_ERC20;
          } else {
            return;
          }
        } else if (contractProvider.type == "hyperlane") {
          if (contractProvider.contract == "ONFT") {
            _contractType = ContractType.HONFT_ERC721;
          } else if (contractProvider.contract == "OFT") {
            _contractType = ContractType.HOFT_ERC20;
          } else {
            return;
          }
        } else {
          return;
        }

        const { response, error: apiError } = await updateBridgeData({
          address: account.address,
          contractType: _contractType,
          chainId: fromNetwork.id,
        });

        // TODO: Display the Toast Error
        // @ts-ignore
        setApiError(apiError);

        if (response) {
          handleAPIError(response);
        }
      } else {
        console.log("No Account found !!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAPIError = (response: Response) => {
    // TODO: Display the Toast Error

    if (response?.status == 200) {
      console.log("API Call on update on db Completed");
    } else if (response?.status == 405) {
      console.log("Method Not allowed");
      setApiError("Method Not allowed");
    } else if (response?.status == 400) {
      // let _error = await response.json();
      setApiError("Missing parameters");
      console.error("Missing parameters");
    } else if (response?.status == 401) {
      console.error("You must be signed in to interact with the API");
      setApiError("You must be signed in to interact with the API");
    } else if (response?.status == 500) {
      console.error("Internal Server Error");
      setApiError("Internal Server Error");
    } else {
      console.error("Error occured during APICall");
      setApiError("Error occured during APICall");
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

          <BridgeModal
            props={{
              isOpen: showBridgingModal,
              setIsOpen: setShowBridgingModal,
              isLoading: isLoading,
              modalTitle: "NFT Bridged",
              modalDescription: "Your NFT has been Bridged successfully",
              modalButtonText: "View NFT",
              errorMessage: errorMessage,
              setErrorMessage: setErrorMessage,
              nftId: nftId,
            }}
          />

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
              onChange={(e) => setNftId(e.target.value)}
            />
          </Label>
          {txHash ? (
            <>
              {apiError ? (
                <Button
                  className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
                  onClick={tryAPICall}
                >
                  Try Again
                </Button>
              ) : (
                <a>Bridge Complete</a>
              )}
            </>
          ) : (
            <Button
              className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
              onClick={handleBridgeButton}
            >
              Bridge
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
