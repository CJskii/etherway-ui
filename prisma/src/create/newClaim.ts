import { InteractionType, ContractType } from "@prisma/client";
import { prisma } from "../../client";

type ClaimV1Interaction = {
  ethAddress: string;
  contractType: ContractType;
  interactionType: InteractionType;
  chainId?: number;
  points?: number;
};

export async function claimV1Interaction({
  ethAddress,
  contractType,
  interactionType,
  chainId,
  points,
}: ClaimV1Interaction) {
  if (!points) {
    console.log("No Points founds");
    return;
  }

  //TODO : check if there is no claim currently present for the user
  // const claim = await prisma.interaction.findFirst({
  //   where: { user },
  // });

  const interaction = await prisma.interaction.create({
    data: {
      type: interactionType as InteractionType,
      contractType: contractType as ContractType,
      points: points,
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
