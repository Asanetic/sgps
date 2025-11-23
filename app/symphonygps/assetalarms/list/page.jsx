import { Suspense } from 'react';

import AssetalarmsList from '../uiControl/AssetalarmsList';

import { InteprateAssetalarmsEvent } from '../dataControl/AssetalarmsRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Asset Alarms "//searchParams?.mosyTitle || "Asset Alarms";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Asset Alarms`,
    description: 'symphonygps Asset Alarms',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function AssetalarmsMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <AssetalarmsList  
                    
                     dataIn={{ parentUseEffectKey: "loadAssetalarmsList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateAssetalarmsEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }