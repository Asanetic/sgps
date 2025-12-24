'use client';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { hiveRoutes } from "../../../appConfigs/hiveRoutes";
import GeofenceMonitor, { loadSiteInfoWindowCard, FloatingSearchBar, GeofenceAlerts } from "../../AppCore/coreUtils";
import { MosyTitleTag } from "../../UiControl/componentControl";
import { mosyUrlParam } from "../../../MosyUtils/hiveUtils";
import RegisteredsitesDetails from "../../gpssites/uiControl/RegisteredsitesDetails";

export default function SingleSiteMap({ points = [] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });
  const [selected, setSelected] = useState(null); // full info card
  const [mapRef, setMapRef] = useState(null);     // map instance

  
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  const center = points.length
    ? { lat: Number(points[0].y), lng: Number(points[0].x) }
    : { lat: -1.2921, lng: 36.8219 };

  // Called when a site is selected from the search
  function handleSiteSelect(site) {
    if (!mapRef) return;

    console.log(`seelcted siteeeeeeee`. site)
    const lat = Number(site.latitude);
    const lng = Number(site.longitude);

    // Pan and zoom to selected marker
    mapRef.panTo({ lat, lng });
    mapRef.setZoom(14);

    // Ensure InfoWindow uses exact coordinates
    const fullMarker = points.find(p => p.record_id === site.record_id) || site;
    setSelected(fullMarker);
  }

  // useEffect(() => {
    
  //   setSelected(points[0])
  //   handleSiteSelect(selected)

  // }, []); // 👈 empty deps = run once only

  const siteData = points[0]
  const record_id = mosyUrlParam("sitetoken");

  return (
    <>
      {/* <FloatingSearchBar
        onSiteSelectFull={handleSiteSelect}
        
      /> */}

      <MosyTitleTag title={`Site  : ${siteData.name} - ${siteData.site_code}`}/>
      <GoogleMap
        onLoad={(map) => setMapRef(map)}
        mapContainerStyle={{ height: "70vh", width: "100%" }}
        center={center}
        zoom={14}
      >
        {points.map((p, i) => (
          <Marker
            key={i}
            position={{ lat: Number(p.y), lng: Number(p.x) }}
            onClick={() => setSelected(p)}
            icon={{
              url: `${hiveRoutes.hiveBaseRoute}/siteicon.png`,
              scaledSize: new google.maps.Size(60, 60),
            }}
          />
        ))}

        {/* Full InfoWindow */}
        {selected && (
          <InfoWindow
            position={{ lat: Number(selected.y), lng: Number(selected.x) }}
            onCloseClick={() => setSelected(null)}
            options={{ pixelOffset: new google.maps.Size(0, -40) }}
          >
            <div style={{ maxWidth: "450px", maxHeight: "400px", overflowY: "auto" }}>
              {loadSiteInfoWindowCard({site : selected, showSiteDetails : false , newPage : false})}
            </div>
          </InfoWindow>
        )}

        {/* <GeofenceMonitor title="Asset alerts"/> */}
      </GoogleMap>
      <RegisteredsitesDetails dataIn={
        {    
          showNavigationIsle : false,
          customQueryStr : ` where record_id = '${record_id}' `
        }
        } 
    />
    </>
  );
}
