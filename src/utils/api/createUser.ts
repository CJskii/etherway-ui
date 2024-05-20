// NOTE: Not used at this point for creating the new User , will be done at some point later when we need to care about referral
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
