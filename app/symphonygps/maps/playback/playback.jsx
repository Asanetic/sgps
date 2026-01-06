"use client";
import { GoogleMap, Marker, Polyline, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { hiveRoutes } from "../../../appConfigs/hiveRoutes";
import { loadSiteData } from "../loadSite";
import { MosyTitleTag } from "../../UiControl/componentControl";
import { FloatingSearchBar, loadTrackerPlayBack } from "../../AppCore/coreUtils";
import { mosyBtoa, mosyFormatDateTime, mosyUrlParam } from "../../../MosyUtils/hiveUtils";

export default function PlayBack({ devices = [] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });

  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000); // ms between points
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Flatten all device_logs into a single array of logs
  const allPoints = devices.flatMap(d => d.device_logs || []);
  const routePath = allPoints.map(p => ({ lat: Number(p.y), lng: Number(p.x) }));

  const center = routePath.length ? routePath[0] : { lat: -1.2921, lng: 36.8219 };

  const handleMarkerClick = (point) => setSelected(point);

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
    }, speed);

    return () => clearInterval(interval);
  }, [playing, routePath.length, speed]);

  useEffect(() => {
      
    const startDate = mosyUrlParam("start_date")
    const endDate = mosyUrlParam("end_date")

    if(startDate!="" && endDate!="")
    {
      setStartDate(startDate)
      setEndDate(endDate)
    }
  }, [])  

  useEffect(() => {
    const playbackParam = mosyUrlParam("playback");
  
    // only auto-play if we have enough points to animate
    if (playbackParam === "true" && allPoints.length > 1) {
      setProgress(1);
      setPlaying(true);
    }
  }, [allPoints.length]);

  
  const setPlaybackDates = () => {
    window.location=`../maps/playback?device=${mosyBtoa(devices[0].device_data.primkey)}&start_date=${startDate}&end_date=${endDate}&playback=true` 
  };

  const visiblePath = routePath.slice(0, progress);

  function switchDevice(device)
  {
    const deviceKey = device[0].device_data.primkey;

    console.log(`switc deviceeeeee `, deviceKey)
    window.location=`${hiveRoutes.cms}/maps/playback?device=${mosyBtoa(deviceKey)}`
  }

  const deviceData = devices[0];
  let title = "Tracker Playback";

  let dateRemark = startDate && endDate ? ` | Date filter  : (${mosyFormatDateTime(startDate)} - ${mosyFormatDateTime(endDate)})` : " no date filter";

  if (devices.length === 1 && deviceData) {
    title = `Tracker playback : ${deviceData.device_name} ${dateRemark}`;
  }

  const currentPoint = visiblePath[Math.min(progress - 1, visiblePath.length - 1)];


  return (
    <div style={{ position: "relative" }}>
      {!isLoaded ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>Loading Google Maps...</div>
      ) : (
        <>
        <MosyTitleTag title={title}/>
        <FloatingSearchBar showSiteSearch={false} showTrakerSearch={true} onDeviceSelectFull={switchDevice}/>
        <GoogleMap
          mapContainerStyle={{ height: "100vh", width: "100%" }}
          center={visiblePath[visiblePath.length - 1] || center}
          zoom={13}
        >
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
{/* 
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
          ))} */}

          {currentPoint && (
            <Marker
              position={currentPoint}
              icon={{
                url: `${hiveRoutes.hiveBaseRoute}/pin.png`,
                scaledSize: new window.google.maps.Size(50, 50),
              }}
            />
          )}

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
        </>
      )}

      {/* 🧭 Floating Control Panel */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: 20,
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "10px",
          padding: "12px 16px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          width: "220px",
          fontSize: "14px"
        }}
      >
        <label>
          Start Date:
          <input
            type="datetime-local"
            id="startDate"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={{
              width: "100%",
              marginTop: 4,
              padding: "5px 6px",
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />
        </label>

        <label>
          End Date:
          <input
           id="endDate"
            type="datetime-local"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            style={{
              width: "100%",
              marginTop: 4,
              padding: "5px 6px",
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />
        </label>

        <label>
          Speed: {Math.round(2000 / speed * 100)}%
          <input
            type="range"
            min="200"
            max="3000"
            step="100"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>

        <button
          onClick={setPlaybackDates}
          style={{
            background: playing ? "#dc3545" : "#331050",
            color: "#fff",
            padding: "10px 15px",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.3)"
          }}
        >
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>
    </div>
    
  );
}
