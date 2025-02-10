import { increaseHabit } from "@/api";
import { Button } from "@/components/ui/button";
import { Habit } from "@/types/habit";
import { Plus } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

export default function HabitTrackerColumns({
  data,
  callback,
}: {
  data: Habit[];
  callback: () => void;
}) {
  async function handleIncrement(habit_name: string) {
    try {
      const result = await increaseHabit(habit_name);
      if (!result) {
        callback();
      } else {
        console.error("Failed to increment Habit");
      }
    } catch (error) {
      console.error("Unexpected error incrementing Habit:", error);
    }
  }

  return (
    <div className="flex w-full flex-nowrap justify-center gap-4 overflow-x-auto">
      {data.map((habit) => {
        // Calculate fill percentage
        const fillPercentage = (habit.current_progress / habit.target) * 100;

        return (
          <div key={habit.name} className="flex flex-col items-center">
            {/* Progress bar container */}
            <div className="relative mb-2 h-40 w-7 overflow-hidden rounded-lg bg-dark/20">
              {/* Filled portion */}
              <div
                className="absolute bottom-0 w-full transition-[height] duration-300 ease-in"
                style={{
                  height: `${fillPercentage}%`,
                  backgroundColor:
                    fillPercentage === 100 ? "#22c55e" : habit.colour,
                }}
              />

              <div className="absolute bottom-1 z-10 flex w-full flex-col items-center justify-center gap-2  text-dark/70">
                <span className="origin-center -rotate-90 text-sm font-semibold">
                  {habit.current_progress}/{habit.target}
                </span>

                <HoverCard openDelay={200} closeDelay={100}>
                  <HoverCardTrigger>
                    <div className="flex size-6 items-center justify-center rounded-sm bg-dark/20">
                      <habit.icon className="size-4 text-dark" />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="m-0 flex w-min items-center justify-center rounded-full p-0 text-xs">
                    <Badge variant={"default"}>
                        {habit.name}
                    </Badge>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>

            {/* Increment button */}
            {fillPercentage != 100 ? (
              <Button
                onClick={() => handleIncrement(habit.name)}
                className="flex size-6 items-center justify-center rounded bg-dark text-white hover:bg-red"
              >
                <Plus />
              </Button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
