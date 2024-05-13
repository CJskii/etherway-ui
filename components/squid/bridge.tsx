import { Button } from "@/components/ui/button";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import {
  RouteType,
  executeSquidRoute,
  getSquidChains,
  getSquidRoute,
  getSquidTokens,
  getTxStatus,
  integratorId,
} from "@/common/utils/squid/squidRouter";
import { useEffect, useState } from "react";
import getProviderOrSigner from "@/common/utils/getters/getProviderOrSigner";
import { Signer } from "ethers";
import { Typography } from "../ui/typography";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import SquidNetworkModal, { NetworkModalProps } from "./network-modal";
import SquidTokenModal, { TokenModalProps } from "./token-modal";

import {
  ChainData,
  ChainName,
  GetRoute,
  RouteData,
  TokenData,
} from "@0xsquid/sdk";
import { useChainSelection } from "@/common/hooks/useChainSelection";
import { useTokenSelection } from "@/common/hooks/useTokenSelection";
import { formatUnits, parseUnits } from "viem";
import { Separator } from "@radix-ui/react-separator";
import { Skeleton } from "../ui/skeleton";
import { requestNetworkSwitch } from "@/common/utils/requestNetworkSwitch";
import { useChainModal } from "@rainbow-me/rainbowkit";
import Loader from "@/components/ui/loader";
import { toast } from "sonner";
import StatusModal from "./status-modal";
import { FeeDetails } from "./fee-display";
import { CheckBoxComponent } from "./check-box";

export const SquidBridge = () => {
  // DO WE WANT TO MANAGE ENTIRE LOGIC OF NETWORK AND TOKEN SELECTIONS WITHIN THIS COMPONENT?

  // IF YES THEN WE SHOULD HAVE SELECTIONS HANDLERS HERE AND PASS THEM DOWN TO MODALS
  // IF NO THEN WE SHOULD HAVE SELECTIONS HANDLERS IN MODALS AND PASS THEM BACK UP TO THIS COMPONENT

  // THEN ON BRIDGE BUTTON CLICK WE CAN GET THE SELECTED TOKENS AND NETWORKS FROM MODALS AND CALL THE BRIDGE FUNCTION
  const { address } = useAccount();
  const [route, setRoute] = useState<RouteData | undefined>();
  const [requestId, setRequestId] = useState<string | undefined>();
  const [inAmount, setInAmount] = useState<number>();
  const [outAmount, setOutAmount] = useState<number>();
  const [txHash, setTxHash] = useState<string>();
  const [userBalance, setUserBalance] = useState<number>(0);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toAddress, setToAddress] = useState<string>();
  const [isFetchingRoute, setIsFetchingRoute] = useState<boolean>(false);
  const [isExecutingTransaction, setIsExecutingTransaction] =
    useState<boolean>(false); // might not need this state, but could be useful to show different stuff depending if we're fetching routes or executing tx
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const account = useAccount();
  const { switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();

  const handleBridgeButton = async () => {
    try {
      if (!route) {
        return;
      }

      const signer = await getProviderOrSigner(true);

      const txReciept = await executeSquidRoute(route, signer as Signer);
      console.log(txReciept);
      setTxHash(txReciept?.transactionHash);

      console.log(`Bridging complete with tx ${txReciept?.transactionHash}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePreviewButton = async () => {
    setIsFetchingRoute(true);
    if (!isConnected && openConnectModal) {
      openConnectModal();
      setIsFetchingRoute(false);
      return;
    }
    if (!isCorrectNetwork && fromChain?.chainId) {
      console.log(fromChain.chainId);
      try {
        await requestNetworkSwitch(fromChain.chainId, openChainModal);
      } catch (error) {
        console.error("Failed to switch network:", error);
        setIsFetchingRoute(false);
        return;
      }
    }

    if (inAmount == undefined || inAmount == 0) {
      toast.error("Please enter an amount to bridge");
      setIsFetchingRoute(false);
      return;
    }

    try {
      if (fromChain && toChain && fromToken && toToken) {
        const routeParams = {
          fromChain: fromChain.chainId,
          fromAmount: parseUnits(
            inAmount.toString(),
            fromToken.decimals,
          ).toString(),
          fromToken: fromToken.address,
          toChain: toChain.chainId,
          toToken: toToken.address,
          fromAddress: address ? address : `0x`,
          toAddress: toAddress ? toAddress : address ? address : `0x`,
          slippage: 1,
        };

        await fetchRoute(routeParams);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      toast.error("Failed to fetch route. Please try again.");
    } finally {
      setIsFetchingRoute(false);
    }
  };

  const {
    selectedchain: fromChain,
    chains: fromChains,
    onChainSelect: setFromNetwork,
  } = useChainSelection(ChainName.ARBITRUM);

  const {
    selectedchain: toChain,
    chains: toChains,
    onChainSelect: setToNetwork,
  } = useChainSelection("blast");

  const {
    selectedtoken: fromToken,
    tokens: fromTokens,
    onTokenSelect: setFromToken,
  } = useTokenSelection(
    fromChain,
    42161,
    "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
  );

  const {
    selectedtoken: toToken,
    tokens: toTokens,
    onTokenSelect: setToToken,
  } = useTokenSelection(
    toChain,
    81457,
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  );

  const isConnected = account.isConnected;
  const isCorrectNetwork = fromChain
    ? fromChain.chainId === (account.chainId ?? "")
    : false;

  // reconfigure the chainId
  const result = useBalance({
    address: fromToken
      ? (fromToken.address as `0x${string}`)
      : "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
  });

  const handleMaxButton = () => {
    if (!result.data?.value) {
      return;
    }
    setInAmount(Number(formatUnits(result.data?.value, result.data?.decimals)));
  };

  const fromChainProps: NetworkModalProps = {
    selectedNetwork: fromChain,
    onNetworkSelect: setFromNetwork,
    filteredChains: fromChains,
    dialogTitle: "Select a network to bridge from",
    dialogDescription: "Select a network to bridge from",
    commandHeading: "Select a network",
  };

  const toChainProps: NetworkModalProps = {
    selectedNetwork: toChain,
    onNetworkSelect: setToNetwork,
    filteredChains: toChains,
    dialogTitle: "Select a network to bridge to",
    dialogDescription: "Select a network to bridge to",
    commandHeading: "Select a network",
  };

  const fromTokenProps: TokenModalProps = {
    selectedToken: fromToken,
    onTokenSelect: setFromToken,
    filteredTokens: fromTokens,
    dialogTitle: "Select a token to bridge from",
  };

  const toTokenProps: TokenModalProps = {
    selectedToken: toToken,
    onTokenSelect: setToToken,
    filteredTokens: toTokens,
    dialogTitle: "Select a token to bridge to",
  };

  // might want to fetch the latest route every 20 seconds to refresh the price
  const fetchRoute = async (routeParams: GetRoute) => {
    try {
      const _route = await getSquidRoute(routeParams);
      if (_route) {
        setRoute(_route.route);
        setRequestId(_route.requestId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // TODO: call getStatus repeatedly after the tx is Sent to show the current status of tx
  const getStatus = async () => {
    try {
      if (
        !txHash ||
        !requestId ||
        fromChain?.chainId == undefined ||
        toChain?.chainId == undefined
      ) {
        return;
      }
      const getStatusParams = {
        transactionId: txHash,
        requestId: requestId,
        integratorId: integratorId,
        fromChainId: fromChain.chainId.toString(),
        toChainId: toChain.chainId.toString(),
      };

      const status = await getTxStatus(getStatusParams);
      console.log(status);

      // {
      //   (SUCCESS = "success"),
      //     (NEEDS_GAS = "needs_gas"),
      //     (ONGOING = "ongoing"),
      //     (PARTIAL_SUCCESS = "partial_success"),
      //     (NOT_FOUND = "not_found");
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const formatToFixed2 = ({
    value,
    decimals,
  }: {
    value: bigint;
    decimals: number;
  }) => {
    const formattedValue = formatUnits(value, decimals);
    return parseFloat(formattedValue).toFixed(2);
  };

  // UNCOMMENT TO TEST STATUS MODAL

  // useEffect(() => {
  //   setShowStatusModal(true);
  //   setIsLoading(true);
  // }, []);

  return (
    <div className=" z-10 py-20 md:py-16 flex items-center justify-center flex-col min-h-[90vh]">
      <StatusModal
        props={{
          isOpen: showStatusModal,
          setIsOpen: setShowStatusModal,
          isLoading: isLoading,
          errorMessage: errorMessage,
          setErrorMessage: setErrorMessage,
          fromNetwork: fromChain as ChainData,
          toNetwork: toChain as ChainData,
          modalTitle: "",
          modalDescription: "",
          modalButtonText: "",
        }}
      />
      <div className="bg-gradient my-auto md:rounded-xl md:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-4/12 w-full items-start rounded-2xl">
        <div className="py-8 px-4 md:p-8 flex flex-col gap-6">
          <Typography variant={"h3"} className=" dark:text-black text-center">
            Bridge
          </Typography>

          {/* BRIDGE FROM NETWORK  */}
          <div className="flex flex-col">
            <Label className=" space-y-2">
              <Typography variant={"large"} className="dark:text-black">
                From
              </Typography>
            </Label>
            <div className="flex flex-col bg-white rounded-lg p-2 md:p-4">
              <div className="flex justify-between items-center">
                <SquidNetworkModal props={fromChainProps} />
                <div className="flex items-center justify-center gap-2">
                  <Typography
                    variant="small"
                    className="dark:text-black font-semibold"
                  >
                    {result.data
                      ? formatToFixed2({
                          value: result.data.value,
                          decimals: result.data.decimals,
                        })
                      : "0.00"}{" "}
                    {fromToken?.symbol}
                  </Typography>
                  <Button
                    variant={"etherway"}
                    onClick={handleMaxButton}
                    className="text-xs h-6 rounded-md px-2 text-white"
                  >
                    MAX
                  </Button>
                </div>
              </div>
              <Separator
                orientation="horizontal"
                className="my-2 border-[1px]  dark:border-black/20 rounded-lg w-full place-self-center"
              />
              <div className="flex justify-between items-center">
                <SquidTokenModal props={fromTokenProps} />
                <div className="flex flex-col items-end justify-center">
                  <Input
                    type="number"
                    className="text-right text-xs h-6 border-0 w-28 px-2 rounded-xl dark:bg-white dark:text-black dark:focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 "
                    placeholder="Enter amount"
                    onChange={(e) => setInAmount(Number(e.target.value))}
                  />
                  {isFetchingRoute ? (
                    <Skeleton className="h-5 w-12 rounded-xl" />
                  ) : route?.estimate ? (
                    <Typography
                      variant="muted"
                      className="dark:text-black py-0 px-2 text-sm"
                    >
                      ${route?.estimate.fromAmountUSD}
                    </Typography>
                  ) : (
                    <Skeleton className="h-5 w-12 rounded-xl invisible" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* BRIDGE TO NETWORK  */}
          <div className="flex flex-col">
            <Label className=" space-y-2 w-full ">
              <Typography variant={"large"} className="dark:text-black">
                To
              </Typography>
            </Label>
            <div className="flex flex-col bg-white rounded-lg p-2 md:p-4">
              <div className="flex justify-between items-center">
                <SquidNetworkModal props={toChainProps} />
              </div>
              <Separator
                orientation="horizontal"
                className="my-2 border-[1px]  dark:border-black/20 rounded-lg w-full place-self-center"
              />
              <div className="flex justify-between items-center">
                <SquidTokenModal props={toTokenProps} />
                {isFetchingRoute ? (
                  <div className="flex flex-col items-end justify-center gap-2 w-24 h-10">
                    <Skeleton className="h-4 w-20 rounded-xl" />
                    <Skeleton className="h-4 w-12 rounded-xl" />
                  </div>
                ) : route?.estimate ? (
                  <div className="flex flex-col items-end justify-center gap-2 w-24 h-10">
                    <Typography
                      variant="smallTitle"
                      className="dark:text-black font-semibold truncate px-2"
                    >
                      {toToken &&
                        `${Number(
                          formatUnits(
                            BigInt(route.estimate.toAmount),
                            toToken.decimals,
                          ),
                        ).toFixed(4)} ${toToken.symbol}`}
                    </Typography>
                    <Typography
                      variant="muted"
                      className="dark:text-black py-0 px-2 text-xs truncate"
                    >
                      ${route.estimate.toAmountUSD}
                    </Typography>
                  </div>
                ) : (
                  <div className="flex flex-col items-end justify-center gap-2 w-24 h-10">
                    {/* Invisible placeholders to maintain layout */}
                    <div className="h-4 w-20 rounded-xl invisible"></div>
                    <div className="h-4 w-12 rounded-xl invisible"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SEND TO ANOTHER ADDRESS */}
          <CheckBoxComponent {...{ isChecked, setIsChecked, setToAddress }} />

          {/* FEE DETAILS */}
          <FeeDetails
            props={{
              route: route,
              isFetchingRoute: isFetchingRoute,
              toToken: toToken,
            }}
          />

          {route ? (
            <Button
              className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
              onClick={handleBridgeButton}
            >
              {isFetchingRoute ? <Loader className="w-8 h-8" /> : "Bridge"}
            </Button>
          ) : (
            <Button
              className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
              onClick={handlePreviewButton}
            >
              {isFetchingRoute ? (
                <Loader className="w-8 h-8 text-white/70" />
              ) : (
                "Preview"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
