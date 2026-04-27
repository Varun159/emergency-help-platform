import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import API from "../api/axios";

const helperPin = new L.Icon({ iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", iconSize: [28, 28] });
const requesterPin = new L.Icon({ iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", iconSize: [28, 28] });

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const [s, u, r, rv] = await Promise.all([
          API.get("/admin/stats"), API.get("/admin/users"),
          API.get("/admin/requests"), API.get("/admin/reviews")
        ]);
        setStats(s.data); setUsers(u.data); setRequests(r.data); setReviews(rv.data);
      } catch (err) {
        console.log("Admin load error:", err);
        if (err.response?.status === 403) navigate("/");
      }
    };
    load();
  }, [navigate]);

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const usersWithLoc = users.filter(u => u.location?.coordinates?.[0] && u.location?.coordinates?.[1]);

  const stars = (n) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));

  const tabs = [
    { key: "overview", label: "📊 Overview" },
    { key: "users", label: "👥 Users" },
    { key: "requests", label: "🚨 Requests" },
    { key: "reviews", label: "⭐ Reviews" },
    { key: "map", label: "🗺️ User Map" },
  ];

  if (!stats) return (
    <div style={S.loadWrap}><div style={S.spinner} /><p style={{ color: "#94a3b8", marginTop: 14 }}>Loading admin panel...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
  );

  return (
    <div style={S.page}>
      {/* Top bar */}
      <div style={S.topBar}>
        <h1 style={S.logo}>Emergency<span style={{ color: "#8B5CF6" }}>Connect</span> <span style={S.adminBadge}>Admin</span></h1>
        <button style={S.logoutBtn} onClick={handleLogout}
          onMouseEnter={e => { e.target.style.background = "#EF4444"; e.target.style.color = "#fff"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#EF4444"; }}>
          🚪 Logout
        </button>
      </div>

      {/* Tab bar */}
      <div style={S.tabBar}>
        {tabs.map(t => (
          <button key={t.key} style={{ ...S.tab, ...(activeTab === t.key ? S.tabActive : {}) }}
            onClick={() => setActiveTab(t.key)}>{t.label}</button>
        ))}
      </div>

      <div style={S.body}>

        {/* ═══ OVERVIEW ═══ */}
        {activeTab === "overview" && (
          <div>
            <h2 style={S.secTitle}>Platform Overview</h2>
            <div style={S.statGrid}>
              {[
                { label: "Total Users", val: stats.totalUsers, icon: "👥", color: "#6366F1" },
                { label: "Helpers", val: stats.totalHelpers, icon: "🤝", color: "#10B981" },
                { label: "Requesters", val: stats.totalRequesters, icon: "🚨", color: "#F59E0B" },
                { label: "Total Requests", val: stats.totalRequests, icon: "📋", color: "#8B5CF6" },
                { label: "Open", val: stats.openRequests, icon: "🔵", color: "#3B82F6" },
                { label: "Accepted", val: stats.acceptedRequests, icon: "✅", color: "#059669" },
                { label: "Resolved", val: stats.resolvedRequests, icon: "🎉", color: "#7C3AED" },
                { label: "Reviews", val: stats.totalReviews, icon: "⭐", color: "#F59E0B" },
              ].map(s => (
                <div key={s.label} style={S.statCard}>
                  <div style={{ ...S.statIcon, background: `${s.color}20` }}><span style={{ fontSize: 22 }}>{s.icon}</span></div>
                  <div><h3 style={{ ...S.statVal, color: s.color }}>{s.val}</h3><p style={S.statLbl}>{s.label}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ USERS ═══ */}
        {activeTab === "users" && (
          <div>
            <h2 style={S.secTitle}>All Users ({filteredUsers.length})</h2>
            <div style={S.filterRow}>
              <input style={S.searchInput} placeholder="Search name, email, phone..."
                value={search} onChange={e => setSearch(e.target.value)} />
              <select style={S.select} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                <option value="all">All Roles</option>
                <option value="requester">Requester</option>
                <option value="helper">Helper</option>
                <option value="both">Both</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead><tr>
                  {["Name", "Email", "Phone", "Role", "Trust", "Address", "Joined"].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u._id} style={S.tr}>
                      <td style={S.td}><div style={S.nameCell}><span style={S.avatar}>{u.name?.charAt(0)?.toUpperCase()}</span>{u.name}</div></td>
                      <td style={S.td}>{u.email}</td>
                      <td style={S.td}>{u.phone}</td>
                      <td style={S.td}><span style={{ ...S.roleBadge, background: u.role === "admin" ? "#7C3AED" : u.role === "helper" ? "#059669" : u.role === "both" ? "#F59E0B" : "#3B82F6" }}>{u.role}</span></td>
                      <td style={S.td}><span style={{ color: "#F59E0B" }}>{stars(u.trust_score || 0)}</span> {u.trust_score || 0}</td>
                      <td style={S.td}>{u.address || "—"}</td>
                      <td style={S.td}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ REQUESTS ═══ */}
        {activeTab === "requests" && (
          <div>
            <h2 style={S.secTitle}>All Requests ({requests.length})</h2>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead><tr>
                  {["Category", "Description", "Urgency", "Status", "Requester", "Helper", "Created"].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r._id} style={S.tr}>
                      <td style={S.td}><strong>{r.category}</strong></td>
                      <td style={{ ...S.td, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.description}</td>
                      <td style={S.td}><span style={{ ...S.urgBadge, background: r.urgency_level === "high" ? "#EF4444" : r.urgency_level === "medium" ? "#F59E0B" : "#10B981" }}>{r.urgency_level}</span></td>
                      <td style={S.td}><span style={{ ...S.statusBadge, background: r.status === "resolved" ? "#7C3AED" : r.status === "accepted" ? "#10B981" : "#3B82F6" }}>{r.status}</span></td>
                      <td style={S.td}>{r.requester_id?.name || "—"}</td>
                      <td style={S.td}>{r.accepted_by?.name || "—"}</td>
                      <td style={S.td}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ REVIEWS ═══ */}
        {activeTab === "reviews" && (
          <div>
            <h2 style={S.secTitle}>All Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <div style={S.empty}><span style={{ fontSize: 40 }}>⭐</span><p>No reviews yet</p></div>
            ) : (
              <div style={S.reviewGrid}>
                {reviews.map(rv => (
                  <div key={rv._id} style={S.reviewCard}>
                    <div style={S.reviewTop}>
                      <div><p style={S.reviewerName}>{rv.reviewer_id?.name || "Unknown"}</p>
                        <p style={S.reviewMeta}>reviewed {rv.helper_id?.name || "Unknown"} • {rv.request_id?.category || ""}</p></div>
                      <span style={S.ratingBig}>{stars(rv.rating)} <strong>{rv.rating}/5</strong></span>
                    </div>
                    {rv.comment && <p style={S.reviewComment}>"{rv.comment}"</p>}
                    <p style={S.reviewDate}>{rv.createdAt ? new Date(rv.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ MAP ═══ */}
        {activeTab === "map" && (
          <div>
            <h2 style={S.secTitle}>User Locations ({usersWithLoc.length} mapped)</h2>
            <div style={S.mapLegend}>
              <span style={S.legendItem}><span style={{ ...S.legendDot, background: "#3B82F6" }} /> Helpers</span>
              <span style={S.legendItem}><span style={{ ...S.legendDot, background: "#EF4444" }} /> Requesters</span>
            </div>
            <div style={S.mapWrap}>
              <MapContainer center={[12.9716, 77.5946]} zoom={5} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                {usersWithLoc.map(u => (
                  <Marker key={u._id}
                    position={[u.location.coordinates[1], u.location.coordinates[0]]}
                    icon={u.role === "helper" || u.role === "both" ? helperPin : requesterPin}>
                    <Popup><b>{u.name}</b><br />{u.role}<br />{u.email}<br />📞 {u.phone}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}

      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── STYLES ──────────────────────────────
const S = {
  page: { minHeight: "100vh", background: "#0f172a", color: "#f8fafc" },
  loadWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f172a" },
  spinner: { width: 40, height: 40, border: "4px solid rgba(255,255,255,0.1)", borderTop: "4px solid #6366F1", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 36px", background: "#1e293b", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  logo: { fontSize: 24, fontWeight: 800, margin: 0 },
  adminBadge: { fontSize: 12, background: "#7C3AED", color: "#fff", padding: "3px 10px", borderRadius: 8, marginLeft: 8, fontWeight: 700, verticalAlign: "middle" },
  logoutBtn: { background: "transparent", color: "#EF4444", border: "1.5px solid #EF4444", padding: "8px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s" },
  tabBar: { display: "flex", gap: 4, padding: "8px 36px", background: "#1e293b", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  tab: { flex: 1, padding: "10px 16px", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#94a3b8", background: "transparent", cursor: "pointer", transition: "all 0.2s", textAlign: "center" },
  tabActive: { background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" },
  body: { maxWidth: 1200, margin: "0 auto", padding: "30px 36px" },
  secTitle: { fontSize: 22, fontWeight: 800, marginBottom: 20 },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 },
  statCard: { background: "#1e293b", borderRadius: 14, padding: 20, display: "flex", alignItems: "center", gap: 16, border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" },
  statIcon: { width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" },
  statVal: { fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1 },
  statLbl: { fontSize: 13, color: "#94a3b8", margin: "3px 0 0" },
  filterRow: { display: "flex", gap: 12, marginBottom: 20 },
  searchInput: { flex: 1, padding: "10px 16px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.1)", background: "#262f45", color: "#f8fafc", fontSize: 14, outline: "none" },
  select: { padding: "10px 16px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.1)", background: "#262f45", color: "#f8fafc", fontSize: 14, outline: "none", cursor: "pointer" },
  tableWrap: { overflowX: "auto", borderRadius: 14, border: "1px solid rgba(255,255,255,0.05)" },
  table: { width: "100%", borderCollapse: "collapse", background: "#1e293b" },
  th: { textAlign: "left", padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid rgba(255,255,255,0.05)" },
  td: { padding: "12px 16px", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.03)", color: "#cbd5e1" },
  tr: { transition: "background 0.15s" },
  nameCell: { display: "flex", alignItems: "center", gap: 10 },
  avatar: { width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 },
  roleBadge: { color: "#fff", padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: "capitalize" },
  urgBadge: { color: "#fff", padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: "capitalize" },
  statusBadge: { color: "#fff", padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: "capitalize" },
  empty: { textAlign: "center", padding: "60px 0", color: "#94a3b8" },
  reviewGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  reviewCard: { background: "#1e293b", borderRadius: 14, padding: 20, border: "1px solid rgba(255,255,255,0.05)" },
  reviewTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 12, flexWrap: "wrap" },
  reviewerName: { fontWeight: 700, fontSize: 14, margin: 0, color: "#f8fafc" },
  reviewMeta: { fontSize: 12, color: "#94a3b8", margin: "2px 0 0" },
  ratingBig: { color: "#F59E0B", fontSize: 13 },
  reviewComment: { color: "#cbd5e1", fontSize: 14, fontStyle: "italic", lineHeight: 1.5, margin: "0 0 8px" },
  reviewDate: { fontSize: 11, color: "#64748b", margin: 0 },
  mapLegend: { display: "flex", gap: 20, marginBottom: 12 },
  legendItem: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8" },
  legendDot: { width: 10, height: 10, borderRadius: "50%", display: "inline-block" },
  mapWrap: { height: 500, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" },
};

export default AdminDashboard;
