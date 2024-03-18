import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../prisma/client";
import handleUser from "@/prisma/src/handlers/user";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "./auth/[...nextauth]";
import { getUser } from "@/prisma/src/get/userData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const {
    ethereumAddress,
    includeReferred,
    includeReferrals,
    includeInteractions,
    includeRewards,
  } = req.query;

  if (!ethereumAddress || typeof ethereumAddress !== "string") {
    console.error("Missing parameters");
    return res.status(400).json({ message: "Missing parameters" });
  }

  try {
    const user = await getUser({
      ethAddress: ethereumAddress,
    });
    // console.log(`New user created`);
    return res.status(201).json({ user }); // 201 means Created
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
}
