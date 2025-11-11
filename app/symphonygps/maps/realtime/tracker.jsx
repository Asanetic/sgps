'use client';
import { GoogleMap, Marker, InfoWindow, Polygon, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { MosyNotify } from "../../../MosyUtils/ActionModals";
import GeofenceMonitor, { computeGeofence, FloatingSearchBar, GeofenceAlerts, loadTackerProfile, loadTrackerDataCard, useGeofenceAlerts } from "../../AppCore/coreUtils";
import { hiveRoutes } from "../../../appConfigs/hiveRoutes";
import { MosyTitleTag } from "../../UiControl/componentControl";
import DeviceSummaryDetails from "../../devicesummary/uiControl/DevicesummaryDetails";
import { mosyUrlParam } from "../../../MosyUtils/hiveUtils";

export default function Tracker({ devices = [] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });
  const [selected, setSelected] = useState(null);
  const [mapRef, setMapRef] = useState(null);     // map instance

  console.log("Tracker devices data:", devices);

  if (!isLoaded) return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h4>Loading Google Maps...</h4>
    </div>
  );

  const handleMarkerClick = (point) => {
    setSelected(point);
    loadTrackerDataCard(point);
  };


  function handleDeviceSelect(deviceArray) {
    const device = deviceArray[0];
    if (!device || !device.latestPoint) return;
  
    const lat = Number(device.latestPoint.y);
    const lng = Number(device.latestPoint.x);
  
    console.log("Selected device:", device.device_name, lat, lng);
  
    // Safe check for map reference
    if (mapRef) {
      mapRef.panTo({ lat, lng });
      mapRef.setZoom(12);
    } else {
      console.warn("Map reference not ready yet");
    }
  
    // Build marker-friendly data (ensures InfoWindow works)
    const markerPoint = {
      ...device.latestPoint,
      device_name: device.device_name,
      record_id: device.device_data?.record_id,
    };
  
    setSelected(markerPoint);
  }
  

  // Default center to first available latestPoint or fallback to Nairobi
  const allPoints = devices.map(d => d.latestPoint).filter(Boolean);
  const center = allPoints.length
    ? { lat: Number(allPoints[0].y), lng: Number(allPoints[0].x) }
    : { lat: -1.2921, lng: 36.8219 };

    const deviceData = devices[0];
    let title = "Device locations";
  
    if (devices.length === 1 && deviceData) {
      title = `Realtime device tracker : ${deviceData.device_name}`;
    }

    const deviceListUpToken = mosyUrlParam("device_list_uptoken");

    //
  return (
    <><MosyTitleTag title={title}/>
    {devices.length > 1 && (
    <FloatingSearchBar showSiteSearch={false} onDeviceSelectFull={handleDeviceSelect} />
    )}
    <GoogleMap
      onLoad={(map) => setMapRef(map)}
      mapContainerStyle={{ height: "100vh", width: "100%" }}
      center={center}
      zoom={12}
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
    <GeofenceMonitor title="Asset alerts"/>
      
    {selected && (
      <InfoWindow
        position={{ lat: Number(selected.y), lng: Number(selected.x) }}
        onCloseClick={() => setSelected(null)}
        options={{ pixelOffset: new google.maps.Size(0, -40) }}
      >
        <div style={{ maxWidth: "450px", maxHeight: "400px", overflowY: "auto" }}>
          {loadTrackerDataCard(selected)}
        </div>
      </InfoWindow>
    )}

    </GoogleMap>

      {deviceListUpToken && deviceListUpToken.trim() !== "" && (
        <DeviceSummaryDetails
          dataIn={{
            showNavigationIsle: false,
            customQueryStr: `WHERE record_id='${deviceData.record_id}'`,
          }}
        />
      )}

    </>
  );
}
