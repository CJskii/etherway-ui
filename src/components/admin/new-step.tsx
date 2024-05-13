import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormItem, FormLabel, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Typography } from "../ui/typography";
import React, { useEffect, useState } from "react";
import { createSteps } from "@/utils/api/task";
import { getProjects } from "@/utils/api/getProjects";
import { Project, Task } from "@prisma/client";
import { useToast } from "../ui/use-toast";

interface ProjectWithTask extends Project {
  tasks: Task[];
}

const stepFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 20 characters"),
  taskId: z.number(),
  projectId: z.number(),
});

export const NewStepForm = () => {
  const [projectData, setProjectData] = useState<ProjectWithTask[]>([]);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(stepFormSchema),
    defaultValues: {
      name: "",
      description: "",
      taskId: projectTasks[0]?.id || 1,
      projectId: projectData[0]?.id || 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof stepFormSchema>) => {
    const response = (await createSteps({
      taskId: values.taskId,
      name: values.name,
      description: values.description,
    })) as Response;

    if (response.ok) {
      toast({
        title: "Step created successfully",
        description: "The step has been added to the task.",
        variant: "success",
      });
      form.reset();
    } else {
      toast({
        title: "Failed to create step",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const selectedProjectId = form.watch("projectId");

  function setFormValue<T>(field: keyof typeof stepFormSchema.shape, value: T) {
    form.setValue(field, value as any);
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        if (response && Array.isArray(response)) {
          setProjectData(response);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjectData([]);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (projectData.length) {
      const project = projectData.find(
        (project) => project.id === selectedProjectId,
      );
      if (project) {
        setProjectTasks(project.tasks);
      }
    }
  }, [projectData, selectedProjectId]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-8 w-9/12 space-y-6"
      >
        <FormLabel>
          {" "}
          <Typography variant={"h2"}>New Step</Typography>
          <Typography variant={"smallTitle"}>
            Select task from the dropdown and fill in the form to add a new step
            to the task.
          </Typography>
        </FormLabel>
        <FormItem className="flex flex-col">
          <FormLabel>Project ID</FormLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                {form.watch("projectId") || "Select Difficulty"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.values(projectData).map(({ id, name }) => (
                <DropdownMenuItem
                  key={String(id)}
                  onSelect={() => setFormValue("projectId", id)}
                >
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </FormItem>
        <FormItem className="flex flex-col">
          <FormLabel>Task ID</FormLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                {form.watch("taskId") || "Select Difficulty"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {projectTasks.map(({ id, name }) => (
                <DropdownMenuItem
                  key={String(id)}
                  onSelect={() => setFormValue("taskId", id)}
                >
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </FormItem>
        <FormItem>
          <FormLabel>Step Name</FormLabel>
          <Input {...form.register("name")} />
        </FormItem>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <Textarea {...form.register("description")} />
            </FormItem>
          )}
        />
        {/* <FormItem>
          <FormLabel>Description</FormLabel>
          <Textarea {...form.register("description")} />
          {errors.description && <p>{errors.description.message}</p>}
        </FormItem> */}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
