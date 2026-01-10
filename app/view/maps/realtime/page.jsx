// app/symphonygps/maps/page.jsx
import { hiveRoutes } from "../../../appConfigs/hiveRoutes";
import { Suspense } from "react";

import TrackerMapData from "./trackerdata";

export async function generateMetadata({ searchParams }) {
  const mosyTitle = searchParams?.mosyTitle || "Device monitoring dashboard";
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
      <div className="page-wrapper p-0 m-0 ">
        <div className="content container-fluid p-0 m-0">
          <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading playback map...</div>}>
            <TrackerMapData    />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
