import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import { createTask } from "@/api";
import TaskForm, { formSchema } from "./taskForm";
import { z } from "zod";

export default function CreateTaskDialog({
  callback,
}: {
  callback: () => void;
}) {
    const initialValues: z.infer<typeof formSchema> = {
        title: "",
        type: "Personal",
        created_at: new Date().toISOString(),
        status: "Todo",
        complete: false,
        completed_date: null,        
        priority: "Medium",
        scheduled_date: null,        
        course: null,               
        due_date: null,             
        week: null,
        weight: null,
        reoccurring: false,
        reoccurring_interval: 0,
      };

  async function handleCreate(values: typeof initialValues) {
    try {
      const result = await createTask(values);
      if (!result) {
        console.error("Failed to create task");
      } else {
        callback();
      }
    } catch (error) {
      console.error("Unexpected error creating task:", error);
    }
  }

  return (
    <Dialog>
        <DialogTrigger asChild className="ml-auto">
          <Button className="hover:bg-red">
            <CirclePlus /> Add New
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new task</DialogTitle>
            <DialogDescription>Input info to create a task</DialogDescription>
          </DialogHeader>
        <TaskForm
          onSubmit={handleCreate}
          initialValues={initialValues}
          submitButtonLabel="Submit"
        />
      </DialogContent>
    </Dialog>
  );
}
