import { InteractionType, ContractType } from "@prisma/client";
import { prisma } from "../../client";

type BridgeInteraction = {
  ethAddress: string;
  contractType: ContractType;
  interactionType: InteractionType;
  chainId?: number;
};

export default async function newBridge({
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
