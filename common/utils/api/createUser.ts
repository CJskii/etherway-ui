export async function createUser({
  address,
  refLink,
}: {
  address: string;
  refLink: string | null;
}) {
  let response;
  let error;
  try {
    response = await fetch("/api/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ethereumAddress: address, refLink: refLink }),
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
