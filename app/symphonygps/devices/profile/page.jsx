import { Suspense } from 'react';

import DevicelistProfile from '../uiControl/DevicelistProfile';

import { InteprateDevicelistEvent } from '../dataControl/DevicelistRequestHandler';

import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Device List "//searchParams?.mosyTitle || "Device List";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Device List`,
    description: 'symphonygps Device List',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}    
                      

export default function DevicelistMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <DevicelistProfile 
                    dataIn={{ parentUseEffectKey: "initDevicelistProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateDevicelistEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}