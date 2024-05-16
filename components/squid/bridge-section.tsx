import React, { useEffect } from "react";
import { TokenModalProps } from "./token-modal";
import { RouteType } from "@/common/utils/squid/squidRouter";
import { formatUnits } from "viem";

import { Label } from "../ui/label";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import SquidNetworkModal from "./network-modal";
import SquidTokenModal from "./token-modal";

import { fetchRoute, formatToFixed2 } from "@/common/utils/squid/bridgeUtils";
import { ChainData } from "@0xsquid/squid-types";
import { RefreshCw } from "lucide-react";

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
  setRoute?: (route: RouteType | undefined) => void;
  balanceData?: any;
  inAmount?: number;
  setInAmount?: (amount: number) => void;
  handleFetchRoute?: () => void;
};

export const BridgeSection: React.FC<BridgeSectionProps> = ({
  label,
  chainProps,
  tokenProps,
  handleMaxButton,
  isFetchingRoute,
  route,
  setRoute,
  balanceData,
  inAmount,
  setInAmount,
  handleFetchRoute,
}) => {
  const tokenBalance = () => {
    if (!balanceData || !tokenProps.selectedToken) return null;
    const userBalance = balanceData.find(
      (balance: any) =>
        balance.address.toLowerCase() ===
        tokenProps.selectedToken?.address.toLowerCase(),
    );

    if (userBalance) {
      const formattedBalance = parseFloat(
        formatUnits(
          BigInt(userBalance.balance),
          tokenProps.selectedToken?.decimals,
        ),
      );

      return formattedBalance > 0 ? formattedBalance.toFixed(4) : "0.0";
    }

    return null;
  };

  const balance = tokenBalance();

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
                {balance ? `${balance} ` : "0.0 "}{" "}
                {tokenProps.selectedToken?.symbol}
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
          {label === "To" && handleFetchRoute && route && (
            <Button
              variant="etherway"
              onClick={handleFetchRoute}
              className="text-xs h-6 rounded-md px-2 text-white flex items-center"
              disabled={isFetchingRoute}
            >
              <RefreshCw
                width={12}
                height={12}
                className={`mr-1 ${isFetchingRoute ? "animate-spin" : ""}`}
              />
              Re-fetch
            </Button>
          )}
        </div>
        <Separator
          orientation="horizontal"
          className="my-2 border-[1px] border-black/10 dark:border-black/10 rounded-lg w-full place-self-center"
        />
        {label === "From" && (
          <div className="flex justify-between items-center">
            <SquidTokenModal props={tokenProps} />
            <div className="flex flex-col items-end justify-center">
              {setInAmount && (
                <Input
                  type="number"
                  className="text-right text-xs h-6 border-0 w-28 px-2 rounded-xl dark:bg-white dark:text-black dark:focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0"
                  placeholder="Enter amount"
                  onChange={(e) => {
                    setInAmount(Number(e.target.value));
                    setRoute?.(undefined);
                  }}
                />
              )}
              {isFetchingRoute ? (
                <Skeleton className="h-5 w-12 rounded-md" />
              ) : route?.estimate ? (
                <Typography
                  variant="muted"
                  className="dark:text-black py-0 px-2 text-sm"
                >
                  ${route.estimate.fromAmountUSD}
                </Typography>
              ) : (
                <Skeleton className="h-5 w-12 rounded-md invisible" />
              )}
            </div>
          </div>
        )}

        {label === "To" && (
          <div className="flex justify-between items-center">
            <SquidTokenModal props={tokenProps} />
            {isFetchingRoute ? (
              <div className="flex flex-col items-end justify-center gap-2 w-24 h-10">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>
            ) : route?.estimate ? (
              <div className="flex flex-col items-end justify-center gap-2 w-24 h-10">
                <Typography
                  variant="smallTitle"
                  className="dark:text-black font-semibold truncate px-2"
                >
                  {tokenProps.selectedToken &&
                    `${Number(
                      formatUnits(
                        BigInt(route.estimate.toAmount),
                        tokenProps.selectedToken.decimals,
                      ),
                    ).toFixed(4)} ${tokenProps.selectedToken.symbol}`}
                </Typography>
                <Typography
                  variant="muted"
                  className="dark:text-black py-0 px-2 text-xs truncate"
                >
                  ${route.estimate.toAmountUSD}
                </Typography>
              </div>
            ) : (
              <div className="flex flex-col items-end justify-center gap-2 w-24 h-10">
                {/* Invisible placeholders to maintain layout */}
                <div className="h-4 w-20 rounded-xl invisible"></div>
                <div className="h-4 w-12 rounded-xl invisible"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
