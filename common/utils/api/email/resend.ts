import { ContractType } from "@prisma/client";

export async function subscribeEmail({
  listRecepientId,
  email,
}: {
  listRecepientId: number;
  email: string;
}) {
  let response;
  let error;
  console.log("Resending verification email", listRecepientId, email);

  // TODO - Resend the email verification link handler
  // parse the response to get the listRecepientId in the body of subcribe call

  try {
    response = await fetch("/api/email/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listRecepientId: listRecepientId,
        email: email,
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
