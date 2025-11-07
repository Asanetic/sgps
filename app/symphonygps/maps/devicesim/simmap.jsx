'use client';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
import { MosyNotify } from "../../../MosyUtils/ActionModals";
import { logDeviceLocation } from "../../AppCore/coreUtils";

export default function SimMap({ points = [] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });
  const [selected, setSelected] = useState(null);
  const [clickedMarker, setClickedMarker] = useState(null); // <-- store clicked point

  if (!isLoaded) return <div>Loading Google Maps...</div>;

  const center = points.length
    ? { lat: Number(points[0].y), lng: Number(points[0].x) }
    : { lat: -1.2921, lng: 36.8219 };

  return (
    <GoogleMap
      mapContainerStyle={{ height: "100vh", width: "100%" }}
      center={center}
      zoom={14}
      onClick={(e) => {
        e.domEvent.preventDefault();
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();


        // Show notification
        //MosyNotify({ icon: `map-marker`, message: `y:${lat.toFixed(6)}, x:${lng.toFixed(6)}`, addTimer: false });
        const device = {x : lng, y: lat, name: 'Simulated Device test'};

        logDeviceLocation(device);

        // Add marker on map
        setClickedMarker({ lat, lng });
      }}
    >
      {/* Marker for clicked point */}
      {clickedMarker && <Marker position={clickedMarker} />}

      {/* Info Window */}
      {selected && (
        <InfoWindow
          position={{ lat: Number(selected.y), lng: Number(selected.x) }}
          onCloseClick={() => setSelected(null)}
        >
          <div>
            <strong>{selected.name}</strong>
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
