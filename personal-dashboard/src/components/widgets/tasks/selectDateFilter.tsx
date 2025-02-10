import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { Calendar, Check, ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export const dateFilters = [
  {
    label: "Anytime",
    value: "anytime",
    filter: () => true,
  },
  {
    label: "Today",
    value: "today",
    filter: (task: Task) =>
      task.scheduled_date
        ? task.scheduled_date <= new Date().toISOString()
        : null,
  },
  {
    label: "Next 7 Days",
    value: "thisWeek",
    filter: (task: Task) =>
      task.scheduled_date
        ? task.scheduled_date <=
          new Date(new Date().getDate() + 7).toISOString()
        : null,
  },
];

type SelectDateFilterProps = {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
};

export default function SelectDateFilter({
  value,
  onChange,
}: SelectDateFilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="size-min justify-between text-xs"
        >
          <Calendar className=" size-4 opacity-50" />
          {value
            ? dateFilters.find((filter) => filter.value === value)?.label
            : "Select filter..."}
          <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {dateFilters.map((filter) => (
                <CommandItem
                  key={filter.value}
                  value={filter.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === filter.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {filter.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
