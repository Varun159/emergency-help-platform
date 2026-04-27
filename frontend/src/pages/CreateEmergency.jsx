import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";
import API from "../api/axios";
import LocationPickerMap from "../components/LocationPickerMap";

function CreateEmergency() {

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedLat, setSelectedLat] = useState(null);
  const [selectedLng, setSelectedLng] = useState(null);

  // ── CATEGORIES ──────────────────────────

  const categories = [
    { key: "blood", icon: "🩸", label: "Blood", desc: "Blood donation needed" },
    { key: "transport", icon: "🚑", label: "Transport", desc: "Emergency vehicle" },
    { key: "medicine", icon: "💊", label: "Medicine", desc: "Urgent medication" },
    { key: "beds", icon: "🛏️", label: "Beds", desc: "Hospital bed needed" },
    { key: "oxygen", icon: "💨", label: "Oxygen", desc: "Oxygen supply" },
    { key: "fire", icon: "🔥", label: "Fire", desc: "Fire emergency" },
    { key: "flood", icon: "🌊", label: "Flood", desc: "Flood assistance" },
    { key: "other", icon: "🚨", label: "Other", desc: "Other emergency" },
  ];

  // ── URGENCY LEVELS ──────────────────────

  const urgencyLevels = [
    { key: "low", icon: "🟢", label: "Low", color: "#10B981", bg: "#ECFDF5", desc: "Can wait a few hours" },
    { key: "medium", icon: "🟡", label: "Medium", color: "#F59E0B", bg: "#FFFBEB", desc: "Need help soon" },
    { key: "high", icon: "🔴", label: "High", color: "#EF4444", bg: "#FEF2F2", desc: "Immediate attention" },
  ];

  // ── SUBMIT ──────────────────────────────

  const createEmergency = async () => {
    if (!category) {
      setToast({ message: "Please select a category", type: "error" });
      return;
    }
    if (!description.trim()) {
      setToast({ message: "Please describe the emergency", type: "error" });
      return;
    }

    setSubmitting(true);

    // Use the map-selected location
    if (!selectedLat || !selectedLng) {
      setToast({ message: "Please wait for location detection or pick a location on the map", type: "error" });
      setSubmitting(false);
      return;
    }

    try {
      await API.post("/emergency/create", {
        category,
        description,
        urgency_level: urgency,
        latitude: selectedLat,
        longitude: selectedLng,
      });
      setToast({ message: "Emergency request created!", type: "accepted" });
      setTimeout(() => navigate("/requests"), 1200);
    } catch {
      setToast({ message: "Failed to create request", type: "error" });
      setSubmitting(false);
    }
  };

  // ── RENDER ──────────────────────────────

  return (
    <div style={styles.layout}>
      <Sidebar open={sidebarOpen} close={() => setSidebarOpen(false)} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div style={styles.content}>
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />

        <div style={styles.page}>
          <div style={styles.container}>

            {/* ═══ HEADER ═══ */}

            <div style={styles.header}>
              <div style={styles.headerIcon}>🚨</div>
              <div>
                <h1 style={styles.title}>Create Emergency Request</h1>
                <p style={styles.subtitle}>
                  Fill in the details below to alert nearby helpers
                </p>
              </div>
            </div>

            <div style={styles.card}>

              {/* ═══ STEP 1: CATEGORY ═══ */}

              <div style={styles.section}>
                <div style={styles.stepBadge}>
                  <span style={styles.stepNumber}>1</span>
                  <span style={styles.stepLabel}>Select Category</span>
                </div>

                <div style={styles.categoryGrid}>
                  {categories.map((c) => (
                    <div
                      key={c.key}
                      style={{
                        ...styles.categoryCard,
                        ...(category === c.key ? styles.categorySelected : {}),
                      }}
                      onClick={() => setCategory(c.key)}
                      onMouseEnter={(e) => {
                        if (category !== c.key) {
                          e.currentTarget.style.borderColor = "#6366F1";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (category !== c.key) {
                          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      <span style={styles.catEmoji}>{c.icon}</span>
                      <span style={styles.catLabel}>{c.label}</span>
                      <span
                        style={{
                          ...styles.catDesc,
                          color: category === c.key ? "rgba(255,255,255,0.8)" : "#9ca3af",
                        }}
                      >
                        {c.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ═══ STEP 2: DESCRIPTION ═══ */}

              <div style={styles.section}>
                <div style={styles.stepBadge}>
                  <span style={styles.stepNumber}>2</span>
                  <span style={styles.stepLabel}>Describe Emergency</span>
                </div>

                <textarea
                  placeholder="Provide details — what happened, what do you need, any specifics..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={styles.textarea}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#6366F1";
                    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <p style={styles.charCount}>
                  {description.length} characters
                </p>
              </div>

              {/* ═══ STEP 3: URGENCY ═══ */}

              <div style={styles.section}>
                <div style={styles.stepBadge}>
                  <span style={styles.stepNumber}>3</span>
                  <span style={styles.stepLabel}>Urgency Level</span>
                </div>

                <div style={styles.urgencyRow}>
                  {urgencyLevels.map((u) => (
                    <div
                      key={u.key}
                      style={{
                        ...styles.urgencyCard,
                        background: urgency === u.key ? u.color : u.bg,
                        color: urgency === u.key ? "white" : u.color,
                        border: `2px solid ${urgency === u.key ? u.color : "transparent"}`,
                        transform: urgency === u.key ? "scale(1.03)" : "scale(1)",
                        boxShadow: urgency === u.key
                          ? `0 6px 20px ${u.color}30`
                          : "none",
                      }}
                      onClick={() => setUrgency(u.key)}
                    >
                      <span style={{ fontSize: 22 }}>{u.icon}</span>
                      <span style={styles.urgLabel}>{u.label}</span>
                      <span
                        style={{
                          ...styles.urgDesc,
                          color: urgency === u.key ? "rgba(255,255,255,0.85)" : "#9ca3af",
                        }}
                      >
                        {u.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ═══ STEP 4: LOCATION ═══ */}

              <div style={styles.section}>
                <div style={styles.stepBadge}>
                  <span style={styles.stepNumber}>4</span>
                  <span style={styles.stepLabel}>Emergency Location</span>
                </div>

                <div style={styles.mapWrapper}>
                  <LocationPickerMap
                    onLocationSelect={(lat, lng) => {
                      setSelectedLat(lat);
                      setSelectedLng(lng);
                    }}
                  />
                </div>
                <p style={styles.locationHint}>
                  📍 Click on the map or drag the pin to set the emergency location
                </p>
              </div>

              {/* ═══ SUBMIT ═══ */}

              <button
                style={{
                  ...styles.submitBtn,
                  opacity: submitting ? 0.7 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
                onClick={createEmergency}
                disabled={submitting}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 10px 30px rgba(99,102,241,0.35)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 6px 20px rgba(99,102,241,0.25)";
                }}
              >
                {submitting ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                    <span style={styles.btnSpinner} />
                    Submitting...
                  </span>
                ) : (
                  "🚨 Submit Emergency Request"
                )}
              </button>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════

const styles = {

  layout: {
    display: "flex",
  },

  content: {
    width: "100%",
    minHeight: "100vh",
    background: "#0f172a"
  },

  page: {
    background: "#0f172a",
    minHeight: "calc(100vh - 65px)",
    padding: "36px 20px 60px",
  },

  container: {
    maxWidth: "680px",
    margin: "0 auto",
  },

  // ── HEADER ──────────────────────────

  header: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginBottom: "28px",
  },

  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: "16px",
    background: "linear-gradient(135deg, #EF4444, #DC2626)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    boxShadow: "0 6px 20px rgba(239,68,68,0.25)",
  },

  title: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#f8fafc",
    margin: 0,
  },

  subtitle: {
    fontSize: "15px",
    color: "#94a3b8",
    margin: "3px 0 0",
  },

  // ── CARD ────────────────────────────

  card: {
    background: "#1e293b",
    padding: "32px",
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
    border: "1px solid rgba(255, 255, 255, 0.05)"
  },

  // ── SECTIONS ────────────────────────

  section: {
    marginBottom: "32px",
  },

  stepBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  },

  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "800",
  },

  stepLabel: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#f8fafc",
  },

  // ── CATEGORY GRID ───────────────────

  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
  },

  categoryCard: {
    padding: "16px 10px",
    borderRadius: "14px",
    background: "#262f45",
    border: "2px solid rgba(255, 255, 255, 0.05)",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.25s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    color: "#f8fafc"
  },

  categorySelected: {
    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    color: "white",
    borderColor: "#6366F1",
    boxShadow: "0 6px 20px rgba(99,102,241,0.3)",
    transform: "translateY(-2px)",
  },

  catEmoji: {
    fontSize: "26px",
  },

  catLabel: {
    fontWeight: "700",
    fontSize: "13px",
  },

  catDesc: {
    fontSize: "10px",
    lineHeight: "1.2",
  },

  // ── TEXTAREA ────────────────────────

  textarea: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "2px solid rgba(255, 255, 255, 0.05)",
    minHeight: "110px",
    fontSize: "14px",
    color: "#f8fafc",
    resize: "vertical",
    outline: "none",
    transition: "all 0.25s ease",
    fontFamily: "inherit",
    boxSizing: "border-box",
    background: "#262f45",
  },

  charCount: {
    textAlign: "right",
    fontSize: "12px",
    color: "#9ca3af",
    margin: "6px 0 0",
  },

  // ── URGENCY ─────────────────────────

  urgencyRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
  },

  urgencyCard: {
    padding: "18px 14px",
    borderRadius: "14px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.25s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },

  urgLabel: {
    fontWeight: "700",
    fontSize: "15px",
  },

  urgDesc: {
    fontSize: "11px",
  },

  // ── MAP ─────────────────────────────

  mapWrapper: {
    borderRadius: "14px",
    overflow: "hidden",
    border: "2px solid rgba(255, 255, 255, 0.1)",
  },

  locationHint: {
    fontSize: "13px",
    color: "#94a3b8",
    margin: "10px 0 0",
    textAlign: "center",
  },

  // ── SUBMIT ──────────────────────────

  submitBtn: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    border: "none",
    borderRadius: "14px",
    color: "white",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 6px 20px rgba(99,102,241,0.25)",
  },

  btnSpinner: {
    width: 18,
    height: 18,
    border: "3px solid rgba(255,255,255,0.3)",
    borderTop: "3px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  },
};

export default CreateEmergency;