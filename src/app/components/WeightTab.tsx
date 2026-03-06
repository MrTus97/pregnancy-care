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
}: WeightTabProps) {
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
                </tr>
              </thead>
              <tbody>
                {weightLogs
                  .slice(-10)
                  .reverse()
                  .map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontSize: "0.9rem" }}>{log.date}</td>
                      <td style={{ fontSize: "0.9rem", fontWeight: 600 }}>{log.weight_kg}</td>
                      <td style={{ fontSize: "0.9rem", color: "#4d5f52" }}>
                        {log.note || "-"}
                      </td>
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
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
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
