import { Squid } from "@0xsquid/sdk";
import {
  RouteResponse,
  RouteRequest,
  Estimate,
  SquidData,
} from "@0xsquid/squid-types";
import { Signer, ethers } from "ethers";

const userAddress = "0x62C43323447899acb61C18181e34168903E033Bf";
export const integratorId = "etherway-2c794744-6972-4f23-bdcb-784032b1a377";

const squid = new Squid({
  baseUrl: "https://v2.api.squidrouter.com",
  integratorId: integratorId,
});
// https://apiplus.squidrouter.com

export interface RouteType {
  estimate: Estimate;
  transactionRequest?: SquidData;
  params: RouteRequest;
}

interface SquidResponse {
  route: RouteResponse["route"];
  requestId: string | undefined;
  integratorId?: string;
}

export async function getSquidRoute(
  routeParams: RouteRequest,
): Promise<SquidResponse | undefined> {
  await squid.init();

  const response = await squid.getRoute(routeParams);
  const { route, requestId } = response;

  return { route, requestId };
}

export async function executeSquidRoute(
  route: RouteResponse["route"],
  signer: Signer,
): Promise<ethers.providers.TransactionReceipt | undefined> {
  try {
    await squid.init();

    const tx = (await squid.executeRoute({
      signer: signer,
      route,
    })) as unknown as ethers.providers.TransactionResponse;

    console.log(`Transaction sent via Squid Router ...`);
    const txReceipt = await tx.wait();

    return txReceipt;
  } catch (error) {
    console.error("Error executing Squid route:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage);
  }
}

export type txDataType = {
  transactionId: string;
  requestId: string;
  integratorId: string;
  fromChainId: string;
  toChainId: string;
};

export async function getTxStatus(txData: txDataType) {
  try {
    // Retrieve the transaction's route stat

    const status = await squid.getStatus(txData);

    // Display the route status
    console.log(`Route status: ${status.squidTransactionStatus}`);
    return status;
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
