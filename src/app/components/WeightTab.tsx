import {
  FormEvent,
  useMemo,
  useState,
} from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeightTabProps } from "@/lib/components.types";

export default function WeightTab({
  baseline,
  weightLogs,
  chartData,
  weightDate,
  weightKg,
  weightNote,
  expectedRange,
  onWeightDateChange,
  onWeightKgChange,
  onWeightNoteChange,
  onAddWeightLog,
  onUpdateWeightLog,
  onDeleteWeightLog,
}: WeightTabProps) {
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState("");
  const [editingKg, setEditingKg] = useState("");
  const [editingNote, setEditingNote] = useState("");

  const recentLogs = useMemo(() => weightLogs.slice(-10).reverse(), [weightLogs]);

  const startEdit = (log: { id: string; date: string; weight_kg: number; note: string | null }) => {
    setEditingLogId(log.id);
    setEditingDate(log.date);
    setEditingKg(String(log.weight_kg));
    setEditingNote(log.note || "");
  };

  const cancelEdit = () => {
    setEditingLogId(null);
    setEditingDate("");
    setEditingKg("");
    setEditingNote("");
  };

  const submitEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingLogId) {
      return;
    }

    const parsedWeight = Number.parseFloat(editingKg);
    if (Number.isNaN(parsedWeight)) {
      return;
    }

    await onUpdateWeightLog(editingLogId, {
      date: editingDate,
      weight_kg: parsedWeight,
      note: editingNote.trim() ? editingNote.trim() : null,
    });

    cancelEdit();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa bản ghi cân nặng này?")) {
      return;
    }

    await onDeleteWeightLog(id);

    if (editingLogId === id) {
      cancelEdit();
    }
  };

  const preferredMinWeight = 48;
  const preferredMaxWeight = 80;

  const chartWeights = chartData
    .flatMap((item) => [item.actual, item.expectedMin, item.expectedMax])
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  const rawMinWeight =
    chartWeights.length > 0 ? Math.min(preferredMinWeight, ...chartWeights) : preferredMinWeight;
  const rawMaxWeight =
    chartWeights.length > 0 ? Math.max(preferredMaxWeight, ...chartWeights) : preferredMaxWeight;

  const yAxisMin = Math.max(40, Math.floor((rawMinWeight - 1) / 2) * 2);
  const yAxisMax = Math.ceil((rawMaxWeight + 1) / 2) * 2;
  const yAxisTicks = Array.from(
    { length: Math.floor((yAxisMax - yAxisMin) / 2) + 1 },
    (_, index) => yAxisMin + index * 2,
  );

  const weightWarning =
    weightLogs.length > 0 && expectedRange
      ? weightLogs[weightLogs.length - 1].weight_kg < expectedRange.minWeight
        ? `⚠️ Cân nặng thấp hơn mục tiêu`
        : weightLogs[weightLogs.length - 1].weight_kg > expectedRange.maxWeight
          ? `⚠️ Cân nặng cao hơn mục tiêu`
          : "✅ Cân nặng đạt mục tiêu"
      : "";

  return (
    <div className="grid" style={{ gap: 16 }}>
      {/* Input Form */}
      <div className="card">
        <h2>📝 Nhập cân nặng</h2>
        <form onSubmit={onAddWeightLog} className="grid">
          <div>
            <label className="label">Ngày</label>
            <input
              type="date"
              required
              value={weightDate}
              onChange={(e) => onWeightDateChange(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label className="label">Cân nặng (kg)</label>
            <input
              type="number"
              step="0.1"
              required
              value={weightKg}
              onChange={(e) => onWeightKgChange(e.target.value)}
              placeholder="Ví dụ: 55.5"
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label className="label">Ghi chú (tùy chọn)</label>
            <textarea
              value={weightNote}
              onChange={(e) => onWeightNoteChange(e.target.value)}
              placeholder="Ví dụ: cân sáng, không ăn gì"
              rows={2}
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit">✅ Thêm bản ghi</button>
        </form>
      </div>

      {/* Weight Status */}
      {weightWarning && (
        <div className="alert">
          <p className="small">{weightWarning}</p>
        </div>
      )}

      {/* Recent Weight Logs */}
      <div className="card">
        <h2>📚 Lịch sử cân nặng gần đây</h2>
        {weightLogs.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Kg</th>
                  <th>Ghi chú</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id}>
                    {editingLogId === log.id ? (
                      <>
                        <td>
                          <input
                            type="date"
                            value={editingDate}
                            onChange={(e) => setEditingDate(e.target.value)}
                            style={{ width: "100%", minWidth: 120 }}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.1"
                            value={editingKg}
                            onChange={(e) => setEditingKg(e.target.value)}
                            style={{ width: "100%", minWidth: 80 }}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editingNote}
                            onChange={(e) => setEditingNote(e.target.value)}
                            style={{ width: "100%", minWidth: 140 }}
                            placeholder="Ghi chú"
                          />
                        </td>
                        <td>
                          <form onSubmit={submitEdit} style={{ display: "flex", gap: 8 }}>
                            <button type="submit" style={{ padding: "6px 10px" }}>
                              Lưu
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              style={{ padding: "6px 10px", background: "#f0f0f0", color: "#222" }}
                            >
                              Hủy
                            </button>
                          </form>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ fontSize: "0.9rem" }}>{log.date}</td>
                        <td style={{ fontSize: "0.9rem", fontWeight: 600 }}>{log.weight_kg}</td>
                        <td style={{ fontSize: "0.9rem", color: "#4d5f52" }}>{log.note || "-"}</td>
                        <td>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              type="button"
                              onClick={() => startEdit(log)}
                              style={{ padding: "6px 10px", background: "#dff4e8", color: "#17633f" }}
                            >
                              Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(log.id)}
                              style={{ padding: "6px 10px", background: "#fde7e7", color: "#8b1a1a" }}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="small">Chưa có bản ghi cân nặng.</p>
        )}
      </div>

      {/* Chart */}
      {chartData.length > 0 && baseline !== null ? (
        <div className="card">
          <h2>📊 Biểu đồ: Thực tế vs Mục tiêu</h2>
          <div style={{ width: "100%", height: 300, marginTop: 12 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[yAxisMin, yAxisMax]}
                  ticks={yAxisTicks}
                  tickFormatter={(value) => `${value}kg`}
                />
                <Tooltip
                  formatter={(value) =>
                    typeof value === "number" ? `${value.toFixed(1)} kg` : String(value ?? "")
                  }
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #d6dfd8",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: 12 }} />
                <Area
                  type="monotone"
                  dataKey="expectedMin"
                  fill="#d4f2de"
                  stroke="#64af83"
                  name="Min"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="expectedMax"
                  fill="#f1f7e9"
                  stroke="#a6c57e"
                  name="Max"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#17633f"
                  strokeWidth={2}
                  name="Thực tế"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="card">
          <p className="small">
            💡 Thêm ít nhất 1 bản ghi cân nặng để xem biểu đồ.
          </p>
        </div>
      )}
    </div>
  );
}
