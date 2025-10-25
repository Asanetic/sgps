'use client';
import { htmlToPdfFromElement } from './htmlpdfjs';

export default function InvoicePreview() {
  const handleDownload = () => {
    htmlToPdfFromElement({
      elementId: 'invoice-container',
      fileName: 'invoice_asanetic.pdf',
    });
  };

  return (
    <>
      <div id="invoice-container" style={{ padding: '20px', background: '#fff' }}>
        <h1>Invoice</h1>
        <p><strong>Client:</strong> John Mwangi</p>
        <h2>Items</h2>
        <table className="table table-hover  text-left printTarget" id="invoices_data_table">

          <thead>
            <tr>
              <th>Item</th><th>Rate</th><th>Qty</th><th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Web Hosting</td><td>7500</td><td>1</td><td>7500</td></tr>
            <tr><td>Web Design</td><td>60000</td><td>1</td><td>60000</td></tr>
          </tbody>
        </table>
        <p><strong>Total:</strong> Ksh 67,500.00</p>
        <p>Thank you for your business.</p>
      </div>

      <button onClick={handleDownload}>Download PDF</button>
    </>
  );
}
