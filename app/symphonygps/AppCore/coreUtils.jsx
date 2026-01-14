import React, { useState, useEffect, useRef } from "react";

import { mosy_push_data, mosyBtoa, mosyGetData, mosyGetElemVal, mosyPostData, mosyPostFormData, mosyUpdateUrlParam , mosyFormatDateTime, mosyGetLSData} from "../../MosyUtils/hiveUtils";
import { closeMosyModal, MosyAlertCard, MosyNotify } from "../../MosyUtils/ActionModals";

import { getApiRoutes } from '../AppRoutes/apiRoutesHandler';
import {filterDataByDate, LiveSearchDropdown, MosyDateRangeFilter} from "../UiControl/componentControl"
import DevicelistProfile from "../devices/uiControl/DevicelistProfile";
import { closeMosyCard, MosyCard } from "../../components/MosyCard";
import { PlayBackMapData } from "../maps/playback/playbackdata";
import {loadSiteData} from "../maps/loadSite";
import { hiveRoutes } from "../../appConfigs/hiveRoutes";
import { MosyLiveSearch } from "../UiControl/customUI";

const apiRoutes = getApiRoutes(); // Use the imported JSON directly

// ====================
// Send SMS
// ====================
export function viewLastGPS(device_id)
{

  MosyCard(`Device Playback`, <PlayBackMapData device_id={device_id}/>, true, "topmost", "mosycard_wide");
  
}

// Convert your geofence string into an array of lat/lng objects
export function parseGeofence(geofenceStr) {
  if (!geofenceStr) return [];

  // Split by commas for each coordinate object
  const coords = geofenceStr.split("\n").map(line => {
    // Remove braces and whitespace
    const clean = line.replace(/[{}]/g, "").trim();
    // Split x and y
    const [yPart, xPart] = clean.split(",");
    if (!xPart || !yPart) return null;

    const x = parseFloat(xPart.split(":")[1]);
    const y = parseFloat(yPart.split(":")[1]);

    if (isNaN(x) || isNaN(y)) return null;
    return { y: y, x: x };
  }).filter(Boolean); // remove nulls

  //console.log(`Parsed geofence coords:  ${geofenceStr} `, coords);
  return coords;
}

//geofence 
/**
 * Check if a point is inside a polygon (geofence)
 * @param {{x:number, y:number}} point - point to check (lng=x, lat=y)
 * @param {{x:number, y:number}[]} polygon - array of vertices [{x, y}, ...]
 * @returns {boolean} true if inside, false if outside
 */

export function computeGeofence(points, polygon) {
  if (!Array.isArray(points)) points = [points];

  return points.map(p => {
    const x = Number(p.x);
    const y = Number(p.y);
    let inside = false;
    const n = polygon.length;

    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xi = Number(polygon[i].x), yi = Number(polygon[i].y);
      const xj = Number(polygon[j].x), yj = Number(polygon[j].y);

      const intersect = ((yi > y) !== (yj > y)) &&
                        (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return { ...p, inside };
  });
}


/**
 * Generate geofence corners around a center point
 * @param {number} lat - center latitude (y)
 * @param {number} lng - center longitude (x)
 * @param {number} distance - half-side distance in meters
 * @returns {{x:number, y:number}[]} array of corner points (clockwise or counter-clockwise)
 */
export function generateGeofence(lat, lng, distance) {
  const earthRadius = 6378137; // meters (WGS-84)

  // Latitude: 1 deg = ~111.32 km
  const deltaLat = (distance / earthRadius) * (180 / Math.PI);
  // Longitude delta depends on latitude
  const deltaLng = (distance / earthRadius) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);

  return [
    { x: lng - deltaLng, y: lat - deltaLat }, // SW
    { x: lng + deltaLng, y: lat - deltaLat }, // SE
    { x: lng + deltaLng, y: lat + deltaLat }, // NE
    { x: lng - deltaLng, y: lat + deltaLat }, // NW
  ];
}


export function logDeviceLocation(device) {
  const lat = device.y;
  const lng = device.x;
  const deviceName = device.name || "Unknown Device";

  const cardBody = (
    <div className="col-md-12 p-2 m-0 text-left">
      <LiveSearchDropdown
          apiEndpoint={apiRoutes.devicelist.base}
          tblName="device_list"
          parentTable="gps_logs"
          inputName="txt__device_list_device_name_device_id"
          hiddenInputName="txt_device_id"
          valueField="record_id"
          displayField="device_name"
          label="Device Name"
          onSelect={(id) =>{ console.log("Just the ID:", id); device.device_id = id; }}
          onSelectFull={(dataRes) =>  console.log("Data seleted")}
          defaultColSize="col-md-12 hive_data_cell"
          context={{hostParent : "logDeviceLocation"}}
         />

      <div className="col-md-12 ">            
      <p><strong>Latitude (y):</strong> {lat.toFixed(6)}</p>
      <p><strong>Longitude (x):</strong> {lng.toFixed(6)}</p>
      <div className="col-md-12 text-right">            
        <button
          className="btn btn-primary mt-2"
          onClick={() => {sendDeviceLocationLog(device);}}
        >
          Send Log
        </button>
        </div>
      </div>
    </div>
  );

  MosyCard(
   "Confirm Send device location data",
    cardBody,
    true,
    "modal2"
  );
}

export  function loadTackerProfile(sitedata)
{
    mosyUpdateUrlParam("device_list_uptoken", mosyBtoa(sitedata.token || sitedata.primkey || ""));
    MosyCard("",<DevicelistProfile dataIn={{showNavigationIsle:false}}/>,true, "modal1","mosycard_wide")
    
}


export function GeofenceAlerts({ alerts = [], title = "Alarms" }) {
  const audioRef = useRef(null);
  const prevAlarmCountRef = useRef(0);
  const hasUnlockedRef = useRef(false);

  const [audioReady, setAudioReady] = useState(false);
  const [userMuted, setUserMuted] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const alarmListUiList = LoadAlarmListUi();
  
  // Calculate current alarm count
  const savedAlarmCount = parseInt(mosyGetLSData("alarm_list_count") || "0", 10);
  const currentAlarmCount = alerts.length + savedAlarmCount;
  const hasAlerts = currentAlarmCount > 0 || alarmListUiList !== null;

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio("/alarm.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  // Unlock audio on first user interaction (required by browsers)
  useEffect(() => {
    function unlockAudio() {
      if (hasUnlockedRef.current || !audioRef.current) return;

      const audio = audioRef.current;
      audio.muted = true;
      
      audio.play()
        .then(() => {
          audio.pause();
          audio.muted = false;
          audio.currentTime = 0;
          hasUnlockedRef.current = true;
          setAudioReady(true);
        })
        .catch((err) => {
          console.warn("Audio unlock failed:", err.message);
        });
    }

    // document.addEventListener("click", unlockAudio);
    // document.addEventListener("touchstart", unlockAudio);
    // document.addEventListener("keydown", unlockAudio);

    return () => {
      // document.removeEventListener("click", unlockAudio);
      // document.removeEventListener("touchstart", unlockAudio);
      // document.removeEventListener("keydown", unlockAudio);
    };
  }, []);

// Play/stop sound based on alerts and mute state
useEffect(() => {
  if (!audioReady || !audioRef.current) return;

  const audio = audioRef.current;
  const prevCount = prevAlarmCountRef.current;
  const isNewAlarm = currentAlarmCount > prevCount;
  const shouldPlay = hasAlerts && !userMuted;

  // Force play on NEW alarm, regardless of mute state
  if (isNewAlarm && hasAlerts) {
    // Reset mute so user sees unmuted state
    if (userMuted) {
      setUserMuted(false);
    }
    
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn("Audio play failed:", err.message);
        setIsPlaying(false);
      });
  }
  // Normal play: has alerts, not muted, not already playing
  else if (shouldPlay && !isPlaying) {
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn("Audio play failed:", err.message);
        setIsPlaying(false);
      });
  }
  // Stop only if: no alerts OR user muted (and NOT a new alarm)
  else if (!shouldPlay && isPlaying && !isNewAlarm) {
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  }

  // Update previous count
  prevAlarmCountRef.current = currentAlarmCount;
}, [currentAlarmCount, hasAlerts, userMuted, audioReady, isPlaying]);

  // Handle mute/unmute toggle
  function handleSoundToggle() {
    const audio = audioRef.current;
    if (!audio) return;

    // If audio not ready, try to unlock first
    if (!audioReady) {
      audio.muted = true;
      audio.play()
        .then(() => {
          audio.pause();
          audio.muted = false;
          audio.currentTime = 0;
          hasUnlockedRef.current = true;
          setAudioReady(true);
          setUserMuted(false);
        })
        .catch((err) => {
          console.warn("Manual unlock failed:", err.message);
        });
      return;
    }

    // Toggle mute state
    const newMutedState = !userMuted;
    setUserMuted(newMutedState);

    if (newMutedState) {
      // Muting - stop audio
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    } else {
      // Unmuting - play if there are alerts
      if (hasAlerts) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn("Play on unmute failed:", err.message);
          });
      }
    }
  }

  // Determine button text
  function getSoundButtonText() {
    if (!audioReady) return "🔇 Enable Sound";
    if (userMuted) return "🔇 Unmute";
    return "🔊 Mute";
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setShowAlerts((prev) => !prev)}
        className="position-fixed rounded-circle shadow"
        style={{
          bottom: "20px",
          right: "20px",
          width: "55px",
          height: "55px",
          zIndex: 10000,
          border: "none",
          background: hasAlerts ? "#dc3545" : "#6c757d",
          color: "white",
          fontSize: "22px",
        }}
      >
        {showAlerts ? "✖" : "🚨"}
        {hasAlerts && !showAlerts && (
          <span
            className="position-absolute"
            style={{
              top: "-5px",
              right: "-5px",
              background: "#ffc107",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {currentAlarmCount}
          </span>
        )}
      </button>

      {/* Alerts panel */}
      {showAlerts && (
        <div
          className="position-fixed bottom-50 end-0 translate-middle-y p-3"
          style={{
            width: "300px",
            maxHeight: "70vh",
            overflowY: "auto",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
          }}
        >
          <div className="card shadow-sm border rounded">
            <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
              <strong>
                {title} {currentAlarmCount > 0 && `(${currentAlarmCount})`}
              </strong>
              <button
                type="button"
                className={`btn btn-sm ${
                  !userMuted && audioReady ? "btn-light" : "btn-outline-light"
                }`}
                onClick={handleSoundToggle}
              >
                {getSoundButtonText()}
              </button>
            </div>
            <div className="card-body p-3">
              {hasAlerts ? (
                <ul className="list-group list-group-flush">
                  <span>{alarmListUiList}</span>

                </ul>
              ) : (
                <p className="text-center text-muted mb-0">No active alarms</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

//goto alarm list 
export function gotoAlarmList(alarmkey) {

  window.location = `${hiveRoutes.cms}/assetalarms/list?asset_alarms_mosyfilter=${btoa(` primkey = '${alarmkey}' `)}`  

}

export function LoadAlarmListUi() {
  const [alarmList, setAlarmsList] = useState(null);   // <-- start as null

  const pollInterval = 3000;

  const mapping = {
    open: "open_alarm",
    geofence: "pending_alarm",
    disturbance: "darkbg_alarm",
    battery: "purplebg_alarm",
    pending: "yellowbg_alarm",
    acknowledged: "yellowbg_alarm",
    closed: "closed_alarm",
    active: "open_alarm",
    inactive: "inactive_status",
    critical_motion : "open_alarm",
    expired: "inactive_status",
    online: "online_status",
    offline: "offline_status",
  };

  function getAlarmClass(alarmType) {
    if (!alarmType) return "";
    const key = alarmType.toLowerCase().trim();
    return mapping[key] || "";
  }

  // Fetch device data periodically
  useEffect(() => {
    let intervalId;

    async function fetchData() {
      try {
        let qparams = { q: mosyBtoa(`where close_status !='Closed'`), fullQ: true };

        const res = await mosyGetData({
          endpoint: apiRoutes.assetalarms.base,
          params: qparams
        });

        if (res?.data) {
          const items = (res.data || []).reverse();
          setAlarmsList(items.length > 0 ? items : []);   // empty array
        } else {
          setAlarmsList([]);  // no data
        }

      } catch (err) {
        console.error("Alarms fetch error:", err);
        setAlarmsList([]); // treat errors as empty result
      }
    }

    fetchData();
    intervalId = setInterval(fetchData, pollInterval);
    return () => clearInterval(intervalId);
  }, [pollInterval]);

  // -----------------------------------------------------
  // ✅ If alarmList is null → still loading → return null
  // -----------------------------------------------------
  if (alarmList === null) {
    return null; 
  }

  // -----------------------------------------------------
  // ✅ If alarmList is EMPTY → return null explicitly
  // -----------------------------------------------------
  if (alarmList.length === 0) {
    return null;
  }

  // -----------------------------------------------------
  // Otherwise → render the UI
  // -----------------------------------------------------
  return (
    <div className="card-body p-0">
      <ul className="list-group list-group-flush">
        {alarmList.map((data, i) => (
          <li
            key={`device-${i}`}
            onClick={() => gotoAlarmList(data.primkey)}
            className={`cpointer mb-3 p-2 row justify-content-center rounded text-dark`}
          >
            <div className="col-md-12 text-dark border-bottom border-white">
              <b>{data.device_name}</b> <br />
              {data._sites_site_name_site_id} - {data._sites_site_name_site_id}
            </div>

            <div className="col-md-12 row justify-content-start pl-3 m-2">

              <div className={`text-center p-1 text-white mr-1 ${getAlarmClass(data.alarm_type)}`}>
                {data.alarm_type}
              </div>

              <div className={`text-center p-1 ${getAlarmClass(data.close_status)}`}>
                {data.close_status}
              </div>

            </div>

            <div className="col-md-12 text-dark">
              <small className="smal_text">Serial: {data.device_serial}</small>
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
}


export function flattenMapData(data)
{
    // Make sure we have a proper array of sites
    const sites = [data];

    console.log("Rendering flattenMapData  with devices:", sites);

    // Flatten all device lists, embedding site data
    const allDevices = sites.flatMap(site =>
      (site.device_list || []).map(device => ({
        ...device,
        site_data: site
      }))
    );

    console.log("Rendering flattenMapData  with new data devices:", allDevices);

    return allDevices;
}

// Dashboard - log device location
export function DashSiteInfoData({ alerts = {}, title = "Devices" }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Make sure we have a proper array of sites
  const sites = alerts;

  // Flatten all device lists, embedding site data
  const allDevices = sites.flatMap(site =>
    (site.device_list || []).map(device => ({
      ...device,
      site_data: site
    }))
  );

  // Filter devices based on search input
  const filteredDevices = allDevices.filter(device => {
    const nameMatch = device.device_name.toLowerCase().includes(searchTerm.toLowerCase());
    const siteMatch = device.site_data.name.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || siteMatch;
  });

  console.log("Rendering DashSiteInfoData with devices:", filteredDevices);

  return (
    <div
      className="position-fixed bottom-50 end-0 translate-middle-y p-3"
      style={{
        width: "300px",
        maxHeight: "70vh",
        overflowY: "auto",
        bottom: "20px",
        right: "20px"
      }}
    >
      <div className="card shadow-sm border rounded">
        <div className="card-header bg-info text-white">
          <strong>{title}</strong>
        </div>

        <div className="p-2">
          {/* Search Box */}
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search device or site..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          {filteredDevices.length > 0 ? (
            <ul className="list-group list-group-flush p-3">
              {filteredDevices.map((device, i) => (
                <li
                  key={`device-${i}`}
                  onClick={() => loadTrackerDataCard(device)}
                  className="cpointer bg-light text-dark mb-3 p-2 row justify-content-center rounded"
                >
                  <div className="col-md-12 text-dark border-bottom border-white">
                    <b>{device.device_name}</b> <br />
                    {device.site_data.site_code} - {device.site_data.name}
                  </div>
                  <div className="col-md-12 row justify-content-end p-1 m-0">
                    <span className="badge p-1 bg-danger text-white mr-1">Offline</span>
                    <span className="badge p-1 bg-warning text-dark">Not moving</span>
                  </div>
                  <div className="col-md-12 text-dark">
                    <small className="smal_text">Serial: {device.serial_number}</small>
                  </div>
                  {device.gps_logs?.length > 0 && (
                    <div className="col-md-12 mt-2">
                      <small className="text-muted">GPS Logs: {device.gps_logs.length}</small>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted mb-0">No devices found</p>
          )}
        </div>
      </div>
    </div>
  );
}



export function loadTrackerDataCard(tracker)
{
  console.log(`loadsitedatacard __ `,tracker)

  const cardBody = (
    <div className="col-md-12 p-2 m-0 text-left row justify-content-center p-0 m-0 ">
        <div className="col-md-12 row justify-content-start p-2 m-0">
          <span className="badge p-2 bg-success text-white mr-1">Online</span>
          <span className="badge p-2 bg-warning text-dark d-none">Not moving</span>
        </div>      
    <div className="col-md-12 p-2 border-top border-info"></div>
      <div className="col-md-6">
      <p><strong>Name :</strong> {tracker.device_name}</p>
      <p><strong>Site:</strong> {tracker.site_data?.site_name || ""}</p>
      <p><strong>Serial:</strong> {tracker.serial_number}</p>
      </div>
      <div className="col-md-6">
      <p><strong>Latest Location :</strong> Y: {tracker.y} , X : {tracker.x} </p>
      <p><strong>Last log :</strong> {mosyFormatDateTime(tracker.timestamp)}</p>

      </div>
      
      <div className="pt-3 col-md-12 "></div>
      <div className="col-md-12 row justify-content-center border-top border-info mt-3 p-0 m-0 pt-2 text-info ">
      <div title ="Alarms" onClick={() => { loadTrackerProfile(tracker, "tracker"); }} className="col-3 cpointer "><i className="fa fa-bolt"></i><small className=""> Device </small></div>
      <div title="Logs" onClick={() => { loadDeviceAlarms(tracker.record_id); }} className="col-3 cpointer "><i className="fa fa-list"></i> <small className=""> Alarms </small></div>
      <div title="Playback" onClick={() => { loadTrackerPlayBack(tracker); }} className="col-3 cpointer "><i className="fa fa-play"></i> <small className=""> Playback</small></div>
      <div title="Track" onClick={() => { loadTrackerPlayBack(tracker, "realtime"); }} className="col-3 cpointer "><i className="fa fa-map-marker"></i> <small className=""> Track</small></div>
      <button
          className="btn btn-primary mt-2 d-none"
          onClick={() => { loadSiteData(tracker.site_data); }}
        >
          Load Site Data
        </button>
      </div>
    </div>
  );

  return cardBody

  //MosyCard("", cardBody)
}

//loadDeviceAlarms
export function loadDeviceAlarms(deviceId, module="devicealarms")
{

  window.location = `${hiveRoutes.cms}/${module}/list?gps_logs_mosyfilter=${mosyBtoa(` device_id='${deviceId}' `)}`

}

///loadTrackerPlayBack
export function loadTrackerPlayBack(tracker, module="playback")
{
  //console.log(`load tracker inccc`, tracker)
  const deviceId = tracker.token
  window.location = `${hiveRoutes.cms}/maps/${module}?device=${mosyBtoa(deviceId)}`

}

export function loadTrackerProfile(tracker, module="tracker")
{
  //console.log(`load tracker inccc`, tracker)
  const deviceId = tracker.token
  window.location = `${hiveRoutes.cms}/maps/${module}?device_key=${mosyBtoa(deviceId)}&device_list_uptoken=${mosyBtoa(deviceId)}`

}

///confusinf
export function loadSiteinfoDataCard(site) 
{
  console.log(`loadsitedatacard __ `, site);

  const sites = [site];

  // Flatten all devices, embedding site data
  const allDevices = sites.flatMap(site =>
    (site.device_list || []).map(device => {
      const firstLog = device.gps_logs?.length > 0 ? device.gps_logs[0] : null;
      return {
        ...device,
        first_log: firstLog,
        site_data: site
      };
    })
  );

  const cardBody = (
    <div className="col-md-12 p-2 m-0 text-left row justify-content-center p-0 m-0 ">
      <div className="col-md-12 row justify-content-start p-2 m-0">
        <div className="p-2 h5"> Site {site.site_name}</div>
        <span className="p-2"> Devices ({site.total_devices})</span>
      </div>

      <div className="col-md-12 p-2 border-top border-info"></div>

      <div className="col-md-12 row justify-content-start p-2 m-0 ">
        {allDevices.map((device, i) => (
          <div key={`device-${i}`} className="col-md-6 mb-3 border rounded p-2 shadow-sm">
            <p className="pb-2">
              <u>
                <strong>Device</strong> ({i + 1})
              </u>
            </p>
            <p><strong>Name:</strong> {device.device_name}</p>
            <p><strong>Serial:</strong> {device.serial_number}</p>

            {device.first_log ? (
              <>
                <p><strong>Battery:</strong> {device.first_log.battery}</p>
                <p><strong>Longitude:</strong> {device.first_log.longitude}</p>
                <p><strong>Latitude:</strong> {device.first_log.latitude}</p>
              </>
            ) : (
              <p className="text-muted"><em>No GPS logs available</em></p>
            )}

            <p className="pt-3 text-info" onClick={()=>{loadTackerProfile(device)}}>
              <span className="badge cpointer text-info">
                <i className="fa fa-arrow-right"></i> View device
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="pt-3 col-md-12"></div>
      <div className="col-md-12 row justify-content-center border-top border-info mt-3 p-0 m-0 pt-2 text-info"></div>
    </div>
  );

  MosyCard("", cardBody);
}

// Modify loadSiteinfoDataCard to return JSX
export function loadSiteInfoWindowCard({site, showSiteDetails=true,newPage=false}) {
  const sites = [site];

  console.log(`loadSiteInfoWindowCard`, site)

  const allDevices = sites.flatMap(site =>
    (site.device_list || []).map(device => {
      const firstLog = device.gps_logs?.length > 0 ? device.gps_logs[0] : null;
      return {
        ...device,
        first_log: firstLog,
        site_data: site
      };
    })
  );

  return (
    <div className="col-md-12 p-2 m-0 text-left row justify-content-center p-0 m-0">
      <div className="col-md-12 row justify-content-start p-2 m-0">
        <div className="p-2 h5">{site.site_code || "_"} - {site.site_name || site.name}  </div>
        <span className="p-2 h6"> | Devices : ({site.total_devices})</span>
      </div>

      <div className="col-md-12 p-2 border-top border-info"></div>

      <div className="col-md-12 row justify-content-center p-2 m-0">
        {allDevices.map((device, i) => (
          <div key={`device-${i}`} className="col-md-6 mb-3 p-2">
            <p className="pb-2">
              <u><strong>Device</strong> ({i + 1})</u>
            </p>
            <p><strong>Name:</strong> {device.device_name}</p>
            <p><strong>Serial:</strong> {device.serial_number}</p>

            {device.first_log ? (
              <>
                <p><strong>Battery:</strong> {device.first_log.battery}</p>
                <p className="d-none"><strong>Longitude:</strong> {device.first_log.longitude}</p>
                <p className="d-none"><strong>Latitude:</strong> {device.first_log.latitude}</p>
              </>
            ) : (
              <p className="text-muted"><em>No GPS logs available</em></p>
            )}

            <p className="pt-3 text-info" onClick={()=>{loadDeviceKey(device, newPage)}}>
              <span className="badge cpointer text-info">
                <i className="fa fa-arrow-right"></i> View device
              </span>
            </p>
          </div>
        ))}
        {showSiteDetails && (
            <p className=" text-right border-top border-info p-3 text-info col-md-12 " onClick={() => loadSitePage(site)}>
              <b className=" cpointer text-info">
                <i className="fa fa-arrow-right"></i> View site
              </b>
            </p>
        )}        
      </div>
    </div>
  );
}

//go to site 
export function loadSitePage(site)
{
  const sitetoken = site.record_id 
  window.location = `${hiveRoutes.cms}/maps/sitemap?sitetoken=${sitetoken}`

}

/// load device key 
export function loadDeviceKey(device, newPage=false) {
  const key = device?.primkey || device?.token;
  if (!key) return;

  if(newPage)
  {
    window.location = `${hiveRoutes.cms}/maps/tracker?device_key=${mosyBtoa(key)}&device_list_uptoken=${mosyBtoa(key)}`
  }
  // Update URL param
  mosyUpdateUrlParam("device_key", key);
  mosyUpdateUrlParam("device_list_uptoken", mosyBtoa(key));

  // Dispatch a custom event so MapSwitcher can listen
  window.dispatchEvent(
    new CustomEvent("deviceKeyChanged", { detail: { deviceKey: key } })
  );

}



//load site card modal
export function loadSiteDataCard(site)
{
  console.log(`loadsitedatacard __ `,site)
  const cardBody = (
    <div className="col-md-12 p-2 m-0 text-left">
      <p><strong>Site Name:</strong> {site.name}</p>
      <p><strong>Latitude (y):</strong> {site.y}</p>
      <p><strong>Longitude (x):</strong> {site.x}</p>
      <div className="pt-3 col-md-12 "></div>
      <div className="col-md-12 row justify-content-center border-top border-info mt-3 p-0 m-0 ">
      <div className="col-3 cpointer "><i className="fa fa-refresh"></i></div>
      <div onClick={() => { loadSiteData(site); }} className="col-3 cpointer "><i className="fa fa-info"></i> Site info</div>
      <div className="col-3 cpointer "><i className="fa fa-refresh"></i></div>
      <div className="col-3 cpointer "><i className="fa fa-refresh"></i></div>
      <button
          className="btn btn-primary mt-2 d-none"
          onClick={() => { loadSiteData(site); }}
        >
          Load Site Data
        </button>
      </div>
    </div>
  );

  MosyCard("", cardBody)
}


//home bar search bar 

export function FloatingSearchBar({ onSearch, onSiteSelectFull, showSiteSearch=true , showTrakerSearch=true, onDeviceSelectFull }) {
  const [filter, setFilter] = useState("sites");
  const [query, setQuery] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (onSearch) onSearch({ filter, query });
  }

  return (
    <div
      className="floating-search-bar top-0 start-50 translate-middle-x p-2 bg-white"
      style={{ zIndex: 1050, width: "90%", maxWidth: "60%" }}
    >
      <div className="row justify-content-start p-0 m-0">
        {showSiteSearch && (
        <LiveSearchDropdown       
          apiEndpoint={apiRoutes.registeredsites.base}       
          tblName="sites"       
          parentTable="device_list"       
          inputName="txt__sites_site_name_site_id"       
          hiddenInputName="txt_site_id"       
          valueField="record_id"       
          displayField="site_name"       
          label="Site list"       
          onSelect={(id) => console.log("Just the ID:", id)}       
          onSelectFull={(dataRes) => {
           // console.log("Site selected:", dataRes);
            if (onSiteSelectFull) onSiteSelectFull(dataRes); // Pass up to parent
          }}       
          defaultColSize="col-md-10 hive_data_cell"       
          context={{ hostParent: "FloatingSearchBar" }}          
        />
        )}

        {showTrakerSearch &&(
        <LiveSearchDropdown      
          apiEndpoint={apiRoutes.devicelist.base}      
          tblName="device_list"      
          parentTable="gps_logs"      
          inputName="txt__device_list_device_name_device_id"      
          hiddenInputName="txt_device_id"      
          valueField="record_id"      
          displayField="device_name"      
          label="Trackers"          
          onSelect={(id) => console.log("Just the ID:", id)}      
          onSelectFull={(dataRes) => {
            console.log("Device selected:", dataRes);
            if (onDeviceSelectFull) onDeviceSelectFull(refactorDeviceData({data:[dataRes]}));
            //loadTackerProfile(dataRes)
            //loadTrackerDataCard(dataRes)
          }}      
          defaultColSize="col-md-6 hive_data_cell "      
          context={{ hostParent: "FloatingSearchBar" }}
        /> 
        )}
      </div>    
    </div>
  );
}



export async function sendDeviceLocationLog(device) {
  const log_type = "GPS";
  const battery = "50";
  const speed =  "30";
  const remark = "Auto log from map";

    try {
      const payload = {   
        device_name: device.name || "Unknown Device",
        latitude: device.y,
        longitude: device.x,
        timestamp: new Date().toISOString(),
        log_type  : log_type,
        device_id  : device.device_id,
        battery  : battery, 
        speed  : speed,
        remark  : remark,
        gps_logs_mosy_action: "add_log"
      };
      
      MosyNotify({ message: "Logging device location...", icon: "send", id: "topmost" });

      var logResponse = await mosyPostData({
        url: apiRoutes.devicegpslogs.addlog,
        data: payload,
        isMultipart: true,
      });
      console.log("Device location logged successfully:", logResponse);
      MosyNotify({
        message: "Device location logged successfully",
        icon: "check",
        id: "topmost",
        addTimer: true,
        duration: 4000,
      });
    } catch (error) {   
      MosyNotify({
        message: "Failed to log device location",
        icon: "times-circle",
        iconColor :"text-danger",   
        id: "topmost",
        addTimer: true,
        duration: 4000,   
      });
      console.error("Log device location error:", error);
    }
}

export function refactorDeviceData(apiResponse) {
  if (!apiResponse?.data) return [];

  return apiResponse.data.map((device) => {
    // 1️⃣ Latest device log
    const latestLog = device.device_logs?.length
      ? [...device.device_logs].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )[0]
      : null;

    const latestPoint = latestLog
      ? {
          x: Number(latestLog.longitude),
          y: Number(latestLog.latitude),
          device_name: device.device_name,
          token: device.primkey,
          timestamp: latestLog.timestamp,
        }
      : null;

    // 2️⃣ All device logs with x/y keys
    const logsWithXY = (device.device_logs || []).map(log => ({
      ...log,
      x: Number(log.longitude),
      y: Number(log.latitude)
    }));

    // 3️⃣ Geofences
    const geofences =
      device.geofence?.trim()
        ? [{ device_name: device.device_name, coords: parseGeofence(device.geofence) }]
        : [];

    return {
      device_name: device.device_name,
      latestPoint,
      device_logs: logsWithXY,
      geofences,
      device_data : device
    };
  });
}


/**
 * Fully independent geofence monitoring component
 * - Polls device data
 * - Computes geofence breaches
 * - Shows floating alerts card
 */
export default function GeofenceMonitor({title ="Device alarms", pollInterval = 3000 }) {
  const [devices, setDevices] = useState([]);
  const [alarmsList, setAlarmsList] = useState([]);
  const [showModal, setShowModal] = useState(true);

  // Fetch device data periodically
  useEffect(() => {
    let intervalId;

    async function fetchData() {
      try {
        let qparams = { q: mosyBtoa(`where close_status !='Closed'`), fullQ: true };

        const res = await mosyGetData({
          endpoint: apiRoutes.assetalarms.base,
          params: qparams
        });

        if (res?.data) {
          const items = (res.data || []).reverse();
          setAlarmsList(items.length > 0 ? items : []);   // empty array
        } else {
          setAlarmsList([]);  // no data
        }

      } catch (err) {
        console.error("Alarms fetch error:", err);
        setAlarmsList([]); // treat errors as empty result
      }
    }

    fetchData();
    intervalId = setInterval(fetchData, pollInterval);
    return () => clearInterval(intervalId);
  }, [pollInterval]);

  return <GeofenceAlerts alerts={alarmsList} title={title} />;

}

export function viewPendingAlarmHistory()
{
  window.location=`../assetalarms/list?asset_alarms_mosyfilter=${btoa(` close_status != 'closed' `)}`
}

export async function sendPrimarySMS({ formSrc="sms_profile_form", phone = "254710766390", message = "Hello, this is a test SMS from the system." }) {
    try {
      const payload = {
        recp: phone,
        body: message,
        pushsms: "ok",
      };
  
      MosyNotify({ message: "Sending SMS...", icon: "send", id: "topmost" });

      //insert sent sms message
        await insertSentSmsmessage(formSrc);

      var smsResponse = await mosyPostData({
        url: apiRoutes.appcore.sendsms,
        data: payload,
        isMultipart: true,
      });

      console.log("SMS sent successfully:", smsResponse);

      //update sent sms message
      await updateSentSmsmessage(formSrc,smsResponse);

      MosyNotify({
        message: "SMS sent successfully",
        icon: "check",
        id: "topmost",
        addTimer: true,
        duration: 4000,
      });
    } catch (error) {
      MosyNotify({
        message: "Failed to send SMS",
        icon: "times-circle",
        iconColor :"text-danger",
        id: "topmost",
        addTimer: true,
        duration: 4000,
      });
      console.error("SMS error:", error);
    }
  }
  

async function insertSentSmsmessage(formSrc="sms_profile_form") {
   
    // Logic to insert sent SMS message into the database
    //update form    
    mosy_push_data("sms_mosy_action", "add_sms");

    //insert new details
    var insertResp =     await mosyPostFormData({
        formId: formSrc,
        url: apiRoutes.smsmessages.base,
        method: 'POST',
        isMultipart: true,
      });
      
    //update the token
    var newToken = mosyBtoa(insertResp?.sms_uptoken || "")
      
    mosy_push_data("sms_uptoken", newToken);
    mosyUpdateUrlParam("sms_uptoken", newToken);
      
}

async function updateSentSmsmessage(formSrc="sms_profile_form", smsResponse={}) {
  
    mosy_push_data("txt_delivery_report", JSON.stringify(smsResponse) || "Sent");
    mosy_push_data("txt_status", "Sent");
    
    mosy_push_data("sms_mosy_action", "update_sms");

    //updateSmsmessages()

    await mosyPostFormData({
        formId: formSrc,
        url: apiRoutes.smsmessages.base,
        method: 'POST',
        isMultipart: true,
      });

}


// ╔══════════════════════════════════════╗
// ║  AUTO-GENERATED FUNCTION  #1          
// ║  Function: filterAlarmDate                    
// ╚══════════════════════════════════════╝
export function filterAlarmDate() {
  
  filterDataByDate({
      mode:"datetime",
      label: "Search by alarm date",
      callBack: ({startDate, endDate}) => {
          window.location=`../assetalarms/list?asset_alarms_mosyfilter=${btoa(` alarm_time >= '${mosyFormatDateTime(startDate)}' AND alarm_time <= '${mosyFormatDateTime(endDate)}' `)}`   
      },  
  })

}


// ╔══════════════════════════════════════╗
// ║  AUTO-GENERATED FUNCTION  #2          
// ║  Function: filterAlarmType                    
// ╚══════════════════════════════════════╝

export function filterAlarmType(fieldName="alarm_type") 
{
    //alert(`filterAlarmType`);

    MosyLiveSearch({
        api: apiRoutes.assetalarms.base,
        title: "Search by alarm type",
        displayField: fieldName,
        valueField: fieldName,
        tableName: "asset_alarms",
        actionName: "mosyfilter",        
        actionData: {
          router: "../assetalarms/list",
          qstr: `${fieldName} = '{{${fieldName}}}'`,
          path : "../assetalarms/list",
       }
    })

}


// ╔══════════════════════════════════════╗
// ║  AUTO-GENERATED FUNCTION  #3          
// ║  Function: filterDeviceName                    
// ╚══════════════════════════════════════╝
export function filterDeviceName(fieldName="serial_number") {

  MosyLiveSearch({
    api: apiRoutes.devicesummary.base,
    title: "Search by device name",
    displayField: "device_name",
    valueField: fieldName,
    tableName: "device_list",
    actionName: "mosyfilter",        
    actionData: {
      router: "../assetalarms/list",
      qstr: `device_serial = '{{${fieldName}}}'`,
      path : "../assetalarms/list",
      parentTable: "asset_alarms",
   }
})

}


// ╔══════════════════════════════════════╗
// ║  AUTO-GENERATED FUNCTION  #4          
// ║  Function: viewAlarmHistory                    
// ╚══════════════════════════════════════╝
export function viewAlarmHistory() {
    alert(`viewAlarmHistory`);
}


// ╔══════════════════════════════════════╗
// ║  AUTO-GENERATED FUNCTION  #5          
// ║  Function: acknowledgeAlarm                    
// ╚══════════════════════════════════════╝
export function acknowledgeAlarm(token) 
{

  const payload = {new_status :"Acknowledged", close_status : "Pending"}

  MosyAlertCard({
    title: "Acknowledge Alarm",
    message: "Are you sure you want to acknowledge this alarm?",
    onYes: () => confimAlarmStatus({token, payload}),
    onNo: () => {},
    yesLabel: "Yes",
    noLabel: "Cancel",

  })
    
}

export async function confimAlarmStatus({token, payload})
{
  MosyNotify({ message: "Sending request ...", icon: "send", addTimer : false,id:"modal1" });
  await  mosyPostData({
    url: apiRoutes.assetalarms.manage,
    data: {token: token, payload},
    method: 'POST',  
})

closeMosyCard("modal1")

MosyNotify({ message: `${payload.new_status} successfully`, icon: "check-circle" , iconColor : "success" });

setTimeout(() => {
  window.location.reload();
},4000)

}

// ╔══════════════════════════════════════╗
// ║  AUTO-GENERATED FUNCTION  #2          
// ║  Function: trackAlarm                    
// ╚══════════════════════════════════════╝
export function trackAlarm(token) {
    //alert(`trackAlarm`);
    //window.location = `${hiveRoutes.cms}/maps/realtime?device=NA=
   window.location = `${hiveRoutes.cms}/maps/realtime?device=${mosyBtoa(token)}`
}


// ╔══════════════════════════════════════╗
// ║  AUTO-GENERATED FUNCTION  #2          
// ║  Function: closeAlarm                    
// ╚══════════════════════════════════════╝
export function closeAlarm(token) {
  const payload = {new_status :"Closed", close_status : "Closed"}

  MosyAlertCard({
    title: "Close Alarm",
    message: "Are you sure you want to mark this alarm as closed?",
    onYes: () => confimAlarmStatus({token, payload}),
    onNo: () => {},
    yesLabel: "Yes",
    noLabel: "Cancel",
    icon:"lock",
    iconColor:"purple"

  })
}

export async function logAlarm(data)
{
  console.log(`data..... log alarm .... `, data )
  MosyNotify({message :"Logging alarm...",icon:"send",addTimer:false,id:"topmost"});

 const logData = {...data, log_data :{alarm_type : "Geofence", description : "Geofence Violation"}}

 const res = await mosyPostData({
    url: apiRoutes.assetalarms.logalarm,
    data: {payload:logData},
    method: 'POST',  
})

closeMosyModal("topmost")
MosyNotify({message :`Alarm ${res?.asset_alarms_uptoken} logged`,icon:"check-circle",addTimer:false,id:"topmost"});

window.location = `${hiveRoutes.cms}/assetalarms/list?asset_alarms_mosyfilter=${btoa(` primkey = '${res?.asset_alarms_uptoken}' `)}`  

}


// ╔══════════════════════════════════════╗
// ║  AUTO-GENERATED FUNCTION  #6          
// ║  Function: filterAlarmStatus                    
// ╚══════════════════════════════════════╝
export function filterAlarmStatus(fieldName="close_status") {
    ///alert(`filterAlarmStatus`);
    
    MosyLiveSearch({
      api: apiRoutes.assetalarms.base,
      title: "Search by status",
      displayField: fieldName,
      valueField: fieldName,
      tableName: "asset_alarms",
      actionName: "mosyfilter",  
      signature :"status_search",      
      actionData: {
        router: "../assetalarms/list",
        qstr: `${fieldName} = '{{${fieldName}}}'`,
        path : "../assetalarms/list",
     }
  })

}

export function useStatusHighlighter(list = []) {
  useEffect(function () {

    if (!list || list.length === 0) return;

    const mapping = {
      open: "open_alarm",
      geofence: "pending_alarm",
      disturbance: "darkbg_alarm",
      battery: "purplebg_alarm",
      pending: "yellowbg_alarm",
      acknowledged: "yellowbg_alarm",
      closed: "closed_alarm",
      critical_motion : "open_alarm",
      active: "open_alarm", 
      inactive: "inactive_status",
      expired: "inactive_status",
      online: "online_status",
      offline: "offline_status",
    };

    const spans = document.querySelectorAll("td span");

    spans.forEach(function (span) {
      const text = span.textContent?.trim().toLowerCase();
      if (!text) return;

      if (mapping[text]) {
        span.classList.add(mapping[text]);
      }
    });

    ///console.log("Highlighter applied");

  }, [list]);
}



// ╔══════════════════════════════════════╗
// ║  AUTO-GENERATED FUNCTION  #1          
// ║  Function: viewDeviceOnMap                    
// ╚══════════════════════════════════════╝
export function viewDeviceOnMap(token) {
      //console.log(`load tracker inccc`, tracker)
  window.location = `${hiveRoutes.cms}/maps/tracker?device=${mosyBtoa(token)}`

}


