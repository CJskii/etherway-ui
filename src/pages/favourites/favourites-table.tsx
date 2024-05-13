import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import milkyWay from "@/../assets/dashboard/milkyway.svg";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Typography } from "@/components/ui/typography";
import { useAuth } from "@/context/authContext";
import { getProjects } from "@/utils/api/getProjects";
import { ProjectDataType } from "@/utils/api/project";
import { activeChains } from "@/constants/config/chainsConfig";
import { ShieldX } from "lucide-react";
import { toggleFavouriteProject } from "@/utils/api/user";
import Loader from "@/components/ui/loader";

interface ProjectDataProps {
  projectData: ProjectDataType;
}

export default function FavouritesTable() {
  const [projectData, setProjectData] = useState<ProjectDataProps | {}>({});
  const [favouriteProjectsData, setFavouriteProjectsData] = useState<
    ProjectDataType[]
  >([]);

  const { currentUserData, setHasChanged } = useAuth();

  const handleToggleFavourite = async ({
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

    try {
      const response = (await toggleFavouriteProject({
        userProjectId: userProjectId,
        favourite: favourite,
      })) as Response;

      // remove projectId from favouriteProjectsData if favourite is false

      if (response.ok) {
        // if (favourite) {
        //   setFavouriteProjectsData((prevState) => [
        //     ...prevState,
        //     projectData as ProjectDataType,
        //   ]);
        //   setHasChanged(true);
        // }
        // else {
        setFavouriteProjectsData((prevState) =>
          prevState.filter((project) => project.id !== projectId),
        );
        setHasChanged(true);
        // }
      }
    } catch (error) {
      console.error("Failed to toggle favourite project:", error);
    }
  };

  const isFavourite = (projectId: number) => {
    return (
      favouriteProjectsData.some((project) => project.id === projectId) || false
    );
  };

  const filterFavouriteProjects = (projects: ProjectDataType[]) => {
    if (!currentUserData.current?.UserProjects) {
      return;
    }
    const favouriteProjectIds =
      currentUserData.current?.UserProjects.filter(
        (project) => project.favourite,
      ).map((project) => project.projectId) || [];

    const favProjects = projects.filter((project) =>
      favouriteProjectIds.includes(project.id),
    );
    setFavouriteProjectsData(favProjects);
  };

  useEffect(() => {
    if (currentUserData.current?.UserProjects) {
      const favouriteProjectIds =
        currentUserData.current?.UserProjects.filter((p) => p.favourite).map(
          (p) => p.projectId,
        ) || [];
    }

    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        if (response && Array.isArray(response)) {
          setProjectData(response);
          filterFavouriteProjects(response);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjectData([]);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      {Object.keys(projectData).length === 0 ? (
        <Loader />
      ) : (
        <>
          <div className="space-y-6 py-6 md:space-y-12">
            <Typography variant={"h2"} className=" font-raleway">
              {favouriteProjectsData.length ?? 0} Airdrops
            </Typography>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="dark:text-slate-200">
                <TableHead></TableHead>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Likelihood</TableHead>
                <TableHead>Quest</TableHead>
                <TableHead>Networks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {favouriteProjectsData.map((project, idx) => (
                <React.Fragment key={idx}>
                  <TableRow className="z-10 rounded-xl border-0 bg-[#b5b4b6]/30 px-8 py-7 backdrop-blur-md hover:bg-[#b5b4b6]/20 dark:bg-white/10 dark:text-white">
                    <TableCell className=" cursor-pointer rounded-l-xl">
                      <Star
                        className="text-yellow-400"
                        onClick={
                          isFavourite(project.id)
                            ? () =>
                                handleToggleFavourite({
                                  projectId: project.id,
                                  favourite: false,
                                })
                            : () => {}
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell>
                      <Link
                        href={`/airdrops/${project.id}`}
                        className=" flex items-center gap-2"
                      >
                        <Image src={milkyWay} alt={project.name} />
                        <span className="block space-y-0">
                          <Typography variant={"large"}>
                            {project.name}
                          </Typography>
                          <Typography
                            variant={"paragraph"}
                            className=" max-w-[20ch] truncate"
                          >
                            {project.shortDescription}
                          </Typography>
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>{project.difficulty}</TableCell>
                    <TableCell>{project.category}</TableCell>
                    <TableCell>{project.likelihood}</TableCell>
                    <TableCell>{project.tasks?.length}</TableCell>
                    <TableCell className="rounded-r-xl text-center">
                      <span className="flex items-center">
                        <React.Fragment key={idx}>
                          {project.network.length > 0 ? (
                            project.network.map((chainId, index) => {
                              const chain = activeChains.find(
                                (c) => c.id === chainId,
                              );
                              if (chain) {
                                return (
                                  <Image
                                    key={index}
                                    src={chain.iconUrl || "/default-icon.png"}
                                    alt={`${chain.name} network`}
                                    width={20}
                                    height={20}
                                    className="rounded-full"
                                  />
                                );
                              } else {
                                return null;
                              }
                            })
                          ) : (
                            <ShieldX />
                          )}
                        </React.Fragment>
                      </span>
                    </TableCell>
                  </TableRow>
                  {idx < favouriteProjectsData.length - 1 && (
                    <tr className="spacer" style={{ height: "10px" }}></tr>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
}
