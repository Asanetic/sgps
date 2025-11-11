// app/symphonygps/maps/MapSwitcher.jsx
"use client";
import { useState, useEffect } from "react";
import SiteMapData from "./mapdata";
import TrackerMapData from "../tracker/trackerdata";
import { mosyUrlParam } from "../../../MosyUtils/hiveUtils";

export default function MapSwitcher() {
  const [activeMap, setActiveMap] = useState("simple");
  const [deviceKey, setDeviceKey] = useState("");

  // Update title + initial device key
  useEffect(() => {
    document.title =
      activeMap === "simple"
        ? "Simple Map - SymphonyGPS"
        : "Tracker Map - SymphonyGPS";

    setDeviceKey(mosyUrlParam("device_key"));
  }, [activeMap]);

  // Listen to external device key updates
  useEffect(() => {
    const handleDeviceKeyChange = (e) => {
      setDeviceKey(e.detail.deviceKey);
      setActiveMap("tracker"); // optional: automatically switch to tracker
    };

    window.addEventListener("deviceKeyChanged", handleDeviceKeyChange);
    return () => window.removeEventListener("deviceKeyChanged", handleDeviceKeyChange);
  }, []);

  return (
    <>
      <div className="text-right col-md-12 ">
        <button
          type="button"
          className="btn text-info "
          onClick={() => setActiveMap("simple")}
          disabled={activeMap === "simple"}
        >
        View site Map <i className="fa fa-arrow-right"></i>
        </button>
        <button
          className="btn btn-outline-success d-none"
          onClick={() => setActiveMap("tracker")}
          disabled={activeMap === "tracker"}
        >
          Tracker Map
        </button>
      </div>

      {activeMap === "simple" ? (
        <SiteMapData />
      ) : (
        <TrackerMapData className="col-md-12 mb-4" device_id={deviceKey} />
      )}
    </>
  );
}
