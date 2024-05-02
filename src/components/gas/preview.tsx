import { IPreview } from "../../types/gas-refuel";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Typography } from "@/src/components/ui/typography";

const Preview = ({
  nativeCurrencySymbol,
  networkName,
  inputAmount,
  setInputAmount,
  handleMaxButton,
  handlePreviewClick,
}: IPreview) => {
  return (
    <>
      <Label className=" space-y-2">
        <Typography
          variant={"smallTitle"}
          className="dark:text-black font-semibold"
        >
          {`Step 1: Input amount of ${nativeCurrencySymbol} to receive on ${networkName}`}
        </Typography>
        <div className="relative">
          <Input
            placeholder="Enter amount to bridge"
            className="p-6 py-7 rounded-xl dark:bg-white dark:text-black"
            onChange={(e) => setInputAmount(e.target.value)}
            type="number"
            value={inputAmount}
            // ref={userBalanceRef}
          />
          <Button
            size={"sm"}
            className="absolute right-4 top-3.5 h-8 dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-lg "
            onClick={handleMaxButton}
          >
            Max
          </Button>
        </div>
      </Label>
      <div className="flex flex-col gap-2">
        <Label className=" space-y-2">
          <Typography
            variant={"smallTitle"}
            className="dark:text-black font-semibold"
          >
            Step 2: {"Preview transaction"}
          </Typography>
        </Label>
        <Button
          className=" py-6 w-full dark:bg-black dark:text-white dark:hover:bg-black/80 rounded-xl"
          disabled={inputAmount === ""}
          // onClick={apiBridgeError ? tryBridgingAPICall : handleBridgeButton}
          onClick={handlePreviewClick}
        >
          {/* {hasBridged && apiBridgeError ? "Try again" : "Send"} */}
          {"Confirm"}
        </Button>
      </div>
    </>
  );
};

export default Preview;
