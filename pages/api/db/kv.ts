import { NextApiRequest, NextApiResponse } from "next";

import { kv } from "@vercel/kv";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method == "GET") {
      const userId = req.query.userId;
      const data = await kv.hget("points", `${userId}`);
      return res.status(200).json({
        // @ts-ignore
        points: data?.points,
      });
    } else if (req.method == "POST") {
      const userId = req.body.userId;
      const points = req.body.points;

      await kv.hset("points", { points: points });
      return res
        .status(200)
        .json(`${points}Points set for the user ${userId} in the cache `);
    } else {
      return res.status(405).json("Method Not Allowed");
    }
  } catch (error) {
    console.error(error);
  }
}
