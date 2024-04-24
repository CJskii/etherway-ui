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
    ethereumAddress,
    email,
  }: {
    ethereumAddress: string;
    email: string;
  } = req.body;

  if (!ethereumAddress || !email) {
    console.error("Missing parameters");
    return res.status(400).json({ message: "Missing parameters" });
  }

  // if (isValidEmail(email)) {
  //   console.error("Invalid Email ID");
  //   return res.status(400).json({ message: "Invalid Email ID" });
  // }

  const session = await getServerSession(req, res, getAuthOptions(req));

  const csrfToken = await getCsrfToken({ req: { headers: req.headers } });

  if (!session && !csrfToken) {
    res.status(401).send({
      error: "You must be signed in to interact with the API",
    });
  }

  try {
    //    -> POST /contact - create a new Contact in the mail jet List
    const createresult = await mailjet
      .post("contact", { version: "v3" })
      .request({
        IsExcludedFromCampaigns: "false",
        Name: ethereumAddress,
        Email: email,
      });

    const createresponse = createresult.response.data as {
      Count: number;
      Data: any[];
      Total: number;
    };

    const createdata = createresponse.Data[0];
    const contactId = createdata?.ID;

    //    -> POST /listrecipient - create a new list recipient for a relationship b/w contact and contact List with the listId & contactID , isUnsubscribed as true

    const listresult = await mailjet
      .post("listrecipient", { version: "v3" })
      .request({
        IsUnsubscribed: "true",
        ContactID: contactId,
        ContactAlt: email,
        ListID: listId,
      });

    const listresponse = listresult.response.data as {
      Count: number;
      Data: any[];
      Total: number;
    };

    // TODO: handle the case when user email is already in the list

    const listdata = listresponse.Data[0];
    const listRecepientId = listdata.ID;

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
      Subject: "Verify Your Etherway Account",
      HTMLPart: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
        <!-- Header Image -->
        <img src="https://pbs.twimg.com/profile_banners/1634697370247233538/1710699959/1500x500" alt="Etherway Logo" style="width: 100%; height: auto;">
    
        <!-- Main Content Area -->
        <div style="padding: 20px; text-align: center;">
          <h1 style="color: #333;">Hello,</h1>
          <p>Welcome to Etherway! You're one step away from completing your sign-up.</p>
          
          <p>Please activate your account by clicking the button below:</p>
          
          <!-- Activation Button -->
          <a href="${verificationLink}" style="display: inline-block; margin-top: 15px; margin-bottom: 15px; padding: 10px 20px; background-color: #0077cc; color: #fff; text-decoration: none; border-radius: 5px;">Activate Account</a>
    
          <p>If the button above doesn't work, copy and paste the following link into your web browser:</p>
          <p style="word-wrap: break-word; color: #0077cc;">${verificationLink}</p>
    
          <p>If you didn't sign up for an Etherway account, you can safely ignore this email.</p>
        </div>
    
        <!-- Footer -->
        <div style="background-color: #f4f4f4; padding: 10px; text-align: center;">
          <p>If you'd like to learn more, visit our <a href="https://www.etherway.io" style="color: #0077cc; text-decoration: none;">website</a> or reach out to us directly.</p>
          <p>This message was sent to <a href="mailto:${email}" style="color: #0077cc;">${email}</a>.</p>
        </div>
      </div>
      `,
    };

    //     const verifyEmailData = {
    //       From: {
    //         Email: "hello@etherway.io",
    //         Name: "Etherway",
    //       },
    //       To: [
    //         {
    //           Email: email,
    //         },
    //       ],
    //       Subject: "Verify your email address",
    //       HTMLPart: `
    //     <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e7e7e7; font-family: Arial, sans-serif;">

    //     <!-- Logo Image -->
    //     <div style="background-color: #f4f4f4;">
    //         <img src="https://pbs.twimg.com/profile_banners/1634697370247233538/1710699959/1500x500" alt="Etherway Logo" style="display: block; width: 100%; height: auto;">
    //     </div>

    //     <!-- Content Area -->
    //     <div style="padding: 20px;">
    //         <p>Hello,</p>

    //         <p>Thanks for signing up for our waitlist. Please confirm your subscription by clicking the button below.</p>

    //         <a href="${verificationLink}" style="display: inline-block; margin-top: 15px; margin-bottom: 15px; padding: 10px 20px; background-color: #0077cc; color: #fff; text-decoration: none; border-radius: 5px;">Confirm my subscription</a>

    //         <p>If the above button doesn’t work, copy and paste the following link into your web browser: <span style="word-wrap: break-word;">${verificationLink}</span></p>

    //         <p>If you've received this email by mistake, ignore it. You'll only receive future emails from us if you've confirmed your subscription.</p>

    //         <p>Thanks,</p>
    //         <p>Etherway Team</p>
    //     </div>
    // </div>
    //     `,
    //     };

    const sendresult = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [verifyEmailData],
    });

    console.log("Subscription contact created and Email sent");
    res
      .status(200)
      .json({
        message: "Subscription contact created and Email sent",
        listRecepientId: listRecepientId,
      });
  } catch (error) {
    console.error("Error in /api/email/subscribe:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: (error as any).message,
    });
  }
}
