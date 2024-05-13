import { getAccount, getPublicClient } from "wagmi/actions";
import { Config, useConfig } from "wagmi";
import {
  Morph_Token_ABI,
  Morph_Token_Address,
  Staking_Morph_ABI,
  Staking_Morph_Address,
} from "@/constants/contracts/morph";
import { formatEther, parseEther } from "viem";

export const getMorphTokenBalance = async ({
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
    const morphTokenAmount = await publicClient.readContract({
      account,
      address: Morph_Token_Address,
      abi: Morph_Token_ABI,
      functionName: "balanceOf",
      args: [toAddress],
    });
    console.log(morphTokenAmount);

    return {
      morphTokenAmount: formatEther(morphTokenAmount),
    };
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getTotalStakedAmount = async ({ config }: { config: Config }) => {
  const { address: account } = getAccount(config);
  const publicClient = getPublicClient(config);

  if (!publicClient) {
    console.log("public client is undefined");
    return;
  }

  try {
    const totalStakedAmount = await publicClient.readContract({
      account,
      address: Staking_Morph_Address,
      abi: Staking_Morph_ABI,
      functionName: "totalSupply",
    });
    console.log(totalStakedAmount);

    return {
      totalStakedAmount: formatEther(totalStakedAmount),
    };
  } catch (error) {
    console.log(error);
    return;
  }
};
