// export async function callClaimRewards({ address }: { address: string }) {
//   const response = await fetch("/api/claimDailyRewards", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ ethereumAddress: address }),
//   });
//   return response;
// }

export async function getClaimData(): Promise<boolean | undefined> {
  try {
    let url = `/api/claim`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function claimV1Points() {
  try {
    let url = `/api/claim`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}
