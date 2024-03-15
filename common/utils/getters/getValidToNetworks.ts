import { Network } from "../../types/network";
import { networkTransferMappings } from "../../../constants/networkMappings";

export const getValidToNetworks = ({
  fromNetwork,
  type,
  contract,
}: {
  fromNetwork: Network;
  type: string;
  contract: string;
}) => {
  if (type == "layerzero") {
    return networkTransferMappings.layerzero[contract][fromNetwork.name] || [];
  } else if (type == "hyperlane") {
    return networkTransferMappings.hyperlane[contract][fromNetwork.name] || [];
  }
};
