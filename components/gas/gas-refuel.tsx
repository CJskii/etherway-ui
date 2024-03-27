import { useEffect, useState } from "react";
import { Network } from "../../common/types/network";
import { useNetworkSelection } from "../../common/hooks/useNetworkSelection";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { activeChains } from "../../constants/config/chainsConfig";
import { estimateGasRequest } from "../../common/utils/interaction/handlers/estimateGas";
import { gasTransferRequest } from "../../common/utils/interaction/handlers/handleGasRefuel";
import { getValidToNetworks } from "../../common/utils/getters/getValidToNetworks";
import { handleErrors } from "../../common/utils/interaction/handlers/handleErrors";
import Preview from "./preview";
import Confirm from "./confirm-transaction";
import { Typography } from "../ui/typography";
import DashboardCard from "../dashboard/dashboard-card";
import NetworkModal from "../networkModal";
import { ArrowLeftRight, ArrowUpDown } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import BridgeModal from "../modal-bridge";
import { useAccount, useSwitchChain } from "wagmi";
import HowItWorks from "./how-it-works";

const Gas = ({
  contractProvider,
}: {
  contractProvider: {
    type: string;
    contract: string;
  };
}) => {
  // const { chain } = useNetwork();
  const { openConnectModal } = useConnectModal();
  const { type, contract } = contractProvider;
  const account = useAccount();
  const { switchChain } = useSwitchChain();

  const [inputAmount, setInputAmount] = useState("");
  const [gasFee, setGasFee] = useState("");
  const [showGasModal, setShowGasModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionBlockNumber, setTransactionBlockNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");

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
    filteredChains: fromFilteredChains,
  } = useNetworkSelection(contractProvider);

  const {
    selectedNetwork: toNetwork,
    onNetworkSelect: setToNetwork,
    filteredChains: toFilteredChains,
  } = useNetworkSelection(contractProvider, isValidToNetwork);

  useEffect(() => {
    // If the currently selected "To" network is not valid after the "From" network changes, reset it.
    if (!isValidToNetwork(toNetwork)) {
      const validNetworks = getValidToNetworks({
        fromNetwork,
        type,
        contract,
      }) as string[];
      const defaultNetwork = activeChains.find(
        (chain) => chain.name === validNetworks[0],
      );
      defaultNetwork
        ? setToNetwork(defaultNetwork as Network)
        : setToNetwork(activeChains[0] as Network);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromNetwork, toNetwork, setToNetwork]);

  useEffect(() => {
    setGasFee("");
  }, [fromNetwork, toNetwork]);

  const isConnected = account.isConnected;
  const isCorrectNetwork = fromNetwork.id === (account.chainId ?? "");

  const handleConfirmButton = async () => {
    if (fromNetwork.id === toNetwork.id) return;
    if (!isConnected && openConnectModal) {
      openConnectModal();
      return;
    } else if (!isCorrectNetwork && switchChain) {
      switchChain({ chainId: fromNetwork.id });
      return;
    }
    await gasTransferRequest({
      fromNetwork,
      toNetwork,
      inputAmount,
      setIsLoading,
      setGasFee,
      setErrorMessage,
      setShowGasModal,
      setTxHash,
      setTransactionBlockNumber,
      gasFee,
      recipientAddress,
    });
  };

  const handleMaxButton = () => {
    const maxGas = toNetwork.params?.layerzero?.maxRefuelGas;
    if (maxGas) {
      setInputAmount(maxGas.toString());
    }
  };

  const handlePreviewClick = async () => {
    setIsLoading(true);
    try {
      if (fromNetwork.id === toNetwork.id) return;
      if (!isConnected && openConnectModal) {
        openConnectModal();
        return;
      } else if (!isCorrectNetwork && switchChain) {
        switchChain({ chainId: fromNetwork.id });
        return;
      }
      await estimateGasRequest({
        fromNetwork,
        toNetwork,
        inputAmount,
        setIsLoading,
        setGasFee,
        setErrorMessage,
        setShowGasModal,
        recipientAddress,
      });
    } catch (e) {
      console.error(e);
      handleErrors({ e, setErrorMessage });
      setShowGasModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapButton = () => {
    const temp = fromNetwork;
    setFromNetwork(toNetwork);
    setToNetwork(temp);
  };

  const fromBridgeProps = {
    selectedNetwork: fromNetwork,
    onNetworkSelect: setFromNetwork,
    filteredChains: fromFilteredChains,
    dialogTitle: "Select from network",
    dialogDescription: "From",
    commandHeading: "Select a network to bridge from",
  };

  const toBridgeProps = {
    selectedNetwork: toNetwork,
    onNetworkSelect: setToNetwork,
    filteredChains: toFilteredChains,
    dialogTitle: "Select to network",
    dialogDescription: "To",
    commandHeading: "Select a network to bridge to",
  };

  return (
    <div className="z-10 py-20 md:py-16 flex items-center justify-center min-h-[90vh]">
      <div className="bg-gradient my-auto md:rounded-xl md:w-8/12 lg:w-5/12 w-full items-start">
        <div className="p-8 md:py-10 md:px-16 flex flex-col gap-8">
          <Typography variant={"h3"} className=" dark:text-black text-center">
            {"Gas refuel ⛽"}
          </Typography>
          <HowItWorks />

          <div className="flex items-center md:flex-row flex-col justify-between gap-4 md:gap-6">
            <div className="grid lg:grid-cols-[1fr,auto,1fr] gap-2 min-w-full">
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
            <BridgeModal
              props={{
                isOpen: showGasModal,
                setIsOpen: setShowGasModal,
                isLoading,
                errorMessage,
                setErrorMessage,
                nftId: txHash,
                errorHeader: "There was an error while bridging gas",
                successHeader: "Transaction successful",
                loadingHeader: "We're working hard to bridge your tokens",
              }}
            />
          </div>

          {gasFee === "" && (
            <Label className=" space-y-2">
              <Typography
                variant={"smallTitle"}
                className="dark:text-black font-semibold"
              >
                {"Sending to a friend? (optional):"}
              </Typography>
              <div className="relative">
                <Input
                  placeholder="Enter recipent's  EVM address"
                  className="p-6 py-7 rounded-xl dark:bg-white dark:text-black"
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  value={recipientAddress}
                />
              </div>
            </Label>
          )}

          {gasFee != "" ? (
            <Confirm
              toNetwork={toNetwork}
              fromNetwork={fromNetwork}
              inputAmount={inputAmount}
              gasFee={gasFee}
              setGasFee={setGasFee}
              handleConfirmButton={handleConfirmButton}
              isLoading={isLoading}
            />
          ) : (
            <Preview
              nativeCurrencySymbol={toNetwork.nativeCurrency.symbol}
              networkName={toNetwork.name}
              inputAmount={inputAmount}
              setInputAmount={setInputAmount}
              handleMaxButton={handleMaxButton}
              handlePreviewClick={handlePreviewClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Gas;
