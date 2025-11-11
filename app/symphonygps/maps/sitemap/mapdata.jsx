"use client";
import { useEffect, useState } from "react";
import { mosyBtoa, mosyGetData, mosyUrlParam } from "../../../MosyUtils/hiveUtils";
import { getApiRoutes } from "../../AppRoutes/apiRoutesHandler";
import SingleSiteMap from "./maps";

const apiRoutes = getApiRoutes();

export default function SiteMapData() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const siteId  = mosyUrlParam("sitetoken")
      let  qstr = "";
      let  fullQuery = false ;
      if(siteId!='')
      {
        qstr = mosyBtoa(` where record_id ='${siteId}' `)
        fullQuery = true
      }

      const res = await mosyGetData({
        endpoint: `${apiRoutes.registeredsites.map}`,
        params: { fullQ: fullQuery , q:qstr},
      });
      setPoints(res.data || []);
    }
    fetchData();
  }, []); // 👈 empty deps = run once only

  console.log("Map points:", points);

  return (
    <div className="col-md-12 p-0 m-0">
          {points.length > 0 ? (<>
            <SingleSiteMap
              points={points}
            />
            </>
          ) : (
            <div className="col-md-12 p-5 text-center h3">Loading site map...</div>
          )}
        </div>
  );
}
