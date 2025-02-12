import { AccessorKeyColumnDef, Row, Column } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Repeat,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Circle,
  CircleCheckBig,
  CircleOff,
  CircleHelp,
  Timer,
} from "lucide-react";
import { Task } from "@/types/task";
import {
  markTaskComplete,
  markTaskUncomplete,
} from "@/api";
import { toast } from "sonner";
import EditTaskDialog from "@/components/dialogs/taskDialog/taskEditDialog";

const STATUS_ICON_MAP = {
  Todo: Circle,
  Done: CircleCheckBig,
  Backlog: CircleHelp,
  Canceled: CircleOff,
  "In Progress": Timer,
};

type Status = keyof typeof STATUS_ICON_MAP;

const PRIORITY_ICON_MAP = {
  High: ArrowUp,
  Medium: ArrowRight,
  Low: ArrowDown,
};

type Priority = keyof typeof PRIORITY_ICON_MAP;


export function getColumns(
  visibleColumns: string[],
  onTaskUpdated: () => void
): AccessorKeyColumnDef<Task>[] {
  const allColumns: AccessorKeyColumnDef<Task>[] = [
    {
      accessorKey: "complete",
      header: () => (
        <div className="flex w-12 items-center justify-center">
          <Checkbox checked={true} disabled />
        </div>
      ),
      cell: ({ row }: { row: Row<Task> }) => {
        return (
          <div className="flex w-8 items-center justify-center">
            <Checkbox
              checked={row.original.complete}
              onCheckedChange={async () => {
                row.original.complete = true;
                await markTaskComplete(row.original);

                toast("Task has been completed", {
                  description: row.original.title + " - " + row.original.type,
                  action: {
                    label: "Undo",
                    onClick: async () => {
                      await markTaskUncomplete(row.original);
                      if (row.original.reoccurring) {
                        // If repeated task is marked as complete, then undone, delete the newly created repeat
                      }
                      onTaskUpdated();
                    },
                  },
                });
                onTaskUpdated();
              }}
              aria-label="Mark task as complete/incomplete"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: () => <div className="w-min pl-4 text-left">Title</div>,
      cell: ({ row }: { row: Row<Task> }) => {
        const type = row.original.type;
        const title = row.original.title;
        const reoccurring = row.original.reoccurring;
        const reoccurring_interval = row.original.reoccurring_interval;
        const courseCode = row.original.course;
        return (
          <div className="flex items-center gap-3">
            <Badge variant="default" className="">
              {type}
            </Badge>
            {title}
            {courseCode && (
              <span className="rounded-full border border-gray-300 bg-dark/20 px-2 py-0.5 text-xs text-dark">
                {courseCode}
              </span>
            )}
            {reoccurring && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Repeat className="size-4 text-dark/20" />
                    <span>{reoccurring_interval}</span>
                  </Badge>
            )}
          </div>
        );
      },
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "status",
      header: ({ column }: { column: Column<Task> }) => (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 size-4 font-bold" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 size-4 font-bold" />
            ) : (
              <ChevronsUpDown className="ml-2 size-4 font-normal" />
            )}
          </Button>
        </div>
      ),
      cell: ({ row }: { row: Row<Task> }) => {
        const status = row.original.status;
        const Icon = STATUS_ICON_MAP[status as Status];
        return (
          <div className="flex items-center justify-center gap-2 text-center text-dark/70">
            <Icon className="size-4" />
            {status}
          </div>
        );
      },
    },
    {
      accessorKey: "scheduled",
      header: ({ column }: { column: Column<Task> }) => (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Scheduled
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 size-4 font-bold" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 size-4 font-bold" />
            ) : (
              <ChevronsUpDown className="ml-2 size-4 font-normal" />
            )}
          </Button>
        </div>
      ),
      cell: ({ row }: { row: Row<Task> }) => {
        let date = new Date();
        if (row.original.scheduled_date) {
          date = new Date(row.original.scheduled_date);
        } else {
          return <div className="flex justify-center">Not Scheduled</div>;
        }
        const now = new Date();

        let formatted = "Not Scheduled";
        let bgColor = "bg-green-200";

        if (date != null) {
          const diffInDays =
            (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

          // Format the date (e.g., "20 Dec")
          formatted = date.toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            timeZone: "Australia/Sydney",
          });

          if (diffInDays < 0) {
            // date is in the past
            bgColor = "bg-red/80"; // ensure valid Tailwind class
          } else if (diffInDays < 7) {
            // within a week
            bgColor = "bg-yellow"; // ensure valid Tailwind class
          }
        }
        return (
          <div className="flex items-center justify-center space-x-2">
            <div
              className={`w-fit rounded-xl ${bgColor} px-3 py-1 text-center font-medium`}
            >
              {formatted}
            </div>
            {row.original.week && (
              <div className="rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700">
                W{row.original.week}
              </div>
            )}
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        if (!rowA.original.scheduled_date && !rowB.original.scheduled_date) {
          return 0;
        } else if (
          rowA.original.scheduled_date &&
          !rowB.original.scheduled_date
        ) {
          return -1;
        } else if (
          !rowA.original.scheduled_date &&
          rowB.original.scheduled_date
        ) {
          return 1;
        } else if (
          rowA.original.scheduled_date &&
          rowB.original.scheduled_date
        ) {
          const rowADate = new Date(rowA.original.scheduled_date).getTime();
          const rowBDate = new Date(rowB.original.scheduled_date).getTime();

          return rowADate - rowBDate;
        } else {
          return 0;
        }
      },
    },
    {
      accessorKey: "due_date",
      header: ({ column }: { column: Column<Task> }) => (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Due Date
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 size-4 font-bold" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 size-4 font-bold" />
            ) : (
              <ChevronsUpDown className="ml-2 size-4 font-normal" />
            )}
          </Button>
        </div>
      ),
      cell: ({ row }: { row: Row<Task> }) => {
        let date = new Date();
        if (row.original.due_date) {
          date = new Date(row.original.due_date);
        } else {
          return <div className="flex justify-center">-</div>;
        }

        let formatted = "Not Scheduled";


        if (date != null) {

          formatted = date.toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            timeZone: "Australia/Sydney",
          });
        
        }
        return (
          <div className="flex items-center justify-center space-x-2">
            <div
              className={`w-fit rounded-xl bg-dark/20 px-3 py-1 text-center font-medium`}
            >
              {formatted}
            </div>
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        if (!rowA.original.scheduled_date && !rowB.original.scheduled_date) {
          return 0;
        } else if (
          rowA.original.scheduled_date &&
          !rowB.original.scheduled_date
        ) {
          return -1;
        } else if (
          !rowA.original.scheduled_date &&
          rowB.original.scheduled_date
        ) {
          return 1;
        } else if (
          rowA.original.scheduled_date &&
          rowB.original.scheduled_date
        ) {
          const rowADate = new Date(rowA.original.scheduled_date).getTime();
          const rowBDate = new Date(rowB.original.scheduled_date).getTime();

          return rowADate - rowBDate;
        } else {
          return 0;
        }
      },
    },
    {
      accessorKey: "course",
      header: ({ column }: { column: Column<Task> }) => (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Course
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 size-4 font-bold" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 size-4 font-bold" />
            ) : (
              <ChevronsUpDown className="ml-2 size-4 font-normal" />
            )}
          </Button>
        </div>
      ),
      cell: ({ row }: { row: Row<Task> }) => row.original.course ?? "-",
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "week",
      header: ({ column }: { column: Column<Task> }) => (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Week
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 size-4 font-bold" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 size-4 font-bold" />
            ) : (
              <ChevronsUpDown className="ml-2 size-4 font-normal" />
            )}
          </Button>
        </div>
      ),
      cell: ({ row }: { row: Row<Task> }) => row.original.week ?? "-",
      sortingFn: "basic",
    },
    {
      accessorKey: "weight",
      header: () => <div className="flex justify-center px-4">Weight</div>,
      cell: ({ row }: { row: Row<Task> }) => row.original.weight ?? "-",
    },
    {
      accessorKey: "priority",
      header: ({ column }: { column: Column<Task> }) => (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Priority
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 size-4 font-bold" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 size-4 font-bold" />
            ) : (
              <ChevronsUpDown className="ml-2 size-4 font-normal" />
            )}
          </Button>
        </div>
      ),
      cell: ({ row }: { row: Row<Task> }) => {
        const priority = row.original.priority;
        if (priority != null) {
          const Icon = PRIORITY_ICON_MAP[priority as Priority];
          return (
            <div className="flex items-center justify-center gap-2 text-center text-dark/70">
              <Icon className="size-4" />
              {priority}
            </div>
          );
        }
      },
      sortingFn: (rowA, rowB) => {
        const priorityOrder = {
          High: 1,
          Medium: 2,
          Low: 3,
        };

        if (rowA.original.priority && rowB.original.priority) {
          const priorityA = priorityOrder[rowA.original.priority as Priority];
          const priorityB = priorityOrder[rowB.original.priority as Priority];
          return priorityA - priorityB; // Sort in ascending order
        } else {
          return 0;
        }
      },
    },
    {
      accessorKey: "edit",
      header: () => <div></div>,
      cell: ({ row }: { row: Row<Task> }) => {
        return (
          <>
            <EditTaskDialog task={row.original} callback={onTaskUpdated} />
          </>
        );
      },
    },
  ];

  // Return only the columns the current preset wants to see
  return allColumns.filter((col) => visibleColumns.includes(col.accessorKey!));
}
