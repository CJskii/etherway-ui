import { GetRoute, RouteData, Squid } from "@0xsquid/sdk";
import {
  Estimate,
  RouteRequest,
  RouteResponse,
  SquidData,
} from "@0xsquid/squid-types";
import { Signer, ethers } from "ethers";

const userAddress = "0x62C43323447899acb61C18181e34168903E033Bf";
export const integratorId = "etherway-2c794744-6972-4f23-bdcb-784032b1a377";

const squid = new Squid({
  baseUrl: "https://api.squidrouter.com",
  integratorId: integratorId,
});

export type RouteType = {
  estimate: Estimate;
  transactionRequest?: SquidData;
  params: RouteRequest;
};

// export async function getSquidRoute(
//   routeParams: RouteRequest,
// ): Promise<RouteType | undefined> {
//   try {
//     await squid.init();

//     const { route, requestId, integratorId } =
//       await squid.getRoute(routeParams);

//     console.log(route, requestId);
//     return route;
//   } catch (error) {
//     console.log(error);
//     return;
//   }
// }

export async function getSquidRoute(
  routeParams: GetRoute,
): Promise<{ route: RouteData; requestId: string | undefined } | undefined> {
  try {
    await squid.init();

    const { route, requestId, integratorId } =
      await squid.getRoute(routeParams);

    console.log(route, requestId);
    return { route, requestId };
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function executeSquidRoute(route: RouteData, signer: Signer) {
  try {
    await squid.init();

    const tx = (await squid.executeRoute({
      signer: signer,
      route,
    })) as unknown as ethers.providers.TransactionResponse;
    console.log(`Transaction sent via squid Router ...`);
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
