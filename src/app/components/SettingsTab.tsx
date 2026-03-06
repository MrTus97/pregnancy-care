import type { SettingsTabProps } from "@/lib/components.types";

export default function SettingsTab({
  lmpDate,
  dueDate,
  baselineWeight,
  timezone,
  rules,
  alerts,
  ruleStartWeek,
  ruleEndWeek,
  ruleMin,
  ruleMax,
  alertType,
  alertDate,
  alertValue,
  alertTitle,
  alertMessage,
  onLmpDateChange,
  onDueDateChange,
  onBaselineWeightChange,
  onTimezoneChange,
  onRuleStartWeekChange,
  onRuleEndWeekChange,
  onRuleMinChange,
  onRuleMaxChange,
  onAlertTypeChange,
  onAlertDateChange,
  onAlertValueChange,
  onAlertTitleChange,
  onAlertMessageChange,
  onSaveSettings,
  onAddRule,
  onAddAlert,
}: SettingsTabProps) {
  return (
    <div className="grid" style={{ gap: 16 }}>
      {/* Pregnancy Settings */}
      <div className="card">
        <h2>🤰 Thông tin thai kỳ</h2>
        <form onSubmit={onSaveSettings} className="grid">
          <div>
            <label className="label">Ngày đầu kỳ kinh cuối (LMP)</label>
            <input
              type="date"
              required
              value={lmpDate}
              onChange={(e) => onLmpDateChange(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label className="label">Ngày dự sinh - Tùy chọn</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label className="label">Cân nặng mốc ban đầu (kg) - Tùy chọn</label>
            <input
              type="number"
              step="0.1"
              value={baselineWeight}
              onChange={(e) => onBaselineWeightChange(e.target.value)}
              placeholder="Ví dụ: 52.0"
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label className="label">Múi giờ</label>
            <input
              value={timezone}
              onChange={(e) => onTimezoneChange(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit">💾 Lưu thông tin</button>
        </form>
      </div>

      {/* Weight Target Rules */}
      <div className="card">
        <h2>⚖️ Quy tế tăng cân theo tuần</h2>
        <form onSubmit={onAddRule} className="grid">
          <p className="small" style={{ marginBottom: 8, color: "#4d5f52" }}>
            Ví dụ: Tuần 14-20 tăng 0.4-0.5kg/tuần
          </p>
          <div className="row">
            <div>
              <label className="label">Từ tuần</label>
              <input
                value={ruleStartWeek}
                onChange={(e) => onRuleStartWeekChange(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="label">Đến tuần</label>
              <input
                value={ruleEndWeek}
                onChange={(e) => onRuleEndWeekChange(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="row">
            <div>
              <label className="label">Min (kg/tuần)</label>
              <input
                value={ruleMin}
                onChange={(e) => onRuleMinChange(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="label">Max (kg/tuần)</label>
              <input
                value={ruleMax}
                onChange={(e) => onRuleMaxChange(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <button type="submit">➕ Thêm quy tế</button>
        </form>

        {rules.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p className="small" style={{ fontWeight: 600, marginBottom: 8 }}>Các quy tế hiện có:</p>
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Tuần</th>
                    <th>kg/tuần</th>
                    <th>kg/tháng xấp xỉ</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule) => (
                    <tr key={rule.id}>
                      <td style={{ fontSize: "0.9rem" }}>
                        {rule.start_week}-{rule.end_week}
                      </td>
                      <td style={{ fontSize: "0.9rem" }}>
                        {rule.min_per_week_kg}-{rule.max_per_week_kg}
                      </td>
                      <td style={{ fontSize: "0.9rem" }}>
                        {(rule.min_per_week_kg * 4).toFixed(1)}-{(rule.max_per_week_kg * 4).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Alerts / Reminders */}
      <div className="card">
        <h2>🔔 Cảnh báo & Nhắc nhở</h2>
        <form onSubmit={onAddAlert} className="grid">
          <div>
            <label className="label">Loại cảnh báo</label>
            <select
              value={alertType}
              onChange={(e) =>
                onAlertTypeChange(e.target.value as "date" | "week" | "month")
              }
              style={{ width: "100%" }}
            >
              <option value="date">Theo ngày cụ thể</option>
              <option value="week">Theo tuần thai</option>
              <option value="month">Theo tháng thai xấp xỉ</option>
            </select>
          </div>

          {alertType === "date" ? (
            <div>
              <label className="label">Chọn ngày</label>
              <input
                type="date"
                value={alertDate}
                onChange={(e) => onAlertDateChange(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          ) : (
            <div>
              <label className="label">
                Giá trị ({alertType === "week" ? "tuần" : "tháng"})
              </label>
              <input
                type="number"
                value={alertValue}
                onChange={(e) => onAlertValueChange(e.target.value)}
                placeholder={alertType === "week" ? "Ví dụ: 20" : "Ví dụ: 2"}
                style={{ width: "100%" }}
              />
            </div>
          )}

          <div>
            <label className="label">Tiêu đề</label>
            <input
              value={alertTitle}
              onChange={(e) => onAlertTitleChange(e.target.value)}
              placeholder="Ví dụ: Kiểm tra huyết áp"
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label className="label">Nội dung chi tiết</label>
            <textarea
              value={alertMessage}
              onChange={(e) => onAlertMessageChange(e.target.value)}
              placeholder="Ví dụ: Đi khám, kiểm tra đường huyết"
              rows={2}
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit">➕ Thêm cảnh báo</button>
        </form>

        {alerts.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p className="small" style={{ fontWeight: 600, marginBottom: 8 }}>
              Các cảnh báo ({alerts.length}):
            </p>
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {alerts.slice(0, 10).map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: 10,
                    marginBottom: 8,
                    background: alert.is_active ? "#dff4e8" : "#eeeee",
                    border: `1px solid ${alert.is_active ? "#64af83" : "#d6dfd8"}`,
                    borderRadius: 6,
                  }}
                >
                  <p
                    className="small"
                    style={{
                      fontWeight: 600,
                      color: alert.is_active ? "#0b643d" : "#999",
                      marginBottom: 4,
                    }}
                  >
                    {alert.title}
                  </p>
                  <p className="small" style={{ color: "#4d5f52", marginBottom: 2 }}>
                    {alert.trigger_type === "date"
                      ? `Ngày: ${alert.trigger_date}`
                      : `${alert.trigger_type === "week" ? "Tuần" : "Tháng"}: ${alert.trigger_value}`}
                  </p>
                  {alert.message && (
                    <p className="small" style={{ color: "#4d5f52", fontSize: "0.85rem" }}>
                      {alert.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
