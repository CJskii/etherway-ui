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
import { ChainData } from "@0xsquid/squid-types";
import { RefreshCw } from "lucide-react";

import {
  roundedTokenBalance,
  formatToFixedDecimals,
} from "@/common/utils/squid/bridgeUtils";

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
  inAmount?: string;
  setInAmount?: (amount: string) => void;
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
  const balance = roundedTokenBalance({ balanceData, tokenProps });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Use a regex to allow only numbers and one decimal point
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInAmount?.(value);
      setRoute?.(undefined);
    }
  };

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
          {balanceData && renderBalance(balance, tokenProps, handleMaxButton)}
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
          className="my-2 border-[1px] rounded-lg w-full place-self-center"
        />
        {label === "From" && (
          <div className="flex justify-between items-center">
            <SquidTokenModal props={tokenProps} />
            {renderInput(
              setInAmount,
              inAmount,
              handleChange,
              isFetchingRoute,
              route,
            )}
          </div>
        )}
        {label === "To" && (
          <div className="flex justify-between items-center">
            <SquidTokenModal props={tokenProps} />
            {renderEstimate(isFetchingRoute, route, tokenProps)}
          </div>
        )}
      </div>
    </div>
  );
};

export const renderBalance = (
  balance: string | null,
  tokenProps: TokenModalProps,
  handleMaxButton?: () => void,
) => (
  <div className="flex items-center justify-center gap-2">
    <Typography
      variant="small"
      className="dark:text-black font-semibold xl:text-lg"
    >
      {balance ? `${balance} ` : "0.0 "} {tokenProps.selectedToken?.symbol}
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
);

export const renderInput = (
  setInAmount: ((amount: string) => void) | undefined,
  inAmount: string | undefined,
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  isFetchingRoute: boolean,
  route: RouteType | undefined,
) => (
  <div className="flex flex-col items-end justify-center">
    {setInAmount && (
      <Input
        type="text"
        className="text-right text-xs h-6 xl:w-36 xl:h-8 border-0 w-28 px-2 xl:text-lg rounded-xl dark:bg-white dark:text-black dark:focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0"
        placeholder="Enter Amount"
        value={inAmount}
        onChange={handleChange}
      />
    )}
    {isFetchingRoute ? (
      <Skeleton className="h-5 w-12 rounded-md" />
    ) : route?.estimate ? (
      <Typography
        variant="muted"
        className="dark:text-gray-600/60 py-0 px-2 text-sm xl:text-lg"
      >
        ${route.estimate.fromAmountUSD}
      </Typography>
    ) : (
      <Skeleton className="h-5 w-12 rounded-md invisible" />
    )}
  </div>
);

export const renderEstimate = (
  isFetchingRoute: boolean,
  route: RouteType | undefined,
  tokenProps: TokenModalProps,
) => (
  <div className="flex flex-col items-end justify-center gap-2 w-24 h-10 xl:h-14">
    {isFetchingRoute ? (
      <>
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-12 rounded-md" />
      </>
    ) : route?.estimate ? (
      <>
        <Typography
          variant="smallTitle"
          className="dark:text-black font-semibold truncate px-2 xl:text-lg"
        >
          {tokenProps.selectedToken &&
            (() => {
              const formattedAmount = formatUnits(
                BigInt(route.estimate.toAmount),
                tokenProps.selectedToken.decimals,
              );
              return `${formatToFixedDecimals(formattedAmount, tokenProps.selectedToken.decimals, 5)} ${tokenProps.selectedToken.symbol}`;
            })()}
        </Typography>
        <Typography
          variant="muted"
          className="dark:text-gray-600/60 py-0 px-2 text-xs truncate xl:text-lg"
        >
          ${route.estimate.toAmountUSD}
        </Typography>
      </>
    ) : (
      <>
        <div className="h-4 w-20 rounded-xl invisible"></div>
        <div className="h-4 w-12 rounded-xl invisible"></div>
      </>
    )}
  </div>
);
