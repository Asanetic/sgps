import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { base64Encode, magicRandomStr, mosyCountRows, mosyQddata, mosyQuickSel, mosyRightNow } from "../../apiUtils/dataControl/dataUtils";
import { AddAssetalarms } from "../assetalarms/assetalarms/AssetalarmsDbGateway";
import { UpdateDevicegpslogs } from "../gpslogs/devicegpslogs/DevicegpslogsDbGateway";
import nodemailer from 'nodemailer';


const devicePageUrl = `https://gps.symphony.co.ke/symphonygps/maps/realtime?device=`

/**
 * Parses a GPS device raw string into a structured object.
 * Supports dynamic number of Base Stations and WiFi entries.
 * Assumes input is a string in square brackets: [...]
 * Example: [3G*866936070019995*013D*UD,171025,132723,V,...]
 *
 * @param {string} rawString
 * @returns {object|null} parsed data
 */
export function parseGPSData(rawString) {
    if (!rawString) return null;
  
    // Remove leading/trailing brackets if present
    rawString = rawString.replace(/^\[|\]$/g, '');
  
    // Split the string by commas
    const parts = rawString.split(',');
    if (parts.length < 10) return null; // basic validation
  
    // ----- DEVICE INFO -----
    // Format: 3G*IMEI*Number*UD
    const deviceInfo = parts[0].split('*');
  
    // ----- FIXED FIELDS -----
    const fixedFields = {
      deviceType: deviceInfo[0] || null, // e.g., 3G
      imei: deviceInfo[1] || null,       // unique device IMEI
      number: deviceInfo[2] || null,     // device number or identifier
      ud: deviceInfo[3] || null,         // UD field (unknown device code)
  
      // Timestamp information
      timestamp: {
        date: parts[1],                  // yymmdd
        time: parts[2],                  // hhmmss
        valid: parts[3] === 'V'          // 'V' = valid GPS fix
      },
  
      // Location
      location: {
        lat: parseFloat(parts[4]),       // latitude value
        ns: parts[5],                     // 'N' or 'S'
        lng: parseFloat(parts[6]),       // longitude value
        ew: parts[7]                      // 'E' or 'W'
      },
  
      speed: parseFloat(parts[8]),        // speed in km/h or m/s
      angle: parseFloat(parts[9]),        // direction angle
      altitude: parseFloat(parts[10]),    // altitude in meters
      satellites: parseInt(parts[11]),    // number of satellites used
      gsmSignal: parseInt(parts[12]),     // GSM signal strength
      power: parseInt(parts[13]),         // device battery/power info
      steps1: parseInt(parts[14]),        // steps counter 1
      steps2: parseInt(parts[15]),        // steps counter 2
      motionByte: parts[16],              // motion info in 8-bit
      lbsCount: parseInt(parts[17]),      // number of connected base stations
      gsmTimeDelay: parseInt(parts[18]),  // GSM delay
      mcc: parseInt(parts[19]),           // Mobile Country Code
      mnc: parseInt(parts[20])            // Mobile Network Code
    };
  
    // ----- BASE STATIONS -----
    // LBS info comes next: each base station has 3 values
    const baseStations = [];
    let index = 21; // start index for BS info
    for (let i = 0; i < fixedFields.lbsCount; i++) {
      if (index + 2 >= parts.length) break; // avoid overflow
      const bs = {
        areaCode: parseInt(parts[index]),         // Base Station Area Code
        baseStationNumber: parseInt(parts[index+1]), // Base Station number
        signal: parseInt(parts[index+2])          // Signal strength
      };
      baseStations.push(bs);
      index += 3;
    }
  
    // ----- WIFI ENTRIES -----
    // Remaining fields are WiFi signals: each triplet = wfName, MAC, signal
    const wifi = [];

    // Check if first WiFi value is the WiFi count
    let wifiCount = parseInt(parts[index]);
    if (!isNaN(wifiCount)) {
        index++; // skip the count
    }

    while (index + 2 < parts.length) {
        const name = parts[index++];
        const mac = parts[index++];
        const signal = parseInt(parts[index++]);

        wifi.push({ name, mac, signal });
    }

  
    // ----- FINAL STRUCTURED OBJECT -----
    return { ...fixedFields, baseStations, wifi };
  }


  /**
 * Maps parsed GPS data to DevicegpslogsInputsArr structure
 *
 * @param {object} parsedGPS - object returned from parseGPSData()
 * @param {object} options - optional extra fields
 *    siteName, remark, hiveSiteId, hiveSiteName, createdAt
 * @returns {object} formatted input for gps_logs
 */
export async function processDevicePingToLog(parsedGPS, options = {}) {
    if (!parsedGPS) return null;
  
    const {
      location: { lat, lng } = {},
      speed,
      power: battery,
      timestamp: { date, time } = {},
      imei: deviceId,
      satellites,
      angle,
      motionByte,
      baseStations,
      wifi
    } = parsedGPS;
  
    // Combine date and time to timestamp (assuming yyMMdd, HHmmss)
    let timestamp = null;
    try {
      if (date && time) {
        const yyyy = '20' + date.slice(0,2);
        const mm = date.slice(2,4);
        const dd = date.slice(4,6);
        const hh = time.slice(0,2);
        const mi = time.slice(2,4);
        const ss = time.slice(4,6);
        timestamp = new Date(`${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}Z`).toISOString();
      }
    } catch (err) {
      timestamp = new Date().toISOString();
    }
  
    // Build log_details string for debugging or storing raw info
    const logDetails = {
      satellites,
      angle,
      motionByte,
      baseStations,
      wifi
    };


    const deviceData = await mosyQddata("device_list", "serial_number",`${deviceId}`);
    console.log(`processssgps pinggggggggggggg imei ${deviceId}`, parsedGPS, deviceData);

    const devicePingLog = {
      log_type: 'GPS',                    // fixed type for GPS logs
      site_name: deviceData?.site_id || 'N/A',
      device_id: deviceData?.record_id || `Unregistered device ${deviceId}`,  
      battery: battery || '?',
      latitude: lat || 'na',
      longitude: `-${lng}` || 'na',
      speed: speed || '0',
      remark: options.remark || '?',
      timestamp: timestamp || '?',
      created_at: options.createdAt || new Date().toISOString(),
      log_details: JSON.stringify(logDetails),
      hive_site_id: options.hiveSiteId || '?',
      hive_site_name: options.hiveSiteName || '?'
    };
      
    return {
      insertObject : devicePingLog,
      gpsRequest : parsedGPS
    };

  }
  
  export async function logTcpAlarm(data, parsedData, newId)
  {

    let alarmType = "";
    let description=""
    let addAlarm = false;

    const alarmByte = parsedData.motionByte;
    const speed = parsedData.speed || 0;

    const deviceData = await mosyQddata("device_list", "serial_number",`${parsedData.imei}`);    
    const lowlevel = deviceData.low_battery_level || 0;
    const currentLevel = parsedData.power || 0;
      
        
    const siteData = await mosyQddata("sites", "record_id",`${deviceData.site_id}`);
    const siteName = siteData.site_name || "na";
    const siteCode = siteData.site_code || "na";


    ///console.log(`Low battery alert - @${currentLevel} - ${lowlevel}%`, recipientCsv);

    //--- Begin  asset_alarms inputs array ---//     
      const AssetalarmsInputsArr = {
        "record_id": newId,
        "alarm_time" : mosyRightNow(),     
        "alarm_type" : alarmType, 
        "description" : description || ``,               
        "device_serial" : parsedData.imei ,               
        "site_id" : deviceData.site_id || "na",               
        "status" : "Open",               
        "ack_status" : "Open",               
        "close_status" : "Open",               
        "reg_date" : mosyRightNow(), 
      
    };
      
    const deviceURlPageDetails = ` - View site issue here ${devicePageUrl}${base64Encode(`${deviceData.primkey}`)}`

    //console.log(`device deviceURlPageDetails +++++++____+++___+++_+++++++ ${deviceData.primkey}`, deviceData)
    if(Number(currentLevel) <= Number(lowlevel))
      {
          alarmType = "Battery";
          description =`Low battery alert - current @${currentLevel}% - threshold ${lowlevel}%`;
          addAlarm = true

          AssetalarmsInputsArr.alarm_type = alarmType;
          AssetalarmsInputsArr.description = description;
          const deviceSerial = parsedData.imei

          const checkSimilarAlarms = await mosyCountRows(`asset_alarms`, `where device_serial='${deviceSerial}' and alarm_type='${alarmType}' and status !='Closed'`)

          if(checkSimilarAlarms==0)
          {
            //--- End asset_alarms inputs array --//
            const result = await AddAssetalarms(newId, AssetalarmsInputsArr, {}, {});  
                    
            const message = `Low battery alert - Device -  ${deviceData?.device_name} / Site -  ${siteCode} - ${siteName} Battery Level @ ${currentLevel}%   ,  Report time : ${mosyRightNow()} ${deviceURlPageDetails}` ;

            sendAlertSMS(message, siteData);
            sendAlertEmail(message, `Low battery alert ${deviceData?.device_name} Site : ${siteCode} - ${siteName}`, siteData);
          }

      }

      if(alarmByte=="00100008")
      {
          alarmType = "Disturbance";
          description ="Asset disturbance alert";
          addAlarm = true

          AssetalarmsInputsArr.alarm_type = alarmType;
          AssetalarmsInputsArr.description = description;
          //--- End asset_alarms inputs array --//
          
          const deviceSerial = parsedData.imei

          const checkSimilarAlarms = await mosyCountRows(`asset_alarms`, `where device_serial='${deviceSerial}' and alarm_type='${alarmType}' and status !='Closed'`)

          if(checkSimilarAlarms==0)
          {

            const result = await AddAssetalarms(newId, AssetalarmsInputsArr, {}, {});  
            const newKey = result.record_id

            const message = `Asset disturbance alert - Device -  ${deviceData?.device_name} / Site -  ${siteCode} - ${siteName}   Report time : ${mosyRightNow()} ${deviceURlPageDetails}` ;

            sendAlertSMS(message, siteData);
            sendAlertEmail(message, `Disturbance alert ${deviceData?.device_name} Site : ${siteCode} - ${siteName}`, siteData);

          }
      }

      if(Number(speed) > 0.0)
        {
            alarmType = "Critical_motion";
            description ="Critial motion asset moving";
            addAlarm = true
  
            AssetalarmsInputsArr.alarm_type = alarmType;
            AssetalarmsInputsArr.description = description;
            //--- End asset_alarms inputs array --//
            const deviceSerial = parsedData.imei

            const checkSimilarAlarms = await mosyCountRows(`asset_alarms`, `where device_serial='${deviceSerial}' and alarm_type='${alarmType}' and status !='Closed'`)

            if(checkSimilarAlarms==0)
            {

              const result = await AddAssetalarms(newId, AssetalarmsInputsArr, {}, {});  
              const newKey = result.record_id

              const message = `Critical motion. Your asset is moving at ${speed} Km/h Device -  ${deviceData?.device_name} / Site -  ${siteCode} - ${siteName}     Report time : ${mosyRightNow()} ${deviceURlPageDetails} ` ;
        
              sendAlertSMS(message, siteData);
              sendAlertEmail(message, `Critical motion alert ${deviceData?.device_name} Site : ${siteCode} - ${siteName}`, siteData);
            }

        } 
        
        
        if(newId=="geofence")
        {
          alarmType = "Geofence";
          description ="Geofence Violation";
          addAlarm = true

          AssetalarmsInputsArr.alarm_type = alarmType;
          AssetalarmsInputsArr.description = description;
          //--- End asset_alarms inputs array --//
          const deviceSerial = parsedData.imei

            //if there is no geofence
            if(deviceData.geofence!=""){
              const checkSimilarAlarms = await mosyCountRows(`asset_alarms`, `where device_serial='${deviceSerial}' and alarm_type='${alarmType}' and status !='Closed'`)

              if(checkSimilarAlarms==0)
              {

              const result = await AddAssetalarms(newId, AssetalarmsInputsArr, {}, {});  
              const newKey = result.record_id

              const message = `Geofence Violation. Device -  ${deviceData?.device_name} / Site -  ${siteCode} - ${siteName}     Report time : ${mosyRightNow()} ${deviceURlPageDetails}` ;  

              sendAlertSMS(message, siteData);
              sendAlertEmail(message, `Geofence Violation alert ${deviceData?.device_name} Site : ${siteCode} - ${siteName}`, siteData); 
              }
          }
        }
    

  }

  export function loadSystemContacts(siteData)
  {

    //console.log(`loadSystemContacts++++++++++++++++++_____________++++++++++`, siteData);

    const siteName = siteData.site_name || "na";
    const siteCode = siteData.site_code || "na";

    //contact people
    const company_security_contacts = siteData.company_security_contacts || "";
    const vendor_contacts = siteData.vendor_contacts || "";
    const response_team_contacts = siteData.response_team_contacts || "";
    const crew_commander_contacts = siteData.crew_commander_contacts || "";
    const manager_email = siteData.manager_email || "";
    const contact_person_email = siteData.contact_person_email || "";

    const fallbackContact = "0710766390";

    
    const recipientCsv = [
      company_security_contacts,
      vendor_contacts,
      response_team_contacts,
      crew_commander_contacts,
      siteData.manager_mobile || "",
      siteData.contact_person_mobile || ""
    ]
    
    .filter(v => v && v.toString().trim() !== "")
    .join(",") || fallbackContact;

    const recipiensContacts = {phone_numbers : recipientCsv, manager_email : `${manager_email},${contact_person_email}`};

    //console.log(`recipiensContacts loadSystemContacts++++++++++++++++++_____________++++++++++`, recipiensContacts);

    return recipiensContacts
  }

  export async function sendAlertSMS(message, siteData)
  {
    const smsApiUrl = 'https://asanetic.com/sms/sendsms';

    const recipient = loadSystemContacts(siteData).phone_numbers;//'254710766390';

    //console.log(`sendAlert SMSMSM ++++++++++++++++_______________`, message, recipient);

    ///const message = 'Hello, this is a test SMS from the system.';

    // 🧠 Prepare SMS request
    const smsRequest = `pushsms&recp=${encodeURIComponent(recipient)}&body=${encodeURIComponent(message)}`;

    // 🚀 Send SMS
    const response = await fetch(smsApiUrl, {
      method: 'POST',
      headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: smsRequest,
    });
    
        const resultText = await response.text();

        console.log('SMS result:', resultText, recipient);

  }

  export async function sendAlertEmail(message, subject = "Symphony GPS", siteData)
  {
    const recipientCsv = loadSystemContacts(siteData).manager_email;

    //console.log(`sendAlertEmail++++++++++++++++_______________`, message, recipientCsv);
   
    const emailpassword = `ksff wxtm mqfd ngww`
    const emailAccount  =`symphonygpske@gmail.com`;

    // Configure Gmail transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailAccount,
        pass: emailpassword, // ✅ Gmail App Password        
      },
    });

    const finalMessage = `${message}`

    // // Send the actual email
    const info = await transporter.sendMail({
      from: `Symphony <${emailAccount}>`,
      to: recipientCsv,
      subject,
      text: finalMessage, // plain text
      html: `<p>${finalMessage.replace(/\n/g, '<br/>')}</p>`, // basic HTML
    });

    console.log('📨 Email sent:', info.messageId);
    return NextResponse.json({ success: true, message: 'Email sent successfully!' });    

  }

  export async function computeUnknownCoordinates(parseGPSData, recordId)
  {
     console.log(`computeUnknownCoordinates`, parseGPSData);

     const googlePayload = buildGoogleGeoPayload(parseGPSData)  

     console.log(`buildGoogleGeoPayload`, googlePayload);

    const location = await requestGoogleLocation(googlePayload);

    console.log(`requestGoogleLocation`, location);

    await UpdateDevicegpslogs(recordId, 
      {

      latitude: location.lat,
      longitude: location.lng,
      remark : "Computed"

     },
    {},{}, ` record_id ='${recordId}'`);

    //device geofence 
    const deviceDataRes = await mosyQddata("device_list", "serial_number",`${parseGPSData.imei}`);
    const deviceData = deviceDataRes;

    //run geofence 
   const isInsideGeofence = runGeofence(location, deviceData?.geofence)?.[0]?.inside;
   console.log(`isInsideGeofence`, isInsideGeofence);

   if(!isInsideGeofence)
   {
    logTcpAlarm(deviceData, parseGPSData, "geofence");
   }
  }

  export function buildGoogleGeoPayload(deviceData) 
  {

    // 1. Extract main tower info
    const mcc = deviceData.mcc || 0;
    const mnc = deviceData.mnc || 0;

    // 2. Convert Base Stations → Google format
    const cellTowers = (deviceData.baseStations || []).map(function (tower) {
        return {
            cellId: tower.baseStationNumber,
            locationAreaCode: tower.areaCode,
            mobileCountryCode: mcc,
            mobileNetworkCode: mnc,
            signalStrength: tower.signal
        };
    });

    // 3. Convert WiFi list → Google format
    const wifiAccessPoints = (deviceData.wifi || [])
        .filter(function (wifi) {
            return wifi.mac && wifi.mac !== "" && !isNaN(wifi.signal);
        })
        .map(function (wifi) {
            return {
                macAddress: wifi.mac,
                signalStrength: wifi.signal
            };
        });

    // 4. Build final Google payload
    const googlePayload = {
        homeMobileCountryCode: mcc,
        homeMobileNetworkCode: mnc,
        radioType: "gsm",
        considerIp: false,
        cellTowers: cellTowers,
        wifiAccessPoints: wifiAccessPoints
    };

    return googlePayload;

}

export async function requestGoogleLocation(payload) {

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;

  try {
      const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
      });

      const data = await response.json();

      console.error("Google Geolocation API Response:", data);

      // Return only the computed coordinates
      return {
          lat: data?.location?.lat || null,
          lng: data?.location?.lng || null,
          accuracy: data?.accuracy || null,
          raw: data
      };

  } catch (err) {

      console.error("Google Geolocation API Error:", err);

      return {
          lat: null,
          lng: null,
          accuracy: null,
          raw: null,
          error: true
      };
  }
}



export function runGeofence(points, polygon) {
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
