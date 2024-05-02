import { ContractType } from "@prisma/client";

export async function subscribeEmail({
  address,
  email,
}: {
  address: string;
  email: string;
}) {
  let response;
  let error;
  console.log("Subscribing email", address, email);
  // TODO - Resend the email verification link handler
  // parse the response to get the listRecepientId in the body
  try {
    response = await fetch("/api/email/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ethereumAddress: address,
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
