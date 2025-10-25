// utils/html2pdfClient.js
import html2pdf from 'html2pdf.js';

export function htmlToPdfFromElement({ elementId, fileName = 'document.pdf' }) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`❌ Element with ID "${elementId}" not found.`);
    return;
  }

  html2pdf()
    .set({
      margin: 0.5,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    })
    .from(element)
    .save();
}
