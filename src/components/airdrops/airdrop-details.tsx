"use client";
import { Typography } from "../ui/typography";
import milkyway from "@/../assets/dashboard/milkyway2.svg";
import Image from "next/image";
import { ChevronLeft, Link as LinkIcon, LucideIcon, Star } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import DashboardCard from "../dashboard/dashboard-card";
import Link from "next/link";
import { ProjectDataType } from "@/utils/api/project";
import { getAboutProtocol } from "@/utils/helpers/dashboard/getProtocolAbout";
import { getLinksProtocol } from "@/utils/helpers/dashboard/getProtocolLinks";
import Loader from "../ui/loader";
import { useAuth } from "@/context/authContext";
import { favouriteProject, toggleFavouriteProject } from "@/utils/api/user";
import { useEffect, useState } from "react";

interface AboutProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

interface ProjectDataProps {
  projectData: ProjectDataType;
}

interface FavouriteProjects {
  projectId: number;
  favourite: boolean;
}

export default function AirdropDetails({ projectData }: ProjectDataProps) {
  const router = useRouter();
  const aboutProtocol = getAboutProtocol(projectData);
  const links = getLinksProtocol(projectData);
  const { currentUserData, setHasChanged } = useAuth();
  const [userFavouriteProjects, setUserFavouriteProjects] = useState<
    FavouriteProjects[]
  >([]);

  // const userFavouriteProjects = currentUserData.current?.UserProjects;
  const currentProjectId = projectData.id;

  const isFavourite = userFavouriteProjects?.some(
    (project) =>
      project.projectId === currentProjectId && project.favourite === true,
  );

  const handleAddToFavourites = async ({
    projectId,
  }: {
    projectId: number;
  }) => {
    const userId = currentUserData.current?.id;
    if (!userId) {
      return console.error("User is not logged in");
    }
    const response = (await favouriteProject({
      userId,
      projectId,
    })) as Response;

    if (response.ok) {
      setUserFavouriteProjects((prev) => [
        ...prev,
        { projectId: projectId, favourite: true },
      ]);
      setHasChanged(true);
    } else {
      console.error("Failed to add project to favourites");
    }
  };

  const handleRemoveFromFavourites = async ({
    projectId,
    favourite,
  }: {
    projectId: number;
    favourite: boolean;
  }) => {
    const userId = currentUserData.current?.id;

    const userProjectId = currentUserData.current?.UserProjects?.find(
      (project) => project.projectId === projectId,
    )?.id;

    if (!userId || !userProjectId) {
      return console.error("User is not logged in");
    }

    const response = (await toggleFavouriteProject({
      userProjectId: userProjectId,
      favourite: favourite,
    })) as Response;

    if (response.ok) {
      // if favourite is false, remove project from favourites
      if (!favourite) {
        setUserFavouriteProjects((prev) =>
          prev.filter((project) => project.projectId !== projectId),
        );
      } else {
        setUserFavouriteProjects((prev) =>
          prev.map((project) =>
            project.projectId === projectId
              ? { projectId: projectId, favourite: true }
              : project,
          ),
        );
      }
      setHasChanged(true);
    } else {
      console.error("Failed to remove project from favourites");
    }
  };

  const isInUserProjects = (projectId: number) => {
    return currentUserData.current?.UserProjects?.some(
      (project) => project.projectId === projectId,
    );
  };

  useEffect(() => {
    setUserFavouriteProjects(currentUserData.current?.UserProjects || []);
  }, [currentUserData.current?.UserProjects]);

  return (
    <>
      {Object.keys(projectData).length !== 0 ? (
        <div className="space-y-14">
          <div className="space-y-8">
            <Button
              onClick={() => router.replace("/airdrops")}
              variant={"secondary"}
              className="flex items-center gap-1 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
              <div>Back</div>
            </Button>

            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Image
                  src={projectData.images ? projectData.images[0] : milkyway}
                  alt="protocol"
                  width={100}
                  height={100}
                />
                <div>
                  <Typography variant={"h2"}>{projectData?.name}</Typography>
                  <Typography variant={"muted"}>
                    {projectData?.shortDescription}
                  </Typography>
                </div>
              </div>
              <div className="cursor-pointer">
                <Star
                  className={`h-5 w-5 ${isFavourite ? "text-yellow-400" : ""}`}
                  onClick={
                    isFavourite && isInUserProjects(currentProjectId)
                      ? () =>
                          handleRemoveFromFavourites({
                            projectId: currentProjectId,
                            favourite: false,
                          })
                      : !isFavourite && isInUserProjects(currentProjectId)
                        ? () =>
                            handleRemoveFromFavourites({
                              projectId: currentProjectId,
                              favourite: true,
                            })
                        : () =>
                            handleAddToFavourites({
                              projectId: currentProjectId,
                            })
                  }
                />
              </div>
            </div>

            <DashboardCard className="space-y-8">
              <div className="flex w-full flex-wrap items-center justify-between gap-4">
                {aboutProtocol.map(({ title, value, icon: Icon }, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <Typography variant={"h4"}>{title}</Typography>
                    </div>
                    <Typography variant={"smallTitle"} className="">
                      {value}
                    </Typography>
                  </div>
                ))}
              </div>

              <div className="flex w-full flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  <Typography variant={"h3"}>Links</Typography>
                </div>
                <div className=" flex items-center gap-6 px-7">
                  {links.length === 0 && (
                    <Typography variant={"paragraph"}>
                      No links available
                    </Typography>
                  )}
                  {links.map(({ label, href }, idx) => (
                    <Link
                      key={idx}
                      href={href}
                      target="_blank"
                      className="text-lg underline"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </DashboardCard>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <Typography variant={"h4"}>About</Typography>
              <Typography variant={"paragraph"}>
                {projectData?.about}
              </Typography>
            </div>
            <div className=" space-y-4">
              <Typography variant={"h4"}>More</Typography>
              <Typography variant={"paragraph"}>
                {projectData?.moreDescription}
              </Typography>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}
