import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32]
});

// Component to handle map click events
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

function LocationPickerMap({ onLocationSelect }) {

  const [position, setPosition] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  // Reverse geocode a lat/lng
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`
      );
      const data = await res.json();
      setLocationName(data.display_name || "");
    } catch {
      setLocationName("");
    }
  };

  // Auto-detect on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition([lat, lng]);
          setLoading(false);
          reverseGeocode(lat, lng);
          if (onLocationSelect) onLocationSelect(lat, lng);
        },
        () => {
          // Fallback to Bangalore
          setPosition([12.9716, 77.5946]);
          setLoading(false);
          if (onLocationSelect) onLocationSelect(12.9716, 77.5946);
        }
      );
    } else {
      setPosition([12.9716, 77.5946]);
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle map click / marker move
  const handleLocationChange = (lat, lng) => {
    setPosition([lat, lng]);
    reverseGeocode(lat, lng);
    if (onLocationSelect) onLocationSelect(lat, lng);

    // Pan map to new position
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], mapRef.current.getZoom());
    }
  };

  // Use current GPS
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleLocationChange(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          console.log("Could not get current location");
        }
      );
    }
  };

  if (loading || !position) {
    return (
      <div style={styles.loadingBox}>
        <div style={styles.spinner} />
        <p style={{ color: "#94a3b8", marginTop: 10, fontSize: 13 }}>Detecting location...</p>
      </div>
    );
  }

  return (
    <div>

      {/* Location info header */}
      <div style={styles.locationHeader}>
        <span style={styles.locationIcon}>📍</span>
        <div style={{ flex: 1 }}>
          <p style={styles.locationTitle}>Emergency Location</p>
          <p style={styles.locationText}>
            {locationName || `${position[0].toFixed(4)}, ${position[1].toFixed(4)}`}
          </p>
        </div>
        <button
          type="button"
          style={styles.gpsBtn}
          onClick={useCurrentLocation}
          onMouseEnter={(e) => { e.target.style.background = "#6366F1"; e.target.style.color = "white"; }}
          onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#6366F1"; }}
        >
          📡 Use My GPS
        </button>
      </div>

      {/* Interactive map */}
      <MapContainer
        ref={mapRef}
        center={position}
        zoom={14}
        zoomAnimation={false}
        style={{ height: "300px", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <Marker
          position={position}
          icon={markerIcon}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const ll = e.target.getLatLng();
              handleLocationChange(ll.lat, ll.lng);
            }
          }}
        />
        <MapClickHandler onLocationSelect={handleLocationChange} />
      </MapContainer>

      <p style={styles.hint}>
        Click on the map or drag the pin to set the emergency location
      </p>
    </div>
  );
}

const styles = {

  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },

  spinner: {
    width: 30,
    height: 30,
    border: "3px solid rgba(255,255,255,0.1)",
    borderTop: "3px solid #6366F1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  locationHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px"
  },

  locationIcon: {
    fontSize: "20px"
  },

  locationTitle: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#f8fafc",
    margin: 0,
  },

  locationText: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: "2px 0 0",
  },

  gpsBtn: {
    background: "transparent",
    color: "#6366F1",
    border: "1.5px solid #6366F1",
    padding: "6px 14px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },

  hint: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: "8px 0 0",
    textAlign: "center",
  },

};

export default LocationPickerMap;
