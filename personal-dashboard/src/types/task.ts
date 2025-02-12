// src/types/task.ts


// Update the Task interface to use these types
export interface Task {
  id?: number ;
  title: string;
  type: string;
  created_at: string;
  status: string;
  complete: boolean;
  reoccurring: boolean;
  reoccurring_interval: number;
  completed_date: string | null;
  priority: string;
  scheduled_date: string | null;
  course: string | null;
  due_date: string | null;
  week: number | null;
  weight: number | null;
}
