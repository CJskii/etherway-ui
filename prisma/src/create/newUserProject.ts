import { prisma } from "../../client";

type NewUserProjectProps = {
  userId: number;
  projectId: number;
  favourite?: boolean;
};

// NOTE: This will be called when the user bookmarks or favourites the project
// TODO: Can also be created when the user marks certain step complete for the first time for this project
// When created ideally it will be marked true for favourite
export default async function newUserProject({
  userId,
  projectId,
  favourite = true,
}: NewUserProjectProps) {
  return await prisma.userProject.create({
    data: {
      userId: userId,
      projectId: projectId,
      favourite: favourite,
    },
  });
}

export type ToggleUserProjectFavouritesProps = {
  userProjectId: number;
  favourite: boolean;
};

export async function toggleUserProjectFavourites({
  userProjectId,
  favourite,
}: ToggleUserProjectFavouritesProps) {
  return await prisma.userProject.update({
    where: { id: userProjectId },
    data: {
      favourite: favourite,
    },
  });
}
