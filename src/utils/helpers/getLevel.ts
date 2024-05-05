export const calculateUserLevel = (totalXP: number): number => {
  let level = 0;
  let xpForNextLevel = 0;

  while (totalXP >= xpForNextLevel) {
    level++;
    xpForNextLevel = Math.pow(level, 2) * 10;
  }

  return level - 1;
};

export const calculateProgressToNextLevel = (totalXP: number): number => {
  const level = calculateUserLevel(totalXP);
  const xpForCurrentLevel = Math.pow(level, 2) * 10;
  const xpForNextLevel = Math.pow(level + 1, 2) * 10;

  const xpGainedThisLevel = totalXP - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressToNextLevel = (xpGainedThisLevel / xpNeededForNextLevel) * 100;

  return Math.min(100, Math.max(0, progressToNextLevel)); // progress between 0 - 100
};
