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
import { RouteType } from "@/common/utils/squid/squidRouter";
import { Token } from "@0xsquid/squid-types";

interface FeesProps {
  props: {
    isFetchingRoute: boolean;
    route: RouteType | undefined;
    toToken: Token | undefined;
  };
}

export const FeeDetails = ({ props }: FeesProps) => {
  const { isFetchingRoute, route, toToken } = props;

  return (
    <div>
      {isFetchingRoute ? (
        <Skeleton className="h-4 w-full rounded-md" />
      ) : route?.estimate ? (
        <Typography
          variant={"muted"}
          className="dark:text-black text-xs truncate"
        >
          Estimated Fee:{" "}
          {formatUnits(
            BigInt(route.estimate.gasCosts[0].amount),
            route.estimate.gasCosts[0].token.decimals,
          )}{" "}
          {route.estimate.gasCosts[0].token.symbol} ~ $
          {route.estimate.gasCosts[0].amountUsd}
        </Typography>
      ) : (
        <div className="invisible">
          <Typography
            variant={"muted"}
            className="dark:text-black text-xs truncate"
          >
            Estimated Fee: 0 ~ $0
          </Typography>
        </div>
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

            {route?.estimate && toToken ? (
              <Typography variant={"muted"} className="dark:text-black text-xs">
                Minmum received amount:{" "}
                {Number(
                  formatUnits(
                    BigInt(route.estimate.toAmountMin),
                    toToken?.decimals,
                  ),
                ).toFixed(4)}
                {toToken?.symbol}
              </Typography>
            ) : null}

            {route?.estimate.gasCosts &&
              route?.estimate.feeCosts.map((feeCost, index) => {
                return (
                  <Typography
                    variant={"muted"}
                    className="dark:text-black text-xs"
                    key={index}
                  >
                    {feeCost.name} : ${Number(feeCost.amountUsd).toFixed(2)}
                  </Typography>
                );
              })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
