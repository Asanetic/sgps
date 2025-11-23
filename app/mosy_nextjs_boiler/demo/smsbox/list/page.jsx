import { Suspense } from 'react';

import SmsmessagesList from '../uiControl/SmsmessagesList';

import { InteprateSmsmessagesEvent } from '../dataControl/SmsmessagesRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "SMS Messages "//searchParams?.mosyTitle || "SMS Messages";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `SMS Messages`,
    description: 'dsgportal SMS Messages',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function SmsmessagesMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <SmsmessagesList  
                    
                     dataIn={{ parentUseEffectKey: "loadSmsmessagesList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateSmsmessagesEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }