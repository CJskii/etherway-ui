import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import banner from "@/../assets/dashboard/banner.svg";
import React, { useEffect } from "react";
import Image from "next/image";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ProjectDataType } from "@/utils/api/project";
import Loader from "@/components/ui/loader";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { completeTask } from "@/utils/api/user";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { BadgeCheck } from "lucide-react";

interface ProjectDataProps {
  projectData: ProjectDataType;
}

interface TaskStatus {
  id: number;
  completed: boolean;
}

export default function QuestsDetails({ projectData }: ProjectDataProps) {
  const { tasks } = projectData;
  const account = useAccount();
  const { openConnectModal } = useConnectModal();
  const { currentUserData } = useAuth();

  const [taskStatus, setTaskStatus] = useState<TaskStatus[]>([]);
  const [totalTasksCompletedByUser, setTotalTasksCompletedByUser] = useState(0);
  const [totalTaskCompletions, setTotalTaskCompletions] = useState(0);

  const handleCompleteTaskButton = async ({ taskId }: { taskId: number }) => {
    if (!account.isConnected && openConnectModal) {
      return openConnectModal();
    }

    if (currentUserData.current?.id) {
      const completionResponse = (await completeTask({
        userId: currentUserData.current?.id,
        taskId: taskId,
      })) as Response;

      if (completionResponse.ok) {
        setTaskStatus((prevStatus) =>
          prevStatus.map((status) =>
            status.id === taskId ? { ...status, completed: true } : status,
          ),
        );
      }
    } else {
      // TODO: handle the case when completion fails
      console.error("User data not found");
    }
  };

  useEffect(() => {
    if (tasks) {
      const initialStatus = tasks.map((task) => ({
        id: task.id,
        completed:
          task.UserTasks?.some(
            (ut) => ut.userId === currentUserData.current?.id,
          ) ?? false,
      }));

      const totalTasksCompletedByUser = taskStatus.filter(
        (status) => status.completed,
      ).length;

      const totalTaskCompletions =
        tasks?.reduce(
          (total, task) => total + (task.UserTasks?.length || 0),
          0,
        ) || 0;

      setTaskStatus(initialStatus);
      setTotalTasksCompletedByUser(totalTasksCompletedByUser);
      setTotalTaskCompletions(totalTaskCompletions);
    }
  }, [tasks, currentUserData]);

  const taskData = tasks?.map((task) => {
    const isTaskCompleted = taskStatus?.find(
      (status) => status.id === task.id,
    )?.completed;

    return {
      title: task.name,
      description: `${task.UserTasks?.length || 0} people completed`,
      value: task.difficulty || "Not Specified",
      isCompleted: isTaskCompleted,
      details: (
        <div>
          <div className="space-y-3">
            <Typography variant={"large"} className="text-zinc-900">
              About
            </Typography>
            <Typography variant={"paragraph"} className="text-zinc-900">
              {task.about ||
                "Detailed information about this task will be provided soon."}
            </Typography>
            <Typography variant={"large"} className="text-zinc-900">
              Requirements
            </Typography>
            <Typography variant={"paragraph"} className="text-zinc-900">
              {task.instructions ||
                "Instructions for this task will be provided soon."}
            </Typography>
            <Typography variant={"large"} className="text-zinc-900">
              Steps to do
            </Typography>
            {task.steps && task.steps.length > 0 ? (
              task.steps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <Typography variant={"list"} className="text-zinc-900">
                    <li>{step.name || "Step description coming soon."}</li>
                  </Typography>
                  <Typography variant={"muted"}>
                    {step.description || "No description available."}
                  </Typography>
                </React.Fragment>
              ))
            ) : (
              <Typography variant={"paragraph"} className="text-zinc-900">
                Steps for this task will be added soon.
              </Typography>
            )}
          </div>

          {isTaskCompleted ? (
            <></>
          ) : (
            <div className="mt-4 flex w-full items-center justify-center">
              <Button
                size={"lg"}
                variant={"accent"}
                onClick={() => handleCompleteTaskButton({ taskId: task.id })}
                disabled={isTaskCompleted}
              >
                Mark as completed
              </Button>
            </div>
          )}
        </div>
      ),
    };
  });

  return (
    <>
      {Object.keys(projectData).length !== 0 ? (
        <div className="space-y-8">
          <div className="space-y-4">
            {/* <Image
              src={projectData.images ? banner : projectData.images[1]}
              alt="banner"
              className=" w-full"
              width={400}
              height={200}
            /> */}

            <Image
              src={projectData.images ? projectData.images[1] : banner}
              alt="banner"
              className=" w-full rounded-xl"
              width={400}
              height={200}
            />
            <DashboardCard className="flex w-full items-center justify-between p-5">
              <Typography variant={"smallTitle"}>
                {totalTasksCompletedByUser}/{tasks?.length} Tasks completed
              </Typography>
              <Typography variant={"smallTitle"}>
                {totalTaskCompletions} people completed
              </Typography>
            </DashboardCard>
          </div>

          {taskData?.map(
            ({ title, description, value, details, isCompleted }, idx) => (
              <Accordion
                key={idx}
                type="single"
                collapsible
                className=" min-w-full md:max-w-md"
              >
                <AccordionItem value="title">
                  <AccordionTrigger
                    className="flex flex-wrap items-center justify-between "
                    key={idx}
                  >
                    <div className="flex flex-col text-start">
                      <Typography variant={"large"}>{title}</Typography>
                      <Typography
                        variant={"smallTitle"}
                        className="text-neutral-600 dark:text-neutral-300"
                      >
                        {description}
                      </Typography>
                    </div>
                    <div>
                      <Typography className="flex gap-2">
                        {value}{" "}
                        {isCompleted ? (
                          <BadgeCheck className="text-green-400" />
                        ) : (
                          ""
                        )}
                      </Typography>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>{details}</AccordionContent>
                </AccordionItem>
              </Accordion>
            ),
          )}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}
