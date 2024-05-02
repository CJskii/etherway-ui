import React, { useEffect, useState } from "react";
import { Typography } from "@/src/components/ui/typography";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useNetworkSelection } from "@/src/hooks/useNetworkSelection";
import { Network } from "@/src/types/network";
import { getValidToNetworks } from "@/src/utils/helpers/getValidToNetworks";
import { handleBridging } from "@/src/utils/contracts/handlers/handleBridging";
import NetworkModal from "../networkModal";
import { handleErrors } from "@/src/utils/contracts/handlers/handleErrors";
import { useAccount, useSwitchChain } from "wagmi";
import BridgeModal from "../modal-bridge";
import { ContractType } from "@prisma/client";
import { updateBridgeData } from "@/src/utils/api/bridge";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { handleAPIError } from "@/src/utils/api/handleError";

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
  const { switchChain } = useSwitchChain();
  const router = useRouter();

  useEffect(() => {
    const queryParam = router.query;
    setNftId(`${queryParam.nftId ? queryParam.nftId : ""}`);
  }, [router]);
  const account = useAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [nftId, setNftId] = useState("");
  const [showBridgingModal, setShowBridgingModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [apiError, setApiError] = useState<boolean>(false);

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

  const isConnected = account.isConnected;
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
          setApiError(true);
          toast.error(`${data.APIerror}`);
        }

        if (data?.response) {
          handleAPIError({ response: data.response, toast, setApiError });
        }

        const txHash = data?.tx ? data.tx.hash : "";

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
        if (!apiError) {
          console.log("NO ERROR RECORDED , CAN'T TRY AGAIN");
          return;
        }
        let _contractType: ContractType = ContractType.ONFT_ERC721;

        if (contractProvider.type == "layerzero") {
          if (contractProvider.contract == "ONFT") {
            _contractType = ContractType.ONFT_ERC721;
          } else {
            return;
          }
        } else if (contractProvider.type == "hyperlane") {
          if (contractProvider.contract == "ONFT") {
            _contractType = ContractType.HONFT_ERC721;
          } else {
            return;
          }
        } else {
          return;
        }

        const { response, error: _apiError } = await updateBridgeData({
          address: account.address,
          contractType: _contractType,
          chainId: fromNetwork.id,
        });

        if (_apiError) {
          // @ts-ignore
          setApiError(true);
          toast.error(`${_apiError}`);
        }

        if (response) {
          handleAPIError({ response, toast, setApiError });
        }
      } else {
        console.log("No Account found !!");
      }
    } catch (error) {
      console.error(error);
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
              errorMessage: errorMessage,
              setErrorMessage: setErrorMessage,
              nftId: nftId,
              errorHeader: "There was an error while bridging your NFT",
              successHeader: "NFT Sent",
              loadingHeader: "We're working hard to bridge your NFT",
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
              value={nftId}
              placeholder="ID"
              className="p-6 rounded-xl dark:bg-white dark:text-black"
              onChange={(e) => setNftId(e.target.value)}
            />
          </Label>
          {/* {txHash ? (
            <>
              {apiError ? (
                <Button
                  className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
                  onClick={tryAPICall}
                >
                  Try Again
                </Button>
              ) : (
                <></>
              )}
            </>
          ) : (
            <Button
              className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
              onClick={handleBridgeButton}
            >
              Bridge
            </Button>
          )} */}
          <Button
            className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
            onClick={txHash && apiError ? tryAPICall : handleBridgeButton}
          >
            {txHash && apiError ? "Try again" : "Bridge"}
          </Button>
        </div>
      </div>
    </div>
  );
}
