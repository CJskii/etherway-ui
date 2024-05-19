import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Typography } from "../ui/typography";
import {
  BridgeHookType,
  useChainSelection,
} from "@/common/hooks/useChainSelection";
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
import { ChainData, ChainName, RouteRequest } from "@0xsquid/squid-types";
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
import { useRouter } from "next/router";
import { Copy } from "lucide-react";

interface TransactionType {
  txHash: string;
  requestId: string;
  fromChain: ChainData;
  toChain: ChainData;
  status: string;
  intervalId: NodeJS.Timeout | null;
  toastId: number | string;
}

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
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  const [initalFromChain, setInitalFromChain] = useState<ChainName>(
    ChainName.ARBITRUM,
  );
  const [initialToChain, setInitialToChain] = useState<ChainName>(
    ChainName.BASE,
  );
  const [initialTokenFrom, setInitialTokenFrom] = useState<string>(
    "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
  );
  const [initialTokenTo, setInitialTokenTo] = useState<string>(
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  );

  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();

  const signer = useEthersSigner();

  const router = useRouter();

  const {
    selectedChain: fromChain,
    chains: fromChains,
    onChainSelect: setFromNetwork,
  } = useChainSelection(initalFromChain);

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
  } = useChainSelection(initialToChain, "", BridgeHookType.TO);

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
    initialTokenFrom,
  );

  const {
    selectedToken: toToken,
    tokens: toTokens,
    onTokenSelect: setToToken,
  } = useTokenSelection(
    toChain,
    toChain?.chainId ?? 8453,
    setRoute,
    initialTokenTo,
    BridgeHookType.TO,
  );

  const isConnected = useAccount().isConnected;
  const isCorrectNetwork = fromChain
    ? fromChain.chainId === (account.chainId ?? "")
    : false;

  const getTransactionStatus = async ({
    txHash,
    requestId,
    fromChain,
    toChain,
  }: {
    txHash: string;
    requestId: string;
    fromChain: ChainData;
    toChain: ChainData;
  }) => {
    const getStatusParams = {
      transactionId: txHash,
      requestId: requestId,
      integratorId: integratorId,
      fromChainId: fromChain.chainId.toString(),
      toChainId: toChain.chainId.toString(),
    };

    const status = await getTxStatus(getStatusParams);
    console.log(status);

    const tx = transactions?.find((tx) => tx.txHash === txHash);
    const txIndex = transactions?.findIndex((tx) => tx.txHash === txHash);
    if (txIndex === -1 || tx == undefined || txIndex === undefined) return;

    // NOTE: the URL will be the first transaction URL that's in the queue
    if (!axelarURL) {
      setAxelarURL(status?.axelarTransactionUrl);
    }

    if (status?.squidTransactionStatus === "success") {
      handleStopPoll(txHash);

      if (route?.estimate.fromAmountUSD && fromChain?.chainId && address) {
        handleSquidBridgePoints({
          userAddress: address,
          chainId: Number(fromChain.chainId!),
          txAmountUSD: Number(route?.estimate.fromAmountUSD!),
        });
      }
      setErrorMessage("");

      if (!showStatusModal) {
        toast.dismiss(tx?.toastId);
        toast.success("Transaction successful");
      } else {
        setModalStatus(ModalStatus.SUCCESS);
      }
    } else if (status?.squidTransactionStatus === "needs_gas") {
      handleStopPoll(txHash);
      setErrorMessage("Transaction needs more gas");

      //TODO: Pop the modal to show the axelar txLink to complete the tx by filling the gas
      if (!showStatusModal) {
        toast.dismiss(tx?.toastId);
        toast.error("Transaction needs more gas");
      }
    } else if (
      status?.squidTransactionStatus === "ongoing" ||
      status?.squidTransactionStatus === "partial_success"
    ) {
      setIsLoading(true);
      // setShowStatusModal(true);
      setErrorMessage("");
      if (!showStatusModal) {
        if (!tx.toastId) {
          const toastId = toast.loading(
            `Transaction with hash ${tx.txHash.slice(0, 6)}..${tx.txHash.slice(-6)} in progress...`,
          );
          tx.toastId = toastId as number;
          const currentTransactions = transactions;
          if (currentTransactions) {
            currentTransactions[txIndex] = tx;
          } else {
            setTransactions([tx]);
          }
        }
      }
    } else if (status?.squidTransactionStatus === "not_found") {
      handleStopPoll(txHash);
      setErrorMessage("Transaction not found");
      if (!showStatusModal) {
        toast.error("Transaction not found");
      }
    }
  };

  const handleStartPoll = (txHash: string) => {
    // Add the tx to the record and start polling for the tx, also add the intervalId
    if (txHash && requestId && fromChain && toChain) {
      getTransactionStatus({ txHash, requestId, fromChain, toChain });
      const newIntervalId = setInterval(() => {
        getTransactionStatus({ txHash, requestId, fromChain, toChain });
      }, 5000);

      const txData: TransactionType = {
        txHash,
        requestId,
        fromChain,
        toChain,
        status: "",
        intervalId: newIntervalId,
        toastId: 0,
      };
      const currentTransactions = transactions;
      currentTransactions?.push(txData);
      setTransactions(currentTransactions);
    }
  };

  const handleStopPoll = (txHash: string) => {
    const currentTransactions = transactions;
    const txData = currentTransactions?.find((tx) => tx.txHash === txHash);
    if (txData?.intervalId) {
      clearInterval(txData?.intervalId);
      const remainingTransactions = currentTransactions?.filter(
        (tx) => tx.txHash !== txHash,
      );
      setTransactions(remainingTransactions);
    }
    setIsLoading(false);
  };

  const handleBridgeButton = async () => {
    if (!route) return;

    setIsExecutingTransaction(true);
    setShowStatusModal(true);
    setModalStatus(ModalStatus.APPROVE);

    try {
      if (!signer) {
        console.log("No signer found");
        return;
      }

      const txReceipt = await executeSquidRoute(
        route,
        signer as Signer,
        setModalStatus,
      );

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

    setInAmount(String(rawBalance));
    setRoute?.(undefined);
  };

  const handleCopyButton = () => {
    const baseURL = "https://etherway.io/bridge";
    const url = `${baseURL}/?fromChain=${fromChain?.networkName}&toChain=${toChain?.networkName}&fromToken=${fromToken?.address}&toToken=${toToken?.address}`;

    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
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
  //   setTxHash(
  //     "0x2bc1eb877a361c383c4c317d87c8a5b10f338ea658c13e88bff22ee8827172b7",
  //   );
  //   setRequestId("fc2c413c-6d66-4785-86f7-d2b5ca06325a");

  //   handleStartPoll(
  //     "0x2bc1eb877a361c383c4c317d87c8a5b10f338ea658c13e88bff22ee8827172b7",
  //   );
  // }, [fromChain]);

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
          axelarURL,
        }}
      />
      <div className="bg-gradient my-auto md:rounded-xl md:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-4/12 w-full items-start rounded-2xl">
        <div className="py-8 px-4 md:p-8 flex flex-col gap-6">
          <Typography variant="h3" className="dark:text-black text-center">
            Bridge{" "}
            <Copy
              className="w-6 h-6 inline cursor-pointer ml-2 hover:text-black/60"
              onClick={handleCopyButton}
            />
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
