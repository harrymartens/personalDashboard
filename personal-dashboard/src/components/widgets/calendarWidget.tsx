import React from "react";
import { Calendar } from "@/app/components/ui/calendar";

export default function CalendarWidget() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="size-full"> {/* Ensure the wrapper is full-size */}
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className=" inline size-full rounded-md border"
      />
    </div>
  );
}
