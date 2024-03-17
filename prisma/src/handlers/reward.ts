// Pseudocode
//   async function claimDailyReward(userId, rewardId) {
//     const reward = await getReward(rewardId);
//     const userStreak = await getUserStreak(userId);

//     const today = new Date();
//     const points = calculatePoints(reward.basePoints, userStreak.streak);

//     if (isConsecutiveDay(userStreak.lastClaim, today)) {
//       userStreak.streak++;
//     } else {
//       userStreak.streak = 1;
//     }

//     userStreak.lastClaim = today;
//     updateUserStreak(userStreak);

//     createUserReward(userId, rewardId, points, today);
//   }

import claimDailyReward from "./claimDailyReward";
import { RewardType } from "@prisma/client";

type handleRewardProps = {
  ethereumAddress: string;
  rewardType: RewardType;
};

export default async function handleReward({
  ethereumAddress,
  rewardType,
}: handleRewardProps) {
  switch (rewardType) {
    case "DAILY":
      return await claimDailyReward({
        ethereumAddress,
        rewardType: "DAILY",
      });
    default:
      break;
  }
}
