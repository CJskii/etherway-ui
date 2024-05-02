export async function resendEmail({
  listRecepientId,
  email,
}: {
  listRecepientId: number;
  email: string;
}) {
  let response;
  let error;
  try {
    response = await fetch("/api/email/resend", {
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
