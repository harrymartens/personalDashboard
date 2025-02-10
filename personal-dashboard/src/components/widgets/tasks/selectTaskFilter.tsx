import { Check, ChevronDown, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { getTypes, archiveType } from "@/api"; // Make sure you implement deleteType in your API
import { Task } from "@/types/task";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const frameworks = [
  {
    value: "allTasks",
    label: "All Tasks",
    visibleColumns: ["complete", "title", "status", "scheduled", "priority", "edit"],
    filter: (_task: Task) => _task != null,
  },
  {
    value: "universityTasks",
    label: "University Tasks",
    visibleColumns: [
      "complete",
      "title",
      "scheduled",
      "course",
      "week",
      "weight",
      "edit"
    ],
  },
];

export default function SelectTaskFilter({
  value,
  onChange,
}: {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [types, setTypes] = useState<{ name: string }[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        let fetched = await getTypes();
        if (!fetched) {
          fetched = [];
        }
        const allOption = { name: "All" };
        setTypes([allOption, ...fetched]);
      } catch (err) {
        console.error("Error fetching types:", err);
      }
    };
    fetchTypes();
  }, []);

  const handleDeleteType = async () => {
    if (!typeToDelete) return;
    try {
      await archiveType(typeToDelete);
      setTypes((prev) => prev.filter((type) => type.name !== typeToDelete));
      if (value === typeToDelete) {
        onChange("");
      }
      setDialogOpen(false);
      setTypeToDelete(null);
    } catch (err) {
      console.error("Error deleting type:", err);
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="size-min justify-between text-xs"
          >
            <Tag className="size-4 shrink-0 opacity-50" />
            {value || "Select type..."}
            <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No type found.</CommandEmpty>
              <CommandGroup>
                {types.map((type) => (
                  <CommandItem
                    key={type.name}
                    value={type.name}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <div className="group flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === type.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {type.name}
                      </div>
                      <Button
                        className="size-5 p-0 opacity-0 transition-opacity delay-500 duration-200 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTypeToDelete(type.name);
                          setDialogOpen(true);
                        }}
                      >
                        <X className="size-4 cursor-pointer" />
                      </Button>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Global confirmation dialog for deletion */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the type {typeToDelete}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteType}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
