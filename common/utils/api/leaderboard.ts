interface getLeaderboardDataProps {
  limit?: number;
}

export async function getLeaderboadData({ limit }: getLeaderboardDataProps) {
  try {
    let url = "/api/leaderboard";

    if (limit) {
      url = `/api/leaderboard?limit=${limit}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

interface getUserPointDataProps {
  userAddress: string;
}

export async function getUserPointData({ userAddress }: getUserPointDataProps) {
  try {
    let url = `/api/leaderboard?userAddress=${userAddress}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
