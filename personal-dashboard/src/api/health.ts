import { supabase } from "./supabaseClient";

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