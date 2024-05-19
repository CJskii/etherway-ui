import { useState, useEffect } from "react";
import { ChainData, ChainName, ChainType } from "@0xsquid/sdk/dist/types";
import { getSquidChains } from "../utils/squid/squidRouter";

export const useChainSelection = (
  initialChainName: ChainName | string,
  excludeChainName: ChainName | string = "",
  filterFn: (chain: ChainData) => boolean = () => true,
) => {
  const [selectedChain, setSelectedChain] = useState<ChainData>();
  const [chains, setChains] = useState<ChainData[]>([]);

  useEffect(() => {
    async function fetchChains() {
      const _chains = await getSquidChains();
      // Pass _chains for all chains and evmChains for EVM chains only
      const evmChains = _chains.filter(
        (chain) => chain.chainType === ChainType.EVM,
      );

      setChains(evmChains);

      const initialChain = _chains.find(
        (chain) =>
          chain.networkName.toLowerCase() === initialChainName.toLowerCase(),
      );

      initialChain
        ? setSelectedChain(initialChain)
        : setSelectedChain(evmChains[1]);
    }

    fetchChains();
  }, [initialChainName]);

  useEffect(() => {
    // Update selected chain if it's the same as the excluded chain
    if (selectedChain && selectedChain.networkName === excludeChainName) {
      const newChain = chains.find(
        (chain) => chain.networkName !== excludeChainName,
      );
      setSelectedChain(newChain);
    }
  }, [excludeChainName, selectedChain, chains]);

  const onChainSelect = (chain: ChainData) => {
    setSelectedChain(chain);
  };

  const filteredChains = chains.filter(
    (chain) => filterFn(chain) && chain.networkName !== excludeChainName,
  );

  return {
    selectedChain,
    chains: filteredChains,
    onChainSelect,
  };
};
