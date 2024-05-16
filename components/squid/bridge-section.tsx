import { NetworkModalProps } from "@/common/types/network";
import { TokenModalProps } from "./token-modal";
import { RouteType } from "@/common/utils/squid/squidRouter";

import { Label } from "../ui/label";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import SquidNetworkModal from "./network-modal";
import SquidTokenModal from "./token-modal";

import { formatToFixed2 } from "@/common/utils/squid/bridgeUtils";
import { ChainData } from "@0xsquid/squid-types";

export type ChainProps = {
  selectedNetwork: ChainData;
  onNetworkSelect: (chain: ChainData) => void;
  filteredChains: ChainData[];
  dialogTitle: string;
};

type BridgeSectionProps = {
  label: string;
  chainProps: ChainProps;
  tokenProps: TokenModalProps;
  handleMaxButton?: () => void;
  isFetchingRoute: boolean;
  route: RouteType | undefined;
  balanceData?: any;
  inAmount?: number;
  setInAmount?: (amount: number) => void;
};

export const BridgeSection: React.FC<BridgeSectionProps> = ({
  label,
  chainProps,
  tokenProps,
  handleMaxButton,
  isFetchingRoute,
  route,
  balanceData,
  inAmount,
  setInAmount,
}) => {
  const formattedBalance = balanceData
    ? formatToFixed2({
        value: balanceData.value,
        decimals: balanceData.decimals,
      })
    : "0.00";

  return (
    <div className="flex flex-col">
      <Label className="space-y-2">
        <Typography variant="large" className="dark:text-black">
          {label}
        </Typography>
      </Label>
      <div className="flex flex-col bg-white rounded-lg p-2 md:p-4">
        <div className="flex justify-between items-center">
          <SquidNetworkModal props={chainProps} />
          {balanceData && (
            <div className="flex items-center justify-center gap-2">
              <Typography
                variant="small"
                className="dark:text-black font-semibold"
              >
                {formattedBalance}{" "}
                {chainProps.selectedNetwork?.nativeCurrency.symbol}
              </Typography>
              {handleMaxButton && (
                <Button
                  variant="etherway"
                  onClick={handleMaxButton}
                  className="text-xs h-6 rounded-md px-2 text-white"
                >
                  MAX
                </Button>
              )}
            </div>
          )}
        </div>
        <Separator
          orientation="horizontal"
          className="my-2 border-[1px] border-black/10 dark:border-black/10 rounded-lg w-full place-self-center"
        />
        <div className="flex justify-between items-center">
          <SquidTokenModal props={tokenProps} />
          <div className="flex flex-col items-end justify-center">
            {setInAmount && (
              <Input
                type="number"
                className="text-right text-xs h-6 border-0 w-28 px-2 rounded-xl dark:bg-white dark:text-black dark:focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0"
                placeholder="Enter amount"
                onChange={(e) => setInAmount(Number(e.target.value))}
              />
            )}

            {isFetchingRoute ? (
              <Skeleton className="h-5 w-12 rounded-xl" />
            ) : route?.estimate ? (
              <Typography
                variant="muted"
                className="dark:text-black py-0 px-2 text-sm"
              >
                ${route.estimate.fromAmountUSD}
              </Typography>
            ) : (
              <Skeleton className="h-5 w-12 rounded-xl invisible" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
