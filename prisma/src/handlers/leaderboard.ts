import { prisma } from "../../client";

const rawMaterialisedViewCreateQuery = `CREATE MATERIALIZED VIEW UserPoints AS
SELECT
    i."userId" AS id,
    u."ethereumAddress" AS user_address,
    CAST(SUM(i.points) AS INTEGER) AS total_points  -- Explicitly casting to INTEGER
FROM
    "Interaction" i
JOIN
    "User" u ON i."userId" = u."id"
GROUP BY
    i."userId", u."ethereumAddress"
ORDER BY
    total_points DESC;
`;

async function createViewUserPoints() {
  try {
    const result = await prisma.$executeRaw`${rawMaterialisedViewCreateQuery}`;
    console.log("Materialised View created for the users");
  } catch (error) {
    console.log("Error");
  }
}

async function fetchViewAllUserPoints(limit?: number) {
  try {
    let limitParam = limit ? limit : 100;
    const data =
      await prisma.$queryRaw`SELECT * FROM UserPoints ORDER BY total_points DESC LIMIT ${limitParam};`;
    console.log("Materialised View fetched for all the users");
    return data;
  } catch (error) {
    console.log("Error");
  }
}

async function fetchViewUserPoints(userAddress: string) {
  try {
    const data: Array<object> =
      await prisma.$queryRaw`SELECT * FROM UserPoints WHERE "user_address" = ${userAddress.toLowerCase()};`;
    console.log("Materialised View fetched for the user");
    if (data.length > 0) {
      return data[0];
    } else {
      return undefined;
    }
  } catch (error) {
    console.log("Error");
  }
}

async function refershViewTopUsers() {
  try {
    const result =
      await prisma.$executeRaw`REFRESH MATERIALIZED VIEW UserPoints;`;
    console.log("Materialised View data refreshed");
  } catch (error) {
    console.log("Error");
  }
}

export { fetchViewAllUserPoints, fetchViewUserPoints, refershViewTopUsers };
// Flow
// 1. We create the materialized view once
// 2. Then we can just read the data from the view
// 3. Send queries to refresh the view data periodically like every 4 Hours
// 4. Optionally just sync this with Cache too for fast retrieval on dashboard and even for seperate users
