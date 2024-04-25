import { Squid } from "@0xsquid/sdk";
import {
  Estimate,
  RouteRequest,
  RouteResponse,
  SquidData,
} from "@0xsquid/squid-types";
import { Signer, ethers } from "ethers";

const userAddress = "0x62C43323447899acb61C18181e34168903E033Bf";
const integratorId = "etherway-2c794744-6972-4f23-bdcb-784032b1a377";

const squid = new Squid({
  baseUrl: "https://v2.api.squidrouter.com",
  integratorId: integratorId,
});

export type RouteType = {
  estimate: Estimate;
  transactionRequest?: SquidData;
  params: RouteRequest;
};

export async function getSquidRoute(
  routeParams: RouteRequest,
): Promise<RouteType | undefined> {
  try {
    await squid.init();

    const { route, requestId, integratorId } =
      await squid.getRoute(routeParams);

    console.log(route, requestId);
    return route;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function executeSquidRoute(route: RouteType, signer: Signer) {
  try {
    await squid.init();

    const tx = (await squid.executeRoute({
      signer: signer,
      route,
    })) as unknown as ethers.providers.TransactionResponse;
    const txReceipt = await tx.wait();

    return txReceipt;
  } catch (error) {
    console.log(error);
    return;
  }
}

export type txDataType = {
  transactionId: string;
  requestId: string;
  integratorId: string;
  fromChainId: string;
  toChainId: string;
};

async function getTxStatus(txData: txDataType) {
  try {
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
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function getSquidTokens() {
  await squid.init();

  return squid.tokens;
}

export async function getSquidChains() {
  await squid.init();

  return squid.chains;
}
