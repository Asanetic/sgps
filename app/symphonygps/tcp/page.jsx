import {TCPDashboard} from "./tcpmgr";
import { hiveRoutes } from "../../appConfigs/hiveRoutes";

export async function generateMetadata({ searchParams }) {
  const mosyTitle ="TCP monitoring dashboard";
  return {
    title: decodeURIComponent(mosyTitle),
    description: "SymphonyGPS Registered Sites",
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`,
    },
  };
}
export default function TCPPage()
{
    return (<TCPDashboard/>)
}