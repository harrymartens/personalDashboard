import { supabase } from "./supabaseClient";

export const getSteps = async () => {
  try {
    const { data, error } = await supabase
      .from("healthdata")
      .select("steps")
      .eq("date", new Date().toDateString());

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

export const getWeight = async () => {
  try {

    const today = new Date()

    today.setDate(today.getDate()-14)

    const { data, error } = await supabase
      .from("healthdata")
      .select("weight,date")
      .gte("date", today.toDateString());

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

export const getSleepDuration = async () => {
  try {
    const { data, error } = await supabase
      .from("healthdata")
      .select("sleep, sleep_awake, sleep_core, sleep_rem, sleep_deep")
      .eq("date", new Date().toDateString());

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