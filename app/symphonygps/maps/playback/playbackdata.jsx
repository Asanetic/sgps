"use client";
import { useEffect, useState } from "react";
import { mosyGetData, mosyBtoa, mosyUrlParam, mosyAtob } from "../../../MosyUtils/hiveUtils";
import { getApiRoutes } from "../../AppRoutes/apiRoutesHandler";
import { refactorDeviceData } from "../../AppCore/coreUtils";
import { MosyNotify } from "../../../MosyUtils/ActionModals";
import PlayBack from "./playback";

const apiRoutes = getApiRoutes();

export function PlayBackMapData({ device_id = "" }) 
{

  const [requestedDeviceId, setRequestedDeviceId] = useState("");
  const [dates, setDates] = useState({ start: "", end: "" });
  const [pointsData, setPointsData] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // 1️⃣ Safely read URL data (client-only)
  useEffect(() => {
    const urlDevice = mosyUrlParam("device");
    const startDate = mosyUrlParam("start_date");
    const endDate   = mosyUrlParam("end_date");

    setRequestedDeviceId(urlDevice ? mosyAtob(urlDevice) : device_id);
    setDates({ start: startDate || "", end: endDate || "" });
    setIsReady(true);
  }, [device_id]);

  // 2️⃣ Fetch playback data when ready
  useEffect(() => {
    if (!isReady) return;

    if (!requestedDeviceId) {
      MosyNotify({
        icon: "info",
        message: "No device selected for playback",
        addTimer: true
      });
      return;
    }

    async function fetchData() {
      try {
        const qparams = {
          q: mosyBtoa(`where primkey='${requestedDeviceId}'`),
          fullQ: true,
          start_date: dates.start || "",
          end_date: dates.end || ""
        };

        const res = await mosyGetData({
          endpoint: apiRoutes.devicelist.map,
          params: qparams
        });

        if (res?.data) setPointsData(res);
      } catch (err) {
        console.error("Error fetching map data:", err);
      }
    }

    fetchData();

    // ⏱ poll occasionally (but not crazy aggressive)
    const intervalId = setInterval(fetchData, 30000); // 30s
    return () => clearInterval(intervalId);
  }, [isReady, requestedDeviceId, dates]);

  const deviceData = refactorDeviceData(pointsData);

  return (
    <div className="col-md-12 p-0 m-0">
      {deviceData.length > 0 ? (
        <PlayBack devices={deviceData} />
      ) : (
        <div className="col-md-12 p-5 text-center h3">
          Loading map...
        </div>
      )}
    </div>
  );
}
