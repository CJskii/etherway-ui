import { DifficultyType } from "@prisma/client";
import { ContractType, InteractionType, RewardType } from "@prisma/client";

export type FavouriteProjectType = {
  userId: number;
  projectId: number;
};

export type CompleteTaskType = {
  userId: number;
  taskId: number;
};

export type UserData = {
  ethereumAddress: string;
  id: number;
  inviteCode: string;
  createdAt: Date;
  interactions?: {
    id: number;
    type: InteractionType;
    contractType?: ContractType | null;
    chainId?: number | null;
    points: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
  UserRewards?: {
    id: number;
    type: RewardType;
    points: number;
    claimedAt: Date;
  }[];
  UserProjects?: {
    id: number;
    projectId: number;
    favourite: boolean;
  }[];
  UserTasks?: {
    id: number;
    taskId: number;
    completed: boolean;
  }[];
};

export async function favouriteProject(data: FavouriteProjectType) {
  let response;
  let error;

  try {
    response = await fetch("/api/user/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });
    return response;
  } catch (e) {
    console.log(e);
    error = e;
    return error;
  }
}

export type ToggleFavouriteProjectType = {
  userProjectId: number;
  favourite: boolean;
};
export async function toggleFavouriteProject(data: ToggleFavouriteProjectType) {
  let response;
  let error;

  try {
    response = await fetch("/api/user/toggleFavourite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });
    return response;
  } catch (e) {
    console.log(e);
    error = e;
    return error;
  }
}

export async function completeTask(data: CompleteTaskType) {
  let response;
  let error;

  try {
    response = await fetch("/api/user/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });
    return response;
  } catch (e) {
    console.log(e);
    error = e;
    return error;
  }
}

export type ToggleCompleteProjectType = {
  userTaskId: number;
  completed: boolean;
};
export async function ToggleCompleteTask(data: ToggleCompleteProjectType) {
  let response;
  let error;

  try {
    response = await fetch("/api/user/toggleComplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });
    return response;
  } catch (e) {
    console.log(e);
    error = e;
    return error;
  }
}

export async function getUserData(): Promise<UserData | undefined> {
  try {
    const response = await fetch("/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status == 200) {
      const data = (await response.json()) as UserData;
      return data;
    }
    return;
  } catch (e) {
    console.log(e);
    const error = e;
    return;
  }
}
