import { useEffect, useRef } from "react";

const useTransactionPolling = (
  txHash: string,
  requestId: string,
  fromChain: any,
  toChain: any,
  setStatusCallback: (status: any) => void,
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
