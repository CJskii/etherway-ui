import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { RouteRequest } from "@0xsquid/squid-types";
import {
  RouteType,
  executeSquidRoute,
  getSquidChains,
  getSquidRoute,
  getSquidTokens,
} from "@/common/utils/squid/squidRouter";
import { useEffect, useState } from "react";
import getProviderOrSigner from "@/common/utils/getters/getProviderOrSigner";
import { Signer } from "ethers";
import { Typography } from "../ui/typography";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import SquidNetworkModal from "./network-modal";
import SquidTokenModal from "./token-modal";
import { Network } from "@/common/types/network";
import {
  ChainData,
  ChainName,
  GetRoute,
  RouteData,
  TokenData,
} from "@0xsquid/sdk";

// interface NetworkModalProps {
//   props: {
//     selectedNetwork: Network;
//     onNetworkSelect: (network: Network) => void;
//     filteredChains: Network[];
//     dialogTitle: string;
//     dialogDescription: string;
//     commandHeading: string;
//   };
// }

export interface NetworkModalProps {
  selectedNetwork: ChainData;
  onNetworkSelect: (network: ChainData) => void;
  filteredChains: ChainData[];
  dialogTitle: string;
  dialogDescription: string;
  commandHeading: string;
}

export const SquidBridge = () => {
  // DO WE WANT TO MANAGE ENTIRE LOGIC OF NETWORK AND TOKEN SELECTIONS WITHIN THIS COMPONENT?

  // IF YES THEN WE SHOULD HAVE SELECTIONS HANDLERS HERE AND PASS THEM DOWN TO MODALS
  // IF NO THEN WE SHOULD HAVE SELECTIONS HANDLERS IN MODALS AND PASS THEM BACK UP TO THIS COMPONENT

  // THEN ON BRIDGE BUTTON CLICK WE CAN GET THE SELECTED TOKENS AND NETWORKS FROM MODALS AND CALL THE BRIDGE FUNCTION

  const [tokens, setTokens] = useState<TokenData[]>();
  const [networks, setNetworks] = useState<ChainData[]>();
  const [fromNetworksProps, setFromNetworksProps] =
    useState<NetworkModalProps>();
  const [toNetworkProps, setToNetworkProps] = useState<NetworkModalProps>();
  const [userBalance, setUserBalance] = useState<string>("0");

  const { address } = useAccount();
  const [route, setRoute] = useState<RouteData | undefined>();

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

  // const routeParams: RouteRequest = {
  //   fromChain: "43114", // Avalanche
  //   fromAmount: "10000000000000000", // 0.1 AVAX
  //   fromToken: "0xEEeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  //   toChain: "137", // Polygon
  //   toToken: "0xEEeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  //   fromAddress: address,
  //   toAddress: address,
  //   slippageConfig: {
  //     autoMode: 1,
  //   },
  // };

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
              setRoute(_route);
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

  const fromBridgeProps = {
    selectedNetwork: {
      name: "Avalanche",

      nativeCurrency: {
        name: "AVAX",
        symbol: "AVAX",
      },
    },
    onNetworkSelect: (network: Network) => {
      console.log(network);
    },
    filteredChains: [
      {
        name: "Avalanche",

        nativeCurrency: {
          name: "AVAX",
          symbol: "AVAX",
        },
      },
      {
        name: "Ethereum",

        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
        },
      },
    ],
    dialogTitle: "Select a network to bridge from",
    dialogDescription: "Select a network to bridge from",
    commandHeading: "Select a network",
  };

  const toBridgeProps = {
    selectedNetwork: {
      name: "Polygon",

      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
      },
    },
    onNetworkSelect: (network: Network) => {
      console.log(network);
    },
    filteredChains: [
      {
        name: "Polygon",

        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
        },
      },
      {
        name: "Ethereum",

        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
        },
      },
    ],
    dialogTitle: "Select a network to bridge to",
    dialogDescription: "Select a network to bridge to",
    commandHeading: "Select a network",
  };

  const fromTokenProps = {
    filteredTokens: [
      {
        chainId: "43114",
        address: "0x1ce0c2827e2ef14d5c4f29a091d735a204794041",
        name: "Wrapped AVAX",
        symbol: "WAVAX",
        decimals: 18,
        logoURI: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
        coingeckoId: "avalanche-2",
      },
      {
        chainId: "43114",
        address: "0x1ce0c2827e2ef14d5c4f29a091d735a204794041",
        name: "Wrapped ETH",
        symbol: "WETH",
        decimals: 18,
        logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        coingeckoId: "ethereum",
      },
    ],
    dialogTitle: "Select a token to bridge from",
  };

  const toTokenProps = {
    filteredTokens: [
      {
        chainId: "137",
        address: "0x1ce0c2827e2ef14d5c4f29a091d735a204794041",
        name: "Wrapped AVAX",
        symbol: "WAVAX",
        decimals: 18,
        logoURI: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
        coingeckoId: "avalanche-2",
      },
      {
        chainId: "137",
        address: "0x1ce0c2827e2ef14d5c4f29a091d735a204794041",
        name: "Wrapped ETH",
        symbol: "WETH",
        decimals: 18,
        logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        coingeckoId: "ethereum",
      },
    ],
    dialogTitle: "Select a token to bridge to",
  };

  useEffect(() => {
    async function fetchData() {
      const _tokens = await getSquidTokens();
      setTokens(_tokens);
      console.log(_tokens);
      const _chains = await getSquidChains();
      console.log(_chains);
      setNetworks(_chains);

      const _fromNetworkProps: NetworkModalProps = {
        selectedNetwork: _chains.filter(
          (chain) => chain.chainName == ChainName.ARBITRUM,
        )[0],
        onNetworkSelect: setNewFromNetwork,
        filteredChains: _chains,
        dialogTitle: "Select a network to bridge from",
        dialogDescription: "Select a network to bridge from",
        commandHeading: "Select a network",
      };

      setFromNetworksProps(_fromNetworkProps);

      const _toNetworkProps: NetworkModalProps = {
        selectedNetwork: _chains.filter(
          (chain) => chain.chainName == ChainName.BASE,
        )[0],
        onNetworkSelect: setNewToNetwork,
        filteredChains: _chains,
        dialogTitle: "Select a network to bridge to",
        dialogDescription: "Select a network to bridge to",
        commandHeading: "Select a network",
      };

      setToNetworkProps(_toNetworkProps);
    }

    if (!tokens || !networks) {
      fetchData();
    }
  }, []);

  const setNewFromNetwork = (network: ChainData) => {
    console.log(networks);
    const newFromNetworkProps = {
      selectedNetwork: network,
      onNetworkSelect: setNewFromNetwork,
      filteredChains: networks,
      dialogTitle: "Select a network to bridge from",
      dialogDescription: "Select a network to bridge from",
      commandHeading: "Select a network",
    };
    setFromNetworksProps(newFromNetworkProps);
  };

  const setNewToNetwork = (network: ChainData) => {
    const newToNetworkProps = {
      selectedNetwork: network,
      onNetworkSelect: setNewToNetwork,
      filteredChains: networks,
      dialogTitle: "Select a network to bridge to",
      dialogDescription: "Select a network to bridge to",
      commandHeading: "Select a network",
    };
    setFromNetworksProps(newToNetworkProps);
  };

  return (
    <div className=" z-10 py-20 md:py-16 flex items-center justify-center flex-col min-h-[90vh]">
      <TestingButtons />
      <div className="bg-gradient my-auto md:rounded-xl md:w-7/12 lg:w-5/12 w-full items-start">
        <div className="p-8 md:p-14 md:px-16 flex flex-col gap-6">
          <Typography variant={"h3"} className=" dark:text-black text-center">
            Squid Bridge
          </Typography>

          {/* <BridgeModal
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
          /> */}

          <div className="flex flex-col">
            <Label className=" space-y-2">
              <Typography variant={"large"} className="dark:text-black">
                Bridge From
              </Typography>
            </Label>
            <Typography variant={"small"} className="dark:text-black">
              Your balance: {userBalance}
            </Typography>
            <SquidTokenModal props={fromTokenProps} />
            {fromNetworksProps && (
              <SquidNetworkModal props={fromNetworksProps} />
            )}
          </div>

          <div className="flex flex-col">
            <Label className=" space-y-2 w-full ">
              <Typography variant={"large"} className="dark:text-black">
                Bridge To
              </Typography>
            </Label>
            <SquidTokenModal props={toTokenProps} />
            {toNetworkProps && <SquidNetworkModal props={toNetworkProps} />}
          </div>

          <Label className=" space-y-2">
            <Typography variant={"large"} className="dark:text-black">
              Some label
            </Typography>
          </Label>
          <Button className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl">
            Bridge
          </Button>
        </div>
      </div>
    </div>
  );
};
