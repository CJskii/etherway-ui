import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { handleUnstake } from "@/utils/contracts/handlers/handleStaking";
import { useConfig } from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { Transaction } from "../../pages/staking";
import Loader from "@/components/ui/loader";

interface UnstakeProps {
  userStakedAmount: number;
  handleUnstakedBalance: (balance: number) => void;
  handleUserBalance: (balance: number) => void;
}

export const Unstake = ({
  handleUserBalance,
  handleUnstakedBalance,

  userStakedAmount,
}: UnstakeProps) => {
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const config = useConfig();
  const { toast } = useToast();

  const handleUnstakeButton = async () => {
    if (unstakeAmount !== "") {
      try {
        setIsLoading(true);
        const tx = (await handleUnstake({
          amount: Number(unstakeAmount),
          config: config,
        })) as Transaction;

        if (tx.transactionHash) {
          toast({
            title: "Unstaked successfully",
            description: `Unstaked ${unstakeAmount} tokens`,
            variant: "success",
          });
          handleUserBalance(Number(unstakeAmount));
          handleUnstakedBalance(Number(unstakeAmount));
          setUnstakeAmount("");
          return setIsLoading(false);
        }

        toast({
          title: "Error unstaking tokens",
          description: "Please try again",
          variant: "destructive",
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error unstaking tokens", error);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-2 p-4 text-center">
      <Typography variant="large">Unstake Your Contribution</Typography>
      <Typography variant="smallTitle">
        Unstake to withdraw your staked tokens.
      </Typography>
      <div className="flex items-center justify-between">
        <Typography variant="inlineCode" className="pt-4">
          Staked Balance: {userStakedAmount} $mMPH
        </Typography>
        <Typography variant="inlineCode" className="pt-4">
          Current APR: 13%
        </Typography>
      </div>

      <Input
        placeholder="Amount to unstake"
        value={unstakeAmount}
        onChange={(e) => setUnstakeAmount(e.target.value)}
        className="rounded-xl bg-[#E9E9E9] text-black dark:bg-white/30"
      />

      <Button
        variant={"outline"}
        onClick={handleUnstakeButton}
        disabled={unstakeAmount == "" || isLoading || unstakeAmount == "0"}
      >
        {isLoading ? <Loader className="h-8 w-8" /> : "Unstake"}
      </Button>
    </div>
  );
};

export default Unstake;
