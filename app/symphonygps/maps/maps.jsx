'use client';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
import { hiveRoutes } from "../../appConfigs/hiveRoutes";
import { loadSiteData } from "./loadSite";
import { DashSiteInfoData, FloatingSearchBar, GeofenceAlerts } from "../AppCore/coreUtils";

export default function SimpleMap({ points = [] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });
  const [selected, setSelected] = useState(null);

  if (!isLoaded) return <div>Loading Google Maps...</div>;

  const center = points.length
    ? { lat: Number(points[0].y), lng: Number(points[0].x) }
    : { lat: -1.2921, lng: 36.8219 };

  function handleMarkerClick(point) {
    setSelected(point);
    loadSiteData(point);
  }

  function handleMouseOver(point) {
    setSelected(point); // show InfoWindow as a tooltip
  }

  function handleMouseOut() {
    setSelected(null); // hide tooltip when leaving marker
  }

  return (
    <>
      <FloatingSearchBar />
      <GoogleMap
        mapContainerStyle={{ height: "100vh", width: "100%" }}
        center={center}
        zoom={12}
      >
        {points.map((p, i) => (
          <Marker
            key={i}
            position={{ lat: Number(p.y), lng: Number(p.x) }}
            onMouseOver={() => handleMouseOver(p)}
            onMouseOut={handleMouseOut}
            onClick={() => handleMarkerClick(p)}
            icon={{
              url: `${hiveRoutes.hiveBaseRoute}/logo.png`,
              scaledSize: new google.maps.Size(60, 60), // Use google.maps.Size for scaling
            }}
          />
        ))}

        <GeofenceAlerts title="Site alerts" />

        {selected && (
          <InfoWindow
            position={{ lat: Number(selected.y), lng: Number(selected.x) }}
            onCloseClick={() => setSelected(null)}
            options={{
              pixelOffset: new google.maps.Size(0, -40), // moves tooltip slightly above marker
            }}
          >
            <div style={{ maxWidth: "180px" }}>
              <strong>{selected.name || "Unnamed Site"}</strong>
              <br />
              <small>
                Lat: {Number(selected.y).toFixed(4)}, Lng:{" "}
                {Number(selected.x).toFixed(4)}
              </small>
              {selected.status && (
                <>
                  <br />
                  <span>Status: {selected.status}</span>
                </>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  );
}
