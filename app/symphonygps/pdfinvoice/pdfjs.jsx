'use client';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function FullInvoicePDF() {
  const generatePDF = async () => {
    const doc = new jsPDF();
    const margin = 12;
    const rightX = doc.internal.pageSize.getWidth() - margin;

    // ✅ Fetch logo and convert to base64
    const logoUrl = `/api/mediaroom?media=${btoa("logo.png")}`;
    const paymentStatusImg = `/api/mediaroom?media=${btoa("unpaid_badge.jpg")}`;
    
    const drawImageSafely = async ({
      doc,
      url,
      type = 'PNG',
      x = 12,
      y = 20,
      maxWidth = 30,
      opacity = 1,
    }) => {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
    
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
    
        // 🔥 If opacity is less than 1, process through a canvas
        let finalBase64 = base64;
    
        if (opacity < 1) {
          const img = await new Promise((resolve) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.src = base64;
          });
    
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
    
          const ctx = canvas.getContext('2d');
          ctx.globalAlpha = opacity;
          ctx.drawImage(img, 0, 0);
          finalBase64 = canvas.toDataURL('image/png'); // use PNG for transparency
        }
    
        // Load final image for aspect ratio
        const tempImg = new Image();
        tempImg.src = finalBase64;
        await new Promise((resolve) => (tempImg.onload = resolve));
    
        const aspectRatio = tempImg.width / tempImg.height;
        const height = maxWidth / aspectRatio;
    
        doc.addImage(finalBase64, type, x, y, maxWidth, height);
      } catch (err) {
        console.warn(`⚠️ Image at "${url}" could not be loaded.`, err);
      }
    };
    

    await drawImageSafely({
      doc,
      url: logoUrl,
      x: margin,
      y: 20,
      maxWidth: 30,
    });
    

    
    // ✅ Vendor Details (right)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('ASANETIC DIGITAL', rightX, 25, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('info@asanetic.com', rightX, 31, { align: 'right' });
    doc.text('+254 712 345 678', rightX, 37, { align: 'right' });
    doc.text('Nairobi, Kenya', rightX, 43, { align: 'right' });

    // ✅ Draw horizontal line
    const hrY = 52;
    doc.setDrawColor("#2367B6");
    doc.setLineWidth(0.3);
    doc.line(margin, hrY, rightX, hrY);


    //status img

    await drawImageSafely({
      doc,
      type: "JPG",
      url: paymentStatusImg,
      x: (doc.internal.pageSize.getWidth() - 70) / 2,
      y: 65,
      maxWidth: 70,
      opacity : 0.3
    });
    
    
    // ✅ Client Details (left)
    const clientY = 65;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Bill To:', margin, clientY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('John Mwangi', margin, clientY + 8);
    doc.text('john@example.com', margin, clientY + 14);
    doc.text('+254 700 123 456', margin, clientY + 20);
    doc.text('Westlands, Nairobi', margin, clientY + 26);

    // ✅ Invoice Details (right)
    const invoiceY = 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor('#2367B6'); 

    doc.text('INVOICE', rightX, invoiceY + 6, { align: 'right' });

    doc.setFontSize(12);
    doc.setTextColor('#000000'); 

    doc.text('INV/20303/KSJDK38', rightX, invoiceY + 14, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    doc.text(`Date: ${new Date().toLocaleDateString()}`, rightX, invoiceY + 24, { align: 'right' });
    doc.text('Due Date: 30/06/2025', rightX, invoiceY + 30, { align: 'right' });
    doc.text('Subtotal: KES 100,000', rightX, invoiceY + 36, { align: 'right' });
    doc.text('Discount: KES 10,000', rightX, invoiceY + 42, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.text('Total: KES 90,000', rightX, invoiceY + 48, { align: 'right' });

    
    // ✅ Draw horizontal line
    const hTblrY = 120;
    doc.setDrawColor("#2367B6");
    doc.setLineWidth(0.3);
    doc.line(margin, hTblrY, rightX, hTblrY);


// 🧾 Invoice Items Table
autoTable(doc, {
  startY: 125, // adjust based on how tall your header/watermark is
  head: [['Item', 'Rate (Ksh)', 'Qty', 'Total (Ksh)']],
  body: [
    ['Web and email hosting', '7,500.00', '1', '7,500.00'],
    [
      `Web design\n 1. Admin portal for content management\n 2. Client main website\n 3. Email integration\n 4. Social media and WhatsApp integration\n 5. SEO`,
      '60,000.00',
      '1',
      '60,000.00',
    ],
  ],
  theme: 'grid',
  headStyles: {
    fillColor: [35, 103, 182], // Your blue (#2367B6)
    textColor: 255,
    halign: 'center',
  },
  bodyStyles: {
    valign: 'top'
  },
  styles: {
    textColor : "#000000",
    fontSize: 10,
    cellPadding: 2,
  },
});


    // 🧮 Totals
const pageWidth = doc.internal.pageSize.getWidth();
//const rightX = pageWidth - 20;
let totalsY = doc.lastAutoTable.finalY + 10;

doc.setFont('helvetica', 'bold');
doc.text('Sub total:', rightX - 40, totalsY, { align: 'right' });
doc.text('Ksh 67,500.00', rightX, totalsY, { align: 'right' });

totalsY += 7;

doc.text('Grand total:', rightX - 40, totalsY, { align: 'right' });
doc.text('Ksh 67,500.00', rightX, totalsY, { align: 'right' });

    // ✅ Draw horizontal line
    const hrfooterrY = totalsY+10;
    doc.setDrawColor("#2367B6");
    doc.setLineWidth(0.3);
    doc.line(margin, hrfooterrY, hrfooterrY, hrfooterrY);


// 🧾 Footer: Payment Modes and Notes
totalsY += 17;

doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.text('Payment Modes', margin, totalsY);

doc.setFont('helvetica', 'normal');
doc.setFontSize(10);
totalsY += 6;
doc.text('1. Bank', margin, totalsY);

totalsY += 6;
doc.text('Account Number: 0170174183460', margin, totalsY);
totalsY += 6;
doc.text('Account Name: JEREMIAH AKUNGA ASANYA', margin, totalsY);
totalsY += 6;
doc.text('Bank: Equity', margin, totalsY);

totalsY += 10;
doc.setFont('helvetica', 'bold');
doc.setTextColor('#2367B6');
doc.text('Thank you for your business!', margin, totalsY);

totalsY += 6;
doc.setFont('helvetica', 'normal');
doc.setTextColor('#000000');
doc.text('For any inquiries, please feel free to contact us.', margin, totalsY);



    doc.save('invoice.pdf');
  };

  return (
    <button onClick={generatePDF}>Download Invoice PDF</button>
  );
}
