export async function callUserStats(address: string) {
  let response;
  let error;
  try {
    response = await fetch(`/api/getUser?ethereumAddress=${address}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
