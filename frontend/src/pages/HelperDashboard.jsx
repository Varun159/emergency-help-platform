import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import API from "../api/axios";
import socket from "../sockets/socket";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";
import "./HelperDashboard.css";

// ── MAP ICONS ──────────────────────────────────────────

const emergencyIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const helperIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
});

// ── HELPERS ────────────────────────────────────────────

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

function urgencyBadgeClass(level) {
  if (!level) return "badge-low";
  const l = level.toLowerCase();
  if (l === "high") return "badge-high";
  if (l === "medium") return "badge-medium";
  return "badge-low";
}

// ── COMPONENT ──────────────────────────────────────────

function HelperDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [available, setAvailable] = useState(false);
  const [emergencies, setEmergencies] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("nearby");
  const [helperLoc, setHelperLoc] = useState(null);
  const [nearbyHelpers, setNearbyHelpers] = useState(0);
  const [stats, setStats] = useState({ nearby: 0, accepted: 0, completed: 0, trust_score: 0 });
  const [toast, setToast] = useState(null);

  // ── JOIN SOCKET ROOM ───────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        socket.emit("join", payload.id);
      } catch (e) {
        console.log("Could not join socket room");
      }
    }
  }, []);

  // ── GET HELPER LOCATION ────────────────────────────
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setHelperLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setHelperLoc({ lat: 12.9716, lng: 77.5946 })
      );
    } else {
      setHelperLoc({ lat: 12.9716, lng: 77.5946 });
    }
  }, []);

  // ── LOAD DATA ──────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const [nearbyRes, acceptedRes, statsRes] = await Promise.all([
        API.get("/emergency/nearby"),
        API.get("/emergency/accepted").catch(() => ({ data: [] })),
        API.get("/helper/stats").catch(() => ({ data: { nearby: 0, accepted: 0, completed: 0, trust_score: 0 } })),
      ]);
      setEmergencies(nearbyRes.data || []);
      setAcceptedRequests(acceptedRes.data || []);
      setStats({
        nearby: statsRes.data.nearby || 0,
        accepted: statsRes.data.accepted || 0,
        completed: statsRes.data.completed || 0,
        trust_score: statsRes.data.trust_score || 0,
      });
    } catch (err) {
      console.log("Load error:", err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── FETCH CURRENT AVAILABILITY ON MOUNT ────────────
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await API.get("/helper/availability");
        setAvailable(res.data.availability);
      } catch {
        console.log("Could not fetch availability");
      }
    };
    fetchAvailability();
  }, []);

  // ── SOCKET LISTENER ────────────────────────────────
  useEffect(() => {
    socket.on("newEmergency", (data) => {
      setEmergencies((prev) => [data, ...prev]);
      setStats((prev) => ({ ...prev, nearby: prev.nearby + 1 }));
      setToast({
        message: data.notification?.message || `New ${data.category} emergency nearby!`,
        type: "emergency"
      });
    });
    return () => socket.off("newEmergency");
  }, []);

  // ── LOAD NEARBY HELPERS COUNT ──────────────────────
  useEffect(() => {
    const fetchHelpers = async () => {
      try {
        const res = await API.get("/helper/nearby-count");
        setNearbyHelpers(res.data.count || 0);
      } catch {
        setNearbyHelpers(0);
      }
    };
    fetchHelpers();
  }, [available]);

  // ── TOGGLE AVAILABILITY ────────────────────────────
  const toggleAvailability = async () => {
    try {
      const res = await API.patch("/helper/availability");
      setAvailable(res.data.availability);
      setToast({
        message: res.data.availability ? "You're now available for emergencies" : "You're now offline",
        type: res.data.availability ? "accepted" : "default"
      });
    } catch {
      setToast({ message: "Error updating availability", type: "error" });
    }
  };

  // ── ACCEPT EMERGENCY ──────────────────────────────
  const acceptEmergency = async (id) => {
    try {
      await API.patch(`/emergency/accept/${id}`);
      const accepted = emergencies.find((e) => e._id === id);
      setEmergencies((prev) => prev.filter((e) => e._id !== id));
      if (accepted) setAcceptedRequests((prev) => [accepted, ...prev]);
      setStats((prev) => ({
        ...prev,
        nearby: prev.nearby - 1,
        accepted: prev.accepted + 1,
      }));
      setToast({ message: "Emergency accepted! Head to the location.", type: "accepted" });
    } catch {
      setToast({ message: "Error accepting request", type: "error" });
    }
  };

  // ── COMPLETE REQUEST ──────────────────────────────
  const completeRequest = async (id) => {
    try {
      await API.patch(`/emergency/complete/${id}`);
      setAcceptedRequests((prev) => prev.filter((e) => e._id !== id));
      setStats((prev) => ({
        ...prev,
        accepted: prev.accepted - 1,
        completed: prev.completed + 1,
        trust_score: prev.trust_score + 1,
      }));
      setToast({ message: "Request completed! Trust score +1 ⭐", type: "accepted" });
    } catch {
      setToast({ message: "Error completing request", type: "error" });
    }
  };

  // ── TAB CONFIGURATION ────────────────────────────
  const tabs = [
    { key: "nearby", label: "🚨 Nearby", count: emergencies.length },
    { key: "accepted", label: "✅ Accepted", count: acceptedRequests.length },
    { key: "map", label: "🗺️ Map" },
    { key: "activity", label: "📊 Activity" },
  ];

  // ── RENDER ────────────────────────────────────────

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

        <div style={styles.container} className="helper-container">
          {/* ═══ AVAILABILITY CARD ═══ */}

          <div
            className="availability-card"
            style={{
              ...styles.availCard,
              background: available
                ? "linear-gradient(135deg, #059669, #10B981)"
                : "linear-gradient(135deg, #4B5563, #6B7280)",
            }}
          >
            <div style={styles.availInner}>
              <div>
                <h2 style={styles.availTitle}>
                  {available ? "You're Available" : "You're Offline"}
                </h2>
                <p style={styles.availDesc}>
                  {available
                    ? "You'll receive nearby emergency alerts in real time."
                    : "Toggle on to start receiving emergency requests."}
                </p>
              </div>

              <div style={styles.availRight}>
                <div
                  className="toggle-track"
                  style={{
                    background: available ? "#065F46" : "#374151",
                  }}
                  onClick={toggleAvailability}
                >
                  <div
                    className="toggle-thumb"
                    style={{ left: available ? "28px" : "3px" }}
                  />
                </div>

                {available && (
                  <div style={styles.pulseRow}>
                    <span style={styles.pulseDot} />
                    <span style={{ fontSize: "13px", opacity: 0.9 }}>LIVE</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ═══ NEARBY HELPERS BADGE ═══ */}

          <div className="helpers-badge" style={styles.helpersBadge}>
            <span style={styles.helpersDot} />
            <span style={{ fontWeight: 600, color: "#111827" }}>
              {nearbyHelpers}
            </span>
            <span style={{ color: "#6b7280" }}>helpers available nearby</span>
          </div>

          {/* ═══ KPI STAT CARDS ═══ */}

          <div
            style={styles.statsGrid}
            className="helper-stats-grid"
          >
            {/* Active Emergencies Nearby */}
            <div className="stat-card-helper">
              <div style={styles.statBar("#EF4444")} />
              <div style={styles.statHeader}>
                <span style={styles.statDot("#EF4444")} />
                <p style={styles.statLabel}>Active Emergencies</p>
              </div>
              <h2 style={styles.statNumber}>{stats.nearby}</h2>
              <p style={styles.statMeta}>Nearby right now</p>
            </div>

            {/* Requests Accepted */}
            <div className="stat-card-helper">
              <div style={styles.statBar("#6366F1")} />
              <div style={styles.statHeader}>
                <span style={styles.statDot("#6366F1")} />
                <p style={styles.statLabel}>Requests Accepted</p>
              </div>
              <h2 style={styles.statNumber}>{stats.accepted}</h2>
              <p style={styles.statMeta}>Active today</p>
            </div>

            {/* Completed */}
            <div className="stat-card-helper">
              <div style={styles.statBar("#10B981")} />
              <div style={styles.statHeader}>
                <span style={styles.statDot("#10B981")} />
                <p style={styles.statLabel}>Completed</p>
              </div>
              <h2 style={styles.statNumber}>{stats.completed}</h2>
              <p style={styles.statMeta}>Resolved today</p>
            </div>
          </div>

          <div style={styles.divider} />

          {/* ═══ TAB BAR ═══ */}

          <div style={styles.tabBar} className="helper-tab-bar">
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`helper-tab ${activeTab === t.key ? "active" : ""}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
                {t.count !== undefined && (
                  <span
                    style={{
                      marginLeft: 6,
                      background:
                        activeTab === t.key
                          ? "rgba(255,255,255,0.25)"
                          : "#e5e7eb",
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ═══ TAB CONTENT ═══ */}

          {/* ── NEARBY EMERGENCIES ── */}
          {activeTab === "nearby" && (
            <div style={styles.cardList}>
              {emergencies.length === 0 && (
                <div style={styles.emptyState}>
                  <span style={{ fontSize: 40, marginBottom: 10 }}>🔍</span>
                  <p style={{ fontWeight: 600, color: "#374151" }}>
                    No nearby emergencies
                  </p>
                  <p style={{ color: "#9ca3af", fontSize: 14 }}>
                    Stay available — you'll be notified when someone needs help.
                  </p>
                </div>
              )}

              {emergencies.map((e, i) => (
                <div
                  className="emergency-card"
                  key={e._id}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div style={styles.cardTop}>
                    <div style={styles.cardInfo}>
                      <div style={styles.cardTitleRow}>
                        <h3 style={styles.cardTitle}>{e.category}</h3>
                        <span className={urgencyBadgeClass(e.urgency_level)}>
                          {e.urgency_level || "Low"}
                        </span>
                      </div>
                      <p style={styles.cardDesc}>{e.description}</p>
                      {e.requester_id && typeof e.requester_id === "object" && (
                        <div style={styles.userInfo}>
                          <span style={styles.userAvatar}>
                            {e.requester_id.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                          <div>
                            <p style={styles.userName}>{e.requester_id.name}</p>
                            <p style={styles.userPhone}>📞 {e.requester_id.phone}</p>
                            {e.requester_id.institution && (
                              <p style={styles.userPhone}>🏥 {e.requester_id.institution}</p>
                            )}
                             {e.requester_id.address && (
                               <p style={styles.userPhone}>📍 {e.requester_id.address}</p>
                             )}
                             <div style={{display:"flex", gap:"8px", marginTop:"4px", alignItems:"center"}}>
                               <span style={{fontSize:"10px", background:"#dcfce7", color:"#166534", padding:"1px 6px", borderRadius:"10px", fontWeight:"600"}}>
                                 ⭐ {e.requester_id.trust_score || 0}
                               </span>
                               <span style={{fontSize:"10px", background:"#f1f5f9", color:"#475569", padding:"1px 6px", borderRadius:"10px", fontWeight:"600"}}>
                                 📅 {e.requester_id.createdAt ? new Date(e.requester_id.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}
                               </span>
                             </div>
                           </div>
                         </div>
                       )}
                    </div>
                  </div>

                  <div style={styles.cardBottom}>
                    <div style={styles.cardMeta}>
                      {helperLoc && e.location?.coordinates && (
                        <span style={styles.metaTag}>
                          📍{" "}
                          {calcDistance(
                            helperLoc.lat,
                            helperLoc.lng,
                            e.location.coordinates[1],
                            e.location.coordinates[0]
                          )}{" "}
                          km away
                        </span>
                      )}
                      <span style={styles.metaTag}>
                        🕐 {timeAgo(e.createdAt || new Date())}
                      </span>
                    </div>
                    <button
                      className="btn-accept"
                      onClick={() => acceptEmergency(e._id)}
                    >
                      Accept Request
                    </button>
                  </div>

                  {/* Mini Map */}
                  {e.location?.coordinates && (
                    <div style={{ marginTop: 12, borderRadius: 10, overflow: "hidden", height: 150, border: "1px solid rgba(255,255,255,0.1)" }}>
                      <MapContainer
                        center={[e.location.coordinates[1], e.location.coordinates[0]]}
                        zoom={14} zoomControl={false} dragging={false}
                        scrollWheelZoom={false} doubleClickZoom={false}
                        style={{ height: "100%", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                        <Marker position={[e.location.coordinates[1], e.location.coordinates[0]]} icon={emergencyIcon} />
                        {helperLoc && <Marker position={[helperLoc.lat, helperLoc.lng]} icon={helperIcon}><Popup>You</Popup></Marker>}
                      </MapContainer>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── ACCEPTED REQUESTS ── */}
          {activeTab === "accepted" && (
            <div style={styles.cardList}>
              {acceptedRequests.length === 0 && (
                <div style={styles.emptyState}>
                  <span style={{ fontSize: 40, marginBottom: 10 }}>✅</span>
                  <p style={{ fontWeight: 600, color: "#374151" }}>
                    No accepted requests yet
                  </p>
                  <p style={{ color: "#9ca3af", fontSize: 14 }}>
                    Accept an emergency from the Nearby tab to start helping.
                  </p>
                </div>
              )}

              {acceptedRequests.map((e, i) => (
                <div
                  className="emergency-card"
                  key={e._id}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div style={styles.cardTop}>
                    <div style={styles.cardInfo}>
                      <div style={styles.cardTitleRow}>
                        <h3 style={styles.cardTitle}>{e.category}</h3>
                        <span className={urgencyBadgeClass(e.urgency_level)}>
                          {e.urgency_level || "Low"}
                        </span>
                      </div>
                      <p style={styles.cardDesc}>{e.description}</p>
                      {e.requester_id && typeof e.requester_id === "object" && (
                        <div style={styles.userInfo}>
                          <span style={styles.userAvatar}>
                            {e.requester_id.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                          <div>
                            <p style={styles.userName}>{e.requester_id.name}</p>
                            <p style={styles.userPhone}>📞 {e.requester_id.phone}</p>
                            {e.requester_id.institution && (
                              <p style={styles.userPhone}>🏥 {e.requester_id.institution}</p>
                            )}
                            {e.requester_id.address && (
                              <p style={styles.userPhone}>📍 {e.requester_id.address}</p>
                            )}
                            <div style={{display:"flex", gap:"8px", marginTop:"4px", alignItems:"center"}}>
                              <span style={{fontSize:"10px", background:"#dcfce7", color:"#166534", padding:"1px 6px", borderRadius:"10px", fontWeight:"600"}}>
                                ⭐ {e.requester_id.trust_score || 0}
                              </span>
                              <span style={{fontSize:"10px", background:"#f1f5f9", color:"#475569", padding:"1px 6px", borderRadius:"10px", fontWeight:"600"}}>
                                📅 {e.requester_id.createdAt ? new Date(e.requester_id.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={styles.cardBottom}>
                    <div style={styles.cardMeta}>
                      {helperLoc && e.location?.coordinates && (
                        <span style={styles.metaTag}>
                          📍{" "}
                          {calcDistance(
                            helperLoc.lat,
                            helperLoc.lng,
                            e.location.coordinates[1],
                            e.location.coordinates[0]
                          )}{" "}
                          km away
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        className="btn-location"
                        onClick={() => {
                          if (e.location?.coordinates) {
                            setActiveTab("map");
                          }
                        }}
                      >
                        View Location
                      </button>
                      <button
                        className="btn-complete"
                        onClick={() => completeRequest(e._id)}
                      >
                        Mark Completed
                      </button>
                    </div>
                  </div>

                  {/* Mini Map */}
                  {e.location?.coordinates && (
                    <div style={{ marginTop: 12, borderRadius: 10, overflow: "hidden", height: 150, border: "1px solid rgba(255,255,255,0.1)" }}>
                      <MapContainer
                        center={[e.location.coordinates[1], e.location.coordinates[0]]}
                        zoom={14} zoomControl={false} dragging={false}
                        scrollWheelZoom={false} doubleClickZoom={false}
                        style={{ height: "100%", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
                        <Marker position={[e.location.coordinates[1], e.location.coordinates[0]]} icon={emergencyIcon} />
                        {helperLoc && <Marker position={[helperLoc.lat, helperLoc.lng]} icon={helperIcon}><Popup>You</Popup></Marker>}
                      </MapContainer>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── EMERGENCY MAP ── */}
          {activeTab === "map" && (
            <div className="map-section" style={styles.mapPanel}>
              <div style={styles.mapHeader}>
                <h2 style={styles.sectionTitle}>Emergency Map</h2>
                <span style={styles.liveBadge}>● LIVE</span>
              </div>

              <div style={styles.mapContainer}>
                <MapContainer
                  center={
                    helperLoc
                      ? [helperLoc.lat, helperLoc.lng]
                      : [12.9716, 77.5946]
                  }
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />

                  {/* Helper position */}
                  {helperLoc && (
                    <Marker
                      position={[helperLoc.lat, helperLoc.lng]}
                      icon={helperIcon}
                    >
                      <Popup>
                        <b>📍 Your Location</b>
                      </Popup>
                    </Marker>
                  )}

                  {/* Emergency markers */}
                  {[...emergencies, ...acceptedRequests].map((e) => {
                    if (!e.location?.coordinates) return null;
                    const lat = e.location.coordinates[1];
                    const lng = e.location.coordinates[0];
                    return (
                      <Marker
                        key={e._id}
                        position={[lat, lng]}
                        icon={emergencyIcon}
                      >
                        <Popup>
                          <div style={{ minWidth: 180 }}>
                            <h4 style={{ marginBottom: 6 }}>{e.category}</h4>
                            <p style={{ fontSize: 13, marginBottom: 6 }}>
                              {e.description}
                            </p>
                            <span className={urgencyBadgeClass(e.urgency_level)}>
                              {e.urgency_level || "Low"}
                            </span>
                            {helperLoc && (
                              <p
                                style={{
                                  fontSize: 12,
                                  color: "#6b7280",
                                  marginTop: 6,
                                }}
                              >
                                📍{" "}
                                {calcDistance(
                                  helperLoc.lat,
                                  helperLoc.lng,
                                  lat,
                                  lng
                                )}{" "}
                                km away
                              </p>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>

              <div style={styles.mapLegend}>
                <span style={styles.legendItem}>
                  <span
                    style={{
                      ...styles.legendDot,
                      background: "#EF4444",
                    }}
                  />
                  Emergencies
                </span>
                <span style={styles.legendItem}>
                  <span
                    style={{
                      ...styles.legendDot,
                      background: "#3B82F6",
                    }}
                  />
                  Your Location
                </span>
              </div>
            </div>
          )}

          {/* ── ACTIVITY TAB ── */}
          {activeTab === "activity" && (
            <div>
              <h3 style={styles.sectionHeader}>Your Contribution</h3>
              <div
                style={styles.activityGrid}
                className="helper-activity-grid"
              >
                <div className="activity-card">
                  <div
                    style={{
                      fontSize: 36,
                      marginBottom: 8,
                    }}
                  >
                    🤝
                  </div>
                  <h2 style={styles.activityNumber}>{stats.accepted}</h2>
                  <p style={styles.activityLabel}>Requests Accepted</p>
                </div>

                <div className="activity-card">
                  <div
                    style={{
                      fontSize: 36,
                      marginBottom: 8,
                    }}
                  >
                    ✅
                  </div>
                  <h2 style={styles.activityNumber}>{stats.completed}</h2>
                  <p style={styles.activityLabel}>Requests Completed</p>
                </div>

                <div className="activity-card">
                  <div
                    style={{
                      fontSize: 36,
                      marginBottom: 8,
                    }}
                  >
                    ⭐
                  </div>
                  <h2 style={{ ...styles.activityNumber, color: "#F59E0B" }}>
                    {stats.trust_score}
                  </h2>
                  <p style={styles.activityLabel}>Trust Score</p>
                </div>

                <div className="activity-card">
                  <div
                    style={{
                      fontSize: 36,
                      marginBottom: 8,
                    }}
                  >
                    🔥
                  </div>
                  <h2 style={styles.activityNumber}>
                    {stats.accepted + stats.completed}
                  </h2>
                  <p style={styles.activityLabel}>Total Interactions</p>
                </div>
              </div>

              {/* Motivational card */}
              <div style={styles.motivationCard}>
                <h3 style={{ marginBottom: 8, fontWeight: 700 }}>
                  🎯 Keep Going!
                </h3>
                <p style={{ opacity: 0.9, fontSize: 14, lineHeight: 1.6 }}>
                  Every request you complete builds trust and saves lives. You're
                  making a difference in your community. Stay available to receive
                  more emergency alerts!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── STYLES ──────────────────────────────────────────────

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
    maxWidth: "1000px",
    margin: "50px auto",
    padding: "20px",
  },

  // ── AVAILABILITY ────────────────────────

  availCard: {
    color: "white",
    padding: "32px 36px",
    borderRadius: "18px",
    marginBottom: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
  },

  availInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 20,
  },

  availTitle: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "6px",
  },

  availDesc: {
    opacity: 0.9,
    fontSize: "14px",
    maxWidth: 400,
  },

  availRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },

  pulseRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },

  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#34D399",
    animation: "pulse 1.5s infinite",
  },

  // ── HELPERS BADGE ───────────────────────

  helpersBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#1e293b",
    padding: "12px 20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    marginBottom: "25px",
    fontSize: 14,
    color: "#f8fafc",
  },

  helpersDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#10B981",
  },

  // ── STATS GRID ──────────────────────────

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "30px",
  },

  statBar: (color) => ({
    height: "4px",
    width: "100%",
    background: color,
    borderRadius: "10px",
    marginBottom: "12px",
  }),

  statHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  statDot: (color) => ({
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: color,
    flexShrink: 0,
  }),

  statLabel: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500",
    margin: 0,
  },

  statNumber: {
    fontSize: "34px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: 0,
  },

  statMeta: {
    fontSize: "13px",
    color: "#9ca3af",
    margin: 0,
  },

  divider: {
    height: "1px",
    background: "rgba(255, 255, 255, 0.1)",
    margin: "10px 0 25px",
  },

  // ── TAB BAR ─────────────────────────────

  tabBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  // ── CARD LIST ───────────────────────────

  cardList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  cardInfo: {
    flex: 1,
  },

  cardTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
  },

  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: 0,
    textTransform: "capitalize",
  },

  cardDesc: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
    lineHeight: 1.5,
  },

  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },

  cardMeta: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
  },

  metaTag: {
    fontSize: "13px",
    color: "#9ca3af",
    fontWeight: "500",
  },

  // ── EMPTY STATE ─────────────────────────

  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    background: "#1e293b",
    borderRadius: "16px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
    color: "#cbd5e1"
  },

  // ── MAP ─────────────────────────────────

  mapPanel: {
    background: "#1e293b",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  mapHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontWeight: "700",
    fontSize: "18px",
    margin: 0,
  },

  liveBadge: {
    background: "rgba(239, 68, 68, 0.2)",
    color: "#f87171",
    padding: "5px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  mapContainer: {
    height: "460px",
    borderRadius: "14px",
    overflow: "hidden",
  },

  mapLegend: {
    display: "flex",
    gap: 20,
    marginTop: 14,
    fontSize: 13,
    color: "#6b7280",
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    display: "inline-block",
  },

  // ── ACTIVITY ────────────────────────────

  sectionHeader: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "18px",
    marginTop: "10px",
  },

  activityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
    marginBottom: "25px",
  },

  activityNumber: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#f8fafc",
    margin: 0,
  },

  activityLabel: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: 6,
    fontWeight: "500",
  },

  motivationCard: {
    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    color: "white",
    padding: "28px 32px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(99,102,241,0.25)",
  },

  // ── USER DETAIL DISPLAY ─────────────────

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "12px",
    padding: "10px 14px",
    background: "#1e293b",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },

  userAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
    flexShrink: 0,
  },

  userName: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#f8fafc",
    margin: 0,
  },

  userPhone: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },
};

export default HelperDashboard;