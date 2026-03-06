import type { AlertItem, WeightTargetRule } from "@/lib/types";

const parseDateOnly = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

export const formatDateOnly = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getPregnancyDay = (lmpDate: string, now = new Date()) => {
  const lmp = parseDateOnly(lmpDate);
  const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const diffMs = today.getTime() - lmp.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};

export const getWeekAndDay = (pregnancyDay: number) => {
  const normalized = Math.max(1, pregnancyDay);
  const week = Math.floor((normalized - 1) / 7) + 1;
  const day = (normalized - 1) % 7;
  return { week, day };
};

export const getPregnancyMonthApprox = (week: number) => {
  return Math.floor((week - 1) / 4) + 1;
};

export const getExpectedGainRange = (
  elapsedWeeks: number,
  rules: WeightTargetRule[],
) => {
  let minGain = 0;
  let maxGain = 0;

  for (const rule of rules) {
    const start = Math.max(0, rule.start_week - 1);
    const end = Math.min(elapsedWeeks, rule.end_week);

    if (end > start) {
      const coveredWeeks = end - start;
      minGain += coveredWeeks * rule.min_per_week_kg;
      maxGain += coveredWeeks * rule.max_per_week_kg;
    }
  }

  return { minGain, maxGain };
};

export const getDueAlerts = (
  alerts: AlertItem[],
  lmpDate: string,
  now = new Date(),
) => {
  const today = formatDateOnly(now);
  const pregnancyDay = getPregnancyDay(lmpDate, now);
  const { week } = getWeekAndDay(pregnancyDay);
  const month = getPregnancyMonthApprox(week);

  return alerts.filter((alert) => {
    if (!alert.is_active) {
      return false;
    }

    if (alert.trigger_type === "date") {
      return alert.trigger_date === today;
    }

    if (alert.trigger_type === "week") {
      return alert.trigger_value === week;
    }

    if (alert.trigger_type === "month") {
      return alert.trigger_value === month;
    }

    return false;
  });
};
