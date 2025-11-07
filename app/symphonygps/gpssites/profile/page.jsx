import { Suspense } from 'react';

import RegisteredsitesProfile from '../uiControl/RegisteredsitesProfile';

import { InteprateRegisteredsitesEvent } from '../dataControl/RegisteredsitesRequestHandler';

import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Registered Sites "//searchParams?.mosyTitle || "Registered Sites";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Registered Sites`,
    description: 'symphonygps Registered Sites',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}    
                      

export default function RegisteredsitesMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <RegisteredsitesProfile 
                    dataIn={{ parentUseEffectKey: "initRegisteredsitesProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateRegisteredsitesEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}