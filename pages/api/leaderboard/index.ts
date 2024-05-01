import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/client";
import handleUser from "@/prisma/src/handlers/user";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "../auth/[...nextauth]";
import { getUser } from "@/prisma/src/get/userData";
import { getCsrfToken } from "next-auth/react";
import {
  fetchViewAllUserPoints,
  fetchViewUserPoints,
  refershViewTopUsers,
} from "@/prisma/src/handlers/leaderboard";

// POST /leaderboard -  refreshes the points , only done by Cron Job

// GET /lederboard?limit=100 - get all the user with points with a limit of 100 records by default , only allowed for authenticated user
// GET /lederboard?userAddress=${0x..000} -  get the points just for this user

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == "GET") {
    const session = await getServerSession(req, res, getAuthOptions(req));

    const csrfToken = await getCsrfToken({ req: { headers: req.headers } });

    if (!session || !csrfToken) {
      res.status(401).send({
        error: "You must be signed in to interact with the API",
      });
    }

    try {
      const userAddress = req.query.userAddress as string;

      if (userAddress) {
        const data = await fetchViewUserPoints(userAddress);
        return res.status(200).json(data);
      }

      const limit = req.query.limit as string;
      const data = await fetchViewAllUserPoints(Number(limit));
      return res.status(200).json(data); // 201 means successfull
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  } else if (req.method == "POST") {
    const authHeader = req.headers.authorization;

    if (
      !process.env.CRON_SECRET ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return res
        .status(401)
        .json({ message: "Not Authenticated to perform call" });
    }

    //TODO: perform the refresh on the leaderboard
    await refershViewTopUsers();
    // TODO: Might want to track the last update call

    res.status(200).json({ message: "Leaderboard score refreshed" });
  } else {
    return res.status(405).send({ error: "Method Not Allowed" });
  }
}

// TODO : Add CRON_SECRET to the env
// "crons": [
//   {
//     "path": "/api/leaderboard",
//     "schedule": "0 0 */4 ? * *	"
//   }
// ]
