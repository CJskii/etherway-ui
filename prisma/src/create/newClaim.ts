import { InteractionType, ContractType } from "@prisma/client";
import { prisma } from "../../client";
import { getClaimData } from "../get/claimData";

type ClaimV1Interaction = {
  ethAddress: string;
  contractType: ContractType;
  interactionType: InteractionType;
  chainId?: number;
  points: number;
};

export async function claimV1Interaction({
  ethAddress,
  contractType,
  interactionType,
  points,
}: ClaimV1Interaction) {
  const claimData = await getClaimData({ ethAddress: ethAddress });
  if (claimData) {
    console.log("Already Claimed !!");
    return null;
  }

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
    },
  });
  return interaction;
}
