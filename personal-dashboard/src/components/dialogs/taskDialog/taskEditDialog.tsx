import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EllipsisVertical } from "lucide-react";
import { z } from "zod";
import TaskForm, { formSchema } from "./taskForm";
import { updateTask } from "@/api";

type EditTaskDialogProps = {
  task: z.infer<typeof formSchema>; // the task object to edit
  callback: () => void;
};

export default function EditTaskDialog({
  task,
  callback,
}: EditTaskDialogProps) {
  async function handleUpdate(values: z.infer<typeof formSchema>) {
    try {
      const result = await updateTask(values);
      if (!result) {
        console.error("Failed to update task");
      } else {
        callback();
      }
    } catch (error) {
      console.error("Unexpected error updating task:", error);
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild className="ml-auto">
          <EllipsisVertical className="cursor-pointer p-0 text-dark/70 hover:text-dark" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
            <DialogDescription>Update the task details</DialogDescription>
          </DialogHeader>
          <TaskForm
          onSubmit={handleUpdate}
          initialValues={task}
          submitButtonLabel="Save Changes"
        />
        </DialogContent>
      </Dialog>
    </div>
  );
}
