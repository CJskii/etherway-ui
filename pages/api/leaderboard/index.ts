import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/client";
import handleUser from "@/prisma/src/handlers/user";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "../auth/[...nextauth]";
import { getUser } from "@/prisma/src/get/userData";
import { getCsrfToken } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const session = await getServerSession(req, res, getAuthOptions(req));

  const csrfToken = await getCsrfToken({ req: { headers: req.headers } });

  if (!session && !csrfToken) {
    res.status(401).send({
      error: "You must be signed in to interact with the API",
    });
  }
  try {
    const leaderboad: any[] = [];
    return res.status(200).json({ leaderboad }); // 201 means successfull
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
}
