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
    while (index + 2 < parts.length) {
      const wfName = parts[index++];
      const mac = parts[index++];
      const signal = parseInt(parts[index++]);
      wifi.push({ name: wfName, mac, signal });
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
export function processDevicePingToLog(parsedGPS, options = {}) {
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
  
    return {
      log_type: 'GPS',                    // fixed type for GPS logs
      site_name: options.siteName || '?',
      device_id: deviceId || '?',
      battery: battery || '?',
      latitude: lat || '?',
      longitude: lng || '?',
      speed: speed || '?',
      remark: options.remark || '?',
      timestamp: timestamp || '?',
      created_at: options.createdAt || new Date().toISOString(),
      log_details: JSON.stringify(logDetails),
      hive_site_id: options.hiveSiteId || '?',
      hive_site_name: options.hiveSiteName || '?'
    };
  }
  
  