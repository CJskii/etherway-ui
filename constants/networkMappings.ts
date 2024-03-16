import { layerZeroMapping } from "./mapping/layerzero";
import { hyperlaneMapping } from "./mapping/hyperlane";

type NetworkTransferMappings = {
  layerzero: {
    [contract: string]: {
      [network: string]: string[];
    };
  };
  hyperlane: {
    [contract: string]: {
      [network: string]: string[];
    };
  };
};

export const networkTransferMappings: NetworkTransferMappings = {
  layerzero: {
    OFT: layerZeroMapping,
    ONFT: layerZeroMapping,
  },
  hyperlane: {
    ONFT: hyperlaneMapping,
    OFT: hyperlaneMapping,
  },
};
