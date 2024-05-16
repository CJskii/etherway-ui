import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Typography } from "../ui/typography";
import { useChainSelection } from "@/common/hooks/useChainSelection";
import { useTokenSelection } from "@/common/hooks/useTokenSelection";
import useTransactionPolling from "@/common/hooks/useTransactionPooling";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance, useSwitchChain, useWalletClient } from "wagmi";
import { Signer } from "ethers";
import { toast } from "sonner";
import { requestNetworkSwitch } from "@/common/utils/requestNetworkSwitch";
import {
  formatToFixed2,
  fetchRoute,
  getStatus,
} from "@/common/utils/squid/bridgeUtils";
import { handleErrors } from "@/common/utils/interaction/handlers/handleErrors";
import getProviderOrSigner from "../../common/utils/getters/getProviderOrSigner";
import {
  executeSquidRoute,
  getSquidEvmBalance,
  getTxStatus,
  integratorId,
} from "@/common/utils/squid/squidRouter";
import { parseUnits } from "viem";

import { RouteType } from "@/common/utils/squid/squidRouter";
import { ChainName, RouteRequest } from "@0xsquid/squid-types";
import { ModalStatus } from "./status-modal";

import { TokenBalance } from "@0xsquid/sdk/dist/types";

import StatusModal from "./status-modal";
import Loader from "@/components/ui/loader";
import { FeeDetails } from "./fee-display";
import { CheckBoxComponent } from "./check-box";
import { BridgeSection, ChainProps } from "./bridge-section";
import { handleSquidBridgePoints } from "@/common/utils/interaction/handlers/handleSquidBridge";
import { useEthersSigner } from "@/common/hooks/useEthersSigner";
import { rawTokenBalance } from "@/common/utils/squid/bridgeUtils";

export const SquidBridge = () => {
  const { address } = useAccount();
  const account = useAccount();
  const [route, setRoute] = useState<RouteType | undefined>();
  const [requestId, setRequestId] = useState<string | undefined>();
  const [inAmount, setInAmount] = useState<string>("");
  const [txHash, setTxHash] = useState<string>();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toAddress, setToAddress] = useState<string>();
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isFetchingRoute, setIsFetchingRoute] = useState<boolean>(false);
  const [isExecutingTransaction, setIsExecutingTransaction] =
    useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<ModalStatus>(
    ModalStatus.APPROVE,
  );
  const [axelarURL, setAxelarURL] = useState<string>();
  const [loadingToastId, setLoadingToastId] = useState<string | number>();
  const [balanceData, setBalanceData] = useState<TokenBalance[]>();

  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();

  const signer = useEthersSigner();

  const {
    selectedChain: fromChain,
    chains: fromChains,
    onChainSelect: setFromNetwork,
  } = useChainSelection(ChainName.ARBITRUM);

  const fromChainProps = {
    selectedNetwork: fromChain,
    onNetworkSelect: setFromNetwork,
    filteredChains: fromChains,
    dialogTitle: "Select a network to bridge from",
  };

  const {
    selectedChain: toChain,
    chains: toChains,
    onChainSelect: setToNetwork,
  } = useChainSelection(ChainName.BASE);

  const toChainProps = {
    selectedNetwork: toChain,
    onNetworkSelect: setToNetwork,
    filteredChains: toChains,
    dialogTitle: "Select a network to bridge to",
  };

  const {
    selectedToken: fromToken,
    tokens: fromTokens,
    onTokenSelect: setFromToken,
  } = useTokenSelection(
    fromChain,
    fromChain?.chainId ?? 42161,
    setRoute,
    "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
  );

  const {
    selectedToken: toToken,
    tokens: toTokens,
    onTokenSelect: setToToken,
  } = useTokenSelection(
    toChain,
    toChain?.chainId ?? 8453,
    setRoute,
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  );

  const isConnected = useAccount().isConnected;
  const isCorrectNetwork = fromChain
    ? fromChain.chainId === (account.chainId ?? "")
    : false;

  const handleStopPoll = () => {
    setIsLoading(false);
    setShowStatusModal(true); // TODO: Close the modal once the Polling is stopped

    // Pop the toast
  };

  useTransactionPolling(
    txHash!,
    requestId!,
    fromChain!,
    toChain!,
    async ({ txHash, requestId, fromChain, toChain }) => {
      const getStatusParams = {
        transactionId: txHash,
        requestId: requestId,
        integratorId: integratorId,
        fromChainId: fromChain.chainId.toString(),
        toChainId: toChain.chainId.toString(),
      };

      const status = await getTxStatus(getStatusParams);
      console.log(status);

      if (!axelarURL) {
        setAxelarURL(status?.axelarTransactionUrl);
      }

      if (status?.squidTransactionStatus === "success") {
        handleStopPoll();

        if (route?.estimate.fromAmountUSD && fromChain?.chainId && address) {
          handleSquidBridgePoints({
            userAddress: address,
            chainId: Number(fromChain.chainId!),
            txAmountUSD: Number(route?.estimate.fromAmountUSD!),
          });
        }
        // TODO: Show errors just in case the points adding fails maybe using a toast

        setErrorMessage("");
        setModalStatus(ModalStatus.SUCCESS);

        if (!showStatusModal) {
          toast.dismiss();
          toast.dismiss(loadingToastId);
          toast.success("Transaction successful");
        }
      } else if (status?.squidTransactionStatus === "needs_gas") {
        handleStopPoll();
        setErrorMessage("Transaction needs more gas");
        if (!showStatusModal) {
          toast.error("Transaction in progress...");
        }
      } else if (
        status?.squidTransactionStatus === "ongoing" ||
        status?.squidTransactionStatus === "partial_success"
      ) {
        setIsLoading(true);
        // setShowStatusModal(true);
        setErrorMessage("");
        if (!showStatusModal) {
          if (!loadingToastId) {
            const toastId = toast.loading("Transaction in progress...");
            setLoadingToastId(toastId);
          }
        }
      } else if (status?.squidTransactionStatus === "not_found") {
        handleStopPoll();
        setErrorMessage("Transaction not found");
        if (showStatusModal == false) {
          toast.loading("Transaction in progress...");
        }
      }
    },
    handleStopPoll,
  );

  const handleStartPoll = (txHash: string) => {
    setTxHash(txHash);
  };

  const handleBridgeButton = async () => {
    if (!route) return;

    setIsExecutingTransaction(true);
    setShowStatusModal(true);
    setModalStatus(ModalStatus.APPROVE);

    try {
      // const signer = (await getProviderOrSigner(true)) as Signer;
      if (!signer) {
        console.log("No signer found");
        return;
      }

      console.log(signer._isSigner);
      const txReceipt = await executeSquidRoute(route, signer as Signer);
      setModalStatus(ModalStatus.AWAIT_TX);

      setTxHash(txReceipt?.transactionHash);
      if (txReceipt?.transactionHash)
        handleStartPoll(txReceipt?.transactionHash);
      setIsExecutingTransaction(false);
    } catch (error) {
      handleErrors({ e: error, setErrorMessage });
      setIsExecutingTransaction(false);
      setRoute(undefined);
    }
  };

  const handleFetchRouteButton = async () => {
    setIsFetchingRoute(true);
    if (!isConnected && openConnectModal) {
      openConnectModal();
      setIsFetchingRoute(false);
      return;
    }

    if (!isCorrectNetwork && fromChain?.chainId) {
      try {
        await requestNetworkSwitch(fromChain.chainId, openChainModal);
      } catch (error) {
        setIsFetchingRoute(false);
        return;
      }
    }

    if (!inAmount) {
      toast.error("Please enter an amount to bridge");
      setIsFetchingRoute(false);
      return;
    }

    if (!fromToken || !toToken) {
      toast.error("Please select tokens to bridge");
      setIsFetchingRoute(false);
      return;
    }

    if (!fromChain || !toChain) {
      toast.error("Please select networks to bridge between");
      setIsFetchingRoute(false);
      return;
    }

    try {
      const routeParams: RouteRequest = {
        fromChain: fromChain.chainId,
        fromAmount: parseUnits(
          inAmount.toString(),
          fromToken.decimals,
        ).toString(),
        fromToken: fromToken.address,
        toChain: toChain.chainId,
        toToken: toToken.address,
        fromAddress: address || "0x",
        toAddress: toAddress || address || "0x",
        slippageConfig: { autoMode: 1 },
      };
      await fetchRoute(routeParams, setRoute, setRequestId);
    } finally {
      setIsFetchingRoute(false);
    }
  };

  const handleMaxButton = () => {
    if (!balanceData) return;
    const rawBalance = rawTokenBalance({
      balanceData,
      tokenProps: fromToken,
    });

    console.log(rawBalance);
    setInAmount(String(rawBalance));
    setRoute?.(undefined);
  };

  useEffect(() => {
    const fetchBalances = async () => {
      if (!account.address || !fromChain?.chainId) return;
      const balances = await getSquidEvmBalance({
        userAddress: account.address,
        chains: [fromChain?.chainId],
      });
      setBalanceData(balances);
    };

    fetchBalances();
  }, [fromChain?.chainId, account.address]);

  // useEffect(() => {
  //   setShowStatusModal(true);
  //   setIsExecutingTransaction(true);
  //   setModalStatus(ModalStatus.AWAIT_TX);
  // }, []);

  return (
    <div className="z-10 py-20 md:py-16 flex items-center justify-center flex-col min-h-[90vh]">
      <StatusModal
        props={{
          isOpen: showStatusModal,
          setIsOpen: setShowStatusModal,
          isLoading: isExecutingTransaction,
          errorMessage,
          setErrorMessage,
          fromNetwork: fromChain,
          toNetwork: toChain,
          modalStatus,
        }}
      />
      <div className="bg-gradient my-auto md:rounded-xl md:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-4/12 w-full items-start rounded-2xl">
        <div className="py-8 px-4 md:p-8 flex flex-col gap-6">
          <Typography variant="h3" className="dark:text-black text-center">
            Bridge
          </Typography>

          <BridgeSection
            label="From"
            chainProps={fromChainProps as ChainProps}
            tokenProps={{
              selectedToken: fromToken,
              onTokenSelect: setFromToken,
              filteredTokens: fromTokens,
              dialogTitle: "Select a token to bridge from",
            }}
            handleMaxButton={handleMaxButton}
            isFetchingRoute={isFetchingRoute}
            route={route}
            setRoute={setRoute}
            balanceData={balanceData}
            inAmount={inAmount}
            setInAmount={setInAmount}
          />

          <BridgeSection
            label="To"
            chainProps={toChainProps as ChainProps}
            tokenProps={{
              selectedToken: toToken,
              onTokenSelect: setToToken,
              filteredTokens: toTokens,
              dialogTitle: "Select a token to bridge to",
            }}
            isFetchingRoute={isFetchingRoute}
            route={route}
            handleFetchRoute={handleFetchRouteButton}
          />

          <CheckBoxComponent {...{ isChecked, setIsChecked, setToAddress }} />

          <FeeDetails props={{ route, isFetchingRoute, toToken }} />

          {route ? (
            <Button
              className="py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
              onClick={handleBridgeButton}
            >
              {isFetchingRoute ? <Loader className="w-8 h-8" /> : "Bridge"}
            </Button>
          ) : (
            <Button
              className="py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
              onClick={handleFetchRouteButton}
            >
              {isFetchingRoute ? (
                <Loader className="w-8 h-8 text-white/70" />
              ) : (
                "Fetch route"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SquidBridge;
