import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { z } from "zod";
import { DifficultyType } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Typography } from "../ui/typography";
import { getProjects } from "@/utils/api/getProjects";
import { Project, Task } from "@prisma/client";
import { createTasks } from "@/utils/api/task";
import React, { useState, useEffect } from "react";
import { useToast } from "../ui/use-toast";

interface ProjectWithTask extends Project {
  tasks: Task[];
}

const taskFormSchema = z.object({
  taskName: z.string().min(2, "Name must be at least 2 characters"),
  difficulty: z.nativeEnum(DifficultyType),
  about: z.string().min(20, "About must be at least 20 characters"),
  instructions: z.string().min(5, "Instructions must be at least 5 characters"),
  projectId: z.number(),
});

export const NewTaskForm = () => {
  const [projectData, setProjectData] = useState<ProjectWithTask[]>([]);
  const { toast } = useToast();

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

  const form = useForm({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      taskName: "",
      difficulty: DifficultyType.EASY,
      about: "",
      instructions: "",
      projectId: projectData[0]?.id || 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof taskFormSchema>) => {
    const response = (await createTasks({
      projectId: values.projectId,
      taskName: values.taskName,
      difficulty: values.difficulty,
      about: values.about,
      instructions: values.instructions,
      steps: [],
    })) as Response;

    if (response.ok) {
      toast({
        title: "Task created",
        description: "Task created successfully",
        variant: "success",
      });
      form.reset();
      return;
    } else {
      toast({
        title: "Error creating task",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  function setFormValue<T>(field: keyof typeof taskFormSchema.shape, value: T) {
    form.setValue(field, value as any);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-8 w-9/12 space-y-6"
      >
        <FormLabel>
          {" "}
          <Typography variant={"h2"}>New Task</Typography>
          <Typography variant={"smallTitle"}>
            Select project from the dropdown and fill in the form to add a new
            task to the project.
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
        <FormItem>
          <FormLabel>Task Name</FormLabel>
          <Input {...form.register("taskName")} />
        </FormItem>
        <FormItem>
          <FormLabel>About</FormLabel>
          <Textarea {...form.register("about")} />
        </FormItem>
        <FormItem>
          <FormLabel>Instructions (Requirements)</FormLabel>
          <Textarea {...form.register("instructions")} />
        </FormItem>

        <div className="flex items-center justify-between">
          <FormItem className="flex flex-col">
            <FormLabel>Difficulty</FormLabel>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"}>
                  {form.watch("difficulty") || "Select Difficulty"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.values(DifficultyType).map((value) => (
                  <DropdownMenuItem
                    key={value}
                    onSelect={() => setFormValue("difficulty", value)}
                  >
                    {value}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </FormItem>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
