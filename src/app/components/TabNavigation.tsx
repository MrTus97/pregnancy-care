import type { TabNavProps } from "@/lib/components.types";

export default function TabNavigation({ activeTab, onTabChange }: TabNavProps) {
  const tabs: Array<{ id: "pregnancy" | "weight" | "settings"; label: string; icon: string }> = [
    { id: "pregnancy", label: "Thai kỳ", icon: "🤰" },
    { id: "weight", label: "Cân nặng", icon: "⚖️" },
    { id: "settings", label: "Cài đặt", icon: "⚙️" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#fff",
        borderTop: "1px solid #d6dfd8",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
        zIndex: 100,
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            flex: 1,
            padding: "12px 8px",
            border: "none",
            background: activeTab === tab.id ? "#dff4e8" : "transparent",
            color: activeTab === tab.id ? "#0b643d" : "#4d5f52",
            cursor: "pointer",
            borderTop: activeTab === tab.id ? "3px solid #1f7a4f" : "3px solid transparent",
            fontSize: "0.85rem",
            fontWeight: activeTab === tab.id ? 600 : 500,
            transition: "all 0.2s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
