import { Suspense } from 'react';

import FullInvoicePDF from './pdfjs';
import PDFBlock from './pdfblock';
import PDFDemo from './pdfdemo';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Invoice items profile"//searchParams?.mosyTitle || "Invoice items";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Invoice items profile`,
    description: 'nextinvoice Invoice items',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function genPdf() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <PDFDemo/>
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}