import { NextApiRequest, NextApiResponse } from "next";

import { kv } from "@vercel/kv";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Get the Data from the db
  // calculate the points for the users
  // update the same in the Cache for that user
}
