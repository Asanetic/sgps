'use client';
import { GoogleMap, Marker, Polyline, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { hiveRoutes } from "../../../appConfigs/hiveRoutes";
import { loadSiteData } from "../loadSite";

export default function PlayBack({ devices = [] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });

  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(1);
  const [playing, setPlaying] = useState(false);

  // Flatten all device_logs into a single array of logs
  const allPoints = devices.flatMap(d => d.device_logs || []);

  // Now each 'p' in routePath is a single log object
  const routePath = allPoints.map(p => ({ lat: Number(p.y), lng: Number(p.x) }));


  const center = routePath.length
    ? routePath[0]
    : { lat: -1.2921, lng: 36.8219 };

  const handleMarkerClick = (point) => {
    setSelected(point);
    loadSiteData(point);
  };

  // 🎬 Gradual line animation
  useEffect(() => {
    if (!playing || routePath.length < 2) return;
    let index = 1;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (index >= routePath.length) {
          clearInterval(interval);
          return routePath.length;
        }
        index++;
        return index;
      });
    }, 2000); // speed — smaller = faster

    return () => clearInterval(interval);
  }, [playing, routePath.length]);

  const togglePlayback = () => {
    if (!playing) setProgress(1);
    setPlaying(!playing);
  };

  const visiblePath = routePath.slice(0, progress);

  console.log("Playback route path:", allPoints, `act points `, devices);

  return (
    <div style={{ position: "relative" }}>
      {!isLoaded ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>Loading Google Maps...</div>
      ) : (
        <GoogleMap
          mapContainerStyle={{ height: "100vh", width: "100%" }}
          center={visiblePath[visiblePath.length - 1] || center}
          zoom={13}
        >
          {/* 🧭 Gradual line draw */}
          {visiblePath.length > 1 && (
            <Polyline
              path={visiblePath}
              options={{
                strokeColor: "#007bff",
                strokeOpacity: 0.9,
                strokeWeight: 4,
                geodesic: true,
                icons: [
                  {
                    icon: {
                      path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                      scale: 3,
                      strokeColor: "#007bff",
                    },
                    offset: "100%",
                  },
                ],
              }}
            />
          )}

          {/* Device markers */}
          {allPoints.map((p, i) => (
            <Marker
              key={`marker-${i}`}
              position={{ lat: Number(p.y), lng: Number(p.x) }}
              onClick={() => handleMarkerClick(p)}
              icon={{
                url: `${hiveRoutes.hiveBaseRoute}/pin.png`,
                scaledSize: new window.google.maps.Size(50, 50),
              }}
            />
          ))}

          {/* Info window */}
          {selected && (
            <InfoWindow
              position={{ lat: Number(selected.y), lng: Number(selected.x) }}
              onCloseClick={() => setSelected(null)}
            >
              <div>
                <strong>{selected.device_name || "Device"}</strong>
                <br />
                <small>
                  {Number(selected.y).toFixed(4)}, {Number(selected.x).toFixed(4)}
                </small>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}

      {/* Playback button */}
      <button
        onClick={togglePlayback}
        style={{
          position: "absolute",
          top: "40%",
          left: 20,
          zIndex: 999,
          background: playing ? "#dc3545" : "#28a745",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        {playing ? "⏸ Pause" : "▶ Play"}
      </button>
    </div>
  );
}
