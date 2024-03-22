import React, { useState, useEffect } from "react";
import featured from "@/assets/homepage-background/featured.svg";
import logoLight from "@/assets/light-logo.svg";
import { Typography } from "@/components/ui/typography";
import { SparkleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain } from "wagmi";
import { useNetworkSelection } from "@/common/hooks/useNetworkSelection";
import NetworkModal from "./networkModal";
import { checkIfReferredUser } from "@/common/utils/validators/checkIfReferredUser";
import { handleMinting } from "@/common/utils/interaction/handlers/handleMinting";
import { ExtendedNetwork } from "@/common/types/network";
import { handleErrors } from "@/common/utils/interaction/handlers/handleErrors";
import { updateMintData } from "@/common/utils/api/mintAPI";
import { ContractType } from "@prisma/client";
import MintModal from "./modal-mint";
import { useRouter } from "next/router";
import { toast } from "sonner";
interface NFTMintProps {
  params: {
    contractProvider: { type: string; contract: string };
    stepDescription: string;
  };
}

export default function NFTMint({ params }: NFTMintProps) {
  const { openConnectModal } = useConnectModal();
  const { chains, switchChain } = useSwitchChain();
  const account = useAccount();
  const chain = account?.chain;
  const { contractProvider, stepDescription } = params;

  const [isLoading, setIsLoading] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [minting, setMinting] = useState(false);
  const [mintedNFT, setMintedNFT] = useState("");
  const [txHash, setTxHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [isInvited, setIsInvited] = useState(false);
  const [referredBy, setReferredBy] = useState("");

  // TODO: Refactor this to display minting modal with txHash and the NFT metadata OR error message
  const router = useRouter();

  const {
    selectedNetwork: mintNetwork,
    onNetworkSelect: setMintNetwork,
    filteredChains: fromFilteredChains,
  } = useNetworkSelection(contractProvider);

  const isConnected = account !== undefined && account !== null;
  const isCorrectNetwork = mintNetwork.id === (account.chainId ?? "");

  const handleMintButton = async () => {
    if (!isConnected && openConnectModal) {
      openConnectModal();
      return;
    } else if (!isCorrectNetwork && switchChain) {
      switchChain({ chainId: mintNetwork.id });
      return;
    } else {
      try {
        setIsLoading(true);
        setShowMintModal(true);
        setMinting(true);
        if (!account.address) {
          return;
        }

        const data = await handleMinting({
          mintNetwork,
          contractProvider,
          userAddress: account.address,
        });

        // TODO: Display the Toast Error
        if (data?.apiError) {
          // @ts-ignore
          setApiError(data?.apiError);
          toast.error(`${data.apiError}`);
        }

        if (data?.response) {
          handleAPIError(data.response);
        }

        if (data?.result) {
          const { mintedID, txHash } = data.result;

          // check the api Response and the Error and accordingly display it to the user

          setTxHash(txHash);
          setMintedNFT(mintedID.toString());
          setMinting(false);
          setIsLoading(false);
        } else {
          console.error("Error while minting");
        }
      } catch (e) {
        console.error(e);
        setIsLoading(false);
        setMinting(false);
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

        const { response, error: apiError } = await updateMintData({
          address: account.address,
          contractType: _contractType,
          chainId: mintNetwork.id,
        });

        // TODO: Display the Toast Error
        // @ts-ignore
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

  const handleAPIError = (response: Response) => {
    // TODO: Display the Toast Error

    if (response?.status == 200) {
      console.log("API Call on update on db Completed");
      toast.success("Interaction recorded in db");
    } else if (response?.status == 405) {
      console.log("405: Method Not allowed");
      setApiError("405: Method Not allowed");
      toast.error("405: Method Not allowed");
    } else if (response?.status == 400) {
      // let _error = await response.json();
      setApiError("400: Missing parameters");
      console.error("400: Missing parameters");
      toast.error("400: Missing parameters");
    } else if (response?.status == 401) {
      console.error("You must be signed in to interact with the API");
      setApiError("You must be signed in to interact with the API");
      toast.error("401: You must be signed in to interact with the API");
    } else if (response?.status == 500) {
      console.error("Internal Server Error");
      setApiError("Internal Server Error");
      toast.error("500: Internal Server Error");
    } else {
      console.error("Error occured during APICall");
      setApiError("Error occured during APICall");
      toast.error("Error occured during APICall");
    }
  };

  useEffect(() => {
    let selected = mintNetwork;

    if (chain?.name) {
      const networkObject = fromFilteredChains.find(
        (net) => net.name === chain.name,
      );
      selected =
        (networkObject as ExtendedNetwork) ||
        (fromFilteredChains[0] as ExtendedNetwork);
    }
    const isReferredUser = checkIfReferredUser();
    const { isReferred, refLink } = isReferredUser;
    setIsInvited(isReferred);
    setReferredBy(refLink ? refLink : "");
    setMintNetwork(selected);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain?.name]);

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
            <Image src={logoLight} alt="etherway logo" className="w-40" />
          </div>
          <Image
            src={featured}
            alt="featured"
            className=" h-[600px] w-full object-cover rounded-xl "
          />
          <div className=" md:rounded-bl-xl absolute bottom-0 py-14 px-8 bg-gradient-to-b from-black/5  to-black flex items-center flex-wrap gap-y-4 gap-x-6 text-white">
            <MintModal
              props={{
                isOpen: showMintModal,
                setIsOpen: setShowMintModal,
                isLoading: isLoading,
                modalTitle: "NFT Minted",
                modalDescription: "Your NFT has been minted successfully",
                modalButtonText: "View NFT",
                errorMessage: errorMessage,
                setErrorMessage: setErrorMessage,
                nftId: mintedNFT,
              }}
            />
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
        <div className="col-span-full h-full md:col-span-7 px-8 py-10 md:p-14 space-y-6 flex flex-col justify-between">
          <Typography variant={"h3"} className=" dark:text-black">
            Step 1 : {stepDescription}
          </Typography>
          <div className="flex flex-col">
            <Label className="py-2 w-full">
              <Typography variant={"large"} className="dark:text-black">
                Network
              </Typography>
            </Label>
            <NetworkModal props={networkModalProps} />
          </div>

          {mintedNFT ? (
            <>
              {apiError != "" ? (
                <Button
                  className="dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
                  onClick={tryAPICall}
                >
                  Try Again
                </Button>
              ) : (
                <Button
                  className="dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
                  onClick={() => {
                    router.push(
                      `/${params.contractProvider.type}/onft-bridge?nftId=${mintedNFT}`,
                    );
                  }}
                >
                  Complete
                </Button>
              )}
            </>
          ) : (
            <Button
              className="dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
              onClick={handleMintButton}
            >
              Mint
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
