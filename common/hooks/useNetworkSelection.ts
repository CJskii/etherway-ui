import { useState, useEffect } from "react";
import { activeChains } from "../../constants/config/chainsConfig";
import { useAccount } from "wagmi";
import { Network, ExtendedNetwork } from "../types/network";

export const useNetworkSelection = (
  contractProviders: { type: string; contract: string },
  filterFn: (network: Network) => boolean = () => true,
) => {
  // const { chain } = useNetwork();

  const [selectedNetwork, setSelectedNetwork] = useState(activeChains[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const { type, contract } = contractProviders;
  const account = useAccount();

  // Function to filter networks based on contract providers
  const filterNetworksByContractProvider = (networks: ExtendedNetwork[]) =>
    networks.filter((network) => {
      const providers = network.contractProviders[type];
      return providers && providers.includes(contract);
    });

  const [networksByProvider, setNetworksByProvider] = useState(
    filterNetworksByContractProvider(activeChains),
  );

  useEffect(() => {
    // Update the selected network based on user's current connection
    const validNetworks = filterNetworksByContractProvider(activeChains);
    const initialNetwork =
      validNetworks.find((net) => net.name === account.chain?.name) ||
      validNetworks[0];
    setSelectedNetwork(initialNetwork);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.chain, type, contract]);

  const filteredChains = activeChains.filter(
    (network) =>
      filterFn(network as Network) &&
      filterNetworksByContractProvider([network]).length > 0 &&
      network.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const onNetworkSelect = (network: Network) => {
    setSelectedNetwork(network as ExtendedNetwork);
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
    selectedNetwork,
    onNetworkSelect,
    searchTerm,
    onSearchChange,
    filteredChains,
    networksByProvider,
    onClose,
  };
};
