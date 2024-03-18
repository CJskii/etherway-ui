import { prisma } from "../../client";

interface getUserProps {
  ethAddress: string;
  includeReferred?: boolean;
  includeReferrals?: boolean;
  includeInteractions?: boolean;
  includeRewards?: boolean;
}
export const getUser = async ({
  ethAddress,
  includeReferred = false,
  includeReferrals = false,
  includeInteractions = false,
  includeRewards = false,
}: getUserProps) => {
  return await prisma.user.findUnique({
    where: { ethereumAddress: ethAddress },
    select: {
      ethereumAddress: true,
      id: true,
      inviteCode: true,
      referred: includeReferred
        ? {
            select: {
              id: true,
              referrerId: true,
              referredId: true,
              pointsAwarded: true,
              points: true,
              createdAt: true,
              updatedAt: true,
            },
          }
        : undefined,
      referrals: includeReferrals
        ? {
            select: {
              id: true,
              referrerId: true,
              referredId: true,
              pointsAwarded: true,
              points: true,
              createdAt: true,
              updatedAt: true,
            },
          }
        : undefined,
      interactions: includeInteractions
        ? {
            select: {
              id: true,
              type: true,
              contractType: true,
              chainId: true,
              points: true,
              createdAt: true,
              updatedAt: true,
            },
          }
        : undefined,
      UserRewards: includeRewards
        ? {
            select: {
              id: true,
              type: true,
              points: true,
              claimedAt: true,
            },
          }
        : undefined,
    },
  });
};

export const getReferrerData = async ({
  inviteCode,
}: {
  inviteCode: string;
}) => {
  const referrerData = await prisma.user.findUnique({
    where: { inviteCode: inviteCode },
    include: {
      referrals: {
        select: { id: true },
      },
    },
  });

  if (!referrerData) {
    return { referrerId: null, referredCount: 0 };
  }

  const referredCount = referrerData.referrals.length;
  return { referrerId: referrerData.id, referredCount };
};
