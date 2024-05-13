import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { handleGetReward } from "@/utils/contracts/handlers/handleStaking";
import { useConfig } from "wagmi";
import { useState } from "react";
import { Transaction } from "../../pages/staking";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/ui/loader";

interface RewardsProps {
  stakedBalance: number;
  userRewards: number;
  setUserRewardsBalance: (balance: number) => void;
  handleUserBalance: (balance: number) => void;
}

export const Rewards = ({
  stakedBalance,
  userRewards,
  setUserRewardsBalance,
  handleUserBalance,
}: RewardsProps) => {
  const config = useConfig();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleClaimRewardsButton = async () => {
    try {
      setIsLoading(true);
      const tx = (await handleGetReward({
        amount: userRewards,
        config: config,
      })) as Transaction;

      console.log("tx", tx);
      if (tx.transactionHash) {
        // TODO: toast feedback
        toast({
          title: "Rewards claimed successfully",
          description: `Claimed ${userRewards} tokens`,
          variant: "success",
        });
        handleUserBalance(userRewards);
        setUserRewardsBalance(0);
        return setIsLoading(false);
      }

      toast({
        title: "Error claiming rewards",
        description: "Please try again",
        variant: "destructive",
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error claiming rewards", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 p-4 text-center">
      <Typography variant="large">Rewards</Typography>
      {/* <Typography variant="smallTitle">Claim your rewards here.</Typography> */}
      <Typography variant="lead" className="py-4">
        {" "}
        Current APR: 13%
      </Typography>
      <div className="flex items-center justify-between">
        <Typography variant="inlineCode" className="pt-4">
          Earned rewards: {userRewards.toFixed(5)} $rMPH
        </Typography>
        <Typography variant="inlineCode" className="pt-4">
          Your Stake: {stakedBalance.toFixed(2)} $mMPH
        </Typography>
      </div>
      <Button
        variant={"outline"}
        onClick={handleClaimRewardsButton}
        disabled={userRewards == 0 || isLoading}
      >
        {isLoading ? <Loader className="h-8 w-8" /> : "Claim Rewards"}
      </Button>
    </div>
  );
};

export default Rewards;
