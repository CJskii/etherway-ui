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
        IsUnsubscribed: "false",
      });

    const listresponse = listresult.response.data as {
      Count: number;
      Data: any[];
      Total: number;
    };

    const listdata = listresponse.Data[0];
    const contactId = listdata.ContactID;

    const contactresult = await mailjet
      .put("contact", { version: "v3" })
      .id(contactId)
      .request();

    const contactresponse = contactresult.body as {
      Count: number;
      Data: any[];
      Total: number;
    };

    const contactdata = contactresponse.Data[0];
    const contactemail = listdata.Email;

    //   -> POST /send - email for welcoming the user to etherway
    const unsubscribeLink = `${process.env.VERCEL_URL}/email/unsubscribe?listRecepientId=${listRecepientId}`;

    const verifyEmailData = {
      From: {
        Email: "hello@etherway.io",
        Name: "Etherway",
      },
      To: [
        {
          Email: contactemail,
        },
      ],
      Subject: "Verify your email address",
      HTMLPart: `
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e7e7e7; font-family: Arial, sans-serif;">

        <!-- Logo Image -->
        <div style="background-color: #f4f4f4;">
            <img src="https://sxhnq.mjt.lu/tplimg/sxhnq/b/m42qp/7hu39.jpeg" alt="Mintly Logo" style="display: block; width: 100%; height: auto;">
        </div>

        <!-- Content Area -->
        <div style="padding: 20px;">
            <p>Hello,</p>

            <p>Thanks for signing up for our waitlist. Please confirm your subscription by clicking the button below.</p>

            <a href="${unsubscribeLink}" style="display: inline-block; margin-top: 15px; margin-bottom: 15px; padding: 10px 20px; background-color: #0077cc; color: #fff; text-decoration: none; border-radius: 5px;">Confirm my subscription</a>

            <p>If the above button doesn’t work, copy and paste the following link into your web browser: <span style="word-wrap: break-word;">${unsubscribeLink}</span></p>

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

    console.log("Subscription verified");
    res.status(200).json({ message: "Subscription verified" });
  } catch (error) {
    console.error("Error in /api/email/verify:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: (error as any).message,
    });
  }
}
