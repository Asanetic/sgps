"use client";
import { useState , useCallback, useRef, Fragment } from 'react';
import { MosyCard } from '../components/MosyCard';
import saAuthConfigs from '../auth/featureConfig/saAuthConfigs'; 

import {destroyAppSession} from '../auth/AuthUtils';

// data_control/postFormData.js
export async function mosyPostFormData({ formId, url, method = 'POST', isMultipart = true }) {
  const form = document.getElementById(formId);
  if (!form) throw new Error(`Form with ID "${formId}" not found.`);

  const formData = new FormData(form);
  let body;
  let headers = {};

  // Check if there's any file input OR force multipart manually
  const containsFile = [...form.elements].some(
    (el) => el.type === 'file' && el.files.length > 0
  );

  const useMultipart = containsFile || isMultipart;

  const sessionPrefix = saAuthConfigs.sessionPrefix
  headers['Authorization'] = `Bearer ${mosyGetLSData(`${sessionPrefix}_authToken`)}`;

  if (useMultipart) {
    // Browser handles content-type header automatically with boundary
    body = formData;
  } else {
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });
    body = JSON.stringify(jsonData);
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
  });

  
  if(res.status=="403"){

    destroyAppSession(true)

  }

  const result = await res.json();

  if (!res.ok) {
    //throw new Error(result.message || 'Form submission failed');
    return res;
  }

  return result;
}


//post data no DOM form id
export async function mosyPostData({
  url,
  data = {},       // pass raw JS object
  method = 'POST',
  isMultipart = false
}) {

  let body;
  let headers = {};

  console.log(`Posting to ${url} with data:`, data);
  
  const sessionPrefix = saAuthConfigs.sessionPrefix;
  const authToken = mosyGetLSData(`${sessionPrefix}_authToken`);

  headers['Authorization'] = `Bearer ${authToken}`;

  if (isMultipart) {
    body = new FormData();
    for (const key in data) {
      body.append(key, data[key]);
    }
    // Content-Type is set automatically by browser for FormData
  } else {
    body = JSON.stringify(data);
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
  });

  if (res.status === 403) {
    destroyAppSession(true);
  }

  const result = await res.json();

  if (!res.ok) {
    console.warn(`Request failed:`, result);
    return res;
  }

  return result;
}


export async function mosyGetData({
  endpoint = '',
  params = {},
  headers = {}, // 🔥 new param
  onError = (err) => console.error('MosyFetchError:', err),
  rawResponse = false
}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;

    const sessionPrefix = saAuthConfigs.sessionPrefix;
    const defaultHeaders = {
      'Authorization': `Bearer ${mosyGetLSData(`${sessionPrefix}_authToken`)}`,
    };

    const mergedHeaders = {
      ...defaultHeaders,
      ...headers, // 🧠 if there's a conflict, this overrides
    };


    const res = await fetch(url, {
      method: 'GET',
      headers: mergedHeaders,
    });

    //console.log("mosygetttttt", res)
    if(res.status=="403"){
      destroyAppSession(true)
    }

    if (!res.ok) {
      return res;
    }

    if(res.ok){
      if(rawResponse)
      {
        return res
      }else{
        const json = await res.json();

        if (json.status !== 'success') {
          return json;
        }
    
        return json;
      }
    }

  } catch (err) {
    onError(err);
    return {
      status: 'error',
      message: err.message,
      data: [],
    };
  }
}



export function mosyHydrateFormData(responseObj, tblCallback = "") {
  console.log('Sent data to hydrate:', JSON.stringify(responseObj, null, 2));

  try {
    const dataObj = responseObj?.data?.[0];

    if (!dataObj) {
      console.warn("No data to hydrate.");
      return;
    }

    Object.entries(dataObj).forEach(([key, val]) => {
      const safeVal = val ?? ''; // avoid nulls

      mosy_push_data(`txt_${key}`, safeVal);
      mosy_push_data(`txt_${key}_disp`, safeVal);
      mosy_push_data(`txt_${key}_${tblCallback}_disp`, safeVal);
      mosy_push_data(`div_txt_${key}`, safeVal);
      mosy_push_data(`src_${key}`, safeVal);
      mosy_push_data(`href_${key}`, safeVal);
      mosy_push_data(`sel_${key}`, safeVal);
      mosy_push_data_class(`mosy_data_${key}`, safeVal);
    });
  } catch (error) {
    console.error("Hydration failed:", error);
  }
}




export function mosy_push_data(id, value) {
  const el = document.getElementById(id);
  if (el) {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
      el.value = value;
    } else if (el.tagName === 'IMG') {
      el.src = value;
    } else if (el.tagName === 'A') {
      el.href = value;
    } else {
      el.innerText = value;
    }
  }
}

function mosy_push_data_class(className, value) {
  const elements = document.querySelectorAll(`.${className}`);
  elements.forEach((el) => {
    el.innerText = value;
  });
}

export function dayTime() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
}

// ------------------------- begin generateRandomStr -------- //

export function magicRandomStr(length=10) {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    randomString += characters[randomIndex];
  }

  return randomString;
}

// ------------------------- end generateRandomStr -------- //


// lib/utils/magic_basename.js
export function magicBasename(input = null) {
  let path = '';

  // If input is provided
  if (input) {
    if (input.includes('http')) {
      try {
        path = new URL(input).pathname;
      } catch {
        path = input;
      }
    } else {
      path = input;
    }
  }

  // If in browser (client-side), auto-detect from location
  else if (typeof window !== 'undefined' && window.location) {
    path = window.location.pathname;
  }

  const segments = path.split('/').filter(Boolean);
  return segments.pop() || '';
}


export function magicTrimText(text, length=20, stripIf = length) {
  try {
    const plainText = String(text).replace(/<[^>]+>/g, '');

    if (plainText.length > stripIf) {
      return plainText.substring(0, length) + '...';
    }

    return plainText;
  } catch (error) {
    return '';
  }
}


export function mosySetCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}


export function mosyGetCookie(name) {
  if (typeof document === "undefined") return null;

  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(name + '='))
    ?.split('=')[1];

  return value ? decodeURIComponent(value) : null;
}



export function mosyDeleteCookie(name) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}


export function mosyToday() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // "YYYY-MM-DD"
}

export function mosyRightNow() {
  const now = new Date();
  const pad = (num) => String(num).padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export function mosySetLSData(key, value) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function mosyGetLSData(key, fallback = null) {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  }
  return fallback;
}

export function mosyDeleteLSData(key) {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
}


export function mosyBtoa(str) {
  try {
    if (!str) return ""; // Handle null, undefined, or empty string
    if (typeof window !== "undefined") {
      return window.btoa(str);
    } else {
      return Buffer.from(str, 'utf-8').toString('base64');
    }
  } catch (err) {
    console.error("btoa failed:", err);
    return "";
  }
}

export function mosyAtob(encodedStr) {
  try {
    if (!encodedStr) return "";
    if (typeof window !== "undefined") {
      return window.atob(encodedStr);
    } else {
      return Buffer.from(encodedStr, 'base64').toString('utf-8');
    }
  } catch (err) {
    console.error("atob failed:", err);
    return "";
  }
}

export function toNum(value, decimalPlaces = 0) {
  if (isNaN(value)) return '0';

  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
}


export function mosyScrollTo(id, offset = 80) {

  const element = document.getElementById(id);
  //console.log(`scrolliiingign tooo... ${id} ${element}`)

  if (!element) return;

  const y = element.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({ top: y, behavior: 'smooth' });
}

export function mosyUpdateUrlParam(paramKey="uem", paramValue="") {
  if (typeof window === 'undefined') return;

  let newValue = paramValue
  if(paramValue=="")
  {
    newValue = magicRandomStr(7)
  }
  const params = new URLSearchParams(window.location.search);
  params.set(paramKey, newValue);

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}


export function deleteUrlParam(paramName){
  // Remove the param from the URL  
  const url = new URL(window.location);  
  url.searchParams.delete(paramName);  
  window.history.replaceState({}, "", url);

}


export function mosyUrlParam(paramName, defaultValue = null) {
  if (typeof window === 'undefined') return defaultValue; // SSR safety
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(paramName) ?? defaultValue;
}


export function mosyTriggerUEM(paramKey="uem", paramValue="") {
  if (typeof window === 'undefined') return;

  let newValue = paramValue
  if(paramValue=="")
  {
    newValue = magicRandomStr(7)
  }
  const params = new URLSearchParams(window.location.search);
  params.set(paramKey, newValue);

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}


export function mosyStateManager(initialStates = {}) {
  const state = {};
  const setters = {};

  Object.entries(initialStates).forEach(([key, initialVal]) => {
    const [val, setter] = useState(initialVal);
    state[key] = val;
    setters[`set${capitalizeFirstLetter(key)}`] = setter;
  });

  ///console.log(`statesmgrrrrrrrrrr`, state, setters)
  return [state, setters];
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export function mosyFormInputHandler(setterFunction, options = {}) {
  const prefixToTrim = options.prefix || 'txt_';

  const handleInputChange = useCallback((eOrName, manualValue = null) => {
    let name, value;

    if (typeof eOrName === 'object' && eOrName.target) {
      // Triggered by onChange event
      name = eOrName.target.name;
      value = eOrName.target.value;
    } else {
      // Triggered manually
      name = eOrName;
      value = manualValue;
    }

    //console.log(`inputchaaageee`, name ,value)

    const trimmedName = name.replace(new RegExp(`^${prefixToTrim}`), '');

    setterFunction((prev) => ({
      ...prev,
      [trimmedName]: value,
    }));
  }, [setterFunction, prefixToTrim]);

  return handleInputChange;
}


// utils/printElem.js
export function printElem(printDivId, docTitle = "", headerLayout = "", printFooter = "") {
  // Hide dropdowns before print
  const dropdowns = document.querySelectorAll(".table_cell_dropdown-content");
  dropdowns.forEach(el => (el.style.display = "none"));

  if (typeof window.mosy_print_header_layout !== "undefined" && !headerLayout) {
    headerLayout = window.mosy_print_header_layout;
  }

  const printTitle = `<h3 class="col-md-12 p-3">${docTitle}</h3>`;
  const divContent = document.getElementById(printDivId)?.innerHTML || "";
  const fullContent = headerLayout + printTitle + divContent + printFooter;

  const originalContent = document.body.innerHTML;
  document.body.innerHTML = `
    <html>
      <head>
        <title></title>
        <style>
          body {
            background-color: #fff !important;
            font-family: "Helvetica";
            font-size: 18px;
            font-weight: 500;
          }
          .table thead th,
          .table tbody td {
            white-space: nowrap;
            padding: 3px;
            vertical-align: top;
            font-size: 14px;
            border:1px solid #ccc!important;
          }

          @media print {
            .table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1rem;
              font-family: "Arial", sans-serif;
            }

            .table thead th {
              background-color: #f0f0f0; /* Soft gray header */
              color: #333;
              font-weight: bold;
              font-size: 13px;
              text-align: left;
              border: 1px solid #aaa !important;
              padding: 6px 8px;
            }

            .table tbody td {
              font-size: 12.5px;
              padding: 6px 8px;
              border: 1px solid #ccc !important;
              color: #000;
              vertical-align: top;
            }

            /* Optional: zebra striping for better readability on paper */
            .table tbody tr:nth-child(even) {
              background-color: #f9f9f9;
            }

            /* Optional: Add a thin colored corner border on table wrapper (for style points) */
            .print-container {
              border: 3px solid #00b894; /* light green-ish (like M-Pesa vibe) */
              padding: 10px;
              border-radius: 6px;
              page-break-inside: avoid;
            }

            /* Prevent table from breaking mid-row */
            .table tr, .table td, .table th {
              page-break-inside: avoid;
            }

            /* Optional: Remove scrollbars or overflow for paper clean look */
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
            
          a { color: #000; }
          .table_cell_dropdown:hover .table_cell_dropdown-content,
          tr:hover .table_cell_dropdown-content {
            display: none;
          }
        </style>
      </head>
      <body>${fullContent}</body>
    </html>`;

  window.print();
  document.body.innerHTML = originalContent;

window.location.reload()
}


export  function PrintTitleBox({
  printDivId,
  defaultTitle = "",
  headerLayout = "",
  printFooter = ""
}) {
  const inputRef = useRef(null);

  const handlePrint = () => {
    const title = inputRef.current.value || "Untitled Document";
    printElem(printDivId, title, headerLayout, printFooter);
  };

  return (
    <div className="col-md-12 mb-4 p-0 m-0">
      <div className="form-group text-center">      
        <input
          className="mt-2 form-control"
          ref={inputRef}
          defaultValue={defaultTitle}
          placeholder="Add the title you would like to appear in the document"
          type="text"
        />
      </div>
      <div className="col-md-12 p-0 text-right">
        <div className="col-md-12 description_text pb-2">
          <em>To download as a PDF file, select "Save as PDF" in your print options.</em>
        </div>
        <button
          type="button"
          className="cpointer shadow btn btn-primary mb-3 pr-5 pl-5"
          onClick={handlePrint}
        >
          <i className="fa fa-print"></i> Print
        </button>
      </div>
    </div>
  );
}

export function mosyPrintToPdf({elemId, defaultTitle="",headerLayout="",printFooterLayout="" })
{

  MosyCard("",
    <>
  <div className='col-md-12 text-left h4 m-0 pt-2 pl-0 pr-0'>
    <span className="m-0 p-0 label_text">Add document title</span>  
  </div>               
    <PrintTitleBox
    printDivId={elemId}
    defaultTitle={defaultTitle}
    headerLayout={headerLayout}
    printFooter={printFooterLayout}
  /> 
  </>)
}

export function mosyFormatDateOnly(dateString) {
  const date = dateString ? new Date(dateString) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function mosyFormatDateTime(dateString) {
  const date = dateString ? new Date(dateString) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export function mosyTonum(req_number, decplc = 0) {
  if (Number.isNaN(Number(req_number))) {
    req_number = 0;
  }

  var n = parseFloat(req_number).toFixed(decplc);
  var withCommas = Number(n).toLocaleString('en');

  if (withCommas === "NaN") {
    withCommas = "0";
  }

  return withCommas;
}


export function mosyNl2br(text) {
  return text.split('\n').map((line, idx) => (
    <Fragment key={idx}>
      {line}
      <br />
    </Fragment>
  ));
}

export function mosyGetElemVal(id, defaultVal = "") {
  const el = document.getElementById(id);
  if (!el) return defaultVal;

  const tag = el.tagName.toLowerCase();

  if (tag === "input" || tag === "textarea" || tag === "select") {
    return el.value?.trim() || defaultVal;
  }

  if (tag === "a") {
    return el.href?.trim() || defaultVal;
  }

  if (tag === "img") {
    return el.src?.trim() || defaultVal;
  }

  // For any other element (div, span, p, etc.)
  return el.textContent?.trim() || defaultVal;
}

export function mosyRefreshPage(delay = 0) {
  if (delay > 0) {
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }, delay);
  } else {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }
}

export function mosyFileUrl(pathname) {
  if (typeof window !== 'undefined' && !pathname) {
    pathname = window.location.pathname;
  }

  if (!pathname) return '';

  const parts = pathname.split('/').filter(Boolean); // remove empty parts
  const lastPart = parts[parts.length - 1] || '';

  // Remove dynamic route brackets like [id] or [...slug]
  const fileName = lastPart.replace(/\[|\]|\.\.\./g, '');

  return fileName;
}


