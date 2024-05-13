import {
  CategoryType,
  DifficultyType,
  LikelihoodType,
  LinkType,
} from "@prisma/client";

export type ProjectDataType = {
  id: number;
  name: string;
  shortDescription: string;
  about?: string;
  moreDescription?: string;
  images?: string[];
  difficulty: DifficultyType;
  category: CategoryType;
  likelihood: LikelihoodType;
  rating: number;
  featured: boolean;
  network: number[];
  createdAt: string;
  updatedAt: string;
  links?: {
    id: number;
    url: string;
    type: LinkType;
  }[];
  tasks?: {
    id: number;
    name: string;
    difficulty: DifficultyType;
    about: string;
    instructions: string;
    steps?: {
      id: number;
      name: string;
      description: string;
    }[];
    UserTasks?: {
      id: number;
      userId: number;
      taskId: number;
    }[];
  }[];
};

export async function getProject({
  id,
  name,
}: {
  id?: number;
  name?: string;
}): Promise<ProjectDataType | undefined> {
  let response;
  let error;
  let url;
  if (id) {
    url = `/api/project?id=${id}`;
  } else if (name) {
    url = `/api/project?name=${name}`;
  } else {
    return;
  }
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = (await response.json()) as ProjectDataType;
    return data;
  } catch (e) {
    console.log(e);
    error = e;
    return;
  }
}

export type CreateProjectType = {
  name: string;
  shortDescription: string;
  about: string;
  moreDescription?: string;
  images?: string[];
  difficulty: DifficultyType;
  category: CategoryType;
  likelihood: LikelihoodType;
  rating: number;
  featured: boolean;
  network: number[];
  links?: { url: string; type: LinkType }[];
};

export async function createProject(projectData: CreateProjectType) {
  let response;
  let error;

  try {
    response = await fetch("/api/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...projectData,
      }),
    });
    return response;
  } catch (e) {
    console.log(e);
    error = e;
    return error;
  }
}
