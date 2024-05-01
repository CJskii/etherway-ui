import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "../auth/[...nextauth]";
import { getCsrfToken } from "next-auth/react";
import Mailjet from "node-mailjet";
import { getWelcomeEmailData } from "@/common/utils/getters/getEmail";

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
  }: {
    listRecepientId: number;
  } = req.body;

  if (!listRecepientId) {
    console.error("Missing parameters");
    return res.status(400).json({ message: "Missing parameters" });
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
    //    -> PUT /listrecipient/{listrecipient_ID} - to mark isUnsubscribed as false
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

    //    -> PUT /listrecipient/{listrecipient_ID} - to mark isUnsubscribed as false
    await mailjet
      .put("listrecipient", { version: "v3" })
      .id(listRecepientId)
      .request({
        IsUnsubscribed: "false",
      });

    // TODO:   -> POST /send - email for welcoming the user to etherway
    const unsubscribeLink = `${process.env.NEXTAUTH_URL}/email/unsubscribe?listRecepientId=${listRecepientId}`;

    const welcomeEmailData = getWelcomeEmailData({
      email: contactemail,
      unsubscribeLink,
    });

    const sendresult = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [welcomeEmailData],
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
