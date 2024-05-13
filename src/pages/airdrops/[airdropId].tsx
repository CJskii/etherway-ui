"use client";
import React, { useEffect, useState } from "react";
import AirdropDetails from "../../components/airdrops/airdrop-details";
import QuestsDetails from "../../components/airdrops/quests-details";
import DashboardLayout from "@/components/dashboard/layout";
import dynamic from "next/dynamic";
import { getProject } from "@/utils/api/project";
import { useRouter } from "next/router";
import { ProjectDataType } from "@/utils/api/project";
import { useAuth } from "@/context/authContext";

interface ProjectDataProps {
  projectData: ProjectDataType;
}

function AirdropPage() {
  const { currentUserData } = useAuth();

  const router = useRouter();
  const [projectData, setProjectData] = useState<ProjectDataProps | {}>({});

  useEffect(() => {
    const params = router.query;
    const fetchProject = async (id: number) => {
      try {
        const response = await getProject({ id: id });
        if (response) {
          setProjectData(response);
        }
      } catch (error) {
        console.log(error);
        console.error("Failed to fetch projects:", error);
        setProjectData([]);
      }
    };

    if (params != undefined && params.airdropId != undefined) {
      fetchProject(Number(params.airdropId));
    }
  }, [router.query]);

  return (
    <DashboardLayout>
      <div className="mx-auto md:max-w-7xl">
        <div className="airdrop-layout py-6">
          <AirdropDetails projectData={projectData as ProjectDataType} />
          <QuestsDetails projectData={projectData as ProjectDataType} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default dynamic(() => Promise.resolve(AirdropPage), {
  ssr: false,
});
