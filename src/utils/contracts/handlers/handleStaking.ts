import { getAccount, getPublicClient, getWalletClient } from "wagmi/actions";
import { Config, useConfig } from "wagmi";
import {
  Morph_Token_ABI,
  Morph_Token_Address,
  Staking_Morph_ABI,
  Staking_Morph_Address,
} from "../../../constants/contracts/morph";
import { formatEther, parseEther } from "viem";

// const config = useConfig() to get the config
export const handleStaking = async ({
  amount,
  config,
}: {
  amount: number;
  config: Config;
}) => {
  const { address: account } = getAccount(config);
  const publicClient = getPublicClient(config);
  const walletClient = await getWalletClient(config);
  if (!publicClient) {
    console.log("public client is undefined");
    return;
  }

  if (!walletClient) {
    console.log("wallet client is undefined");
    return;
  }

  try {
    // Approve token
    const approvedata = await publicClient.simulateContract({
      account,
      address: Morph_Token_Address,
      abi: Morph_Token_ABI,
      functionName: "approve",
      args: [Staking_Morph_Address, parseEther(amount.toString())],
    });

    const approvetx = await walletClient.writeContract(approvedata.request);
    console.log("Transaction Sent !");
    const approvetransaction = await publicClient.waitForTransactionReceipt({
      hash: approvetx,
    });
    console.log("Transaction completed");
    console.log(approvetransaction);

    // Stake token
    const stakedata = await publicClient.simulateContract({
      account,
      address: Staking_Morph_Address,
      abi: Staking_Morph_ABI,
      functionName: "stake",
      args: [parseEther(amount.toString())],
    });

    const staketx = await walletClient.writeContract(stakedata.request);
    console.log("Transaction Sent !");
    const staketransaction = await publicClient.waitForTransactionReceipt({
      hash: staketx,
    });
    console.log("Transaction completed");
    console.log(staketransaction);

    return { approvetransaction, staketransaction };
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const handleUnstake = async ({
  amount,
  config,
}: {
  amount: number;
  config: Config;
}) => {
  const { address: account } = getAccount(config);
  const publicClient = getPublicClient(config);
  const walletClient = await getWalletClient(config);
  if (!publicClient) {
    console.log("public client is undefined");
    return;
  }

  if (!walletClient) {
    console.log("wallet client is undefined");
    return;
  }

  try {
    // UnStake token
    const data = await publicClient.simulateContract({
      account,
      address: Staking_Morph_Address,
      abi: Staking_Morph_ABI,
      functionName: "withdraw",
      args: [parseEther(amount.toString())],
    });

    const tx = await walletClient.writeContract(data.request);
    console.log("Transaction Sent !");
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });
    console.log("Transaction completed");
    console.log(transaction);

    return transaction;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getUserStakingStats = async ({
  toAddress,
  config,
}: {
  toAddress: `0x${string}`;
  config: Config;
}) => {
  const { address: account } = getAccount(config);
  const publicClient = getPublicClient(config);

  if (!publicClient) {
    console.log("public client is undefined");
    return;
  }

  try {
    const stakedAmount = await publicClient.readContract({
      account,
      address: Staking_Morph_Address,
      abi: Staking_Morph_ABI,
      functionName: "balanceOf",
      args: [toAddress],
    });
    console.log(stakedAmount);

    const earnedRewards = await publicClient.readContract({
      account,
      address: Staking_Morph_Address,
      abi: Staking_Morph_ABI,
      functionName: "earned",
      args: [toAddress],
    });

    console.log(earnedRewards);

    return {
      stakedAmount: formatEther(stakedAmount),
      rewardAmount: formatEther(earnedRewards),
    };
  } catch (error) {
    console.log(error);
    return;
  }
};

export const handleGetReward = async ({
  amount,
  config,
}: {
  amount: number;
  config: Config;
}) => {
  const { address: account } = getAccount(config);
  const publicClient = getPublicClient(config);
  const walletClient = await getWalletClient(config);
  if (!publicClient) {
    console.log("public client is undefined");
    return;
  }

  if (!walletClient) {
    console.log("wallet client is undefined");
    return;
  }

  try {
    // UnStake token
    const data = await publicClient.simulateContract({
      account,
      address: Staking_Morph_Address,
      abi: Staking_Morph_ABI,
      functionName: "getReward",
    });

    const tx = await walletClient.writeContract(data.request);
    console.log("Transaction Sent !");
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });
    console.log("Transaction completed");
    console.log(transaction);

    return transaction;
  } catch (error) {
    console.log(error);
    return error;
  }
};
