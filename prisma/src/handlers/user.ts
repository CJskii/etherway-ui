import { getReferralPoints } from "../get/referralPoints";
import { getReferrerData, getUser } from "../get/userData";
import { createUser } from "../create/newUser";

type handleUserProps = {
  ethAddress: string;
  inviteCode?: string;
  includeReferred?: boolean;
  includeReferrals?: boolean;
  includeInteractions?: boolean;
  includeRewards?: boolean;
};

export default async function handleUser({
  ethAddress,
  inviteCode,
  includeReferred = false,
  includeReferrals = false,
  includeInteractions = false,
  includeRewards = false,
}: handleUserProps) {
  // check if user exists
  const userExists = await getUser({
    ethAddress: ethAddress.toLowerCase(),
    includeReferred,
    includeReferrals,
    includeInteractions,
    includeRewards,
  });

  if (userExists) {
    return userExists;
  }

  let referrerId: number | null = null;
  let referralPoints: number | undefined = 0;

  // user doesn't exist, check if they have a referrer
  if (inviteCode) {
    try {
      const { referrerId: referrer, referredCount } = await getReferrerData({
        inviteCode,
      });
      referrerId = referrer;
      referralPoints = getReferralPoints(referredCount);
    } catch (error) {
      console.log(error);
    }
  }

  return await createUser({
    ethAddress: ethAddress.toLowerCase(),
    referrerId,
    referralPoints,
  });
}
