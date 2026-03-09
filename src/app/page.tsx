"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  getDueAlerts,
  getExpectedGainRange,
  getPregnancyDay,
  getPregnancyMonthApprox,
  getWeekAndDay,
} from "@/lib/pregnancy";
import { getSupabaseClient } from "@/lib/supabase/client";
import type {
  AlertItem,
  PregnancySettings,
  WeightLog,
  WeightTargetRule,
} from "@/lib/types";
import PregnancyTab from "./components/PregnancyTab";
import WeightTab from "./components/WeightTab";
import SettingsTab from "./components/SettingsTab";
import TabNavigation from "./components/TabNavigation";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

// Fixed user ID for single-user personal app (no auth needed)
const USER_ID = "00000000-0000-0000-0000-000000000001";

type AlertTriggerType = "date" | "week" | "month";
type TabType = "pregnancy" | "weight" | "settings";

const todayIso = new Date().toISOString().slice(0, 10);

export default function HomePage() {
  const supabase = typeof window !== "undefined" ? getSupabaseClient() : null;
  const db: any = supabase;

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("pregnancy");
  const [pregnancyDate, setPregnancyDate] = useState(todayIso);

  const [settings, setSettings] = useState<PregnancySettings | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [rules, setRules] = useState<WeightTargetRule[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const [lmpDate, setLmpDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [baselineWeight, setBaselineWeight] = useState<string>("");
  const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh");

  const [weightDate, setWeightDate] = useState(todayIso);
  const [weightKg, setWeightKg] = useState("");
  const [weightNote, setWeightNote] = useState("");

  const [ruleStartWeek, setRuleStartWeek] = useState("14");
  const [ruleEndWeek, setRuleEndWeek] = useState("20");
  const [ruleMin, setRuleMin] = useState("0.4");
  const [ruleMax, setRuleMax] = useState("0.5");

  const [alertType, setAlertType] = useState<AlertTriggerType>("week");
  const [alertDate, setAlertDate] = useState(todayIso);
  const [alertValue, setAlertValue] = useState("20");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  // Load all data on mount
  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const settingsRes = await db
          .from("pregnancy_settings")
          .select("user_id, lmp_date, due_date, baseline_weight_kg, timezone")
          .eq("user_id", USER_ID)
          .maybeSingle();

        const settingsData = settingsRes.data as PregnancySettings | null;
        if (settingsData) {
          setSettings(settingsData);
          setLmpDate(settingsData.lmp_date);
          setDueDate(settingsData.due_date || "");
          setBaselineWeight(
            settingsData.baseline_weight_kg !== null
              ? String(settingsData.baseline_weight_kg)
              : "",
          );
          setTimezone(settingsData.timezone || "Asia/Ho_Chi_Minh");
        }

        const logsRes = await db
          .from("weight_logs")
          .select("id, user_id, date, weight_kg, note, created_at")
          .eq("user_id", USER_ID)
          .order("date", { ascending: true });

        setWeightLogs((logsRes.data || []) as WeightLog[]);

        const rulesRes = await db
          .from("weight_target_rules")
          .select(
            "id, user_id, start_week, end_week, min_per_week_kg, max_per_week_kg, created_at",
          )
          .eq("user_id", USER_ID)
          .order("start_week", { ascending: true });

        setRules((rulesRes.data || []) as WeightTargetRule[]);

        const alertsRes = await db
          .from("alerts")
          .select(
            "id, user_id, trigger_type, trigger_date, trigger_value, title, message, is_active, created_at",
          )
          .eq("user_id", USER_ID)
          .order("created_at", { ascending: false });

        setAlerts((alertsRes.data || []) as AlertItem[]);
      } catch (err) {
        console.error("Load error:", err);
        setNotice(
          "Không thể tải dữ liệu. Kiểm tra kết nối Supabase và schema.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [db]);

  const pregnancySummary = useMemo(() => {
    if (!settings?.lmp_date) {
      return null;
    }

    const pregnancyDay = getPregnancyDay(settings.lmp_date, new Date(pregnancyDate));
    const { week, day } = getWeekAndDay(pregnancyDay);
    const elapsedWeeks = (pregnancyDay - 1) / 7;
    const month = getPregnancyMonthApprox(week);

    return { pregnancyDay, week, day, elapsedWeeks, month };
  }, [settings, pregnancyDate]);

  const baseline = useMemo(() => {
    if (
      settings?.baseline_weight_kg !== null &&
      settings?.baseline_weight_kg !== undefined
    ) {
      return settings.baseline_weight_kg;
    }

    if (weightLogs.length > 0) {
      return weightLogs[0].weight_kg;
    }

    return null;
  }, [settings, weightLogs]);

  const latestWeight = useMemo(() => {
    if (weightLogs.length === 0) {
      return null;
    }

    return weightLogs[weightLogs.length - 1];
  }, [weightLogs]);

  const expectedRange = useMemo(() => {
    if (!pregnancySummary || baseline === null) {
      return null;
    }

    const gainRange = getExpectedGainRange(
      pregnancySummary.elapsedWeeks,
      rules,
    );
    return {
      minWeight: baseline + gainRange.minGain,
      maxWeight: baseline + gainRange.maxGain,
      minGain: gainRange.minGain,
      maxGain: gainRange.maxGain,
    };
  }, [pregnancySummary, baseline, rules]);

  const dueAlerts = useMemo(() => {
    if (!settings?.lmp_date) {
      return [];
    }

    return getDueAlerts(alerts, settings.lmp_date);
  }, [alerts, settings]);

  const chartData = useMemo(() => {
    if (!settings?.lmp_date || baseline === null) {
      return [];
    }

    return weightLogs.map((log) => {
      const day = getPregnancyDay(settings.lmp_date, new Date(log.date));
      const elapsedWeeks = (day - 1) / 7;
      const gain = getExpectedGainRange(elapsedWeeks, rules);
      return {
        date: log.date,
        actual: log.weight_kg,
        expectedMin: baseline + gain.minGain,
        expectedMax: baseline + gain.maxGain,
      };
    });
  }, [settings, baseline, rules, weightLogs]);

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db) {
      return;
    }

    const parsedBaseline = baselineWeight
      ? Number.parseFloat(baselineWeight)
      : null;

    const { error } = await db.from("pregnancy_settings").upsert(
      {
        user_id: USER_ID,
        lmp_date: lmpDate,
        due_date: dueDate || null,
        baseline_weight_kg: Number.isNaN(parsedBaseline)
          ? null
          : parsedBaseline,
        timezone,
      },
      { onConflict: "user_id" },
    );

    if (error) {
      setNotice(`Lưu thiết lập thất bại: ${error.message}`);
      return;
    }

    setSettings({
      user_id: USER_ID,
      lmp_date: lmpDate,
      due_date: dueDate || null,
      baseline_weight_kg: Number.isNaN(parsedBaseline)
        ? null
        : parsedBaseline,
      timezone,
    });
    setNotice("Đã lưu thiết lập thai kỳ.");
  };

  const addWeightLog = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db) {
      return;
    }

    const parsedWeight = Number.parseFloat(weightKg);
    if (Number.isNaN(parsedWeight)) {
      setNotice("Cân nặng không hợp lệ.");
      return;
    }

    const { error } = await db.from("weight_logs").insert({
      user_id: USER_ID,
      date: weightDate,
      weight_kg: parsedWeight,
      note: weightNote || null,
    });

    if (error) {
      setNotice(`Thêm cân nặng thất bại: ${error.message}`);
      return;
    }

    setWeightKg("");
    setWeightNote("");
    setNotice("Đã thêm cân nặng.");

    const logsRes = await db
      .from("weight_logs")
      .select("id, user_id, date, weight_kg, note, created_at")
      .eq("user_id", USER_ID)
      .order("date", { ascending: true });

    setWeightLogs((logsRes.data || []) as WeightLog[]);
  };

  const updateWeightLog = async (
    id: string,
    payload: { date: string; weight_kg: number; note: string | null },
  ) => {
    if (!db) {
      return;
    }

    const { error } = await db
      .from("weight_logs")
      .update({
        date: payload.date,
        weight_kg: payload.weight_kg,
        note: payload.note,
      })
      .eq("id", id)
      .eq("user_id", USER_ID);

    if (error) {
      setNotice(`Cập nhật cân nặng thất bại: ${error.message}`);
      return;
    }

    const logsRes = await db
      .from("weight_logs")
      .select("id, user_id, date, weight_kg, note, created_at")
      .eq("user_id", USER_ID)
      .order("date", { ascending: true });

    setWeightLogs((logsRes.data || []) as WeightLog[]);
    setNotice("Đã cập nhật bản ghi cân nặng.");
  };

  const deleteWeightLog = async (id: string) => {
    if (!db) {
      return;
    }

    const { error } = await db
      .from("weight_logs")
      .delete()
      .eq("id", id)
      .eq("user_id", USER_ID);

    if (error) {
      setNotice(`Xóa cân nặng thất bại: ${error.message}`);
      return;
    }

    const logsRes = await db
      .from("weight_logs")
      .select("id, user_id, date, weight_kg, note, created_at")
      .eq("user_id", USER_ID)
      .order("date", { ascending: true });

    setWeightLogs((logsRes.data || []) as WeightLog[]);
    setNotice("Đã xóa bản ghi cân nặng.");
  };

  const addRule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db) {
      return;
    }

    const start = Number.parseInt(ruleStartWeek, 10);
    const end = Number.parseInt(ruleEndWeek, 10);
    const min = Number.parseFloat(ruleMin);
    const max = Number.parseFloat(ruleMax);

    if ([start, end, min, max].some((value) => Number.isNaN(value))) {
      setNotice("Rule tăng cân không hợp lệ.");
      return;
    }

    const { error } = await db.from("weight_target_rules").insert({
      user_id: USER_ID,
      start_week: start,
      end_week: end,
      min_per_week_kg: min,
      max_per_week_kg: max,
    });

    if (error) {
      setNotice(`Thêm rule thất bại: ${error.message}`);
      return;
    }

    setNotice("Đã thêm rule tăng cân.");

    const rulesRes = await db
      .from("weight_target_rules")
      .select(
        "id, user_id, start_week, end_week, min_per_week_kg, max_per_week_kg, created_at",
      )
      .eq("user_id", USER_ID)
      .order("start_week", { ascending: true });

    setRules((rulesRes.data || []) as WeightTargetRule[]);
  };

  const addAlert = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db) {
      return;
    }

    const payload: {
      user_id: string;
      trigger_type: AlertTriggerType;
      trigger_date: string | null;
      trigger_value: number | null;
      title: string;
      message: string;
      is_active: boolean;
    } = {
      user_id: USER_ID,
      trigger_type: alertType,
      trigger_date: null,
      trigger_value: null,
      title: alertTitle || "Nhớ kiểm tra",
      message: alertMessage || "",
      is_active: true,
    };

    if (alertType === "date") {
      payload.trigger_date = alertDate;
    } else {
      const value = Number.parseInt(alertValue, 10);
      if (Number.isNaN(value)) {
        setNotice("Giá trị cảnh báo không hợp lệ.");
        return;
      }
      payload.trigger_value = value;
    }

    const { error } = await db.from("alerts").insert(payload);

    if (error) {
      setNotice(`Thêm cảnh báo thất bại: ${error.message}`);
      return;
    }

    setNotice("Đã thêm cảnh báo.");

    const alertsRes = await db
      .from("alerts")
      .select(
        "id, user_id, trigger_type, trigger_date, trigger_value, title, message, is_active, created_at",
      )
      .eq("user_id", USER_ID)
      .order("created_at", { ascending: false });

    setAlerts((alertsRes.data || []) as AlertItem[]);
  };

  if (loading) {
    return (
      <main>
        <div className="card">⏳ Đang tải...</div>
      </main>
    );
  }

  return (
    <>
      <main style={{ paddingBottom: 100 }}>
        {/* Header */}
        <section className="card" style={{ marginBottom: 16 }}>
          <h1 style={{ margin: 0, marginBottom: 4 }}>🤰 Pregnancy Care</h1>
          <p className="small" style={{ margin: 0 }}>
            Công cụ theo dõi thai kỳ cá nhân
          </p>
        </section>

        {/* Notice */}
        {notice && (
          <section className="card" style={{ marginBottom: 16, background: "#dff4e8", borderColor: "#64af83" }}>
            <p className="small">{notice}</p>
          </section>
        )}

        {/* Due Alerts Banner */}
        {dueAlerts.length > 0 && (
          <section style={{ marginBottom: 16 }}>
            {dueAlerts.map((item) => (
              <div key={item.id} className="alert" style={{ marginBottom: 8 }}>
                <p style={{ fontWeight: 700, margin: 0, marginBottom: 4 }}>
                  🔔 {item.title}
                </p>
                <p className="small" style={{ margin: 0 }}>
                  {item.message || "Không có ghi chú"}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Tab Content */}
        {activeTab === "pregnancy" && (
          <PregnancyTab
            pregnancySummary={pregnancySummary}
            expectedRange={expectedRange}
            latestWeight={latestWeight}
            pregnancyDate={pregnancyDate}
            dueDate={dueDate}
            onPregnancyDateChange={setPregnancyDate}
          />
        )}

        {activeTab === "weight" && (
          <WeightTab
            pregnancySummary={pregnancySummary}
            baseline={baseline}
            weightLogs={weightLogs}
            chartData={chartData}
            weightDate={weightDate}
            weightKg={weightKg}
            weightNote={weightNote}
            expectedRange={expectedRange}
            onWeightDateChange={setWeightDate}
            onWeightKgChange={setWeightKg}
            onWeightNoteChange={setWeightNote}
            onAddWeightLog={addWeightLog}
            onUpdateWeightLog={updateWeightLog}
            onDeleteWeightLog={deleteWeightLog}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab
            settings={settings}
            lmpDate={lmpDate}
            dueDate={dueDate}
            baselineWeight={baselineWeight}
            timezone={timezone}
            rules={rules}
            alerts={alerts}
            ruleStartWeek={ruleStartWeek}
            ruleEndWeek={ruleEndWeek}
            ruleMin={ruleMin}
            ruleMax={ruleMax}
            alertType={alertType}
            alertDate={alertDate}
            alertValue={alertValue}
            alertTitle={alertTitle}
            alertMessage={alertMessage}
            onLmpDateChange={setLmpDate}
            onDueDateChange={setDueDate}
            onBaselineWeightChange={setBaselineWeight}
            onTimezoneChange={setTimezone}
            onRuleStartWeekChange={setRuleStartWeek}
            onRuleEndWeekChange={setRuleEndWeek}
            onRuleMinChange={setRuleMin}
            onRuleMaxChange={setRuleMax}
            onAlertTypeChange={setAlertType}
            onAlertDateChange={setAlertDate}
            onAlertValueChange={setAlertValue}
            onAlertTitleChange={setAlertTitle}
            onAlertMessageChange={setAlertMessage}
            onSaveSettings={saveSettings}
            onAddRule={addRule}
            onAddAlert={addAlert}
          />
        )}
      </main>

      {/* Bottom Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </>
  );
}
