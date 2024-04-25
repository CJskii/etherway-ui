import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "../auth/[...nextauth]";
import { InteractionType } from "@prisma/client";
import { getCsrfToken } from "next-auth/react";
import Mailjet from "node-mailjet";
import { getVerifyEmailData } from "@/common/utils/getters/getEmail";

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});
const listId = 10331420; // TODO: For production replace with the main list ID from Mailjet

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
    email,
  }: {
    listRecepientId: number;
    email: string;
  } = req.body;

  if (!listRecepientId || !email) {
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
    //    -> POST /send - email containing a dynamic link with listID
    const verificationLink = `${process.env.VERCEL_URL}/email/verify?listRecepientId=${listRecepientId}`;

    const verifyEmailData = getVerifyEmailData({
      email,
      verificationLink,
    });

    const sendresult = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [verifyEmailData],
    });

    console.log("Subscription contact created and Email sent");
    res
      .status(200)
      .json({ message: "Subscription contact created and Email sent" });
  } catch (error) {
    console.error("Error in /api/email/verify:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: (error as any).message,
    });
  }
}
