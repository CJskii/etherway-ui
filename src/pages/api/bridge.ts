import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/client";
import handleInteraction from "@/prisma/src/handlers/interaction";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "./auth/[...nextauth]";
import { InteractionType } from "@prisma/client";
import { getCsrfToken } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { ethereumAddress, contractType, chainId } = req.body;

  if (!ethereumAddress || !contractType) {
    console.error("Missing parameters");
    return res.status(400).json({ message: "Missing parameters" });
  }

  const session = await getServerSession(req, res, getAuthOptions(req));

  const csrfToken = await getCsrfToken({ req: { headers: req.headers } });

  if (!session || !csrfToken) {
    res.status(401).send({
      error: "You must be signed in to interact with the API",
    });
  }

  try {
    await handleInteraction({
      ethAddress: ethereumAddress,
      contractType,
      interactionType: InteractionType.BRIDGE_ONFT,
      chainId,
    });
    console.log("Bridge recorded and points awarded");
    res.status(200).json({ message: "Bridge recorded and points awarded" });
  } catch (error) {
    console.error("Error in /api/bridge:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: (error as any).message,
    });
  }
}
