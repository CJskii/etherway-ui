import React, { useEffect, useState, useRef } from "react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeftRight, ArrowUpDown } from "lucide-react";
import DashboardCard from "@/components/dashboard/dashboard-card";

import NetworkModal from "./networkModal";
import { useNetworkSelection } from "@/common/hooks/useNetworkSelection";
import { getValidToNetworks } from "@/common/utils/getters/getValidToNetworks";
import { Network } from "@/common/types/network";

import {
  useAccount,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { handleMinting } from "@/common/utils/interaction/handlers/handleMinting";
import { handleErrors } from "@/common/utils/interaction/handlers/handleErrors";
import { handleBridging } from "@/common/utils/interaction/handlers/handleBridging";
import { getUserBalance } from "@/common/utils/getters/getBalance";
import { activeChains } from "@/constants/config/chainsConfig";
import TokenMintModal from "./modal-mint-token";
import TokenBridgeModal from "./modal-bridge-token";
import { toast } from "sonner";
import { ContractType, InteractionType } from "@prisma/client";
import { updateBridgeData } from "@/common/utils/api/bridge";
import { updateMintData } from "@/common/utils/api/mintAPI";
import { updateInteractionData } from "@/common/utils/api/interactions";

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
  const { contractProvider, headerDescription, stepDescription } = params;
  const { type, contract } = contractProvider;
  const { openConnectModal } = useConnectModal();
  const { chains, switchChain } = useSwitchChain();
  const account = useAccount();
  const userBalanceRef = useRef<HTMLInputElement>(null);

  const [mintAmount, setMintAmount] = useState(0);
  const [bridgeAmount, setBridgeAmount] = useState("");
  const [showMintModal, setShowMintModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [showBridgingModal, setShowBridgingModal] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [apiMintError, setApiMintError] = useState(false);
  const [apiBridgeError, setApiBridgeError] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
  const [hasBridged, setHasBridged] = useState(false);

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

  const isConnected = account.isConnected;
  const isCorrectNetwork = fromNetwork.id === (account.chainId ?? "");

  const handleMintButton = async () => {
    if (mintAmount === 0) return;
    if (!isConnected && openConnectModal) {
      openConnectModal();
      return;
    } else if (!isCorrectNetwork && switchChain) {
      switchChain({ chainId: fromNetwork.id });
      return;
    } else {
      try {
        setIsLoading(true);
        setShowMintModal(true);

        if (!account.address) {
          setIsLoading(false);
          setShowMintModal(false);
          return;
        }

        // setIsMinting(true);
        const data = await handleMinting({
          mintNetwork: fromNetwork,
          contractProvider,
          userAddress: account.address,
          mintQuantity: mintAmount,
        });

        // TODO: Might want to return the execution if we have an API error
        if (data?.apiError) {
          // @ts-ignore
          setApiMintError(true);
          toast.error(`${data.apiError}`);
        }

        if (data?.response) {
          handleAPIError(data.response);
          if (data?.response.status != 200) {
            setApiMintError(true);
          }
        }

        if (!data?.result) {
          throw new Error("Failed to mint NFT");
        }

        const { mintedID, txHash } = data.result;
        const newBalance = userBalance > 0 ? userBalance + mintedID : mintedID;

        setTxHash(txHash);
        setUserBalance(Number(newBalance));
        // setIsMinting(false);
        setHasMinted(true);
        setIsLoading(false);
      } catch (e) {
        console.error(e);
        handleErrors({ e, setErrorMessage });
        setShowMintModal(true);
        // setIsMinting(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBridgeButton = async () => {
    if (bridgeAmount === "" || fromNetwork.id === toNetwork.id) return;
    if (!isConnected && openConnectModal) {
      openConnectModal();
      return;
    } else if (!isCorrectNetwork && switchChain) {
      switchChain({ chainId: fromNetwork.id });
      return;
    } else {
      console.log(
        `Bridging ${bridgeAmount} MIN on ${fromNetwork.name} network...`,
      );

      try {
        setIsLoading(true);
        setShowBridgingModal(true);

        // setIsBridging(true);
        if (Number(bridgeAmount) > userBalance)
          throw new Error("insufficient OFT balance for transfer");

        const result = await handleBridging({
          TOKEN_ID: bridgeAmount,
          fromNetwork,
          toNetwork,
          contractProvider,
          address: account.address ? account.address : "",
        });

        if (!result) {
          throw new Error("Failed to mint NFT");
        }

        const { tx, bridgeError, response, apiError } = result;

        if (apiError) {
          // @ts-ignore
          setApiBridgeError(true);
          toast.error(`${apiError}`);
        }

        if (response) {
          handleAPIError(response);
          if (response.status != 200) {
            setApiBridgeError(true);
          }
        }

        const newBalance = userBalance - Number(bridgeAmount);

        setTxHash(tx.hash);
        setUserBalance(newBalance > 0 ? newBalance : 0);
        setHasBridged(true);
        // setIsBridging(false);
        setIsLoading(false);
      } catch (e) {
        console.error(e);
        handleErrors({ e, setErrorMessage });
        setShowBridgingModal(true);
        // setIsBridging(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAPIError = (response: Response) => {
    // TODO: Display the Toast Error

    if (response?.status == 200) {
      console.log("API Call on update on db Completed");
      toast.success("Interaction successfully recorded");
    } else if (response?.status == 405) {
      console.log("405: Method Not allowed");
      toast.error("405: Method Not allowed");
    } else if (response?.status == 400) {
      // let _error = await response.json();
      console.error("400: Missing parameters");
      toast.error("400: Missing parameters");
    } else if (response?.status == 401) {
      console.error("You must be signed in to interact with the API");
      toast.error("401: You must be signed in to interact with the API");
    } else if (response?.status == 500) {
      console.error("Internal Server Error");
      toast.error("500: Internal Server Error");
    } else {
      console.error("Error occured during APICall");
      toast.error("Error occured during APICall");
    }
  };

  const tryMintingAPICall = async () => {
    try {
      if (account && account.address) {
        if (apiMintError) {
          console.log("NO ERROR RECORDED , CAN'T TRY AGAIN");
          return;
        }
        let _contractType: ContractType = ContractType.OFT_ERC20;
        let _interactionType: InteractionType = InteractionType.MINT_OFT;

        if (contractProvider.type == "layerzero") {
          if (contractProvider.contract == "OFT") {
            _contractType = ContractType.OFT_ERC20;
            _interactionType = InteractionType.MINT_OFT;
          } else {
            return;
          }
        } else if (contractProvider.type == "hyperlane") {
          if (contractProvider.contract == "OFT") {
            _contractType = ContractType.HOFT_ERC20;
            _interactionType = InteractionType.MINT_OFT;
          } else {
            return;
          }
        } else {
          return;
        }

        const { response, error: _apiError } = await updateInteractionData({
          address: account.address,
          contractType: _contractType,
          chainId: fromNetwork.id,
          interactionType: _interactionType,
          amount: Number(bridgeAmount),
        });

        // TODO: Display the Toast Error
        // @ts-ignore
        if (_apiError) {
          // @ts-ignore
          setApiError(_apiError);
          toast.error(`${_apiError}`);
        }

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

  const tryBridgingAPICall = async () => {
    try {
      if (account && account.address) {
        if (apiBridgeError) {
          console.log("NO ERROR RECORDED , CAN'T TRY AGAIN");
          return;
        }
        let _contractType: ContractType = ContractType.OFT_ERC20;
        let _interactionType: InteractionType = InteractionType.MINT_OFT;

        if (contractProvider.type == "layerzero") {
          if (contractProvider.contract == "OFT") {
            _contractType = ContractType.OFT_ERC20;
            _interactionType = InteractionType.BRIDGE_OFT;
          } else {
            return;
          }
        } else if (contractProvider.type == "hyperlane") {
          if (contractProvider.contract == "OFT") {
            _contractType = ContractType.HOFT_ERC20;
            _interactionType = InteractionType.BRIDGE_OFT;
          } else {
            return;
          }
        } else {
          return;
        }

        const { response, error: apiError } = await updateInteractionData({
          address: account.address,
          contractType: _contractType,
          chainId: fromNetwork.id,
          interactionType: _interactionType,
          amount: Number(bridgeAmount),
        });

        // TODO: Display the Toast Error
        if (apiError) {
          // @ts-ignore
          setApiError(apiError);
          toast.error(`${apiError}`);
        }

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

  const handleSwapButton = () => {
    const temp = fromNetwork;
    setFromNetwork(toNetwork);
    setToNetwork(temp);
  };

  const handleMaxButton = () => {
    setBridgeAmount(userBalance.toString());
    if (userBalanceRef.current) {
      userBalanceRef.current.value = userBalance.toString();
    }
  };

  useEffect(() => {
    const getBalance = async () => {
      if (isPageLoaded && fromNetwork.id === account.chain?.id) {
        getUserBalance({
          fromNetwork,
          account,
          type,
          contract,
          setUserBalance,
        });
      }
    };
    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPageLoaded, fromNetwork, toNetwork, setToNetwork]);

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
    setIsPageLoaded(true);
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
              Your Balance: {userBalance}
            </Typography>
          </DashboardCard>

          <TokenMintModal
            props={{
              isOpen: showMintModal,
              setIsOpen: setShowMintModal,
              isLoading: isLoading,
              modalTitle: "Minting Tokens",
              modalDescription: "This might take a few seconds...",
              modalButtonText: "Mint",
              errorMessage: errorMessage,
              setErrorMessage: setErrorMessage,
              amount: mintAmount,
            }}
          />

          <TokenBridgeModal
            props={{
              isOpen: showBridgingModal,
              setIsOpen: setShowBridgingModal,
              isLoading: isLoading,
              modalTitle: "Bridging Tokens",
              modalDescription: "This might take a few seconds...",
              modalButtonText: "Bridge",
              errorMessage: errorMessage,
              setErrorMessage: setErrorMessage,
              amount: Number(bridgeAmount),
            }}
          />

          <div className="flex items-center md:flex-row flex-col justify-between gap-4 md:gap-6">
            <div className="grid grid-cols-[1fr,auto,1fr] gap-2 w-full">
              <NetworkModal props={fromBridgeProps} />
              <div
                onClick={handleSwapButton}
                className="flex justify-center items-center justify-self-center self-center active:scale-90 transition-all ease-in-out cursor-pointer w-12 h-12"
              >
                <ArrowUpDown className="md:hidden block md:h-12 md:w-12" />
                <ArrowLeftRight className="hidden md:block md:h-12 md:w-12" />
              </div>
              <NetworkModal props={toBridgeProps} />
            </div>
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
                onChange={(e) => setMintAmount(Number(e.target.value))}
                type="number"
              />
              {/* {hasMinted ? (
                <>
                  {apiMintError ? (
                    <Button
                      size={"sm"}
                      className="absolute right-4 top-3.5 h-8 dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-lg "
                      onClick={tryMintingAPICall}
                    >
                      Try Again
                    </Button>
                  ) : (
                    <Button
                      disabled={true}
                      size={"sm"}
                      className="absolute right-4 top-3.5 h-8 dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-lg "
                      onClick={handleMintButton}
                    >
                      Mint
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  size={"sm"}
                  className="absolute right-4 top-3.5 h-8 dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-lg "
                  onClick={handleMintButton}
                >
                  Mint
                </Button>
              )} */}
              <Button
                size={"sm"}
                className="absolute right-4 top-3.5 h-8 dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-lg "
                onClick={
                  hasMinted && apiMintError
                    ? tryMintingAPICall
                    : handleMintButton
                }
              >
                {hasMinted && apiMintError ? "Try again" : "Mint"}
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
                onChange={(e) => setBridgeAmount(e.target.value)}
                type="number"
                ref={userBalanceRef}
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
          {/* {hasBridged ? (
            <>
              {apiBridgeError ? (
                <Button
                  className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
                  onClick={tryBridgingAPICall}
                >
                  Try Again
                </Button>
              ) : (
                <Button
                  disabled={true}
                  className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
                  onClick={handleBridgeButton}
                >
                  Send
                </Button>
              )}
            </>
          ) : (
            <Button
              className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
              onClick={handleBridgeButton}
            >
              Send
            </Button>
          )} */}
          <Button
            className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
            onClick={apiBridgeError ? tryBridgingAPICall : handleBridgeButton}
          >
            {hasBridged && apiBridgeError ? "Try again" : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
