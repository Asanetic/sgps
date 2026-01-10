"use client";
import { useEffect, useState } from "react";
import { mosyGetData , mosyBtoa, mosyUrlParam, mosyAtob, mosyGetCookie, mosyGetLSData, mosySetLSData} from "../../../MosyUtils/hiveUtils";
import { getApiRoutes } from "../../../symphonygps/AppRoutes/apiRoutesHandler";
import Tracker from "./tracker";
import { refactorDeviceData } from "../../../symphonygps/AppCore/coreUtils";

const apiRoutes = getApiRoutes();

export default function TrackerMapData({device_id=""}) {
  const [pointsData, setPointsData] = useState([]); // ✅ more descriptive name

  let qparams = { fullQ: false };

  // Get device key from URL param
  const deviceKey = mosyUrlParam("device");

  // Determine which key to use (prop takes priority)
  const validKey = device_id || (deviceKey && mosyAtob(deviceKey));

  if (validKey) {
    qparams = {
      q: mosyBtoa(`WHERE primkey='${validKey}'`),
      fullQ: true,
    };
  } else {
    console.warn("No valid device key provided — query will be empty.");
  }


  useEffect(() => {

    const tokenVal = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dfY291bnQiOjEsInVzZXJfaWQiOiJEVDRLT0lHIiwidGVsIjoiMDcxMDc2NjM5MCIsIm5hbWUiOiJTdXBlcmFkbWluIiwiZW1haWwiOiJzdXBlcmFkbWluIiwiaGl2ZV9zaXRlX2lkIjoiIiwiaGl2ZV9zaXRlX25hbWUiOiIiLCJleHAiOjE4MzEwMDAxNTJ9.BsFyfw8zmRY0jHFhe8SSeOmWYvMvDR4YgOWNwmAANo8`
    
    mosySetLSData("gps_authToken", tokenVal);

    let intervalId;
  
    async function fetchData() {
      try {
        const res = await mosyGetData({
          endpoint: `${apiRoutes.devicelist.map}`,
          params: qparams
        });
  
        if (res?.data) {
          setPointsData(res);
        }
      } catch (err) {
        console.error("Error fetching map data:", err);
      }
    }
  
    const activeToken = mosyGetLSData("gps_authToken");

    // initial fetch
    if(activeToken!=="")
    {
      fetchData();
    
      // poll every 3 seconds
      intervalId = setInterval(fetchData, 2000);
    
      // cleanup on unmount
      return () => clearInterval(intervalId);
    }

  }, [device_id]);
  
  const deviceData= refactorDeviceData(pointsData);

  return (
    <div className="col-md-12 p-0 m-0">
      {deviceData.length > 0 ? (
        <Tracker devices={deviceData} />
      ) : (
        <div className="col-md-12 p-5 text-center h3">Loading device map...</div>
      )}
    </div>
  );
}
