import { Button } from "@/components/ui/button";
import { useAccount, useBalance } from "wagmi";

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
import ethers from "ethers";

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
import { Network } from "../../common/types/network";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";

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

  const handleBridgeButton = () => {
    console.log("Bridge button clicked");
  };

  const handlePreviewButton = () => {
    console.log("Preview button clicked");
  };

  const handleSelectToken = (token: TokenData) => {
    console.log(token);
  };

  const handleSelectNetwork = (network: ChainData) => {
    console.log(network);
  };

  const handleMaxButton = () => {
    console.log("Max button clicked");
  };

  // TODO: Work on the searchFunctionality for the networks
  const {
    selectedchain: fromChain,
    chains: fromChains,
    onChainSelect: setFromNetwork,
    // searchTerm,
    // onSearchChange,
    // onClose,
  } = useChainSelection(ChainName.ARBITRUM);

  const {
    selectedchain: toChain,
    chains: toChains,
    onChainSelect: setToNetwork,
    // searchTerm,
    // onSearchChange,
    // onClose,
  } = useChainSelection("blast");

  const {
    selectedtoken: fromToken,
    tokens: fromTokens,
    onTokenSelect: setFromToken,
    // searchTerm,
    // onSearchChange,
    // onClose,
  } = useTokenSelection(
    fromChain,
    42161,
    "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
  );

  const {
    selectedtoken: toToken,
    tokens: toTokens,
    onTokenSelect: setToToken,
    // searchTerm,
    // onSearchChange,
    // onClose,
  } = useTokenSelection(
    toChain,
    81457,
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  );

  // reconfigure the chainId
  const result = useBalance({
    address: fromToken
      ? (fromToken.address as `0x${string}`)
      : "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
  });

  const routeParams: GetRoute = {
    fromChain: "43114", // Avalanche
    fromAmount: "10000000000000000", // 0.1 AVAX
    fromToken: "0xEEeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    toChain: "137", // Polygon
    toToken: "0xEEeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    fromAddress: address ? address : `0x`,
    toAddress: address ? address : `0x`,
    slippage: 1,
  };

  const TestingButtons = () => {
    return (
      <div className="flex gap-4">
        <Button
          variant={"etherway"}
          onClick={async () => {
            const _route = await getSquidRoute(routeParams);
            if (_route) {
              setRoute(_route.route);
              setRequestId(_route.requestId);
            }
          }}
        >
          Get Squid Route
        </Button>
        <Button
          variant={"etherway"}
          onClick={async () => {
            if (route) {
              const signer = (await getProviderOrSigner(true)) as Signer;
              const _route = await executeSquidRoute(route, signer);
            }
          }}
        >
          Execute
        </Button>
        <br />

        <Button
          variant={"etherway"}
          onClick={async () => {
            console.log(await getSquidTokens());
            console.log(await getSquidChains());
          }}
        >
          Get
        </Button>
      </div>
    );
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

  useEffect(() => {
    if (inAmount != undefined) {
      if (fromChain && toChain && fromToken && toToken) {
        const routeParams: GetRoute = {
          fromChain: fromChain.chainId, // Avalanche
          fromAmount: parseUnits(
            inAmount.toString(),
            fromToken.decimals,
          ).toString(), // 0.1 AVAX
          fromToken: fromToken.address,
          toChain: toChain.chainId, // Polygon
          toToken: toToken.address,
          fromAddress: address ? address : `0x`,
          toAddress: address ? address : `0x`,
          slippage: 1,
        };
        fetchRoute(routeParams);
      }
    }
  }, [inAmount]);

  // might want to fetch the latest route every 20 seconds to refresh the price
  const fetchRoute = async (routeParams: GetRoute) => {
    try {
      const _route = await getSquidRoute(routeParams);
      console.log(_route);
      if (_route) {
        setRoute(_route.route);
        setRequestId(_route.requestId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBridge = async () => {
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
    // Convert the units first
    const formattedValue = formatUnits(value, decimals);
    // Parse to float and fix to 2 decimal places
    return parseFloat(formattedValue).toFixed(2);
  };

  return (
    <div className=" z-10 py-20 md:py-16 flex items-center justify-center flex-col min-h-[90vh]">
      {/* <TestingButtons /> */}
      <div className="bg-gradient my-auto md:rounded-xl md:w-9/12 lg:w-7/12 xl:w-6/12 2xl:w-5/12 w-full items-start rounded-2xl">
        <div className="py-8 px-4 md:p-8 flex flex-col gap-6">
          <Typography variant={"h3"} className=" dark:text-black text-center">
            Squid Bridge
          </Typography>
          <div className="flex flex-col">
            <Label className=" space-y-2">
              <Typography variant={"large"} className="dark:text-black">
                From
              </Typography>
            </Label>
            <div className="flex flex-col bg-white rounded-lg p-2">
              {/* <div className="flex justify-between items-center">
                <SquidNetworkModal props={fromChainProps} />
                <div className="flex justify-center items-center gap-4">
                  <Typography variant="h4" className="dark:text-black">
                    {userBalance} {fromToken?.symbol}
                  </Typography>
                  <Button variant={"etherway"} onClick={handleMaxButton}>
                    Max
                  </Button>
                </div>
              </div> */}
              <div className="flex justify-between items-center">
                <SquidNetworkModal props={fromChainProps} />
                <div className="flex items-center justify-center gap-2">
                  <Typography
                    variant="small"
                    className="dark:text-black font-semibold"
                  >
                    {userBalance} {fromToken?.symbol}
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
                  <Typography
                    variant="muted"
                    className="dark:text-black py-0 px-2 text-sm"
                  >
                    $
                    {result.data
                      ? formatToFixed2({
                          value: result.data.value,
                          decimals: result.data.decimals,
                        })
                      : "0.00"}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <Label className=" space-y-2 w-full ">
              <Typography variant={"large"} className="dark:text-black">
                To
              </Typography>
            </Label>
            <div className="flex flex-col bg-white rounded-lg p-2">
              {/* <div className="flex justify-between items-center">
                <SquidNetworkModal props={fromChainProps} />
                <div className="flex justify-center items-center gap-4">
                  <Typography variant="h4" className="dark:text-black">
                    {userBalance} {fromToken?.symbol}
                  </Typography>
                  <Button variant={"etherway"} onClick={handleMaxButton}>
                    Max
                  </Button>
                </div>
              </div> */}
              <div className="flex justify-between items-center">
                <SquidNetworkModal props={toChainProps} />
              </div>
              <Separator
                orientation="horizontal"
                className="my-2 border-[1px]  dark:border-black/20 rounded-lg w-full place-self-center"
              />
              <div className="flex justify-between items-center">
                <SquidTokenModal props={toTokenProps} />
                <div className="flex flex-col items-end justify-center">
                  <Typography
                    variant="small"
                    className="dark:text-black font-semibold px-2"
                  >
                    {/* // TODO: Read expected received amount from the state */}
                    {outAmount} {toToken?.symbol}
                  </Typography>
                  <Typography
                    variant="muted"
                    className="dark:text-black py-0 px-2 text-sm"
                  >
                    $
                    {result.data
                      ? formatToFixed2({
                          value: result.data.value,
                          decimals: result.data.decimals,
                        })
                      : "0.00"}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-start gap-2">
            <CheckBox isChecked={isChecked} setIsChecked={setIsChecked} />
            {isChecked && (
              <Input
                type="text"
                placeholder="Enter address"
                className="p-2 text-sm rounded-xl dark:bg-white dark:text-black "
              />
            )}
          </div>

          <div>
            <Typography variant={"muted"} className="dark:text-black text-xs">
              Estimated Fee: 0.0001 AVAX
            </Typography>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="flex justify-between items-center w-full py-2">
                  <Typography
                    variant={"small"}
                    className="dark:text-black flex justify-between items-center w-full"
                  >
                    More details <ChevronDown />
                  </Typography>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-1">
                  <Typography
                    variant={"muted"}
                    className="dark:text-black text-xs"
                  >
                    Slippage: 1%
                  </Typography>
                  <Typography
                    variant={"muted"}
                    className="dark:text-black text-xs"
                  >
                    Expected received amount: 0.0001 ETH
                  </Typography>
                  <Typography
                    variant={"muted"}
                    className="dark:text-black text-xs"
                  >
                    Network fee: 0.0001 AVAX
                  </Typography>
                  <Typography
                    variant={"muted"}
                    className="dark:text-black text-xs"
                  >
                    Gas fee: 0.0001 AVAX
                  </Typography>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* // TODO: Render either preview or bridge button based on the state of the route */}
          {route ? (
            <Button
              className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
              onClick={handleBridgeButton}
            >
              Bridge
            </Button>
          ) : (
            <Button
              className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
              onClick={handlePreviewButton}
            >
              Preview
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export function CheckBox({
  isChecked,
  setIsChecked,
}: {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="another-address" className="text-sm dark:text-black">
        Send to another address
      </Label>
      <Switch id="another-address" onClick={() => setIsChecked(!isChecked)} />
    </div>
  );
}
