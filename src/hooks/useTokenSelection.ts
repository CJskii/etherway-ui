import { useState, useEffect } from "react";
import { getSquidTokens } from "../utils/squid/squidRouter";
import { ChainData, Token } from "@0xsquid/squid-types";
import { BridgeHookType } from "./useChainSelection";
import { useRouter } from "next/router";

export const useTokenSelection = (
  chain: ChainData | undefined,
  initialChainID: number | string,
  setRoute: (route: any) => void,
  initialTokenAddress?: string,
  type: BridgeHookType = BridgeHookType.FROM,
) => {
  const [selectedToken, setSelectedToken] = useState<Token>();
  const [chainTokens, setChainTokens] = useState<Token[]>();
  const [allTokens, setAllTokens] = useState<Token[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function getTokens() {
      const _tokens = await getSquidTokens();
      setAllTokens(_tokens);

      const filteredTokensForChain = _tokens.filter(
        (token) => token.chainId == initialChainID,
      );
      setChainTokens(filteredTokensForChain);

      const { fromToken, toToken } = router.query;
      let initialToken;

      if (type === BridgeHookType.FROM && fromToken) {
        initialToken = filteredTokensForChain.find(
          (token) =>
            token.address.toLowerCase() === (fromToken as string).toLowerCase(),
        );
      } else if (type === BridgeHookType.TO && toToken) {
        initialToken = filteredTokensForChain.find(
          (token) =>
            token.address.toLowerCase() === (toToken as string).toLowerCase(),
        );
      }

      if (!initialToken && initialTokenAddress) {
        initialToken = filteredTokensForChain.find(
          (token) =>
            token.address.toLowerCase() === initialTokenAddress.toLowerCase(),
        );
      }

      if (!initialToken) {
        console.error(
          `Token with address ${fromToken || toToken || initialTokenAddress} not found. Using default token.`,
        );
        initialToken = filteredTokensForChain[0];
      }

      setSelectedToken(initialToken);
    }

    if (!allTokens) {
      getTokens();
    }
  }, [initialChainID, initialTokenAddress, router.query, type, allTokens]);

  useEffect(() => {
    if (chain && allTokens) {
      const filteredTokensForChain = allTokens.filter(
        (token) => token.chainId == chain.chainId,
      );
      setChainTokens(filteredTokensForChain);

      const { fromToken, toToken } = router.query;
      let initialToken;

      if (type === BridgeHookType.FROM && fromToken) {
        initialToken = filteredTokensForChain.find(
          (token) =>
            token.address.toLowerCase() === (fromToken as string).toLowerCase(),
        );
      } else if (type === BridgeHookType.TO && toToken) {
        initialToken = filteredTokensForChain.find(
          (token) =>
            token.address.toLowerCase() === (toToken as string).toLowerCase(),
        );
      }

      if (!initialToken && initialTokenAddress) {
        initialToken = filteredTokensForChain.find(
          (token) =>
            token.address.toLowerCase() === initialTokenAddress.toLowerCase(),
        );
      }

      if (!initialToken) {
        console.error(
          `Token with address ${fromToken || toToken || initialTokenAddress} not found. Using default token.`,
        );
        initialToken = filteredTokensForChain[0];
      }

      setSelectedToken(initialToken);
    }
  }, [chain, allTokens, initialTokenAddress, router.query, type]);

  const onTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setRoute(undefined);
  };

  const onSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const onClose = (dialogId: string) => {
    const dialog = document.getElementById(dialogId);
    if (dialog instanceof HTMLDialogElement) {
      dialog.close();
    }
  };

  return {
    selectedToken,
    tokens: chainTokens,
    onTokenSelect,
    searchTerm,
    onSearchChange,
    onClose,
  };
};
