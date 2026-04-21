import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";

function Requests() {

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("/emergency/my-requests");
        setRequests(res.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  // ── HELPERS ─────────────────────────────

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const filtered = filter === "all"
    ? requests
    : requests.filter((r) => r.status === filter);

  const counts = {
    all: requests.length,
    open: requests.filter((r) => r.status === "open").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    resolved: requests.filter((r) => r.status === "resolved").length,
  };

  const categoryIcon = (cat) => {
    const c = (cat || "").toLowerCase();
    if (c.includes("blood")) return "🩸";
    if (c.includes("medic")) return "💊";
    if (c.includes("fire")) return "🔥";
    if (c.includes("accident") || c.includes("transport")) return "🚑";
    if (c.includes("flood") || c.includes("water")) return "🌊";
    return "🚨";
  };

  const statusConfig = {
    open: { color: "#6366F1", bg: "#EEF2FF", label: "Open" },
    accepted: { color: "#10B981", bg: "#ECFDF5", label: "Accepted" },
    resolved: { color: "#8B5CF6", bg: "#F5F3FF", label: "Resolved" },
  };

  const urgencyConfig = {
    high: { color: "#fff", bg: "#EF4444" },
    medium: { color: "#fff", bg: "#F59E0B" },
    low: { color: "#fff", bg: "#10B981" },
  };

  // ── RENDER ──────────────────────────────

  return (
    <div style={styles.layout}>
      <Sidebar open={sidebarOpen} close={() => setSidebarOpen(false)} />

      <div style={styles.content}>
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />

        <div style={styles.container}>

          {/* ═══ PAGE HEADER ═══ */}

          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.pageTitle}>My Requests</h1>
              <p style={styles.pageSubtitle}>
                Track all your emergency requests and their status
              </p>
            </div>
            <button
              style={styles.createBtn}
              onClick={() => navigate("/create-emergency")}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(99,102,241,0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 14px rgba(99,102,241,0.25)";
              }}
            >
              + New Request
            </button>
          </div>

          {/* ═══ STAT SUMMARY CARDS ═══ */}

          <div style={styles.statGrid}>
            {[
              { label: "Total", count: counts.all, icon: "📋", color: "#6366F1" },
              { label: "Open", count: counts.open, icon: "🔵", color: "#3B82F6" },
              { label: "Accepted", count: counts.accepted, icon: "✅", color: "#10B981" },
              { label: "Resolved", count: counts.resolved, icon: "🎉", color: "#8B5CF6" },
            ].map((s) => (
              <div
                key={s.label}
                style={styles.statCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{ ...styles.statIconBg, background: `${s.color}15` }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                </div>
                <div>
                  <h3 style={{ ...styles.statCount, color: s.color }}>{s.count}</h3>
                  <p style={styles.statLabel}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ═══ FILTER TABS ═══ */}

          <div style={styles.filterBar}>
            {["all", "open", "accepted", "resolved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  ...styles.filterTab,
                  ...(filter === f ? styles.filterTabActive : {}),
                }}
                onMouseEnter={(e) => {
                  if (filter !== f) e.target.style.background = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  if (filter !== f) e.target.style.background = "transparent";
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span
                  style={{
                    ...styles.filterCount,
                    background: filter === f ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                    color: filter === f ? "white" : "#6b7280",
                  }}
                >
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>

          {/* ═══ LOADING STATE ═══ */}

          {loading && (
            <div style={styles.loadingBox}>
              <div style={styles.spinner} />
              <p style={{ color: "#6b7280", marginTop: 14 }}>
                Loading your requests...
              </p>
            </div>
          )}

          {/* ═══ EMPTY STATE ═══ */}

          {!loading && filtered.length === 0 && (
            <div style={styles.emptyState}>
              <span style={{ fontSize: 48, marginBottom: 12 }}>
                {filter === "all" ? "📭" : "🔍"}
              </span>
              <h3 style={{ fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                {filter === "all"
                  ? "No requests yet"
                  : `No ${filter} requests`}
              </h3>
              <p style={{ color: "#9ca3af", fontSize: 14 }}>
                {filter === "all"
                  ? "Create your first emergency request to get help fast."
                  : `You don't have any ${filter} requests right now.`}
              </p>
              {filter === "all" && (
                <button
                  style={{ ...styles.createBtn, marginTop: 16 }}
                  onClick={() => navigate("/create-emergency")}
                >
                  + Create Request
                </button>
              )}
            </div>
          )}

          {/* ═══ REQUEST CARDS ═══ */}

          <div style={styles.cardList}>
            {filtered.map((req, i) => {
              const sc = statusConfig[req.status] || statusConfig.open;
              const uc = urgencyConfig[req.urgency_level] || urgencyConfig.low;

              return (
                <div
                  key={req._id}
                  style={{
                    ...styles.card,
                    animationDelay: `${i * 0.05}s`,
                    borderLeft: `4px solid ${sc.color}`,
                  }}
                  className="request-card-anim"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 14px 30px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 14px rgba(0,0,0,0.05)";
                  }}
                >
                  {/* ── TOP ROW ── */}
                  <div style={styles.cardTop}>
                    <div style={styles.cardTitleArea}>
                      <span style={styles.catIcon}>
                        {categoryIcon(req.category)}
                      </span>
                      <div>
                        <h3 style={styles.cardTitle}>{req.category}</h3>
                        <span style={styles.timeTag}>
                          🕐 {timeAgo(req.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div style={styles.badges}>
                      <span
                        style={{
                          ...styles.badge,
                          background: uc.bg,
                          color: uc.color,
                        }}
                      >
                        {req.urgency_level}
                      </span>
                      <span
                        style={{
                          ...styles.badge,
                          background: sc.bg,
                          color: sc.color,
                          fontWeight: 700,
                        }}
                      >
                        {sc.label}
                      </span>
                    </div>
                  </div>

                  {/* ── DESCRIPTION ── */}
                  <p style={styles.cardDesc}>{req.description}</p>

                  {/* ── HELPER INFO (if accepted) ── */}
                  {req.accepted_by &&
                    typeof req.accepted_by === "object" && (
                      <div style={styles.helperInfo}>
                        <span style={styles.helperAvatar}>
                          {req.accepted_by.name
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                        </span>
                        <div style={{ flex: 1 }}>
                          <p style={styles.helperName}>
                            {req.accepted_by.name}
                            <span style={styles.helperBadge}>Helper</span>
                          </p>
                          <div style={styles.helperDetails}>
                            {req.accepted_by.phone && (
                              <span>📞 {req.accepted_by.phone}</span>
                            )}
                            {req.accepted_by.institution && (
                              <span>🏥 {req.accepted_by.institution}</span>
                            )}
                            {req.accepted_by.address && (
                              <span>📍 {req.accepted_by.address}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                  {/* ── FOOTER META ── */}
                  <div style={styles.cardFooter}>
                    {req.location?.coordinates && (
                      <span style={styles.metaChip}>
                        📍 {req.location.coordinates[1]?.toFixed(4)},{" "}
                        {req.location.coordinates[0]?.toFixed(4)}
                      </span>
                    )}
                    {req.createdAt && (
                      <span style={styles.metaChip}>
                        {new Date(req.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── KEYFRAME STYLES ── */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .request-card-anim {
          animation: fadeSlideUp 0.4s ease both;
        }
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
    background: "#0f172a",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "36px 24px 60px",
  },

  // ── PAGE HEADER ──────────────────────

  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: 16,
  },

  pageTitle: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#f8fafc",
    margin: 0,
  },

  pageSubtitle: {
    fontSize: "15px",
    color: "#94a3b8",
    margin: "4px 0 0",
  },

  createBtn: {
    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    color: "white",
    border: "none",
    padding: "10px 24px",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
  },

  // ── STAT GRID ───────────────────────

  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "28px",
  },

  statCard: {
    background: "#1e293b",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
    transition: "all 0.25s ease",
    cursor: "default",
    border: "1px solid rgba(255, 255, 255, 0.05)"
  },

  statIconBg: {
    width: 48,
    height: 48,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statCount: {
    fontSize: "24px",
    fontWeight: "800",
    margin: 0,
    lineHeight: 1,
  },

  statLabel: {
    fontSize: "13px",
    color: "#94a3b8",
    margin: "3px 0 0",
  },

  // ── FILTER BAR ──────────────────────

  filterBar: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    background: "#1e293b",
    padding: "6px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255, 255, 255, 0.05)"
  },

  filterTab: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#6b7280",
    background: "transparent",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  filterTabActive: {
    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    color: "white",
    boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
  },

  filterCount: {
    padding: "2px 8px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    background: "rgba(255, 255, 255, 0.1)",
    color: "#94a3b8"
  },

  // ── LOADING / EMPTY ─────────────────

  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 0",
  },

  spinner: {
    width: 40,
    height: 40,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #6366F1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  emptyState: {
    textAlign: "center",
    padding: "60px 30px",
    background: "#1e293b",
    borderRadius: "16px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
    border: "1px solid rgba(255, 255, 255, 0.05)"
  },

  // ── CARDS ───────────────────────────

  cardList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  card: {
    background: "#1e293b",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
    transition: "all 0.25s ease",
    cursor: "default",
    border: "1px solid rgba(255, 255, 255, 0.05)"
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "14px",
    gap: 12,
    flexWrap: "wrap",
  },

  cardTitleArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  catIcon: {
    width: 44,
    height: 44,
    borderRadius: "12px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    flexShrink: 0,
  },

  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: 0,
    textTransform: "capitalize",
  },

  timeTag: {
    fontSize: "12px",
    color: "#9ca3af",
  },

  badges: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },

  badge: {
    padding: "4px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
  },

  cardDesc: {
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "0 0 16px",
  },

  // ── HELPER INFO BLOCK ───────────────

  helperInfo: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "14px 16px",
    background: "#262f45",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    marginBottom: "14px",
  },

  helperAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10B981, #059669)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
    flexShrink: 0,
  },

  helperName: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#f8fafc",
    margin: "0 0 4px",
  },

  helperBadge: {
    marginLeft: 8,
    fontSize: "11px",
    color: "#10B981",
    fontWeight: "700",
    background: "#d1fae5",
    padding: "2px 8px",
    borderRadius: "6px",
  },

  helperDetails: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    fontSize: "12px",
    color: "#6b7280",
  },

  // ── CARD FOOTER ─────────────────────

  cardFooter: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  metaChip: {
    fontSize: "12px",
    color: "#94a3b8",
    background: "#262f45",
    padding: "4px 10px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
};

export default Requests;