import { ContractType } from "@prisma/client";

export async function updateBridgeData({
  address,
  contractType,
  chainId,
}: {
  address: string;
  contractType: ContractType;
  chainId: number;
}) {
  let response;
  let error;
  try {
    response = await fetch("/api/bridge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ethereumAddress: address,
        contractType: contractType,
        chainId,
      }),
    });
  } catch (e) {
    console.log(e);
    error = e;
  }

  return {
    response,
    error,
  };
}
