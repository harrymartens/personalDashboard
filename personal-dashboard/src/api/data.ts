import { Task } from "@/types/task";
import { supabase } from "./supabaseClient";
import { addWeeks } from "date-fns";

export const getTasks = async () => {
  try {
    const { data: Tasks, error } = await supabase.rpc("gettasks");

    if (error) {
      console.error("Error fetching tasks:", error);
      return null;
    }

    return Tasks;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const getTypes = async () => {
  try {
    const { data: Tasks, error } = await supabase
      .from("Task Types")
      .select("name, id")
      .eq("active", "TRUE");

    if (error) {
      console.error("Error fetching tasks:", error);
      return null;
    }

    return Tasks;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const archiveType = async (name: string) => {
  try {
    const { error } = await supabase
      .from("Task Types")
      .update({ active: false })
      .eq("name", name)
      .select();

    if (error) {
      console.error("Error archiving type:", error);
      return null;
    }

    return;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const createType = async ({
  name,
}: {
  name: string;
}): Promise<{ name: string } | null> => {
  try {
    console.log(name);

    return { name };
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const getStatus = async () => {
  try {
    const { data, error } = await supabase
      .from("Task Status")
      .select("name,id");

    if (error) {
      console.error("Error fetching tasks:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const getPriority = async () => {
  try {
    const { data, error } = await supabase
      .from("Task Priority")
      .select("name,id");

    if (error) {
      console.error("Error fetching tasks:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const getSteps = async () => {
  try {
    const { data, error } = await supabase
      .from("healthdata")
      .select("steps")
      .eq("date", new Date().toUTCString());

    if (error) {
      console.error("Error fetching tasks:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const createTask = async (task: Task) => {
  if (task.id) {
    delete task.id;
  }

  try {
    const priorities = (await getPriority()) ?? [];

    const foundPriority = priorities.find(
      (item) => item.name === task.priority
    );

    if (foundPriority) {
      task.priority = foundPriority.id;
    }

    const types = (await getTypes()) ?? [];

    const foundType = types.find((item) => item.name === task.type);
    if (foundType) {
      task.type = foundType.id;
    }

    const status = (await getStatus()) ?? [];

    const foundStatus = status.find((item) => item.name === task.status);
    if (foundStatus) {
      task.status = foundStatus.id;
    }

    console.log("Right before create API", task);

    const { data, error } = await supabase
      .from("Tasks")
      .insert([task])
      .select();

    if (error) {
      console.error("Error fetching tasks:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const markTaskComplete = async (task: Task) => {
  try {
    const { data, error } = await supabase
      .from("Tasks")
      .update({ complete: true })
      .eq("id", task.id)
      .select();

    if (error) {
      console.error("Error fetching tasks:", error);
      return null;
    }

    if (task.reoccurring) {
      task.complete = false;
      const currentDate = task.scheduled_date
        ? new Date(task.scheduled_date)
        : new Date();
      const newScheduledDate = addWeeks(currentDate, task.reoccurring_interval);

      const futureTask: Task = { ...task };

      futureTask.scheduled_date = newScheduledDate.toISOString();


      if(futureTask.week) futureTask.week = futureTask.week+futureTask.reoccurring_interval

      await createTask(futureTask);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const markTaskUncomplete = async (task: Task) => {
  try {
    const { data, error } = await supabase
      .from("Tasks")
      .update({ complete: false })
      .eq("id", task.id)
      .select();

    if (error) {
      console.error("Error fetching tasks:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const setReoccurringFalse = async (task: Task) => {
  try {
    const { data, error } = await supabase
      .from("Tasks")
      .update({ reoccurring: false })
      .eq("id", task.id)
      .select();

    if (error) {
      console.error("Error fetching tasks:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};
