import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "./auth/[...nextauth]";
import { ContractType, InteractionType } from "@prisma/client";
import { getCsrfToken } from "next-auth/react";
import { claimV1Interaction } from "@/../prisma/src/create/newClaim";
import { getClaimData } from "@/../prisma/src/get/claimData";

const newPointMultiplier = 0.1;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method == "POST") {
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
      // Check if the user indeed has points in the old db
      const response = await fetch(
        "https://omnichain-minter-ppkm.vercel.app/api/userData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ethereumAddress: ethereumAddress,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();

        // Calculate the points from the totalPoints here itself
        const prevPoint = data.user.totalPoints;

        const pointsToAward = Number(prevPoint) * newPointMultiplier;

        const claim = await claimV1Interaction({
          ethAddress: ethereumAddress,
          contractType: ContractType.NO_CONTRACT,
          interactionType: InteractionType.V1,
          points: pointsToAward,
        });

        if (!claim) {
          console.error("Already Claimed !!");
          return res.status(400).json({ message: "Already Claimed !!" });
        }

        console.log(`Claim recorded and awarded ${pointsToAward} points`);
        res.status(201).json({
          message: `Claim recorded and awarded ${pointsToAward} points`,
        });
      } else if (response.status === 404) {
        console.error("No data found for this address.");
        res.status(404).json({
          message: `No data found for this address`,
        });
      } else {
        console.error("Error fetching old data");
        res.status(500).json({
          message: "Error fetching old data in /api/claim:",
        });
      }
    } catch (error) {
      console.error("Error in /api/claim:", error);
      res.status(500).json({
        message: "Error in /api/claim:",
        error: (error as any).message,
      });
    }
  } else if (req.method == "GET") {
    const session = await getServerSession(req, res, getAuthOptions(req));

    const csrfToken = await getCsrfToken({ req: { headers: req.headers } });

    if (!session || !csrfToken) {
      res.status(401).send({
        error: "You must be signed in to interact with the API",
      });
    }

    const ethereumAddress = session?.user?.name;
    if (!ethereumAddress) {
      res.status(400).send({
        error: "User not found in session",
      });
      return;
    }

    try {
      const data = await getClaimData({ ethAddress: ethereumAddress });
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
