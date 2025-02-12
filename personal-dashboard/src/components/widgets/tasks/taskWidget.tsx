"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTable } from "./data-table";
import { getColumns } from "./columns";
import SelectTaskFilter, { frameworks } from "./selectTaskFilter"; // updated import
import { Task } from "@/types/task";
import SearchTaskFilter from "./searchTaskFilter";
import SelectDateFilter, { dateFilters } from "./selectDateFilter";

export default function TaskTable({ tasks,onTaskUpdated }: { tasks: Task[],onTaskUpdated:() => void }) {
  const [data, setData] = useState<Task[]>(() => tasks || []);

  useEffect(() => {
    setData(tasks);
  }, [tasks]);

  // ----- Filters -----
  const [dateFilter, setDateFilter] = useState(dateFilters[0]);
  // Holds the current type filter name, e.g. 'Personal', 'Assessment', 'All', etc.
  const [typeFilter, setTypeFilter] = useState("All");

  // ----- Sorting and Table State -----
  const [sorting, setSorting] = useState<SortingState>([
    { id: "scheduled", desc: false },
    { id: "priority", desc: false },
    { id: "title", desc: false },
  ]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // ----- Memoized data -----
  const filteredData = useMemo(() => {
    // 1) Date filter
    let result = data.filter(dateFilter.filter);

    // 2) Type filter
    if (typeFilter && typeFilter !== "All") {
      result = result.filter((task) => task.type === typeFilter);
    }

    return result;
  }, [data, dateFilter, typeFilter]);

  // Create columns (adjust as needed)
  const columns: ColumnDef<Task>[] = useMemo(() => {

      if(typeFilter == "University") {

        return getColumns(frameworks[1].visibleColumns, onTaskUpdated); 
      }

    return getColumns(frameworks[0].visibleColumns, onTaskUpdated);
  }, [typeFilter]);

  // ----- Create the table instance -----
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="mx-auto h-full">
      {/* Top bar with filters */}
      <div className="flex items-end gap-3 py-2">
        <SearchTaskFilter table={table} />

        {/* Date Filter */}
        <SelectDateFilter
          value={dateFilter.value}
          onChange={(value) =>
            setDateFilter(dateFilters.find((f) => f.value === value) || dateFilters[0])
          }
        />

        {/* Type Filter */}
        <SelectTaskFilter
          value={typeFilter}
          onChange={(value) => setTypeFilter(value || "All")}
        />
      </div>

      <DataTable table={table} />
    </div>
  );
}
