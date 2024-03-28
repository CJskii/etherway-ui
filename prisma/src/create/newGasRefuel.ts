import { InteractionType, ContractType } from "@prisma/client";
import { prisma } from "../../client";

type BridgeInteraction = {
  ethAddress: string;
  contractType: ContractType;
  interactionType: InteractionType;
  chainId?: number;
  amount?: number;
};

export async function gasRefuel({
  ethAddress,
  contractType,
  interactionType,
  chainId,
}: BridgeInteraction) {
  const interaction = await prisma.interaction.create({
    data: {
      type: interactionType as InteractionType,
      contractType: contractType as ContractType,
      points: 0,
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
