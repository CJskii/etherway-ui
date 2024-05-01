import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "../auth/[...nextauth]";
import { getCsrfToken } from "next-auth/react";
import Mailjet from "node-mailjet";
import { getVerifyEmailData } from "@/common/utils/getters/getEmail";

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});
const listId = process.env.MAILJET_LIST_ID;

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

    const verifyEmailData = getVerifyEmailData({
      email,
      verificationLink,
    });

    const sendresult = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [verifyEmailData],
    });

    console.log("Subscription contact created and Email sent");
    res.status(200).json({
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
