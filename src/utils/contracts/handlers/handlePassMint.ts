import { Network } from "@/types/network";
import { address, abi } from "@/constants/contracts/etherwayPass";
import { getAccount, getPublicClient, getWalletClient } from "wagmi/actions";
import { Config } from "wagmi";

interface handlePassMintType {
  wagmiConfig: Config;
  mintNetwork: Network;
  userAddress: `0x${string}`;
}

// Mint a new pass
export const handlePassMint = async ({
  wagmiConfig,
  userAddress,
}: handlePassMintType) => {
  const { address: account } = getAccount(wagmiConfig);
  const publicClient = getPublicClient(wagmiConfig);
  const walletClient = await getWalletClient(wagmiConfig);
  if (!publicClient) {
    console.log("public client is undefined");
    return;
  }

  if (!walletClient) {
    console.log("wallet client is undefined");
    return;
  }

  try {
    const data = await publicClient.simulateContract({
      account,
      address: address,
      abi: abi,
      functionName: "safeMint",
      args: [userAddress],
    });

    console.log("Minting Pass NFT ..");
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

// Check if a user Owns a pass or not
export const getPasses = async ({
  userAddress,
  wagmiConfig,
}: {
  userAddress: `0x${string}`;
  wagmiConfig: Config;
}) => {
  const { address: account } = getAccount(wagmiConfig);
  const publicClient = getPublicClient(wagmiConfig);

  if (!publicClient) {
    console.log("public client is undefined");
    return;
  }

  try {
    const nftBalance = await publicClient.readContract({
      account,
      address: address,
      abi: abi,
      functionName: "balanceOf",
      args: [userAddress],
    });

    const ownsPass: boolean = nftBalance > 0;
    console.log(ownsPass);

    return ownsPass;
  } catch (error) {
    console.log(error);
    return;
  }
};
