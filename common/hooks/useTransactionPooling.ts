import { ChainData } from "@0xsquid/squid-types";
import { useEffect, useRef } from "react";

interface StatusCallBackProps {
  txHash: string;
  requestId: string;
  fromChain: ChainData;
  toChain: ChainData;
}

const useTransactionPolling = (
  txHash: string,
  requestId: string,
  fromChain: ChainData,
  toChain: ChainData,
  setStatusCallback: (props: StatusCallBackProps) => void,
  stopCallback: () => void,
): void => {
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (txHash && requestId && fromChain && toChain) {
      intervalId.current = setInterval(() => {
        setStatusCallback({ txHash, requestId, fromChain, toChain });
      }, 5000);

      return () => {
        if (intervalId.current) clearInterval(intervalId.current);
      };
    }
  }, [txHash, requestId, fromChain, toChain, setStatusCallback]);

  () => {
    if (intervalId.current) clearInterval(intervalId.current);
    stopCallback();
  };
};

export default useTransactionPolling;
