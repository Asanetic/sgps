'use client';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
import { hiveRoutes } from "../../appConfigs/hiveRoutes";
import { loadSiteData } from "./loadSite";

export default function SimpleMap({points = [] }) {

const apiKey=process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });
  const [selected, setSelected] = useState(null);

  if (!isLoaded) return <div>Loading Google Maps...</div>;

  const center = points.length
    ? { lat: Number(points[0].y), lng: Number(points[0].x) }
    : { lat: -1.2921, lng: 36.8219 };

    const handleMarkerClick = (point) => {
        setSelected(point);          // still open info window
        loadSiteData(point)
       // MosyCard(`Site  : ${point.name}`,<>Coordinates {Number(point.y).toFixed(4)} {Number(point.x).toFixed(4)}</>);
      };

  return (
    <GoogleMap
      mapContainerStyle={{ height: "100vh", width: "100%" }}
      center={center}
      zoom={14}
    >
      {points.map((p, i) => (
        <Marker
          key={i}
          position={{ lat: Number(p.y), lng: Number(p.x) }}
          onClick={() => handleMarkerClick(p)}
          icon={{
            url:  `${hiveRoutes.hiveBaseRoute}/logo.png`,       // path to your PNG in /public folder
            scaledSize: { width: 70, height: 70 }, // optional: resize
          }}
        />
      ))}
      {selected && (
        <InfoWindow
          position={{ lat: Number(selected.y), lng: Number(selected.x) }}
          onCloseClick={() => setSelected(null)}
        >
          <div>
            <strong>{selected.name}</strong>
            <br />
            <small>{Number(selected.y).toFixed(4)}, {Number(selected.x).toFixed(4)}</small>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
