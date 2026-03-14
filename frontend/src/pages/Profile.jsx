import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";

function Profile() {

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [form, setForm] = useState({
    name: "",
    phone: "",
    institution: "",
    address: "",
  });

  // ── LOAD PROFILE ────────────────────────

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser(res.data);
        setForm({
          name: res.data.name || "",
          phone: res.data.phone || "",
          institution: res.data.institution || "",
          address: res.data.address || "",
        });
      } catch {
        setToast({ message: "Error loading profile", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // ── SAVE PROFILE ────────────────────────

  const handleSave = async () => {
    try {
      const res = await API.patch("/auth/profile", form);
      setUser(res.data.user);
      setEditing(false);
      setToast({ message: "Profile updated successfully!", type: "accepted" });
    } catch {
      setToast({ message: "Error updating profile", type: "error" });
    }
  };

  // ── LOGOUT ──────────────────────────────

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ── RENDER ──────────────────────────────

  if (loading) {
    return (
      <div style={styles.layout}>
        <div style={styles.content}>
          <Navbar toggleSidebar={() => setSidebarOpen(true)} />
          <div style={styles.loadingBox}>
            <div style={styles.spinner} />
            <p style={{ color: "#6b7280", marginTop: 16 }}>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.layout}>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Sidebar open={sidebarOpen} close={() => setSidebarOpen(false)} />

      <div style={styles.content}>
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />

        <div style={styles.container}>

          {/* ═══ PROFILE HEADER ═══ */}

          <div style={styles.profileHeader}>
            <div style={styles.avatarLarge}>
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <h1 style={styles.profileName}>{user?.name}</h1>
              <p style={styles.profileEmail}>{user?.email}</p>
              <span style={styles.roleBadge}>
                {user?.role === "helper" ? "🤝 Helper" : user?.role === "both" ? "⚡ Requester & Helper" : user?.role === "admin" ? "🛡️ Admin" : "🚨 Requester"}
              </span>
            </div>
          </div>

          {/* ═══ PROFILE DETAILS CARD ═══ */}

          <div style={styles.card}>

            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Personal Information</h2>
              {!editing ? (
                <button
                  style={styles.editBtn}
                  onClick={() => setEditing(true)}
                  onMouseEnter={(e) => { e.target.style.background = "#6366F1"; e.target.style.color = "white"; }}
                  onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#6366F1"; }}
                >
                  ✏️ Edit Profile
                </button>
              ) : (
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    style={styles.saveBtn}
                    onClick={handleSave}
                    onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                    onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                  >
                    Save Changes
                  </button>
                  <button
                    style={styles.cancelBtn}
                    onClick={() => {
                      setEditing(false);
                      setForm({
                        name: user?.name || "",
                        phone: user?.phone || "",
                        institution: user?.institution || "",
                        address: user?.address || "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div style={styles.fieldsGrid}>

              {/* Name */}
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Full Name</label>
                {editing ? (
                  <input
                    style={styles.fieldInput}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={(e) => e.target.style.borderColor = "#6366F1"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                ) : (
                  <p style={styles.fieldValue}>{user?.name || "—"}</p>
                )}
              </div>

              {/* Email (non-editable) */}
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Email</label>
                <p style={styles.fieldValue}>{user?.email || "—"}</p>
                {editing && (
                  <span style={styles.fieldHint}>Email cannot be changed</span>
                )}
              </div>

              {/* Phone */}
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Phone</label>
                {editing ? (
                  <input
                    style={styles.fieldInput}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    onFocus={(e) => e.target.style.borderColor = "#6366F1"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                ) : (
                  <p style={styles.fieldValue}>📞 {user?.phone || "—"}</p>
                )}
              </div>

              {/* Role (non-editable) */}
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Role</label>
                <p style={styles.fieldValue}>
                  {user?.role === "helper" ? "🤝 Helper" : user?.role === "both" ? "⚡ Requester & Helper" : user?.role === "admin" ? "🛡️ Admin" : "🚨 Requester"}
                </p>
                {editing && (
                  <span style={styles.fieldHint}>Role cannot be changed</span>
                )}
              </div>

              {/* Institution */}
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Institution / Hospital</label>
                {editing ? (
                  <input
                    style={styles.fieldInput}
                    value={form.institution}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    placeholder="Enter institution name"
                    onFocus={(e) => e.target.style.borderColor = "#6366F1"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                ) : (
                  <p style={styles.fieldValue}>🏥 {user?.institution || "Not set"}</p>
                )}
              </div>

              {/* Address */}
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Address</label>
                {editing ? (
                  <input
                    style={styles.fieldInput}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Enter your address"
                    onFocus={(e) => e.target.style.borderColor = "#6366F1"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                ) : (
                  <p style={styles.fieldValue}>📍 {user?.address || "Not set"}</p>
                )}
              </div>

            </div>
          </div>

          {/* ═══ ACCOUNT STATS CARD ═══ */}

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Account Details</h2>
            <div style={styles.statsRow}>
              <div style={styles.statItem}>
                <span style={styles.statIcon}>⭐</span>
                <div>
                  <p style={styles.statValue}>{user?.trust_score || 0}</p>
                  <p style={styles.statLabel}>Trust Score</p>
                </div>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statIcon}>
                  {user?.availability_status ? "🟢" : "⚪"}
                </span>
                <div>
                  <p style={styles.statValue}>
                    {user?.availability_status ? "Available" : "Offline"}
                  </p>
                  <p style={styles.statLabel}>Status</p>
                </div>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statIcon}>📅</span>
                <div>
                  <p style={styles.statValue}>
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                  <p style={styles.statLabel}>Member Since</p>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ DANGER ZONE ═══ */}

          <div style={styles.dangerCard}>
            <h2 style={{ ...styles.cardTitle, color: "#EF4444" }}>Account</h2>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>
              Logging out will clear your session. You can log back in anytime.
            </p>
            <button
              style={styles.logoutBtn}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.target.style.background = "#EF4444";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#EF4444";
                e.target.style.transform = "translateY(0)";
              }}
            >
              🚪 Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}


// ── STYLES ──────────────────────────────────────────

const styles = {

  layout: {
    display: "flex",
  },

  content: {
    width: "100%",
    minHeight: "100vh",
    background: "#f8fafc",
  },

  container: {
    maxWidth: "800px",
    margin: "50px auto",
    padding: "20px",
  },

  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
  },

  spinner: {
    width: 40,
    height: 40,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #6366F1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  // ── PROFILE HEADER ──────────────────────

  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "30px",
    padding: "32px 36px",
    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    borderRadius: "18px",
    color: "white",
    boxShadow: "0 12px 30px rgba(99,102,241,0.3)",
  },

  avatarLarge: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    border: "3px solid rgba(255,255,255,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "700",
    flexShrink: 0,
  },

  profileName: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "4px",
  },

  profileEmail: {
    opacity: 0.85,
    fontSize: "15px",
    marginBottom: "8px",
  },

  roleBadge: {
    background: "rgba(255,255,255,0.2)",
    padding: "4px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  // ── CARDS ───────────────────────────────

  card: {
    background: "white",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    marginBottom: "22px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: 12,
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },

  // ── BUTTONS ─────────────────────────────

  editBtn: {
    background: "transparent",
    color: "#6366F1",
    border: "2px solid #6366F1",
    padding: "8px 20px",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },

  saveBtn: {
    background: "linear-gradient(135deg, #10B981, #059669)",
    color: "white",
    border: "none",
    padding: "8px 20px",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
  },

  cancelBtn: {
    background: "transparent",
    color: "#6b7280",
    border: "1px solid #e5e7eb",
    padding: "8px 20px",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
  },

  // ── FIELDS ──────────────────────────────

  fieldsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  fieldLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  fieldValue: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#111827",
    margin: 0,
  },

  fieldInput: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e5e7eb",
    fontSize: "14px",
    color: "#111827",
    outline: "none",
    transition: "border-color 0.2s ease",
    background: "#f9fafb",
  },

  fieldHint: {
    fontSize: "11px",
    color: "#9ca3af",
    fontStyle: "italic",
  },

  // ── STATS ROW ───────────────────────────

  statsRow: {
    display: "flex",
    gap: "20px",
    marginTop: "16px",
    flexWrap: "wrap",
  },

  statItem: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px 20px",
    background: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #f1f5f9",
    minWidth: "180px",
  },

  statIcon: {
    fontSize: "28px",
  },

  statValue: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },

  statLabel: {
    fontSize: "12px",
    color: "#9ca3af",
    margin: 0,
  },

  // ── DANGER ZONE ─────────────────────────

  dangerCard: {
    background: "white",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    border: "1px solid #FEE2E2",
  },

  logoutBtn: {
    background: "transparent",
    color: "#EF4444",
    border: "2px solid #EF4444",
    padding: "10px 28px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
};

export default Profile;
