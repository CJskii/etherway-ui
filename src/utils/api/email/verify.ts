export async function verifySubscription({
  listRecepientId,
}: {
  listRecepientId: number;
}) {
  let response;
  let error;
  console.log("Verifying email", listRecepientId);
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
