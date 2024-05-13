import { getUser, getUserProject, getUserTask } from "../get/userData";
import { createUser } from "../create/newUser";
import {
  getAllProjects,
  getProjectByID,
  getProjectByName,
} from "@/../prisma/src/get/projectData";
import newProject, { NewProjectProps } from "@/../prisma/src/create/newProject";
import {
  CategoryType,
  DifficultyType,
  LikelihoodType,
  LinkType,
} from "@prisma/client";
import newTask from "@/../prisma/src/create/newTask";
import newStep from "@/../prisma/src/create/newStep";
import newUserProject from "@/../prisma/src/create/newUserProject";
import newUserTask from "@/../prisma/src/create/newUserTask";

type getProjectProps = {
  id?: number;
  name?: string;
};

export type CreateProjectType = {
  name: string;
  shortDescription: string;
  about: string;
  moreDescription?: string;
  images?: string[];
  difficulty: string;
  category: string;
  likelihood: string;
  rating: number;
  featured: boolean;
  network: number[];
  links?: { url: string; type: string }[];
};

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

// NOTE: Create a new project
export async function createProject(projectData: CreateProjectType) {
  return await newProject({
    name: projectData.name,
    shortDescription: projectData.shortDescription,
    about: projectData.about,
    moreDescription: projectData.moreDescription,
    images: projectData.images,
    difficulty: projectData.difficulty as DifficultyType,
    category: projectData.category as CategoryType,
    likelihood: projectData.likelihood as LikelihoodType,
    rating: projectData.rating,
    featured: projectData.featured,
    network: projectData.network,
    links:
      projectData.links &&
      projectData.links.map((link) => ({
        url: link.url,
        type: link.type as LinkType,
      })),
  });
}

// NOTE :  Create a Task for a certain Project
export async function createTaskForProject(taskData: CreateTaskType) {
  return await newTask({
    projectId: taskData.projectId,
    taskName: taskData.taskName,
    difficulty: taskData.difficulty as DifficultyType,
    about: taskData.about,
    instructions: taskData.instructions,
    steps: taskData.steps,
  });
}

// NOTE: Add new steps to a task
export async function createStepsForTask(stepData: CreateStepType) {
  return await newStep({
    taskId: stepData.taskId,
    name: stepData.name,
    description: stepData.description,
  });
}

// NOTE: Handler for getting a project detailed info
export default async function getProject({ id, name }: getProjectProps) {
  if (id != undefined) {
    const projectData = await getProjectByID({
      projectId: id,
      includeDetailedInfo: true,
      includeLinks: true,
      includeTasks: true,
      includeSteps: true,
      includeUserTasks: true,
    });
    return projectData;
  }

  if (name) {
    const projectData = await getProjectByName({
      projectName: name,
      includeDetailedInfo: true,
      includeLinks: true,
      includeTasks: true,
      includeSteps: true,
      includeUserTasks: true,
    });
    return projectData;
  }

  return undefined;
}

// NOTE: Get Project data for explore airdrops sections
export { getAllProjects };

// NOTE: Favourite

export type FavouriteProjectType = {
  userId: number;
  projectId: number;
};

export async function handleFavouriteProject(props: FavouriteProjectType) {
  // Check if a User Project exists for the projectId & user Id
  const userProject = await getUserProject({
    userId: props.userId,
    projectId: props.projectId,
  });

  if (userProject) {
    return userProject;
  }

  return await newUserProject({
    userId: props.userId,
    projectId: props.projectId,
    favourite: true,
  });
}

export type CompleteTaskType = {
  userId: number;
  taskId: number;
};

// TODO: Check that the task is not already completed
export async function handleCompleteTask(props: CompleteTaskType) {
  const userTask = await getUserTask({
    userId: props.userId,
    taskId: props.taskId,
  });

  if (userTask) {
    return userTask;
  }

  // Check if the UserTask exists for the taskId & userId
  return await newUserTask({
    userId: props.userId,
    taskId: props.taskId,
    completed: true,
  });
}
