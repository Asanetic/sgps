"use client";
import { useEffect, useState } from "react";
import { mosyGetData } from "../../../MosyUtils/hiveUtils";
import { getApiRoutes } from "../../AppRoutes/apiRoutesHandler";
import SimMap from "./simmap";

const apiRoutes = getApiRoutes();

export default function SimMapData() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await mosyGetData({
        endpoint: `${apiRoutes.registeredsites.map}`,
        params: { site: "all" },
      });
      setPoints(res.data || []);
    }
    fetchData();
  }, []); // 👈 empty deps = run once only

  console.log("Map points:", points);

  return (
    <div className="col-md-12 p-0 m-0">
          {points.length > 0 ? (<>
            <SimMap
              points={points}
            />
            </>
          ) : (
            <div className="col-md-12 p-5 text-center h3">Loading map...</div>
          )}
        </div>
  );
}
