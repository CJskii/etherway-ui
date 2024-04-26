import { prisma } from "../../client";

async function getTopUsersByPoints() {
  try {
    const topUsers = await prisma.interaction.groupBy({
      by: ["userId"],
      _sum: {
        points: true,
      },
      orderBy: {
        _sum: {
          points: "desc",
        },
      },
      take: 100,
    });
    console.log(topUsers);
    return topUsers;
  } catch (error) {
    console.error("Error fetching top users by points:", error);
  }
}

const rawMaterialisedViewCreateQuery = `CREATE MATERIALIZED VIEW mv_top_users AS
SELECT
    i."userId" AS id,
    u."ethereumAddress AS userAddress",
    SUM(i.points) AS total_points
FROM
    "Interaction" i
JOIN
    "User" u ON i."userId" = u."id"
GROUP BY
    i."userId", u."ethereumAddress"
ORDER BY
    total_points DESC;
`;

async function createViewTopUsers() {
  try {
    const result = await prisma.$executeRaw`${rawMaterialisedViewCreateQuery}`;
    console.log("Materialised View created for the users");
  } catch (error) {
    console.log("Error");
  }
}

async function fetchViewTopUsers() {
  try {
    const data = await prisma.$queryRaw`SELECT * FROM mv_top_users;`;
    console.log("Materialised View created for the users");
    return data;
  } catch (error) {
    console.log("Error");
  }
}

async function refershViewTopUsers() {
  try {
    const result =
      await prisma.$executeRaw`REFRESH MATERIALIZED VIEW mv_top_users;`;
    console.log("Materialised View data refreshed");
  } catch (error) {
    console.log("Error");
  }
}

// Flow
// 1. We create the materialized view once
// 2. Then we can just read the data from the view
// 3. Send queries to refresh the view data periodically like every 4 Hours
// 4. Optionally just sync this with Cache too for fast retrieval on dashboard and even for seperate users
