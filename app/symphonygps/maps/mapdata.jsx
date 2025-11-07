"use client";
import { useEffect, useState } from "react";
import { mosyBtoa, mosyGetData } from "../../MosyUtils/hiveUtils";
import { getApiRoutes } from "../AppRoutes/apiRoutesHandler";
import SimpleMap from "./maps";

const apiRoutes = getApiRoutes();

export default function MapData() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await mosyGetData({
        endpoint: `${apiRoutes.registeredsites.map}`,
        params: { fullQ: false , q:mosyBtoa("")},
      });
      setPoints(res.data || []);
    }
    fetchData();
  }, []); // 👈 empty deps = run once only

  console.log("Map points:", points);

  return (
    <div className="col-md-12 p-0 m-0">
          {points.length > 0 ? (<>
            <SimpleMap
              points={points}
            />
            </>
          ) : (
            <div className="col-md-12 p-5 text-center h3">Loading map...</div>
          )}
        </div>
  );
}
