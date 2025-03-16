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

async function mapTypeToId(type: string): Promise<number> {
  const types = (await getTypes()) ?? [];

  const foundType = types.find((item) => item.name === type);

  if (foundType) {
    return foundType.id;
  } else {
    return 1;
  }
}

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

async function mapStatusToId(status: string): Promise<number> {
  const statuses = (await getStatus()) ?? [];

  const foundStatus = statuses.find((item) => item.name === status);

  if (foundStatus) {
    return foundStatus.id;
  } else {
    return 1;
  }
}

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

async function mapPriorityToId(priority: string): Promise<number> {
  const priorities = (await getPriority()) ?? [];

  const foundPriority = priorities.find((item) => item.name === priority);

  if (foundPriority) {
    return foundPriority.id;
  } else {
    return 1;
  }
}

export const createTask = async (task: Task) => {
  if (task.id) {
    delete task.id;
  }

  try {
    task.type = (await mapTypeToId(task.type)).toString();
    task.priority = (await mapPriorityToId(task.priority)).toString();
    task.status = (await mapStatusToId(task.status)).toString();

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

export const updateTask = async (task: Task) => {
  try {
    const { id, ...updatedFields } = task;

    updatedFields.type = (await mapTypeToId(updatedFields.type)).toString()
    updatedFields.status = (await mapStatusToId(updatedFields.status)).toString()
    updatedFields.priority = (await mapPriorityToId(updatedFields.priority)).toString()


    const { data, error } = await supabase
      .from("Tasks")
      .update(updatedFields)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating task:", error);
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

      if (futureTask.week)
        futureTask.week = futureTask.week + futureTask.reoccurring_interval;

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
