import { prisma } from "../../client";

import {
  DifficultyType,
  LikelihoodType,
  CategoryType,
  LinkType,
} from "@prisma/client";

type NewProjectProps = {
  name: string;
  shortDescription: string;
  about: string;
  moreDescription?: string;
  difficulty: DifficultyType;
  category: CategoryType;
  likelihood: LikelihoodType;
  rating: number;
  featured: boolean;
  network: string;
  links?: { url: string; type: LinkType }[];
};

export default async function newProjec({
  name,
  shortDescription,
  about,
  moreDescription,
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
