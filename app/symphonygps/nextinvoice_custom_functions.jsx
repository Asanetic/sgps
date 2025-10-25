import React, { useEffect } from "react";

import { createRoot } from "react-dom/client";

// add app based functons here /nextinvoiceCustomFunctions 
import { mosyCreatePdf } from '../MosyUtils/mosyCreatePdf'
import { magicTrimText, mosyBtoa, mosyGetData, mosyGetElemVal, mosyNl2br, mosyPostData, mosyPostFormData, mosyTonum } from '../MosyUtils/hiveUtils';
import { MosyAlertCard, MosyConfirm, MosyNotify } from '../MosyUtils/ActionModals';
import { closeMosyCard, MosyCard } from '../components/MosyCard';
import { insertInvoicelist } from './docs/dataControl/InvoicelistRequestHandler';
import SmsremindersProfile from './reminders/uiControl/SmsremindersProfile';
import MessageoutboxProfile from './reminders/uiControl/MessageoutboxProfile';
import { insertClientlist } from "./clients/dataControl/ClientlistRequestHandler";


export function loadVendorHeaders(dataRes)
{
  const vendorHeaders = `${dataRes?.business_name}
${dataRes?.mobile}
${dataRes?.email}
${dataRes?.location}`

  return vendorHeaders

}


export function loadClientHeaders(dataRes)
{
  const clientHeaders = `${dataRes?.client_name}
${dataRes?.client_tel}
${dataRes?.client_email}
${dataRes?.client_location}`

  return clientHeaders

}

export async function downloadInvoiceOld({invoiceId="test"})
{
          try {
            MosyNotify({message : "Generating invoice...", addTimer: false, icon:"copy"})
            const response = await mosyGetData({
              endpoint: '/api/nextinvoice/docs/generateinvoice',
              params: { 
                invoice: mosyBtoa(invoiceId), 
                },
            });
        
            if (response.status === 'success') {
              //console.log('docs Data:', response.data);
              mosyCreatePdf(response.data);
              closeMosyCard()
              // ✅ Return the data
            } else {
              console.log('Error fetching docs data:', response);
              return []; // Safe fallback
            }
          } catch (err) {
            console.log('Error:', err);
            return []; //  Even safer fallback
          }
}

export async function downloadInvoice({invoiceId="test"})
{
          try {
            MosyNotify({message : "Generating invoice...", addTimer: false, icon:"copy"})
            const response = await mosyGetData({
              endpoint: '/api/nextinvoice/docs/generateinvoice',
              params: { 
                invoice: mosyBtoa(invoiceId), 
                },
                rawResponse : true
            });
        
            if (response.ok) {
              //console.log('docs Data:', response.data);
              //mosyCreatePdf(response.data);

              if (!response.ok) {
                console.error('Failed to generate PDF:', response.statusText);
                return;
              }
          
              const blob = await response.blob();
          
              const fileName = `${invoiceId}.pdf`;
              const url = URL.createObjectURL(blob);
          
              // 1. Preview in a new tab
              window.open(url, '_blank');
              
              // 2. Auto-download
              const link = document.createElement('a');
              link.href = url;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // 3. Safe cleanup after delay (important!)
              setTimeout(() => {
                URL.revokeObjectURL(url);
              }, 20000); // 20 seconds to be sure the new tab loaded fully
                    
                                      
              closeMosyCard()
              // ✅ Return the data
            } else {
              MosyNotify({message : `Error generating invoice... ${response}`, addTimer: false, icon:"time-circle" , iconColor: "text-danger"})

              console.log('Error fetching docs data:', response);
              return []; // Safe fallback
            }
          } catch (err) {
            console.log('Error:', err);
            MosyNotify({message : `Error generating invoice... ${err}`, addTimer: false, icon:"time-circle" , iconColor: "text-danger"})

            return []; //  Even safer fallback
          }
}


export async function downloadQuotation({invoiceId="test"})
{
          try {
            MosyNotify({message : "Generating quotation...", addTimer: false, icon:"copy"})
            const response = await mosyGetData({
              endpoint: '/api/nextinvoice/docs/generatequotation',
              params: { 
                invoice: mosyBtoa(invoiceId), 
                },
                rawResponse : true
            });
        
            if (response.ok) {
              //console.log('docs Data:', response.data);
              //mosyCreatePdf(response.data);

              if (!response.ok) {
                console.error('Failed to generate PDF:', response.statusText);
                return;
              }
          
              const blob = await response.blob();
          
              const fileName = `${invoiceId}.pdf`;
              const url = URL.createObjectURL(blob);
          
              // 1. Preview in a new tab
              window.open(url, '_blank');
              
              // 2. Auto-download
              const link = document.createElement('a');
              link.href = url;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // 3. Safe cleanup after delay (important!)
              setTimeout(() => {
                URL.revokeObjectURL(url);
              }, 20000); // 20 seconds to be sure the new tab loaded fully
                    
                                      
              closeMosyCard()
              // ✅ Return the data
            } else {
              console.log('Error fetching docs data:', response);
              return []; // Safe fallback
            }
          } catch (err) {
            console.log('Error:', err);
            return []; //  Even safer fallback
          }
}


export async function downloadReceipt({ invoiceId = "test", onComplete = null, externalWindow = null }) {
  try {
    MosyNotify({ message: "Generating receipt...", addTimer: false, icon: "copy" });

    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/docs/generatereceipt',
      params: { invoice: mosyBtoa(invoiceId) },
      rawResponse: true
    });

    if (response.ok) {
      const blob = await response.blob();
      const fileName = `${invoiceId}.pdf`;
      const url = URL.createObjectURL(blob);

      // Open tab if not passed
      let win = externalWindow || window.open('', '_blank');
      if (win) {
        win.location.href = url;
      }

      // Optional: trigger auto-download in current tab
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      setTimeout(() => {
        URL.revokeObjectURL(url);
        if (onComplete) {
          onComplete(); // Your custom cleanup logic
        } else if (win && !win.closed) {
          win.close(); // Default: just close the tab
        }
      }, 5000);

      closeMosyCard();
    } else {
      MosyNotify({
        message: `Error generating receipt... ${response.message}`,
        addTimer: false,
        icon: "times-circle",
        iconColor: "text-danger"
      });
    }

  } catch (err) {
    console.log('Error:', err);
    MosyNotify({
      message: `Fatal error generating receipt... ${err}`,
      addTimer: false,
      icon: "times-circle",
      iconColor: "text-danger"
    });
  }
}



export async function downloadDocument({ docId = "test", onComplete = null, externalWindow = null }) {
  try {
    MosyNotify({ message: "Creating document...", addTimer: false, icon: "copy" });

    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/quick_notes/generatedoc',
      params: { doc: mosyBtoa(docId) },
      rawResponse: true
    });

    if (response.ok) {
      const blob = await response.blob();
      const fileName = `${docId}.pdf`;
      const url = URL.createObjectURL(blob);

      // Open tab if not passed
      let win = externalWindow || window.open('', '_blank');
      if (win) {
        win.location.href = url;
      }

      // Optional: trigger auto-download in current tab
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      setTimeout(() => {
        URL.revokeObjectURL(url);
        if (onComplete) {
          onComplete(); // Your custom cleanup logic
        } else if (win && !win.closed) {
          win.close(); // Default: just close the tab
        }
      }, 5000);

      closeMosyCard();
    } else {
      MosyNotify({
        message: `Error creating document... ${response.message}`,
        addTimer: false,
        icon: "times-circle",
        iconColor: "text-danger"
      });
    }

  } catch (err) {
    console.log('Error:', err);
    MosyNotify({
      message: `Fatal error creating document... ${err}`,
      addTimer: false,
      icon: "times-circle",
      iconColor: "text-danger"
    });
  }
}


export function convertToInvoice(handleInputChange)
{
  MosyAlertCard({message : "Convert to quotation to invoice?", icon: "copy", iconColor : "text-info",
     onYes: async ()=>{
    
    closeMosyCard("modal2")

    handleInputChange('txt_invoice_type','convert_quotation');

    MosyNotify({message:"Converting to invoice...", icon:"send",addTimer:false, id:"modal1"})
    
    const result = await  insertInvoicelist()

    if (result?.status === 'success') {
      
      const invoicesUptoken = btoa(result.invoices_uptoken || '');
      
      window.location=`./invoiceprofile?invoices_uptoken=${invoicesUptoken}`

    }

  },id:"modal2", onNo:()=>{
    closeMosyCard("modal2")
  },dismissable :false})
}

export function convertToCustomer({name, email, tel})
{
  MosyAlertCard({message : "Convert to lead to customer?", icon: "copy", iconColor : "text-info",
     onYes: async ()=>{
    
    closeMosyCard("modal2")

    MosyNotify({message:"Converting to lead...", icon:"send",addTimer:false, id:"modal1"})
    
    const result = await  mosyPostData({url:`/api/nextinvoice/clients/clientlist`,
       data:{
        clients_mosy_action:"add_clients",
        txt_client_name:name, 
        txt_client_email:email, 
        txt_client_tel : tel,
        txt_client_location : `Online Lead`}
      })

    if (result?.status === 'success') {
      
      const clientToken = btoa(result.clients_uptoken || '');
      
      window.location=`../clients/clientprofile?clients_uptoken=${clientToken}`

    }

  },id:"modal2", onNo:()=>{
    closeMosyCard("modal2")
  },dismissable :false})
}

export function sendMessage(handleInputChange)
{
  MosyAlertCard({message : "I confirm the receiver and the message details are correct", icon: "info-circle", iconColor : "text-info",
     onYes: async ()=>{
    
    MosyNotify({message:"Sending message...", icon:"send",addTimer:false, id:"topmost"})
    
    await sendEmail()
    closeMosyCard("topmost")

  }, onNo:()=>{
    closeMosyCard()
  }, yesLabel : "Send", noLabel:"Cancel"})
}

export function sendReminder({docData = {}})
{
  MosyCard("", <>
      <MessageoutboxProfile
          dataIn={{ parentUseEffectKey: "sendreminderPopUp" , docData: docData, showNavigationIsle : false }}                           
      />
    </>,false, "modal2","mosycard_medium")
}



export function sendWhatsappMessage() {
  const messageToSend = mosyGetElemVal("txt_message_details", "");
  const receiver = mosyGetElemVal("txt_receiver_tel", "");

  MosyAlertCard({
    message: `Send to ${receiver} \n ${magicTrimText(messageToSend, 100)}`,
    icon: "whatsapp",
    iconColor: "text-success",
    onYes: async () => {
      MosyNotify({
        message: "Sending message...",
        icon: "send",
        addTimer: false,
        id: "topmost"
      });

      openWhatsAppUrl(receiver, messageToSend); // ✅ Use this instead of <WhatsAppAutoOpen />
    },
    onNo: () => {
      closeMosyCard();
    },
    yesLabel: "Send",
    noLabel: "Cancel"
  });
}


export function openWhatsAppUrl(phone, message) {
  if (!phone || !message) return;

  let cleanedPhone = phone.trim();

  // Handle +254 numbers (keep the +)
  if (cleanedPhone.startsWith("+254")) {
    cleanedPhone = cleanedPhone.replace(/\s+/g, ""); // remove internal spaces
  }

  // Handle 07... -> convert to 2547...
  else if (cleanedPhone.startsWith("07")) {
    cleanedPhone = "254" + cleanedPhone.substring(1);
  }

  // Handle 254... without + (no change needed, just strip non-digits)
  else if (cleanedPhone.startsWith("254")) {
    cleanedPhone = cleanedPhone.replace(/\D/g, "");
  }

  // Handle + other international (keep as-is)
  else if (cleanedPhone.startsWith("+")) {
    cleanedPhone = cleanedPhone.replace(/\s+/g, "");
  }

  // Fallback: clean digits, maybe raise a log or warning
  else {
    cleanedPhone = cleanedPhone.replace(/\D/g, "");
  }

  const encodedMessage = encodeURIComponent(message);
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
  const baseUrl = isMobile
    ? "https://api.whatsapp.com/send"
    : "https://web.whatsapp.com/send";

  // Strip + for wa.me format
  const whatsappPhone = cleanedPhone.startsWith("+")
    ? cleanedPhone.substring(1)
    : cleanedPhone;

  closeMosyCard("topmost");

  const url = `${baseUrl}?phone=${whatsappPhone}&text=${encodedMessage}`;
  window.open(url, "_blank", "noopener,noreferrer");
}




export function genDocNo() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 0-indexed
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}${month}${day}`; // e.g. 20250622
}


// utils/copyElementValueToClipboard.js

export async function grabMessage(elementId) {
  try {
    const inputEl = document.getElementById(elementId);

    if (!inputEl) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    const text = inputEl.value || inputEl.innerText || inputEl.textContent;

    await navigator.clipboard.writeText(text);
    MosyNotify({message:"Message copied to clipboard.\nYou can paste it any where you prefer"})
    console.log('Copied from element:', text);
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
}

const defaultTokens = [
  { label: "Document No", value: "{{doc_no}}", key: "invoice_no" },
  { label: "Name", value: "{{first_name}}", key: "_clients_client_name_client_id" },
  { label: "SubTotal", value: "{{subtotal}}", key: "subtotal" },
  { label: "Discount", value: "{{discount}}", key: "discount" },
  { label: "Grand total", value: "{{grand_total}}", key: "grand_total" },
  { label: "Amount paid", value: "{{amount_paid}}", key: "amount_paid" },
  { label: "Balance", value: "{{balance}}", key: "invoice_balance" },
  { label: "Due Date", value: "{{due_date}}", key: "date_due" },
  { label: "Footnote", value: "{{footnote}}", key: "footnote" },
  { label: "Document link", value: "{{doc_link}}", key: "doc_link" },
];

export function loadDocMessage(dataRes = {}, templateMsg = "", docType="i") {

  dataRes.invoice_balance = mosyTonum(dataRes?.invoice_balance)
  dataRes.subtotal = mosyTonum(dataRes?.subtotal)
  dataRes.grand_total = mosyTonum(dataRes?.grand_total)
  dataRes.balance = mosyTonum(dataRes?.balance)
  dataRes.discount = mosyTonum(dataRes?.discount)
  dataRes.grand_total = mosyTonum(dataRes?.grand_total)
  dataRes.amount_paid = mosyTonum(dataRes?.amount_paid)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if(Number(dataRes?.balance)==0)
  {
    docType="r"
  }

  if(dataRes?.invoice_type=="Invoice")
  {
    docType="i"
  }

  if(dataRes?.invoice_type=="Quotation")
  {
      docType="q"
  }

  dataRes.doc_link = `${baseUrl}/view/${docType}?q=${mosyBtoa(dataRes?.primkey)}`;

  const defaultTemplate = `Hi {{first_name}},

Thank you again for trusting us with your project -- we appreciate that very much.

As agreed, the remaining balance of ${dataRes?.currency} {{balance}} is now due on {{due_date}}.

Kindly find the attached details for your project invoice

 invoice Number {{doc_no}}
 
 Total amount  : ${dataRes?.currency}  {{subtotal}}
 
 Discount : ${dataRes?.currency}  {{discount}}
 
 Amount Paid  : ${dataRes?.currency}  {{amount_paid}}

 Remaining balance : ${dataRes?.currency}  {{balance}}

 To be paid by Date due : {{due_date}}

{{footnote}}

Feel free to reach out if you have any questions.

Invoice link :

${baseUrl}/view/${docType}?q=${mosyBtoa(dataRes?.primkey)}

Best regards,  
{{business_name}}`;

  // Use user-defined or fallback template
  //let message = templateMsg.trim() ? templateMsg : defaultTemplate;
 let message = document.getElementById("txt_message_details")?.value?.trim() || defaultTemplate;

  // Replace known default tokens
  for (const token of defaultTokens) {
    const val = dataRes?.[token.key] ?? "";
    message = message.replaceAll(token.value, val);
  }

  // Replace extra custom tags if needed
  message = message.replaceAll("{{footnote}}", dataRes?.footnote || "");
  message = message.replaceAll("{{business_name}}", dataRes?._companies_business_name_vendor_name || "");

  return message;
}



export function InvoiceMessageEditor() {
  const textareaId = "txt_message_details";

  const placeholders = [
    { label: "Invoice No", value: "{{invoice_no}}" },
    { label: "Client Name", value: "{{client_name}}" },
    { label: "Amount", value: "{{invamt}}" },
    { label: "Due Date", value: "{{due_date}}" },
  ];

  return (
    <div>
      <h4>Customize Invoice Message</h4>

      <div className="mb-2">
        {placeholders.map((p) => (
          <button
            key={p.value}
            className="btn btn-outline-secondary btn-sm me-1 mb-1"
            onClick={() => insertPlaceholderAtCursor(textareaId, p.value)}
          >
            + {p.label}
          </button>
        ))}
      </div>

      <textarea
        id={textareaId}
        className="form-control"
        rows="6"
        placeholder="Type your message here..."
      ></textarea>
    </div>
  );
}


export function PlaceHolderButtons({ textareaId, insertAfterId, tokens = defaultTokens }) {
  useEffect(() => {
    if (!insertAfterId) return;
  
    const anchorElement = document.getElementById(insertAfterId);
    if (!anchorElement) return;
  
    const container = document.createElement("div");
    container.className = "placeholder-button-container";
    anchorElement.parentNode.insertBefore(container, anchorElement.nextSibling);
  
    const root = createRoot(container);
    root.render(<ButtonGroup tokens={tokens} textareaId={textareaId} />);
  
    return () => {
      // Fixes race condition warning
      setTimeout(() => {
        root.unmount();
        container.remove();
      }, 0);
    };
  }, [insertAfterId, textareaId, tokens]);
  

  return null; // Injects elsewhere
}

function ButtonGroup({ tokens, textareaId }) {
  return (
    <div className="mb-2"> <span className="badge"> Placeholders </span>
      {tokens.map((token) => (
        <span
          key={token.value}
          className="badge text-info bg-white border cpointer mr-1 p-1 mb-1"
          onClick={() => insertPlaceholderAtCursor(textareaId, ` ${token.value} `)}
        >
           {token.label}
        </span>
      ))}
    </div>
  );
}

function insertPlaceholderAtCursor(textareaId, placeholder) {
  const textarea = document.getElementById(textareaId);
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;

  const before = text.substring(0, start);
  const after = text.substring(end);

  textarea.value = before + placeholder + after;
  textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
  textarea.focus();
}


export async function sendEmail()
{

  const response = await mosyPostFormData({ 
    formId :"messaging_profile_form", 
    url: '/api/nextinvoice/sendemail'
  });

  if (response.success) {
    MosyNotify({message:"Message sent", icon :"check-circle", iconColor:"text-success", addTimer :false})
  }else{
    MosyNotify({message:"Message not sent", icon :"times-circle", iconColor:"text-danger", addTimer:false})

  }
}


