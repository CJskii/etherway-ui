import { NextApiRequest, NextApiResponse } from "next";
import handleInteraction from "@/../prisma/src/handlers/interaction";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "./auth/[...nextauth]";
import { getCsrfToken } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { ethereumAddress, interactionType, contractType, amount, chainId } =
    req.body;

  if (!ethereumAddress || !interactionType || !contractType) {
    console.error("Missing parameters");
    return res.status(400).json({ message: "Missing parameters" });
  }

  if (interactionType == "V1") {
    console.error("V1 Claim not allowed");
    return res.status(400).json({ message: "V1 Claim not allowed" });
  }

  if (interactionType == "MINT_OFT" || interactionType == "BRIDGE_OFT") {
    if (!amount) {
      console.error("Missing parameters");
      return res.status(400).json({ message: "Missing parameters" });
    }
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
      interactionType,
      chainId,
      amount,
    });
    console.log(`Interaction recorded and ${amount} points awarded`);
    res
      .status(200)
      .json({ message: "Interaction recorded and points awarded" });
  } catch (error) {
    console.error("Error in /api/interactions:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: (error as any).message,
    });
  }
}
