import { prisma } from "@/../prisma/client";
import { InteractionType } from "@prisma/client";

interface getClaimDataProps {
  ethAddress: string;
}

export const getClaimData = async ({ ethAddress }: getClaimDataProps) => {
  const claimData = await prisma.interaction.findFirst({
    where: {
      user: {
        ethereumAddress: ethAddress.toLowerCase(),
      },
      type: InteractionType.V1,
    },
    select: {
      id: true,
      type: true,
      user: {
        select: {
          id: true,
          ethereumAddress: true,
        },
      },
      updatedAt: true,
    },
  });
  return claimData;
};
