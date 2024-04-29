import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../prisma/client";
import handleInteraction from "@/prisma/src/handlers/interaction";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "./auth/[...nextauth]";
import { ContractType, InteractionType } from "@prisma/client";
import { getCsrfToken } from "next-auth/react";
import { claimV1Interaction } from "@/prisma/src/create/newClaim";
import { getClaimData } from "@/prisma/src/get/claimData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == "POST") {
    // const { ethereumAddress, points } = req.body as {
    //   ethereumAddress: string;
    //   points: number;
    // };

    // if (!ethereumAddress || !points) {
    //   console.error("Missing parameters");
    //   return res.status(400).json({ message: "Missing parameters" });
    // }

    const session = await getServerSession(req, res, getAuthOptions(req));

    const csrfToken = await getCsrfToken({ req: { headers: req.headers } });

    if (!session && !csrfToken) {
      res.status(401).send({
        error: "You must be signed in to interact with the API",
      });
    }

    const ethereumAddress = session?.user?.name;
    if (!ethereumAddress) {
      res.status(401).send({
        error: "User not found in session",
      });
      return;
    }

    try {
      // TODO : Check if the user indeed has points in the old db
      // TODO : Calculate the points from the totalPoints here itself

      const points = 0;

      await claimV1Interaction({
        ethAddress: ethereumAddress,
        contractType: ContractType.NO_CONTRACT,
        interactionType: InteractionType.V1,
        points: points,
      });
      console.log("Claim recorded");
      res.status(200).json({ message: "Claim recorded" });
    } catch (error) {
      console.error("Error in /api/claim:", error);
      res.status(500).json({
        message: "Error in /api/claim:",
        error: (error as any).message,
      });
    }
  } else if (req.method == "GET") {
    // const ethereumAddress = req.query.ethereumAddress as string;

    // if (!ethereumAddress) {
    //   console.error("Missing parameters");
    //   return res.status(400).json({ message: "Missing parameters" });
    // }

    const session = await getServerSession(req, res, getAuthOptions(req));

    const csrfToken = await getCsrfToken({ req: { headers: req.headers } });

    if (!session || !csrfToken) {
      res.status(401).send({
        error: "You must be signed in to interact with the API",
      });
    }

    const ethereumAddress = session?.user?.name;
    if (!ethereumAddress) {
      res.status(401).send({
        error: "User not found in session",
      });
      return;
    }

    try {
      const data = await getClaimData({ ethAddress: ethereumAddress });
      console.log("Claim data fetched");
      return res.status(200).json(data); // 201 means Created
    } catch (error) {
      console.error("Error in /api/claim:", error);
      res.status(500).json({
        message: "Error in /api/claim:",
        error: (error as any).message,
      });
    }
  } else {
    return res.status(405).send({ error: "Method Not Allowed" });
  }
}
