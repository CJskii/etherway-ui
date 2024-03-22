import { ContractType, InteractionType } from "@prisma/client";

interface InteractionDataProps {
  address: string;
  contractType: ContractType;
  chainId: number;
  interactionType: InteractionType;
  amount?: number;
}

export async function updateInteractionData({
  address,
  contractType,
  chainId,
  interactionType,
  amount,
}: InteractionDataProps) {
  let response;
  let error;
  try {
    response = await fetch("/api/interactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ethereumAddress: address,
        interactionType: interactionType,
        contractType: contractType,
        chainId: chainId,
        amount: amount,
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
