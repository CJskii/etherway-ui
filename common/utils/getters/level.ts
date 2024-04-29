export const calculateUserLevel = (totalXP: number): number => {
  let level = 0;
  let xpForNextLevel = 0;

  while (totalXP >= xpForNextLevel) {
    level++;
    xpForNextLevel = Math.pow(level, 2) * 10;
  }

  return level - 1;
};
