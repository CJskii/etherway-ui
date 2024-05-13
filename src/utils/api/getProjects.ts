import { CategoryType, DifficultyType, LikelihoodType } from "@prisma/client";

export type AllProjectDataType = {
  id: number;
  name: string;
  shortDescription: string;
  difficulty: DifficultyType;
  category: CategoryType;
  likelihood: LikelihoodType;
  rating: number;
  featured: boolean;
  network: string;
  task: {
    id: number;
  }[];
}[];

export async function getProjects(): Promise<AllProjectDataType | unknown> {
  let response;
  let error;
  try {
    response = await fetch("/api/projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = (await response.json()) as AllProjectDataType;
    return data;
  } catch (e) {
    console.log(e);
    error = e;
    return error;
  }
}
