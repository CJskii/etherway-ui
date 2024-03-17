export const getReferralPoints = (
  referredCount: number,
): number | undefined => {
  if (referredCount < 6) return 100;
  if (referredCount < 11) return 200;
  if (referredCount > 10) return 300;
};
