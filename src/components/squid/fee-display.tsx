import { Typography } from "../ui/typography";
import { Skeleton } from "../ui/skeleton";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@radix-ui/react-accordion";
import React from "react";
import { formatUnits } from "viem";
import { RouteType } from "@/utils/squid/squidRouter";
import { Token } from "@0xsquid/squid-types";

interface FeesProps {
  props: {
    isFetchingRoute: boolean;
    route: RouteType | undefined;
    toToken: Token | undefined;
  };
}

const renderFeeCost = (
  feeCost: any,
  toToken: Token | undefined,
  index: number,
) => {
  const ethAmount = Number(
    formatUnits(BigInt(feeCost.amount), toToken?.decimals ?? 18),
  ).toFixed(5);
  const usdAmount = Number(feeCost.amountUsd).toFixed(2);

  return (
    <Typography
      variant={"muted"}
      className="dark:text-black text-xs"
      key={index}
    >
      {feeCost.name}: ${usdAmount}
    </Typography>
  );
};

const renderTotalCost = (route: RouteType | undefined) => {
  if (!route?.estimate) return null;

  const gasCost = route.estimate.gasCosts[0];
  const ethAmount = formatUnits(BigInt(gasCost.amount), gasCost.token.decimals);
  const usdAmount = gasCost.amountUsd ? `~ $${gasCost.amountUsd}` : "";

  return (
    <Typography variant={"muted"} className="dark:text-black text-xs truncate">
      Estimated Fee: {ethAmount} {gasCost.token.symbol} {usdAmount}
    </Typography>
  );
};

export const FeeDetails = ({ props }: FeesProps) => {
  const { isFetchingRoute, route, toToken } = props;

  const minReceivedAmount = route?.estimate
    ? Number(
        formatUnits(
          BigInt(route.estimate.toAmountMin),
          toToken?.decimals ?? 18,
        ),
      ).toFixed(5)
    : null;

  return (
    <div>
      {isFetchingRoute ? (
        <Skeleton className="h-4 w-full rounded-md" />
      ) : (
        renderTotalCost(route)
      )}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex justify-between items-center w-full py-2">
            <Typography
              variant={"small"}
              className="dark:text-black flex justify-between items-center w-full"
            >
              More details <ChevronDown />
            </Typography>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <Typography variant={"muted"} className="dark:text-black text-xs">
              Slippage: 1%
            </Typography>

            {route?.estimate && toToken && minReceivedAmount && (
              <Typography variant={"muted"} className="dark:text-black text-xs">
                Minimum received amount: {minReceivedAmount} {toToken.symbol}
              </Typography>
            )}

            {route?.estimate?.feeCosts &&
              route.estimate.feeCosts.map((feeCost, index) =>
                renderFeeCost(feeCost, toToken, index),
              )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FeeDetails;
