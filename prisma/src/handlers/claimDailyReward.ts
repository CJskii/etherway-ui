import handleUser from "./user";
import { getLastClaimedDailyReward, getNextReward } from "../get/dailyReward";
import newReward from "../create/newReward";
import { RewardType } from "@prisma/client";

type DailyRewardProps = {
  ethereumAddress: string;
  rewardType: RewardType;
};

export default async function claimDailyReward({
  ethereumAddress,
  rewardType,
}: DailyRewardProps) {
  const user = await handleUser({ ethAddress: ethereumAddress });

  const lastReward = await getLastClaimedDailyReward({
    ethereumAddress,
  });

  const nextReward = await getNextReward({ lastReward });

  if (!nextReward) return null;

  return await newReward({
    userId: user.id,
    rewardId: nextReward.id,
    rewardType,
    points: nextReward.basePoints,
  });
}
