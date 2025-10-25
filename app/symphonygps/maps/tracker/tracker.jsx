'use client';
import { GoogleMap, Marker, InfoWindow, Polygon, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { MosyNotify } from "../../../MosyUtils/ActionModals";
import { computeGeofence, GeofenceAlerts, loadTackerProfile } from "../../AppCore/coreUtils";
import { hiveRoutes } from "../../../appConfigs/hiveRoutes";

export default function Tracker({ devices = [] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });
  const [selected, setSelected] = useState(null);
  const  [geofenceAlerts, setGeofenceAlerts] = useState([]);

  console.log("Tracker devices data:", devices);

  useEffect(() => {
    if (!isLoaded) return;
  
    let alerts = [];
  
    devices.forEach(({ latestPoint, geofences = [] }) => {
      if (!latestPoint) return;
  
      geofences.forEach((fence) => {
        const insideFence = computeGeofence(latestPoint, fence.coords)?.[0]?.inside;
        if (insideFence === false) {

          MosyNotify({
            icon: 'warning',
            iconColor: 'text-danger',
            message: `⚠️ Geofence Alert: ${latestPoint.device_name} has exited ${fence.device_name}'s area!`,
            addTimer: false,
            id:"modal3"
          });

          
          alerts.push(latestPoint);
        }
      });
    });
  
    setGeofenceAlerts(alerts); // ✅ update state
  }, [isLoaded, devices]);

  

  if (!isLoaded) return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h4>Loading Google Maps...</h4>
    </div>
  );

  const handleMarkerClick = (point) => {
    setSelected(point);
    loadTackerProfile(point);
  };

  // Default center to first available latestPoint or fallback to Nairobi
  const allPoints = devices.map(d => d.latestPoint).filter(Boolean);
  const center = allPoints.length
    ? { lat: Number(allPoints[0].y), lng: Number(allPoints[0].x) }
    : { lat: -1.2921, lng: 36.8219 };

  return (
    <GoogleMap
      mapContainerStyle={{ height: "100vh", width: "100%" }}
      center={center}
      zoom={13}
      onRightClick={(e) => {
        e.domEvent.preventDefault();
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        MosyNotify({
          icon: `map-marker`,
          message: `y:${lat.toFixed(6)}, x:${lng.toFixed(6)}`,
          addTimer: false
        });
      }}
    >
      {allPoints.map((p, i) => (
        <Marker
          key={`marker-${i}`}
          position={{ lat: Number(p.y), lng: Number(p.x) }}
          onClick={() => handleMarkerClick(p)}
          icon={{
            url: `${hiveRoutes.hiveBaseRoute}/logo.png`,
            scaledSize: new window.google.maps.Size(55, 55),
          }}
        />
      ))}

      {devices.flatMap(d => d.geofences || []).map((fence, idx) => (
        <Polygon
          key={`fence-${idx}`}
          paths={fence.coords.map(c => ({ lat: c.y, lng: c.x }))}
          options={{
            strokeColor: "#28a745",
            strokeOpacity: 0.9,
            strokeWeight: 2,
            fillColor: "#28a745",
            fillOpacity: 0.15,
          }}
        />
    
    ))}

    {/* Render floating alerts card */}
    <GeofenceAlerts alerts={geofenceAlerts} title="Geofence alerts" />

      {selected && (
        <InfoWindow
          position={{ lat: Number(selected.y), lng: Number(selected.x) }}
          onCloseClick={() => setSelected(null)}
        >
          <div>
            <strong>{selected.device_name}</strong>
            <br />
            <small>
              {Number(selected.y).toFixed(4)}, {Number(selected.x).toFixed(4)}
            </small>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
