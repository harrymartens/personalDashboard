import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Task } from "@/types/task";
import { Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";

export default function TaskEditDialog({ row }: { row: Row<Task> }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="ml-auto">

        <EllipsisVertical className="cursor-pointer text-dark/70 hover:text-dark" />
    </DialogTrigger>
    <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new task</DialogTitle>
            <DialogDescription>Input info to create a task</DialogDescription>
          </DialogHeader>
          </DialogContent>

      </Dialog>
    </div>
  );
}
