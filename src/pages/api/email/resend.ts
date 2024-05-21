import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "../auth/[...nextauth]";
import { getCsrfToken } from "next-auth/react";
import Mailjet from "node-mailjet";
import { getVerifyEmailData } from "@/utils/helpers/getEmail";
import { isValidEmail } from "@/utils/helpers/validators/isValidEmail";

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});

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

  if (!isValidEmail(email)) {
    console.error("Invalid email address");
    return res.status(400).json({ message: "Invalid email address" });
  }

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
    const listresult = await mailjet
      .get("listrecipient", { version: "v3" })
      .id(listRecepientId)
      .request();

    const listresponse = listresult.response.data as {
      Count: number;
      Data: any[];
      Total: number;
    };

    const listdata = listresponse.Data[0];
    const contactId = listdata.ContactID;

    const contactresult = await mailjet
      .get("contact", { version: "v3" })
      .id(contactId)
      .request();

    const contactresponse = contactresult.body as {
      Count: number;
      Data: any[];
      Total: number;
    };

    const contactdata = contactresponse.Data[0];
    const contactemail = contactdata.Email;
    const contactname = contactdata.Name;

    if (contactname != ethereumAddress) {
      res.status(401).send({
        error: "User not authenticated for this listRecepientId",
      });
      return;
    }

    //    -> POST /send - email containing a dynamic link with listID
    const verificationLink = `${process.env.NEXTAUTH_URL}/email/verify?listRecepientId=${listRecepientId}`;

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
