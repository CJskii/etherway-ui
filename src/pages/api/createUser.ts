import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/client";
import handleUser from "@/prisma/src/handlers/user";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "./auth/[...nextauth]";
import { getCsrfToken } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { ethereumAddress, referralCode } = req.body;

  if (!ethereumAddress) {
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

  try {
    const newUser = await handleUser({
      ethAddress: ethereumAddress,
      inviteCode: referralCode,
    });
    console.log(`New user created`);
    return res.status(201).json(newUser); // 201 means Created
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
}

// function generateInviteLink(): string {
//   const referralCodes = require("referral-codes");
//   const code = referralCodes.generate({
//     length: 10,
//     count: 1,
//   });
//   return code[0];
// }

// async function isValidRefLink(refLink: string | null) {
//   if (refLink != null) {
//     const referrer = await prisma.user.findUnique({
//       where: { inviteLink: refLink },
//     });
//     return referrer ? referrer : null;
//   } else {
//     return null;
//   }
// }
