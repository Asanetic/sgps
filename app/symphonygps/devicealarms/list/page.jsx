import { Suspense } from 'react';

import DevicealarmsList from '../uiControl/DevicealarmsList';

import { InteprateDevicealarmsEvent } from '../dataControl/DevicealarmsRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Device Alarms "//searchParams?.mosyTitle || "Device Alarms";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Device Alarms`,
    description: 'symphonygps Device Alarms',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function DevicealarmsMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <DevicealarmsList  
                    
                     dataIn={{ parentUseEffectKey: "loadDevicealarmsList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateDevicealarmsEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }