import { Suspense } from 'react';

import DevicealarmsProfile from '../uiControl/DevicealarmsProfile';

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
                      

export default function DevicealarmsMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <DevicealarmsProfile 
                    dataIn={{ parentUseEffectKey: "initDevicealarmsProfile" }} 
                                           
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