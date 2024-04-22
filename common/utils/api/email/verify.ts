import { ContractType } from "@prisma/client";

export async function verifySubscription({
  listRecepientId,
}: {
  listRecepientId: number;
}) {
  let response;
  let error;
  try {
    response = await fetch("/api/email/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listRecepientId: listRecepientId,
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
