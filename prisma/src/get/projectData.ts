import { prisma } from "../../client";

interface getProjectByIdProps {
  projectId: number;
  includeDetailedInfo: boolean;
  includeLinks?: boolean;
  includeTasks?: boolean;
  includeSteps?: boolean;
  includeUserTasks?: boolean;
}

interface getProjectByNameProps {
  projectName: string;
  includeDetailedInfo: boolean;
  includeLinks?: boolean;
  includeTasks?: boolean;
  includeSteps?: boolean;
  includeUserTasks?: boolean;
}

// TODO: Do we also want to track how many users completed this in total
// TODO: No of tasks this project has ?
export const getAllProjects = async () => {
  return await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      shortDescription: true,
      difficulty: true,
      category: true,
      likelihood: true,
      rating: true,
      featured: true,
      network: true,
      images: true,
      tasks: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getProjectByID = async ({
  projectId,
  includeDetailedInfo = false,
  includeLinks = false,
  includeTasks = false,
  includeSteps = false,
  includeUserTasks = false,
}: getProjectByIdProps) => {
  return await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      shortDescription: true,
      about: includeDetailedInfo ? true : undefined,
      moreDescription: includeDetailedInfo ? true : undefined,
      images: true,
      difficulty: true,
      category: true,
      likelihood: true,
      rating: true,
      featured: true,
      network: true,
      createdAt: true,
      updatedAt: true,
      links: includeLinks
        ? {
            select: {
              id: true,
              url: true,
              type: true,
            },
          }
        : undefined,
      tasks: includeTasks
        ? {
            select: {
              id: true,
              name: true,
              difficulty: true,
              about: true,
              instructions: true,
              steps: includeSteps
                ? {
                    select: {
                      id: true,
                      name: true,
                      description: true,
                    },
                  }
                : undefined,
              UserTasks: includeUserTasks
                ? {
                    select: {
                      id: true,
                      userId: true,
                      taskId: true,
                    },
                  }
                : undefined,
            },
          }
        : undefined,
    },
  });
};

export const getProjectByName = async ({
  projectName,
  includeDetailedInfo = false,
  includeLinks = false,
  includeTasks = false,
  includeSteps = false,
  includeUserTasks = false,
}: getProjectByNameProps) => {
  return await prisma.project.findFirstOrThrow({
    where: { name: { contains: projectName } },
    select: {
      id: true,
      name: true,
      shortDescription: true,
      about: includeDetailedInfo ? true : undefined,
      moreDescription: includeDetailedInfo ? true : undefined,
      images: true,
      difficulty: true,
      category: true,
      likelihood: true,
      rating: true,
      featured: true,
      network: true,
      createdAt: true,
      updatedAt: true,
      links: includeLinks
        ? {
            select: {
              id: true,
              url: true,
              type: true,
            },
          }
        : undefined,
      tasks: includeTasks
        ? {
            select: {
              id: true,
              name: true,
              difficulty: true,
              about: true,
              instructions: true,
              steps: includeSteps
                ? {
                    select: {
                      id: true,
                      name: true,
                      description: true,
                    },
                  }
                : undefined,
              UserTasks: includeUserTasks
                ? {
                    select: {
                      id: true,
                    },
                  }
                : undefined,
            },
          }
        : undefined,
    },
  });
};
