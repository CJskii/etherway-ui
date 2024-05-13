import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useConfig } from "wagmi";
import { handleMorphTokenMint } from "@/utils/contracts/handlers/handleMinting";
import Loader from "@/components/ui/loader";
import { Transaction } from "../../pages/staking";
import { useToast } from "@/components/ui/use-toast";

interface MintProps {
  handleUserBalance: (balance: number) => void;
}

export const Mint = ({ handleUserBalance }: MintProps) => {
  const [mintAmount, setMintAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const account = useAccount();
  const config = useConfig();
  const { toast } = useToast();

  const handleMintButton = async () => {
    if (mintAmount !== "" && account.address) {
      setIsLoading(true);
      try {
        const tx = (await handleMorphTokenMint({
          toAddress: account.address,
          amount: Number(mintAmount),
          config: config,
        })) as Transaction;
        if (tx.transactionHash) {
          toast({
            title: "Minted successfully",
            description: `Minted ${mintAmount} tokens`,
            variant: "success",
          });
          setMintAmount("");
          handleUserBalance(Number(mintAmount));
          setIsLoading(false);
          return;
        }

        toast({
          title: "Error minting tokens",
          description: "Please try again",
          variant: "destructive",
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error minting tokens", error);
        setIsLoading(false);
      }
    }
  };
  return (
    <div className="flex flex-col space-y-2 p-4 text-center">
      <Typography variant="large">Mint Morph Token</Typography>
      <Typography variant="smallTitle">
        Begin your journey by securing Morph tokens. For our testnet phase,
        we&apos;re excited to offer a convenient way for you to mint initial
        tokens.
      </Typography>
      <Input
        placeholder="Amount to mint"
        value={mintAmount}
        onChange={(e) => setMintAmount(e.target.value)}
        className="rounded-xl bg-[#E9E9E9] text-black dark:bg-white/30"
      />
      <Button
        variant={"outline"}
        onClick={handleMintButton}
        disabled={mintAmount == "" || isLoading || mintAmount == "0"}
      >
        {isLoading ? <Loader className="h-8 w-8" /> : "Mint"}
      </Button>
    </div>
  );
};

export default Mint;
