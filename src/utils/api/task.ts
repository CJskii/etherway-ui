import { DifficultyType } from "@prisma/client";

export type CreateTaskType = {
  projectId: number;
  taskName: string;
  difficulty: DifficultyType;
  about: string;
  instructions: string;
  steps: { name: string; description: string }[];
};

export type CreateStepType = {
  taskId: number;
  name: string;
  description: string;
};

export async function createTasks(taskData: CreateTaskType) {
  let response;
  let error;

  try {
    response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...taskData,
      }),
    });
    return response;
  } catch (e) {
    console.log(e);
    error = e;
    return error;
  }
}

export async function createSteps(stepData: CreateStepType) {
  let response;
  let error;

  try {
    response = await fetch("/api/steps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...stepData,
      }),
    });
    return response;
  } catch (e) {
    console.log(e);
    error = e;
    return error;
  }
}
