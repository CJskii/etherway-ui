import { useState, useEffect } from "react";
import { getSquidTokens } from "../utils/squid/squidRouter";
import { ChainData, ChainName, Token } from "@0xsquid/squid-types";

export const useTokenSelection = (
  chain: ChainData | undefined,
  initialChainID: number | string,
  setRoute: (route: any) => void,
  initialTokenAddress?: string,
  filterFn: (token: Token) => boolean = () => true,
) => {
  const [selectedToken, setSelectedToken] = useState<Token>();
  const [chaintokens, setChainTokens] = useState<Token[]>();
  const [allTokens, setAllTokens] = useState<Token[]>();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // TODO: Update the selected token based on user's current connection
    async function getTokens() {
      const _tokens = await getSquidTokens();
      //   console.log(_tokens);
      setAllTokens(_tokens);

      const filteredTokensForChain = _tokens.filter(
        (token) => token.chainId == initialChainID,
      );
      console.log(filteredTokensForChain);

      setChainTokens(filteredTokensForChain);
      if (initialTokenAddress) {
        const initialToken = filteredTokensForChain.filter(
          (token) =>
            token.address.toLowerCase() == initialTokenAddress.toLowerCase(),
        )[0];
        setSelectedToken(initialToken);
      } else {
        setSelectedToken(filteredTokensForChain[0]);
      }
    }

    if (!allTokens) {
      getTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // console.log(chain, allTokens);
    if (chain && allTokens) {
      const filteredTokensForChain = allTokens.filter(
        (token) => token.chainId == chain.chainId,
      );
      // console.log(filteredTokensForChain);
      setChainTokens(filteredTokensForChain);
      if (initialTokenAddress) {
        const initialToken = filteredTokensForChain.filter(
          (token) =>
            token.address.toLowerCase() == initialTokenAddress.toLowerCase(),
        )[0];
        if (initialToken) {
          setSelectedToken(initialToken);
        } else {
          setSelectedToken(filteredTokensForChain[0]);
        }
      } else {
        setSelectedToken(filteredTokensForChain[0]);
      }
    }
  }, [chain]);

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
    tokens: chaintokens,
    onTokenSelect,
    searchTerm,
    onSearchChange,
    onClose,
  };
};
