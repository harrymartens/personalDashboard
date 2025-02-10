import { useCallback, useEffect, useState } from "react";
import { RadialHabitChart } from "./radialHabitChart";
import { Habit } from "@/types/habit";
import HabitTrackerColumns from "./habitTrackerColumns";
import { getHabits } from "@/api";
import * as Icons from 'lucide-react'; // Import all icons


export default function HabitTrackerWidget() {
  const [habits, setHabits] = useState<Habit[]>([]);

  const fetchHabits = async () => {
    try {
      const response = await getHabits();
      if (response) {
        const updatedHabits = response.map((habit) => {
          const IconComponent = Icons[habit.icon as keyof typeof Icons] || Icons.HelpCircle;

          return {
            ...habit,
            icon: IconComponent || Icons.CircleCheckBig,
          };
        });

        setHabits(updatedHabits as Habit[]);
      }
    } catch (err) {
      console.error("Error fetching habits:", err);
    }
  };

  useEffect(() => {
      fetchHabits();
    }, []);

  const handleHabitChange = useCallback(
    () => {
      fetchHabits()
    },[]
  ) 

  return (
    <div className="flex flex-col gap-4">
      <a className="text-med font-semibold">Habit Tracker</a>
      <div className="flex flex-row items-center justify-around gap-4">
        <RadialHabitChart data={habits} />

        <HabitTrackerColumns data={habits} callback={handleHabitChange} />
      </div>
    </div>
  );
}
