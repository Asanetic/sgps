import React, { useState, useEffect } from "react";

import { mosy_push_data, mosyBtoa, mosyGetElemVal, mosyPostData, mosyPostFormData, mosyUpdateUrlParam } from "../../MosyUtils/hiveUtils";
import { MosyAlertCard, MosyNotify } from "../../MosyUtils/ActionModals";

import { getApiRoutes } from '../AppRoutes/apiRoutesHandler';
import {LiveSearchDropdown} from "../UiControl/componentControl"
import DevicelistProfile from "../devices/uiControl/DevicelistProfile";
import { MosyCard } from "../../components/MosyCard";
import { PlayBackMapData } from "../maps/playback/playbackdata";
import {loadSiteData} from "../maps/loadSite";

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

  console.log(`Parsed geofence coords:  ${geofenceStr} `, coords);
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

export function GeofenceAlerts({ alerts=[], title = "Alarms" }) {

  console.log("Rendering GeofenceAlerts with alerts:", alerts);
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
        <div className="card-header bg-danger text-white">
          <strong>{title}</strong>
        </div>
        <div className="card-body p-2">
          {alerts.length > 0 ? (
            <ul className="list-group list-group-flush">
              {alerts.map((device, i) => (
                <li
                  onClick={()=>{loadTackerProfile(device)}}
                  key={`alert-${i}`}
                  className="cpointer list-group-item list-group-item-danger d-flex justify-content-between align-items-center"
                >
                  <div className="colmd-12 badge bg-light rounded-pill p-3 ">
                  Device : {device.device_name}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted mb-0">No alerts</p>
          )}
        </div>
      </div>
    </div>
  );
}


//dashboard log device location
export function DashSiteInfoData({ alerts=[], title = "Sites" }) {

  console.log("Rendering DashSiteInfoData  with alerts:", alerts);
  return (
    <div
      className="position-fixed bottom-50 end-0 translate-middle-y p-3"
      style={{
        width: "300px",
        maxHeight: "30vh",
        overflowY: "auto",
        bottom: "20px",
        right: "20px"
      }}
    >
      <div className="card shadow-sm border rounded">
        <div className="card-header bg-info text-white">
          <strong>{title}</strong>
        </div>
        <div className=" p-2">
          {alerts.length > 0 ? (
            <ul className="list-group list-group-flush">
              {alerts.map((site, i) => (
                <li
                  onClick={()=>{loadSiteData(site)}}
                  key={`alert-${i}`}
                  className="cpointer  bg-purple text-white mb-3 p-2 row justify-content-center"
                >
                  <div className="col-md-12 text-white border-bottom border-white"><b>{site.name} </b></div>
                  <div className="col-md-12 text-white">Y : {site.y} ,<br/> X : {site.x}</div>
                  </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted mb-0">No alerts</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function FloatingSearchBar({ onSearch }) {
  const [filter, setFilter] = useState("sites");
  const [query, setQuery] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (onSearch) onSearch({ filter, query });
  }

  return (
    <div
      className="floating-search-bar top-0 start-50 translate-middle-x p-2 bg-white"
      style={{
        zIndex: 1050,
        width: "90%",
        maxWidth: "60%",
      }}
    >
      <div className="row justify-content-center p-0 m-0 ">
       <LiveSearchDropdown       
          apiEndpoint={apiRoutes.registeredsites.base}       
          tblName="sites"       
          parentTable="device_list"       
          inputName="txt__sites_site_name_site_id"       
          hiddenInputName="txt_site_id"       
          valueField="record_id"       
          displayField="site_name"       
          label="Location site"       
          onSelect={(id) => console.log("Just the ID:", id)}       
          onSelectFull={(dataRes) => { loadSiteData(dataRes); console.log("Data seleted")}}       
          defaultColSize="col-md-6 hive_data_cell "       
          context={{hostParent : "FloatingSearchBar"}}
          
       />
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
      onSelectFull={(dataRes) => {loadTackerProfile(dataRes); console.log("Data seleted")}}      
      defaultColSize="col-md-6 hive_data_cell"      
      context={{hostParent : "FloatingSearchBar"}}
      
      /> 
       </div>    
    </div>
  );
}


export async function sendDeviceLocationLog(device) {
  const log_type = "GPS Update";
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
    };
  });
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
export function formartGradersMessage(send, inputHandler) 
{

 var farmerPhone=mosyGetElemVal("txt_recipient_phone") || ""
 var collectionsSession = mosyGetElemVal("txt_session") || ""
 var collectionsDate = mosyGetElemVal("txt_collection_date") || ""
 var collectionsLitres = mosyGetElemVal("txt_quantity_litres") || ""
 var collectionId = mosyGetElemVal("txt_collection_ref") || ""
 var farmerName = mosyGetElemVal("txt__farmers_farmer_name_farmer_id") || ""

 var message = `Dear ${farmerName.split(" ")[0]}, ${collectionsSession} milk collection for date ${collectionsDate} has been received.\nQty : ${collectionsLitres} litres.\nCollection Ref: ${collectionId}.\nThank you!`

 if(inputHandler){
    inputHandler("txt_message_body", message);
    inputHandler("txt_generated_sms", message);
 }

 if(send){
  sendPrimarySMS({phone:farmerPhone, message:message, formSrc:"milk_collections_profile_form"})

 }

 return message;

}