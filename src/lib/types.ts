export type PregnancySettings = {
  user_id: string;
  lmp_date: string;
  due_date: string | null;
  baseline_weight_kg: number | null;
  timezone: string;
};

export type WeightLog = {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number;
  note: string | null;
  created_at: string;
};

export type WeightTargetRule = {
  id: string;
  user_id: string;
  start_week: number;
  end_week: number;
  min_per_week_kg: number;
  max_per_week_kg: number;
  created_at: string;
};

export type AlertItem = {
  id: string;
  user_id: string;
  trigger_type: "date" | "week" | "month";
  trigger_date: string | null;
  trigger_value: number | null;
  title: string;
  message: string;
  is_active: boolean;
  created_at: string;
};
