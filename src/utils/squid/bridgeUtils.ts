import { formatUnits } from "viem";
import {
  getTxStatus,
  getSquidRoute,
  integratorId,
} from "@/utils/squid/squidRouter";
import { toast } from "sonner";
import { RouteRequest } from "@0xsquid/squid-types";
import { RouteType } from "@/utils/squid/squidRouter";
import { TokenModalProps } from "@/components/squid/token-modal";
import { TokenBalance, Token } from "@0xsquid/sdk/dist/types";

export const formatToFixed2 = ({
  value,
  decimals,
}: {
  value: bigint;
  decimals: number;
}): string => {
  const formattedValue = formatUnits(value, decimals);
  return parseFloat(formattedValue).toFixed(2);
};

export const formatToFixedDecimals = (
  value: string,
  decimals: number,
  limit: number,
) => {
  const [integerPart, fractionalPart] = value.split(".");
  const truncatedFraction = fractionalPart
    ? fractionalPart.slice(0, limit)
    : "";
  return `${integerPart}.${truncatedFraction.padEnd(limit, "0")}`;
};

export const fetchRoute = async (
  routeParams: RouteRequest,
  setRoute: (route: RouteType) => void,
  setRequestId: (id: string) => void,
): Promise<void> => {
  try {
    const _route = await getSquidRoute(routeParams);
    if (_route) {
      setRoute(_route.route);
      if (_route.requestId) {
        setRequestId(_route.requestId);
      }
    }
  } catch (error) {
    console.log(error);
    console.error("Failed to fetch route. Please try again.");
    toast.error("Failed to fetch route. Please try again.");
  }
};

export const roundedTokenBalance = ({
  balanceData,
  tokenProps,
}: {
  balanceData: TokenBalance[] | undefined;
  tokenProps: TokenModalProps;
}) => {
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

export const rawTokenBalance = ({
  balanceData,
  tokenProps,
}: {
  balanceData: TokenBalance[];
  tokenProps: Token | undefined;
}) => {
  if (!balanceData || !tokenProps) return null;
  const userBalance = balanceData.find(
    (balance: any) =>
      balance.address.toLowerCase() === tokenProps?.address.toLowerCase(),
  );

  if (userBalance) {
    return parseFloat(
      formatUnits(BigInt(userBalance.balance), tokenProps?.decimals),
    ).toFixed(6);
  }

  return null;
};
