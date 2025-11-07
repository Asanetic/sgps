'use client';
import { htmlToPdf } from './pdfblock';
import { mosyGetData } from '../../MosyUtils/hiveUtils';

export default function PDFDemo() {
    const handleDownload = async () => {

        try {
          const response = await mosyGetData({
            endpoint: '/api/nextinvoice/docs/generateinvoice',
            params: { 
              invoice: "100", 
              },
          });
      
          if (response.status === 'success') {
            //console.log('docs Data:', response.data);
            htmlToPdf(response.data);
            // ✅ Return the data
          } else {
            console.log('Error fetching docs data:', response);
            return []; // Safe fallback
          }
        } catch (err) {
          console.log('Error:', err);
          return []; //  Even safer fallback
        }
      // data = { x, y, fileName, htmlContent }
    };
  
    return <button onClick={handleDownload}>Download PDF</button>;
  }
