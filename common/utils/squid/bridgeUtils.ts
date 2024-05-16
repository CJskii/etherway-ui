import { formatUnits, parseUnits } from "viem";
import {
  getTxStatus,
  getSquidRoute,
  integratorId,
} from "@/common/utils/squid/squidRouter";
import { toast } from "sonner";
import { RouteRequest } from "@0xsquid/squid-types";
import { RouteType } from "@/common/utils/squid/squidRouter";

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

export const handleErrors = ({
  e,
  setErrorMessage,
}: {
  e: any;
  setErrorMessage: (msg: string) => void;
}): void => {
  console.error(e);
  setErrorMessage(e.message);
};

export const fetchRoute = async (
  routeParams: RouteRequest,
  setRoute: (route: RouteType) => void,
  setRequestId: (id: string) => void,
): Promise<void> => {
  try {
    const _route = await getSquidRoute(routeParams);
    if (_route) {
      console.log(_route);
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

export const getStatus = async (
  params: {
    transactionId: string;
    requestId: string;
    fromChainId: string;
    toChainId: string;
  },
  setStatusCallback?: (status: any) => void,
): Promise<void> => {
  try {
    const status = await getTxStatus({
      ...params,
      integratorId: integratorId,
    });
    if (setStatusCallback) {
      setStatusCallback(status);
    }
  } catch (error) {
    console.log(error);
  }
};
