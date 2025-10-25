import { Suspense } from 'react';

import DevicegpslogsList from '../uiControl/DevicegpslogsList';

import { InteprateDevicegpslogsEvent } from '../dataControl/DevicegpslogsRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Device GPS Logs "//searchParams?.mosyTitle || "Device GPS Logs";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Device GPS Logs`,
    description: 'symphonygps Device GPS Logs',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function DevicegpslogsMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <DevicegpslogsList  
                    
                     dataIn={{ parentUseEffectKey: "loadDevicegpslogsList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateDevicegpslogsEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }