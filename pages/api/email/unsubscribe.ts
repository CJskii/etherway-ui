import { NextApiRequest, NextApiResponse } from "next";
import handleInteraction from "@/prisma/src/handlers/interaction";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "../auth/[...nextauth]";
import { InteractionType } from "@prisma/client";
import { getCsrfToken } from "next-auth/react";
import Mailjet from "node-mailjet";

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});

function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const {
    listRecepientId,
  }: {
    listRecepientId: number;
  } = req.body;

  if (!listRecepientId) {
    console.error("Missing parameters");
    return res.status(400).json({ message: "Missing parameters" });
  }

  const session = await getServerSession(req, res, getAuthOptions(req));

  const csrfToken = await getCsrfToken({ req: { headers: req.headers } });

  if (!session && !csrfToken) {
    res.status(401).send({
      error: "You must be signed in to interact with the API",
    });
  }

  try {
    //    -> PUT /listrecipient/{listrecipient_ID} - to mark isUnsubscribed as false
    const listresult = await mailjet
      .put("listrecipient", { version: "v3" })
      .id(listRecepientId)
      .request({
        IsUnsubscribed: "true",
      });

    console.log("Unsubscription confirmed");
    res.status(200).json({ message: "Unsubscription confirmed" });
  } catch (error) {
    console.error("Error in /api/email/unsubscribe:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: (error as any).message,
    });
  }
}
