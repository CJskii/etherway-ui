import { Squid } from "@0xsquid/sdk";
import {
  Estimate,
  RouteRequest,
  RouteResponse,
  SquidData,
} from "@0xsquid/squid-types";
import { getWalletClient } from "@wagmi/core";
import { Signer, ethers } from "ethers";
import { WalletClient } from "viem";
import { useWalletClient } from "wagmi";

const userAddress = "0x62C43323447899acb61C18181e34168903E033Bf";
const integratorId = "<your integrator id>";

const squid = new Squid({
  baseUrl: "https://v2.api.squidrouter.com",
  integratorId: integratorId,
});

export type RouteType = {
  estimate: Estimate;
  transactionRequest?: SquidData;
  params: RouteRequest;
};

async function getSquidRoute(routeParams: RouteRequest): Promise<RouteType> {
  // initialize the Squid client
  await squid.init();

  const { route, requestId, integratorId } = await squid.getRoute(routeParams);
  // {
  //   fromChain: "43114", // Avalanche
  //   fromAmount: "10000000000000000", // 0.1 AVAX
  //   fromToken: "0xEEeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  //   toChain: "137", // Polygon
  //   toToken: "0xEEeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  //   fromAddress: userAddress,
  //   toAddress: userAddress,
  //   slippageConfig: {
  //     autoMode: 1,
  //   },
  // }
  console.log(route, requestId);
  return route;
}

async function executeSquidRoute(route: RouteType, signer: Signer) {
  await squid.init();

  const tx = (await squid.executeRoute({
    signer: signer,
    route,
  })) as unknown as ethers.providers.TransactionResponse;
  const txReceipt = await tx.wait();

  return txReceipt;
}

export type txDataType = {
  transactionId: string;
  requestId: string;
  integratorId: string;
  fromChainId: string;
  toChainId: string;
};

async function getTxStatus(txData: txDataType) {
  // Retrieve the transaction's route status
  const getStatusParams = {
    transactionId: txData.transactionId,
    requestId: txData.requestId,
    integratorId: txData.integratorId,
    fromChainId: txData.fromChainId,
    toChainId: txData.toChainId,
  };

  const status = await squid.getStatus(getStatusParams);

  // Display the route status
  console.log(`Route status: ${status.squidTransactionStatus}`);
}

async function getSquidTokens() {
  return squid.tokens;
}

async function getSquidChains() {
  return squid.chains;
}
