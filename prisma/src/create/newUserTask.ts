import { prisma } from "../../client";

type NewUserTaskProps = {
  userId: number;
  taskId: number;
  completed?: boolean;
};

// NOTE: This will be called when the user completes a certain project
// TODO: Can also be created when the user interacts with the task for the first time
// When created ideally it will be marked true for completed
export default async function newUserTask({
  userId,
  taskId,
  completed = true,
}: NewUserTaskProps) {
  return await prisma.userTask.create({
    data: {
      userId: userId,
      taskId: taskId,
      completed: completed,
    },
  });
}

export type ToggleUserTaskCompletionProps = {
  userTaskId: number;
  completed: boolean;
};

export async function toggleUserProjectCompletion({
  userTaskId,
  completed,
}: ToggleUserTaskCompletionProps) {
  return await prisma.userTask.update({
    where: { id: userTaskId },
    data: {
      completed: completed,
    },
  });
}
