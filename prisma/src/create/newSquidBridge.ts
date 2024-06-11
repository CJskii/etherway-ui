import { InteractionType, ContractType } from "@prisma/client";
import { prisma } from "../../client";

type BridgeInteraction = {
  ethAddress: string;
  contractType: ContractType;
  interactionType: InteractionType;
  chainId?: number;
  amount?: number;
};

const SQUID_BRIDGE_MULTIPLIER = 0;

export async function squidBridge({
  ethAddress,
  contractType,
  interactionType,
  chainId,
  amount,
}: BridgeInteraction) {
  if (!amount) {
    throw new Error("Missing amount");
  }
  const points = amount * SQUID_BRIDGE_MULTIPLIER;
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
