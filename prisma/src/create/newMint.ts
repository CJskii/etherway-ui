import { ContractType, InteractionType } from "@prisma/client";
import { prisma } from "../../client";

type NewMintProps = {
  ethAddress: string;
  contractType: ContractType;
  interactionType: InteractionType;
  chainId?: number;
  amount?: number;
};

export async function mintInteractionONFT({
  ethAddress,
  contractType,
  interactionType,
  chainId,
}: NewMintProps) {
  // Find the first unawarded referral for the user, if it exists
  const referral = await prisma.referral.findFirst({
    where: {
      referred: {
        ethereumAddress: ethAddress,
      },
      pointsAwarded: false,
    },
  });

  // If a referral is found, update it
  if (referral) {
    console.log("Updating referral:", referral);
    await prisma.referral.update({
      where: { id: referral.id },
      data: { pointsAwarded: true },
    });
  }

  // Create the mint interaction
  const interaction = await prisma.interaction.create({
    data: {
      type: interactionType,
      contractType: contractType,
      points: 100, // Points for mint interaction
      user: { connect: { ethereumAddress: ethAddress.toLowerCase() } },
      chainId,
    },
  });

  return interaction;
}

export async function mintInteractionOFT({
  ethAddress,
  contractType,
  interactionType,
  chainId,
  amount,
}: NewMintProps) {
  if (!amount) {
    return;
  }

  // for minting , we give as much point as they mint the no of tokens
  const pointsToAward = amount;
  // Find the first unawarded referral for the user, if it exists
  const referral = await prisma.referral.findFirst({
    where: {
      referred: {
        ethereumAddress: ethAddress,
      },
      pointsAwarded: false,
    },
  });

  // If a referral is found, update it
  if (referral) {
    console.log("Updating referral:", referral);
    await prisma.referral.update({
      where: { id: referral.id },
      data: { pointsAwarded: true },
    });
  }

  // Create the mint interaction
  const interaction = await prisma.interaction.create({
    data: {
      type: interactionType,
      contractType: contractType,
      points: pointsToAward, // Points for mint interaction
      user: { connect: { ethereumAddress: ethAddress.toLowerCase() } },
      chainId,
    },
  });

  return interaction;
}
