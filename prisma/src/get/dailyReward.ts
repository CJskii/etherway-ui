import { prisma } from "../../client";

import { differenceInCalendarDays } from "date-fns";

export async function getLastClaimedDailyReward({
  ethereumAddress,
}: {
  ethereumAddress: string;
}) {
  const lastReward = await prisma.userReward.findFirst({
    where: {
      user: { ethereumAddress: ethereumAddress.toLowerCase() },
      reward: { type: "DAILY" },
    },
    orderBy: { claimedAt: "desc" },
  });

  return lastReward;
}

export async function getNextReward({ lastReward }) {
  const lastClaimedAt = lastReward?.claimedAt;
  const lastRewardDay = lastReward?.day;

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // Check if last reward was claimed yesterday
  const wasClaimedYesterday =
    differenceInCalendarDays(today, lastClaimedAt) === 1;

  // Check if last reward was claimed today
  const wasClaimedToday = differenceInCalendarDays(today, lastClaimedAt) === 0;

  // If the last reward was claimed today, prevent claiming again
  if (wasClaimedToday) {
    return null;
  }

  // If the last reward was Day 7 or Day 8 and was claimed yesterday, return Day 8 reward
  if ((lastRewardDay === 7 || lastRewardDay === 8) && wasClaimedYesterday) {
    return await getRewardByDay(8);
  }

  // If the last reward was claimed before yesterday or it's the first claim, start from Day 1
  if (!lastReward || !wasClaimedYesterday) {
    return await getRewardByDay(1);
  }

  // Otherwise, calculate the next reward day
  return await getRewardByDay((lastRewardDay % 7) + 1);
}

async function getRewardByDay(day: number) {
  // Fetch the reward based on the day
  return await prisma.reward.findFirst({
    where: {
      day: day,
    },
  });
}
