import { prisma } from "../../client";
import { getNewInviteCode } from "../get/newInviteCode";

interface createUserProps {
  ethAddress: string;
  referrerId: number | null;
  referralPoints: number | undefined;
}

export const createUser = async ({
  ethAddress,
  referrerId = null,
  referralPoints = 0,
}: createUserProps) => {
  return await prisma.user.create({
    data: {
      ethereumAddress: ethAddress,
      inviteCode: getNewInviteCode(),
      ...(referrerId && {
        referred: {
          create: [
            {
              referrer: { connect: { id: referrerId } },
              points: referralPoints,
              pointsAwarded: false,
            },
          ],
        },
      }),
    },
    include: { referred: true, referrals: true, interactions: true },
  });
};
