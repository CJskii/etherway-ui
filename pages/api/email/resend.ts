import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "../auth/[...nextauth]";
import { InteractionType } from "@prisma/client";
import { getCsrfToken } from "next-auth/react";
import Mailjet from "node-mailjet";

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

    const verifyEmailData = {
      From: {
        Email: "hello@etherway.io",
        Name: "Etherway",
      },
      To: [
        {
          Email: email,
        },
      ],
      Subject: "Verify your email address",
      HTMLPart: `
    <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e7e7e7; font-family: Arial, sans-serif;">

    <!-- Logo Image -->
    <div style="background-color: #f4f4f4;">
        <img src="https://pbs.twimg.com/profile_banners/1634697370247233538/1710699959/1500x500" alt="Etherway Logo" style="display: block; width: 100%; height: auto;">
    </div>

    <!-- Content Area -->
    <div style="padding: 20px;">
        <p>Hello,</p>

        <p>Thanks for signing up for our waitlist. Please confirm your subscription by clicking the button below.</p>

        <a href="${verificationLink}" style="display: inline-block; margin-top: 15px; margin-bottom: 15px; padding: 10px 20px; background-color: #0077cc; color: #fff; text-decoration: none; border-radius: 5px;">Confirm my subscription</a>

        <p>If the above button doesn’t work, copy and paste the following link into your web browser: <span style="word-wrap: break-word;">${verificationLink}</span></p>

        <p>If you've received this email by mistake, ignore it. You'll only receive future emails from us if you've confirmed your subscription.</p>

        <p>Thanks,</p>
        <p>Mintly Team</p>
    </div>
</div>
    `,
    };

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
