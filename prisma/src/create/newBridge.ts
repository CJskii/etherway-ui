import { InteractionType, ContractType } from "@prisma/client";
import { prisma } from "../../client";

type BridgeInteraction = {
  ethAddress: string;
  contractType: ContractType;
  interactionType: InteractionType;
  chainId?: number;
  amount?: number;
};

export async function bridgeInteractionONFT({
  ethAddress,
  contractType,
  interactionType,
  chainId,
}: BridgeInteraction) {
  const interaction = await prisma.interaction.create({
    data: {
      type: interactionType as InteractionType,
      contractType: contractType as ContractType,
      points: 50,
      user: {
        connect: {
          ethereumAddress: ethAddress.toLowerCase(),
        },
      },
      chainId,
    },
  });
  return interaction;
}

export async function bridgeInteractionOFT({
  ethAddress,
  contractType,
  interactionType,
  chainId,
  amount,
}: BridgeInteraction) {
  if (!amount || amount > 0) {
    return;
  }
  // We reward 50% points for bridging of whatever the amount of tokens they bridge
  const pointsToAward = amount > 1 ? Number((amount / 2).toFixed(0)) : 1;
  const interaction = await prisma.interaction.create({
    data: {
      type: interactionType as InteractionType,
      contractType: contractType as ContractType,
      points: pointsToAward,
      user: {
        connect: {
          ethereumAddress: ethAddress.toLowerCase(),
        },
      },
      chainId,
    },
  });
  return interaction;
}
