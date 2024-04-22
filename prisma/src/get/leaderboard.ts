const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

getTopUsersByPoints();
