import type { ReactNode } from "react";

type TabType = "pregnancy" | "weight" | "settings";

export interface TabNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export interface PregnancyTabProps {
  pregnancySummary: {
    pregnancyDay: number;
    week: number;
    day: number;
    month: number;
    elapsedWeeks: number;
  } | null;
  expectedRange: {
    minWeight: number;
    maxWeight: number;
    minGain: number;
    maxGain: number;
  } | null;
  latestWeight: { weight_kg: number; date: string } | null;
  pregnancyDate: string;
  dueDate: string | null;
  onPregnancyDateChange: (date: string) => void;
}

export interface WeightTabProps {
  pregnancySummary: {
    pregnancyDay: number;
    week: number;
    day: number;
    month: number;
    elapsedWeeks: number;
  } | null;
  baseline: number | null;
  weightLogs: any[];
  chartData: any[];
  weightDate: string;
  weightKg: string;
  weightNote: string;
  expectedRange: {
    minWeight: number;
    maxWeight: number;
    minGain: number;
    maxGain: number;
  } | null;
  onWeightDateChange: (date: string) => void;
  onWeightKgChange: (kg: string) => void;
  onWeightNoteChange: (note: string) => void;
  onAddWeightLog: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
}

export interface SettingsTabProps {
  settings: any;
  lmpDate: string;
  dueDate: string;
  baselineWeight: string;
  timezone: string;
  rules: any[];
  alerts: any[];
  ruleStartWeek: string;
  ruleEndWeek: string;
  ruleMin: string;
  ruleMax: string;
  alertType: "date" | "week" | "month";
  alertDate: string;
  alertValue: string;
  alertTitle: string;
  alertMessage: string;
  onLmpDateChange: (date: string) => void;
  onDueDateChange: (date: string) => void;
  onBaselineWeightChange: (weight: string) => void;
  onTimezoneChange: (tz: string) => void;
  onRuleStartWeekChange: (week: string) => void;
  onRuleEndWeekChange: (week: string) => void;
  onRuleMinChange: (min: string) => void;
  onRuleMaxChange: (max: string) => void;
  onAlertTypeChange: (type: "date" | "week" | "month") => void;
  onAlertDateChange: (date: string) => void;
  onAlertValueChange: (value: string) => void;
  onAlertTitleChange: (title: string) => void;
  onAlertMessageChange: (msg: string) => void;
  onSaveSettings: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
  onAddRule: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
  onAddAlert: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void;
}
