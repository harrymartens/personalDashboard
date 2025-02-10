import { Input } from "@/components/ui/input";
import { Task } from "@/types/task";
import type { Table } from "@tanstack/react-table";

interface FilterInputProps {
  table: Table<Task>;
}

export default function SearchTaskFilter({ table }: FilterInputProps) {
  const column = table.getColumn("title");

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    column?.setFilterValue(event.target.value);
  };

  return (
    <div className="flex items-center">
      <Input
        placeholder="Search Tasks..."
        value={(column?.getFilterValue() as string) ?? ""}
        onChange={handleFilterChange}
      />
    </div>
  );
}
