import { RewardType } from "@prisma/client";
import { prisma } from "../../client";

type NewRewardProps = {
  userId: number;
  rewardId: number;
  rewardType: RewardType;
  points: number;
};

export default async function newReward({
  userId,
  rewardId,
  rewardType,
  points,
}: NewRewardProps) {
  return await prisma.userReward.create({
    data: {
      userId,
      rewardId,
      points,
      type: rewardType,
    },
  });
}
