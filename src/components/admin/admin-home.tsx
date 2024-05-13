import React, { useState, useEffect } from "react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { NewProjectForm } from "@/components/admin/new-project";
import { NewTaskForm } from "@/components/admin/new-task";
import { NewStepForm } from "@/components/admin/new-step";

export function AdminHome() {
  const [selectedForm, setSelectedForm] = useState("");

  const handleSelectForm = (formType: string) => {
    setSelectedForm(formType);
  };

  // TODO: Create a form for each of the buttons:

  return (
    <>
      <Typography variant="h1">Admin Panel</Typography>
      <div className="flex flex-col items-center justify-center pt-8">
        <Typography variant="h2">What do you want to do?</Typography>

        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => handleSelectForm("newProject")}
            className="mt-4"
            variant="outline"
          >
            New project
          </Button>
          <Button
            onClick={() => handleSelectForm("newTask")}
            className="mt-4"
            variant="outline"
          >
            New task
          </Button>
          <Button
            onClick={() => handleSelectForm("newSteps")}
            className="mt-4"
            variant="outline"
          >
            New steps
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => handleSelectForm("editProject")}
            className="mt-4"
            variant="outline"
          >
            Edit existing project
          </Button>
          <Button
            onClick={() => handleSelectForm("editTask")}
            className="mt-4"
            variant="outline"
          >
            Edit existing task
          </Button>
          <Button
            onClick={() => handleSelectForm("editSteps")}
            className="mt-4"
            variant="outline"
          >
            Edit existing steps
          </Button>
        </div>

        {selectedForm === "newProject" && <NewProjectForm />}

        {selectedForm === "newTask" && <NewTaskForm />}
        {selectedForm === "newSteps" && <NewStepForm />}
        {selectedForm === "editProject" && (
          <div>Edit Project Form or Component Here</div>
        )}
        {selectedForm === "editTask" && (
          <div>Edit Task Form or Component Here</div>
        )}
        {selectedForm === "editSteps" && (
          <div>Edit Steps Form or Component Here</div>
        )}
      </div>
    </>
  );
}
