import { useState, useEffect } from "react";

import { useAccount } from "wagmi";
import { ChainData, ChainName } from "@0xsquid/sdk";
import { getSquidChains } from "../utils/squid/squidRouter";

export const useChainSelection = (
  initialChainName: ChainName | string,
  filterFn: (chain: ChainData) => boolean = () => true,
) => {
  const [selectedchain, setSelectedChain] = useState<ChainData>();
  const [chains, setChains] = useState<ChainData[]>();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // TODO: Update the selected chain based on user's current connection
    async function getChains() {
      const _chains = await getSquidChains();
      //   console.log(_chains);
      setChains(_chains);
      const initialChain = _chains.filter(
        (chain) => chain.chainName == initialChainName,
      )[0];
      setSelectedChain(initialChain);
    }

    if (!chains) {
      getChains();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChainSelect = (chain: ChainData) => {
    setSelectedChain(chain);
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
    selectedchain,
    chains,
    onChainSelect,
    searchTerm,
    onSearchChange,
    onClose,
  };
};
