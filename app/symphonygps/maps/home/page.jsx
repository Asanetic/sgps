// app/symphonygps/maps/page.jsx
import { hiveRoutes } from "../../../appConfigs/hiveRoutes";
import { Suspense } from "react";

import { getApiRoutes } from "../../AppRoutes/apiRoutesHandler";
import MapData from "../mapdata";

const apiRoutes = getApiRoutes();

export async function generateMetadata({ searchParams }) {
  const mosyTitle = searchParams?.mosyTitle || "Site map";
  return {
    title: decodeURIComponent(mosyTitle),
    description: "SymphonyGPS Registered Sites",
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`,
    },
  };
}


export default async function MapPage() {

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content container-fluid p-0 m-0">
          <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading map...</div>}>
            <MapData    />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
