'use client';

import { GoogleMap, Marker, InfoWindow, Polyline, Circle, useLoadScript } from "@react-google-maps/api";

import { useState, useEffect, useRef } from "react";
import { MosyNotify } from "../../../MosyUtils/ActionModals";
import {
  FloatingSearchBar,
  loadTrackerDataCard,
} from "../../../symphonygps/AppCore/coreUtils";

import { hiveRoutes } from "../../../appConfigs/hiveRoutes";
import { MosyTitleTag } from "../../../symphonygps/UiControl/componentControl"; 
import { mosyUrlParam } from "../../../MosyUtils/hiveUtils";
import DeviceProfileDetails from "../../../symphonygps/devicesummary/uiControl/DeviceProfileDetails";

export default function Tracker({ devices = [] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });

  const [selected, setSelected] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  // --- Smooth animated marker position ---
  const [animatedPos, setAnimatedPos] = useState(null);
  const animationRef = useRef(null);
  const [trail, setTrail] = useState([]);


  const [myLocation, setMyLocation] = useState(null);
  const [showMyInfo, setShowMyInfo] = useState(false);
  const [locating, setLocating] = useState(false);

  function handleLocateMe() 
  {
    if (!navigator.geolocation) {
      MosyNotify({ icon: "error", message: "Geolocation not supported" });
      return;
    }
  
    setLocating(true);
  
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
  
        setMyLocation(coords);
        setShowMyInfo(true);
        setLocating(false);
  
        if (mapRef) {
          mapRef.panTo(coords);
          mapRef.setZoom(15);
        }
      },
      () => {
        MosyNotify({ icon: "error", message: "Unable to get your location" });
        setLocating(false);
      },
      { enableHighAccuracy: true }
    );
  }
  

  function animateMove(from, to, duration = 1200) {
    if (!from || !to) return;

    cancelAnimationFrame(animationRef.current);
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // smooth easing

      const lat = from.lat + (to.lat - from.lat) * ease;
      const lng = from.lng + (to.lng - from.lng) * ease;

      setAnimatedPos({ lat, lng });

      if (progress < 1) animationRef.current = requestAnimationFrame(step);
    }

    animationRef.current = requestAnimationFrame(step);
  }

  const allPoints = devices.map(d => d.latestPoint).filter(Boolean);

  // Default center
  const center = allPoints.length
    ? { lat: Number(allPoints[0].y), lng: Number(allPoints[0].x) }
    : { lat: -1.2921, lng: 36.8219 };

  // Animate whenever the latest position changes
  useEffect(() => {
    if (!devices?.[0]?.latestPoint) return;
  
    const next = {
      lat: Number(devices[0].latestPoint.y),
      lng: Number(devices[0].latestPoint.x),
    };
  
    // add to trail (limit to last 200 points)
    setTrail(prev => [...prev, next].slice(-200));
  
    // first load = jump to position
    if (!animatedPos) {
      setAnimatedPos(next);
      return;
    }
  
    animateMove(animatedPos, next, 1200);
  }, [devices?.[0]?.latestPoint]);
  

  const handleMarkerClick = (point) => {
    setSelected(point);
    loadTrackerDataCard(point);
  };

  function handleDeviceSelect(deviceArray) {
    const device = deviceArray[0];
    if (!device || !device.latestPoint) return;

    const lat = Number(device.latestPoint.y);
    const lng = Number(device.latestPoint.x);

    if (mapRef) {
      mapRef.panTo({ lat, lng });
      mapRef.setZoom(12);
    }

    setSelected({
      ...device.latestPoint,
      device_name: device.device_name,
      record_id: device.device_data?.record_id,
    });
  }

  const deviceData = devices[0];
  let title = "Device locations";

  if (devices.length === 1 && deviceData) {
    title = `Realtime device tracker : ${deviceData.device_name}`;
  }

  const deviceListUpToken = mosyUrlParam("device_list_uptoken");

  if (!isLoaded) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h4>Loading Google Maps...</h4>
      </div>
    );
  }

  return (
    <>
      <MosyTitleTag title={title} />

      {devices.length > 1 && (
        <FloatingSearchBar
          showSiteSearch={false}
          onDeviceSelectFull={handleDeviceSelect}
        />
      )}

      <button
        onClick={handleLocateMe}
        style={{
          position: "absolute",
          top: "80px",
          right: "15px",
          zIndex: 10,
          display: "none",
          padding: "10px 14px",
          borderRadius: "30px",
          border: "none",
          background: "#111",
          color: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          cursor: "pointer",
        }}
      >
        {locating ? "Locating..." : "📍 My Location"}
      </button>

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
            icon: "map-marker",
            message: `y:${lat.toFixed(6)}, x:${lng.toFixed(6)}`,
            addTimer: false,
          });
        }}
      >

      {/* {trail.length > 1 && (
        <Polyline
          path={trail}
          options={{
            strokeColor: "#2E86DE",
            strokeOpacity: 0.9,
            strokeWeight: 3,
          }}
        />
      )} */}


        {/* Smooth animated marker */}
        {animatedPos && (
          <Marker
            position={animatedPos}
            icon={{
              url: `${hiveRoutes.hiveBaseRoute}/logo.png`,
              scaledSize: new window.google.maps.Size(55, 55),
            }}
            onClick={() => handleMarkerClick(devices?.[0]?.latestPoint)}
          />
        )}

{myLocation && (
  <>
    {/* Blue dot marker */}
    <Marker
      position={{ lat: myLocation.lat, lng: myLocation.lng }}
      icon={{
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      }}
      onClick={() => setShowMyInfo(true)}
    />

    {/* Accuracy circle */}
    <Circle
      center={{ lat: myLocation.lat, lng: myLocation.lng }}
      radius={myLocation.accuracy || 30}
      options={{
        fillColor: "#4285F4",
        fillOpacity: 0.15,
        strokeColor: "#4285F4",
        strokeOpacity: 0.4,
        strokeWeight: 1,
      }}
    />

      {/* Info window */}
      {showMyInfo && (
        <InfoWindow
          position={{ lat: myLocation.lat, lng: myLocation.lng }}
          onCloseClick={() => setShowMyInfo(false)}
        >
          <div style={{ fontSize: "14px" }}>
            <strong>📍 My Location</strong>
            <br />
            Y: {myLocation.lat.toFixed(6)}
            <br />
            X: {myLocation.lng.toFixed(6)}
            <br />
            Accuracy: ±{Math.round(myLocation.accuracy)}m
          </div>
        </InfoWindow>
      )}
    </>
    )}

{/* 
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
        )} */}
      </GoogleMap>

      {deviceListUpToken && deviceListUpToken.trim() !== "" && (
        <DeviceProfileDetails
          dataIn={{
            showNavigationIsle: false,
            customQueryStr: `WHERE record_id='${deviceData.record_id}'`,
          }}
        />
      )}
    </>
  );
}
