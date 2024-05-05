import { ContractType } from "@prisma/client";

interface MintDataProps {
  address: string;
  contractType: ContractType;
  chainId: number;
}

export async function updateMintData({
  address,
  contractType,
  chainId,
}: MintDataProps) {
  let response;
  let error;
  try {
    response = await fetch("/api/mint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ethereumAddress: address,
        contractType: contractType,
        chainId: chainId,
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
