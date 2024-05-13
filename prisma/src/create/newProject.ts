import { prisma } from "../../client";

import {
  DifficultyType,
  LikelihoodType,
  CategoryType,
  LinkType,
} from "@prisma/client";

export type NewProjectProps = {
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

export default async function newProject({
  name,
  shortDescription,
  about,
  moreDescription,
  images,
  difficulty,
  category,
  likelihood,
  rating,
  featured,
  network,
  links,
}: NewProjectProps) {
  return await prisma.project.create({
    data: {
      name,
      shortDescription,
      about,
      moreDescription,
      images,
      difficulty,
      category,
      likelihood,
      rating,
      featured,
      network,
      links: {
        create: links?.map((link) => ({
          url: link.url,
          type: link.type,
        })),
      },
    },
  });
}
