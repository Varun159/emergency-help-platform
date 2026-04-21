import { useEffect, useState } from "react";

function Toast({ message, type, onClose }) {

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) setTimeout(onClose, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getStyle = () => {
    const base = {
      position: "fixed",
      top: "28px",
      right: "28px",
      padding: "16px 24px",
      borderRadius: "14px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
      fontSize: "14px",
      fontWeight: "600",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      gap: "12px",
      maxWidth: "400px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(30px)",
      transition: "all 0.3s ease",
      cursor: "pointer"
    };

    if (type === "emergency") {
      return { ...base, background: "linear-gradient(135deg, #EF4444, #DC2626)", color: "white" };
    }
    if (type === "accepted") {
      return { ...base, background: "linear-gradient(135deg, #10B981, #059669)", color: "white" };
    }
    if (type === "error") {
      return { ...base, background: "#EF4444", color: "white" };
    }
    return { ...base, background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" };
  };

  const getIcon = () => {
    if (type === "emergency") return "🚨";
    if (type === "accepted") return "✅";
    if (type === "error") return "❌";
    return "🔔";
  };

  return (
    <div style={getStyle()} onClick={onClose}>
      <span style={{ fontSize: "20px" }}>{getIcon()}</span>
      <span>{message}</span>
    </div>
  );
}

export default Toast;