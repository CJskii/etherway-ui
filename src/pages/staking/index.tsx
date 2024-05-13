import DashboardLayout from "@/components/dashboard/layout";
import { Typography } from "@/components/ui/typography";
import { Mint } from "../../components/staking/mint";
import { Stake } from "../../components/staking/stake";
import { Unstake } from "../../components/staking/unstake";
import { Rewards } from "../../components/staking/rewards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { getUserStakingStats } from "@/utils/contracts/handlers/handleStaking";
import { useAccount, useConfig, useConnect } from "wagmi";
import {
  getMorphTokenBalance,
  getTotalStakedAmount,
} from "@/utils/contracts/handlers/handleToken";

import { useAuth } from "@/context/authContext";

export interface Transaction {
  transactionHash: string;
  from: string;
  status: string;
}

export default function AirdropHunterPage() {
  const { currentUserData } = useAuth();
  const { address } = useAccount();
  const [userWalletBalance, setUserWalletBalance] = useState<number>(0);
  const [stakedBalance, setStakedBalance] = useState<number>(0);
  const [totalStakedTokens, setTotalStakedTokens] = useState<number>(0);
  const [userRewards, setUserRewards] = useState<number>(0);
  const config = useConfig();
  const {} = useConnect();

  useEffect(() => {
    const fetchStakingStats = async () => {
      if (address) {
        const stats = await getUserStakingStats({
          toAddress: address as `0x${string}`,
          config: config,
        });

        const userBalance = await getMorphTokenBalance({
          toAddress: address as `0x${string}`,
          config: config,
        });

        const stakingContract = await getTotalStakedAmount({
          config: config,
        });

        if (userBalance) {
          setUserWalletBalance(Number(userBalance.morphTokenAmount));
        }
        if (stakingContract) {
          setTotalStakedTokens(Number(stakingContract.totalStakedAmount));
        }
        if (stats) {
          // setUserWalletBalance(stats.walletBalance);
          setStakedBalance(Number(stats.stakedAmount));
          setUserRewards(Number(stats.rewardAmount));
        }
      }
    };
    fetchStakingStats();
  }, [address]);

  // called after minting and unstaking - updates user wallet balance
  const handleUserBalance = (amount: number) => {
    setUserWalletBalance((prev) => prev + amount);
  };

  // called after staking - updates user staked balance and total staked tokens in the pool
  const handleStakedBalance = (amount: number) => {
    setStakedBalance((prev) => prev + amount);
    setTotalStakedTokens((prev) => prev + amount);
    setUserWalletBalance((prev) => prev - amount);
  };

  // called after unstaking - updates user staked balance and total staked tokens in the pool
  const handleUnstakedBalance = (amount: number) => {
    setStakedBalance((prev) => prev - amount);
    setTotalStakedTokens((prev) => prev - amount);
  };

  return (
    <DashboardLayout>
      <div className=" space-y-6 py-6 text-center md:space-y-12">
        <Typography variant="h2">
          Stake Morph to Access Airdrop Hunter
        </Typography>
        <Typography variant="smallTitle">
          Airdrop Hunter offers you a gateway to the newest airdrops in the
          cryptocurrency realm.
        </Typography>

        {/* <div className="flex flex-col items-start justify-center ">
          <Typography variant="h3">1. Mint Morph Token</Typography>
          <Typography variant="h3">2. Stake Your Tokens</Typography>
          <Typography variant="h3">3. Access Airdrop Hunter</Typography>
        </div> */}
        <Tabs
          defaultValue="stake"
          className="bg-gradient items-start rounded-xl lg:mx-auto lg:w-9/12"
        >
          <TabsList className="border-1 w-full">
            <TabsTrigger value="mint">Mint</TabsTrigger>
            <TabsTrigger value="stake">Stake</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="unstake">Unstake</TabsTrigger>
          </TabsList>
          <TabsContent value="mint">
            <Mint handleUserBalance={handleUserBalance} />
          </TabsContent>
          <TabsContent value="stake">
            <Stake
              handleStakedBalance={handleStakedBalance}
              walletBalance={userWalletBalance}
              totalStakedTokens={totalStakedTokens}
            />
          </TabsContent>
          <TabsContent value="rewards">
            <Rewards
              stakedBalance={stakedBalance}
              userRewards={userRewards}
              setUserRewardsBalance={setUserRewards}
              handleUserBalance={handleUserBalance}
            />
          </TabsContent>

          <TabsContent value="unstake">
            <Unstake
              userStakedAmount={stakedBalance}
              handleUnstakedBalance={handleUnstakedBalance}
              handleUserBalance={handleUserBalance}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
