import { ContractType, InteractionType } from "@prisma/client";
import { updateInteractionData } from "../../api/interactions";

export const handleSquidBridgePoints = async ({
  userAddress,
  chainId,
  txAmountUSD,
}: {
  userAddress: string;
  chainId: number;
  txAmountUSD: number;
}) => {
  try {
    const { response, error: apiError } = await updateInteractionData({
      address: userAddress,
      contractType: ContractType.NO_CONTRACT,
      chainId: chainId,
      interactionType: InteractionType.SQUID_BRIDGE,
      amount: txAmountUSD,
    });
    return {
      response,
      apiError,
    };
  } catch (error) {
    console.error(error);
  }
};
