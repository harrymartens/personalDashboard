import { supabase } from "./supabaseClient";

export const getHabits = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  const mondayStr = monday.toISOString().split("T")[0];

  try {
    // eslint-disable-next-line prefer-const
    let { data: habits, error } = await supabase
      .from("Habits")
      .select("*")
      .eq("week", mondayStr);

    if (error) {
      console.error("Error fetching habits:", error);
      return null;
    }

    if (!habits || habits.length === 0) {
      const lastMonday = new Date(monday);
      lastMonday.setDate(lastMonday.getDate() - 7);
      const lastMondayStr = lastMonday.toISOString().split("T")[0];

      try {
        const { error: duplicateError } = await supabase.rpc("duplicate_habits", {
          old_week: lastMondayStr,
          new_week: mondayStr,
        });

        if (duplicateError) {
          console.error("Error duplicating habits:", duplicateError);
          return null;
        }
      } catch (err) {
        console.error("Can't call duplicate_habits:", err);
        return null;
      }

      // Now fetch again after duplication
      const { data: newHabits, error: fetchNewError } = await supabase
        .from("Habits")
        .select("*")
        .eq("week", mondayStr);

      if (fetchNewError) {
        console.error("Error fetching newly created habits:", fetchNewError);
        return null;
      }

      habits = newHabits;
    }

    habits.sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });

    return habits;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

export const increaseHabit = async (habit_name: string) => {
  try {
    const { data, error } = await supabase.rpc("incrementhabit", {
      row_name: habit_name,
    });

    if (error) {
      console.error("Error increasing Habit:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};
