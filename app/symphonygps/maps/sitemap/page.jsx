// app/symphonygps/maps/page.jsx
import { Suspense } from "react";
import { hiveRoutes } from "../../../appConfigs/hiveRoutes";
import MapSwitcher from "./MapSwitcher";

export async function generateMetadata() {
  return {
    title: "Device monitoring dashboard",
    description: "SymphonyGPS Registered Sites",
    icons: { icon: `${hiveRoutes.hiveBaseRoute}/logo.png` },
  };
}

export default function MapPage() {
  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content container-fluid p-0 m-0">
          <Suspense fallback={<div className="p-5 text-center h3">Loading...</div>}>
            <MapSwitcher />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
