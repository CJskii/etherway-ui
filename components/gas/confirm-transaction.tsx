import { ethers } from "ethers";
import { IConfirm } from "../../common/types/gas-refuel";
import { useEffect, useState } from "react";
import { coingeckoMapping } from "../../constants/tokenMappings";
import GasPriceDisplay from "./gas-price-display";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";
import { Separator } from "@radix-ui/react-separator";

const Confirm = ({
  toNetwork,
  fromNetwork,
  inputAmount,
  gasFee,
  setGasFee,
  handleConfirmButton,
  isLoading,
}: IConfirm) => {
  const [toNetworkPrice, setToNetworkPrice] = useState<number | null>(null);
  const [fromNetworkPrice, setFromNetworkPrice] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/fetchPrices")
      .then((res) => res.json())
      .then((data) => {
        const toPrice =
          data[coingeckoMapping[toNetwork.nativeCurrency.symbol.toLowerCase()]]
            ?.usd;
        const fromPrice =
          data[
            coingeckoMapping[fromNetwork.nativeCurrency.symbol.toLowerCase()]
          ]?.usd;
        setToNetworkPrice(toPrice);
        setFromNetworkPrice(fromPrice);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const estimatedUSDValue = toNetworkPrice
    ? (toNetworkPrice * Number(inputAmount)).toFixed(2)
    : null;
  const totalCost = Number(ethers.utils.formatEther(gasFee.toString())).toFixed(
    5,
  );
  const totalCostUSD = fromNetworkPrice
    ? (fromNetworkPrice * Number(totalCost)).toFixed(2)
    : null;

  return (
    <>
      <div>
        <Label>
          <Typography
            variant={"smallTitle"}
            className="dark:text-black font-semibold"
          >
            Step 3: {"Check estimates"}
          </Typography>
        </Label>
        <div className="mt-4 border-[1px] border-black bg-white/30 rounded-lg p-2 flex flex-col hover:border-opacity-100">
          <GasPriceDisplay
            label={`Receive on ${toNetwork.name}`}
            amount={inputAmount}
            currencySymbol={toNetwork.nativeCurrency.symbol}
            usdValue={estimatedUSDValue ? estimatedUSDValue : undefined}
            tooltipDescription="This is the amount you will receive on the destination network"
          />
          <Separator className="border-[1px] dark:border-black/20 rounded-lg" />
          <GasPriceDisplay
            label="Estimated total cost"
            amount={totalCost}
            currencySymbol={fromNetwork.nativeCurrency.symbol}
            usdValue={totalCostUSD ? totalCostUSD : undefined}
            tooltipDescription="This is the total estimated cost of the transaction including gas fees"
          />
        </div>
      </div>

      <div>
        <Label className="flex flex-col gap-2">
          <Typography
            variant={"smallTitle"}
            className="dark:text-black font-semibold"
          >
            Step 4: {"Confirm transaction"}
          </Typography>
        </Label>
        <Button
          className="py-6 my-2 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
          disabled={isLoading ? true : false}
          onClick={handleConfirmButton}
        >
          {"Confirm"}
        </Button>
        <Button
          className="py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
          onClick={() => {
            setGasFee("");
          }}
        >
          Return
        </Button>
      </div>
    </>
  );
};

export default Confirm;
