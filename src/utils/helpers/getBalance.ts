import { ethers, Contract } from "ethers";
import getProviderOrSigner from "./getProviderOrSigner";
import { Network } from "@/src/types/network";
import { DeployedContracts } from "@/src/types/network";

interface getUserBalanceProps {
  fromNetwork: Network;
  account: any;
  type: string;
  contract: string;
  setUserBalance: (balance: number) => void;
}

export const getUserBalance = async ({
  fromNetwork,
  account,
  type,
  contract,
  setUserBalance,
}: getUserBalanceProps) => {
  if (!fromNetwork.deployedContracts || !account.address) return;
  try {
    const balanceInWei = await getBalance({
      abi: fromNetwork.deployedContracts[type as keyof DeployedContracts][
        contract
      ].ABI,
      walletAddress: account.address,
      contractAddress:
        fromNetwork.deployedContracts[type as keyof DeployedContracts][contract]
          .address,
    });

    const balanceInEther = ethers.utils.formatEther(balanceInWei);

    setUserBalance(Number(balanceInEther));
  } catch (e) {
    console.error(e);
  }
};

export const getBalance = async ({
  abi,
  walletAddress,
  contractAddress,
}: {
  abi: any;
  walletAddress: string;
  contractAddress: string;
}) => {
  try {
    const provider = await getProviderOrSigner();
    const contractInstance = new Contract(contractAddress, abi, provider);
    const balance = await contractInstance.balanceOf(walletAddress);
    return balance.toString();
  } catch (e) {
    console.error(e);
  }
};
