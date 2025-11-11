import { Suspense } from 'react';

import DevicesummaryList from '../uiControl/DevicesummaryList';

import { InteprateDevicesummaryEvent } from '../dataControl/DevicesummaryRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Device summary "//searchParams?.mosyTitle || "Device summary";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Device summary`,
    description: 'symphonygps Device summary',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function DevicesummaryMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <DevicesummaryList  
                    
                     dataIn={{ parentUseEffectKey: "loadDevicesummaryList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateDevicesummaryEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }