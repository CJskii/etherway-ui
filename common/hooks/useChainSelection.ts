import { useState, useEffect } from "react";
import { ChainData, ChainName, ChainType } from "@0xsquid/sdk/dist/types";
import { getSquidChains } from "../utils/squid/squidRouter";
import { useRouter } from "next/router";

export enum BridgeHookType {
  FROM,
  TO,
}

export const useChainSelection = (
  initialChainName: ChainName | string,
  excludeChainName: ChainName | string = "",
  type: BridgeHookType = BridgeHookType.FROM,
  filterFn: (chain: ChainData) => boolean = () => true,
) => {
  const [selectedChain, setSelectedChain] = useState<ChainData>();
  const [chains, setChains] = useState<ChainData[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchChains() {
      const _chains = await getSquidChains();
      const evmChains = _chains.filter(
        (chain) => chain.chainType === ChainType.EVM,
      );

      setChains(evmChains);

      const { fromChain, toChain } = router.query;
      let initialChain;
      if (type === BridgeHookType.FROM && fromChain) {
        initialChain = _chains.find(
          (chain) =>
            chain.networkName.toLowerCase() ===
            (fromChain as string).toLowerCase(),
        );
      } else if (type === BridgeHookType.TO && toChain) {
        initialChain = _chains.find(
          (chain) =>
            chain.networkName.toLowerCase() ===
            (toChain as string).toLowerCase(),
        );
      } else {
        initialChain = _chains.find(
          (chain) =>
            chain.networkName.toLowerCase() === initialChainName.toLowerCase(),
        );
      }

      if (!initialChain) {
        console.error(
          `Chain with name ${fromChain || toChain || initialChainName} not found. Using default chain.`,
        );
        initialChain = evmChains[0];
      }

      setSelectedChain(initialChain);
    }

    fetchChains();
  }, [initialChainName, router.query, type]);

  useEffect(() => {
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
