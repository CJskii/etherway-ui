import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { handleStaking } from "@/utils/contracts/handlers/handleStaking";
import { useAccount } from "wagmi";
import { useConfig } from "wagmi";
import Loader from "@/components/ui/loader";
import { useToast } from "@/components/ui/use-toast";
import { Transaction } from "../../pages/staking";

interface StakeProps {
  handleStakedBalance: (balance: number) => void;
  walletBalance: number;
  totalStakedTokens: number;
}

interface StakingTransaction {
  approvetransaction: Transaction;
  staketransaction: Transaction;
}

export const Stake = ({
  handleStakedBalance,
  walletBalance,
  totalStakedTokens,
}: StakeProps) => {
  const [stakeAmount, setStakeAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const account = useAccount();
  const config = useConfig();
  const { toast } = useToast();

  const handleStakeButton = async () => {
    if (stakeAmount !== "" && account.address) {
      try {
        setIsLoading(true);
        const tx = (await handleStaking({
          amount: Number(stakeAmount),
          config: config,
        })) as StakingTransaction;

        if (
          tx.approvetransaction.transactionHash &&
          tx.staketransaction.transactionHash
        ) {
          toast({
            title: "Staked successfully",
            description: `Staked ${stakeAmount} tokens`,
            variant: "success",
          });
          setStakeAmount("");
          handleStakedBalance(Number(stakeAmount));
          return setIsLoading(false);
        }

        toast({
          title: "Error staking tokens",
          description: "Please try again",
          variant: "destructive",
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error staking tokens", error);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-2 p-4 text-center">
      <Typography variant="large">Stake Your Tokens</Typography>
      <Typography variant="smallTitle">
        Staking Morph tokens is your key to unlocking Airdrop Hunter. Stake the
        required amount through our staking interface to gain instant access.
      </Typography>

      <Typography variant="lead" className="pt-4">
        Staking Pool balance: {totalStakedTokens.toFixed(2)} $mMPH
      </Typography>

      <div className="flex items-center justify-between">
        <Typography variant="inlineCode" className="pt-4">
          Wallet Balance: {walletBalance.toFixed(2)} $mMPH
        </Typography>
        <Typography variant="inlineCode" className="pt-4">
          Current APR: 13%
        </Typography>
      </div>
      <Input
        placeholder="Amount to stake"
        value={stakeAmount}
        onChange={(e) => setStakeAmount(e.target.value)}
        className="rounded-xl bg-[#E9E9E9] text-black dark:bg-white/30"
      />
      <Button
        variant={"outline"}
        onClick={handleStakeButton}
        disabled={stakeAmount == "" || isLoading || stakeAmount == "0"}
      >
        {isLoading ? <Loader className="h-8 w-8" /> : "Stake"}
      </Button>
    </div>
  );
};

export default Stake;
