import { DifficultyType } from "@prisma/client";
import { prisma } from "../../client";

type NewTaskProps = {
  projectId: number;
  taskName: string;
  difficulty: DifficultyType;
  about: string;
  instructions: string;
  steps: { name: string; description: string }[];
};

export default async function newTask({
  projectId,
  taskName,
  difficulty,
  about,
  instructions,
  steps,
}: NewTaskProps) {
  return await prisma.task.create({
    data: {
      name: taskName,
      difficulty,
      about,
      instructions,
      projectId,
      steps: {
        create: steps.map((step) => ({
          name: step.name,
          description: step.description,
        })),
      },
    },
  });
}
