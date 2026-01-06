import { Suspense } from 'react';

import List from '../uiControl/List';

import { InteprateEvent } from '../dataControl/RequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = " "//searchParams?.mosyTitle || "";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : ``,
    description: 'symphonygps ',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function MainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <List  
                    
                     dataIn={{ parentUseEffectKey: "loadList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }