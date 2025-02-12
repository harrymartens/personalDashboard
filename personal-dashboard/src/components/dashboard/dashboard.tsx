// import CalendarWidget from "@/app/components/widgets/calendarWidget";

// Edit Tasks Button api
// Delete remove reoccurring
// Coloured course codes in tasks
// Change quote font
// Make Goals adjustable
// Make Habits Adjustable

import TaskTable from "@/components/widgets/tasks/taskWidget";
import { Footprints, Calendar } from "lucide-react";
import WeatherWidget from "../widgets/weather";
import Goals from "../widgets/motivation/goals";
import { useState, useEffect, useCallback } from "react";
import { getSteps, getTasks } from "@/api";
import { Task } from "@/types/task";
import HealthWidget from "../widgets/health/healthWidget";
import HabitTrackerWidget from "../widgets/habits/habitTrackerWidget";
import CreateTaskDialog from "../dialogs/taskDialog/createTaskDialog";

const today = new Date();
const year = today.getFullYear();
const quarter = Math.floor((today.getMonth() + 3) / 3);
const EOQ = new Date(year, quarter * 3, 0);
const daysRemaining = EOQ.getTime() - today.getTime();
const oneDayInMs = 24 * 60 * 60 * 1000;
const diffInDays = Math.ceil(daysRemaining / oneDayInMs);

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [steps, setSteps] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      if (response) {
        setTasks(response as Task[]);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskChange = useCallback(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchHealthData = async () => {
      setLoading(true);
      try {
        const response = await getSteps();
        if (response) {
          const stepCount = response[0].steps;
          const formattedCount = stepCount.toLocaleString();
          setSteps(formattedCount);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Row 1: 3 columns total. First widget spans 2 columns, second widget 1 column */}
      <div className="grid grid-cols-3 gap-4">
        {/* Top BUBBLE */}
        <div className="col-span-2 flex flex-col gap-4">
          <div className="flex grow justify-around  rounded-xl bg-light">
            <WeatherWidget />

            <div className="flex flex-row items-center gap-4">
              <Footprints className="size-10" />
              <div className="flex flex-col">
                <div>
                  {loading ? <a>...</a> : <a>{steps}</a>}
                  <a className="text-xs"> / 10,000</a>
                </div>
                <a className="text-sml font-light">Steps</a>
              </div>
            </div>

            <div className="flex flex-row items-center gap-4">
              <Calendar className="size-10" />
              <div className="flex flex-col">
                <a className="">{diffInDays}</a>
                <a className="text-sml font-light">Days Left</a>
              </div>
            </div>
          </div>

          {/* Task Widget */}
          <div className="col-span-2 h-[500px]  rounded-xl bg-light p-8 shadow">
            {/* HEADING */}
            <div className="flex items-center justify-between ">
              <a className="text-lrg font-semibold">Tasks</a>

              <CreateTaskDialog callback={handleTaskChange}/>
            </div>

            {/* TABLE */}
            <TaskTable tasks={tasks} onTaskUpdated={handleTaskChange} />
          </div>
        </div>

        <div className="col-span-1 rounded-xl bg-gradient-to-b from-dark to-dark/90 p-4 shadow">
          <Goals />
        </div>
      </div>

      {/* Row 2: 3 columns total, each widget takes one column */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-light p-4 shadow">
          {/* Widget C */}
          <HealthWidget />
        </div>
        <div className="rounded-xl bg-light p-4 shadow">
          {/* Widget D */}
          <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100">
            Finance
          </div>
        </div>
        <div className="rounded-xl bg-light p-4 shadow">
          {/* Widget E */}
          <HabitTrackerWidget />
        </div>
      </div>

      {/* Row 3: Single widget spanning full width */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 rounded-xl bg-light p-4 shadow">
          {/* Widget F */}
          <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100">
            Home Automations
          </div>
        </div>
      </div>

      {/* Add more rows and widgets as needed */}
    </div>
  );
}
