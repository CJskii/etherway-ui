import { prisma } from "../../client";

type NewStepProps = {
  taskId: number;
  name: string;
  description: string;
};

export default async function newStep({
  taskId,
  name,
  description,
}: NewStepProps) {
  return await prisma.step.create({
    data: {
      name,
      description,
      taskId,
    },
  });
}
