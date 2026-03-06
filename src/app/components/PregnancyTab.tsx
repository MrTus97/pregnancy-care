import type { PregnancyTabProps } from "@/lib/components.types";

export default function PregnancyTab({
  pregnancySummary,
  expectedRange,
  latestWeight,
  pregnancyDate,
  dueDate,
  onPregnancyDateChange,
}: PregnancyTabProps) {
  if (!pregnancySummary) {
    return (
      <div className="card">
        <h2>⚠️ Chưa thiết lập</h2>
        <p className="small">Vào tab "Cài đặt" để nhập ngày đầu thai kỳ.</p>
      </div>
    );
  }

  const totalDays = pregnancySummary.week * 7 + pregnancySummary.day;

  // Calculate days remaining to due date
  const daysRemaining = dueDate
    ? Math.ceil((new Date(dueDate).getTime() - new Date(pregnancyDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="grid" style={{ gap: 16 }}>
      {/* Date Picker */}
      <div className="card">
        <h3 style={{ marginBottom: 12, fontSize: "0.95rem" }}>📅 Chọn ngày kiểm tra</h3>
        <input
          type="date"
          value={pregnancyDate}
          onChange={(e) => onPregnancyDateChange(e.target.value)}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      {/* Main KPI Card */}
      <div className="card kpi" style={{ background: "linear-gradient(135deg, #1f7a4f 0%, #0b643d 100%)", color: "#fff" }}>
        <p className="small" style={{ color: "rgba(255,255,255,0.8)" }}>Bé được:</p>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", margin: "4px 0" }}>
            {pregnancySummary.week} tuần {pregnancySummary.day} ngày
          </p>
          <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "rgba(255,255,255,0.95)", margin: "4px 0" }}>
            = {totalDays} ngày
          </p>
        </div>
        <p className="small" style={{ color: "rgba(255,255,255,0.8)" }}>
          Tháng thai xấp xỉ: <strong>Tháng {pregnancySummary.month}</strong>
        </p>
      </div>

      {/* Countdown to Due Date */}
      {daysRemaining !== null && (
        <div className="card" style={{ background: "linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)", color: "#fff" }}>
          <p className="small" style={{ color: "rgba(255,255,255,0.8)" }}>Còn lại đến ngày dự sinh:</p>
          <div style={{ marginBottom: 8 }}>
            <p style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", margin: "8px 0" }}>
              {daysRemaining} ngày
            </p>
            {daysRemaining === 0 && (
              <p style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", margin: "4px 0" }}>
                🎉 Hôm nay là ngày dự sinh!
              </p>
            )}
            {daysRemaining < 0 && (
              <p style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", margin: "4px 0" }}>
                👶 Đã quá {Math.abs(daysRemaining)} ngày sau ngày dự sinh
              </p>
            )}
            {daysRemaining > 0 && (
              <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "rgba(255,255,255,0.9)", margin: "4px 0" }}>
                📅 {dueDate}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Expected Weight Gain */}
      {expectedRange && (
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>📊 Mục tiêu cân nặng toàn thai kỳ</h3>
          <div className="grid cols-2" style={{ gap: 12 }}>
            <div style={{ textAlign: "center", padding: 12, background: "#dff4e8", borderRadius: 8 }}>
              <p className="small" style={{ color: "#0b643d", marginBottom: 4 }}>Mục tiêu tối thiểu</p>
              <p style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0b643d" }}>
                {expectedRange.minGain.toFixed(1)}kg
              </p>
            </div>
            <div style={{ textAlign: "center", padding: 12, background: "#fff4eb", borderRadius: 8 }}>
              <p className="small" style={{ color: "#b42318", marginBottom: 4 }}>Mục tiêu tối đa</p>
              <p style={{ fontSize: "1.3rem", fontWeight: 700, color: "#b42318" }}>
                +{expectedRange.maxGain.toFixed(1)}kg
              </p>
            </div>
          </div>
          <p className="small" style={{ marginTop: 12, textAlign: "center", color: "#4d5f52" }}>
            Dự kiến đạt: {expectedRange.minWeight.toFixed(1)} - {expectedRange.maxWeight.toFixed(1)} kg
          </p>
        </div>
      )}

      {/* Current Weight Status */}
      {latestWeight && (
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>⚖️ Cân nặng hiện tại</h3>
          <div style={{ textAlign: "center", padding: 16, background: "#f7f9f7", borderRadius: 8 }}>
            <p className="small" style={{ color: "#4d5f52", marginBottom: 8 }}>Lần cân cuối cùng ({latestWeight.date})</p>
            <p style={{ fontSize: "2rem", fontWeight: 700, color: "#1f2a22", marginBottom: 8 }}>
              {latestWeight.weight_kg} kg
            </p>
            {expectedRange && (
              <p className="small" style={{
                color: latestWeight.weight_kg < expectedRange.minWeight ? "#b42318" :
                       latestWeight.weight_kg > expectedRange.maxWeight ? "#b42318" : "#0b643d",
                fontWeight: 600
              }}>
                {latestWeight.weight_kg < expectedRange.minWeight
                  ? "⬇️ Thấp hơn mục tiêu"
                  : latestWeight.weight_kg > expectedRange.maxWeight
                    ? "⬆️ Cao hơn mục tiêu"
                    : "✅ Trong mục tiêu"}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Healthy Pregnancy Info */}
      <div className="card" style={{ background: "#eef3ed", border: "1px solid #d6dfd8" }}>
        <h3 style={{ marginBottom: 8, fontSize: "0.95rem" }}>💡 Gợi ý</h3>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: "0.9rem", color: "#4d5f52", lineHeight: 1.6 }}>
          <li>Ăn đầy đủ, dinh dưỡng cân bằng</li>
          <li>Uống 2-3 lít nước mỗi ngày</li>
          <li>Tập thể dục nhẹ nhàng (đi bộ, yoga)</li>
          <li>Kiểm tra định kỳ tại bệnh viện</li>
        </ul>
      </div>
    </div>
  );
}
