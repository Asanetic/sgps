import { connectDB, activeDB } from './conn';
import path from 'path';
import { writeFile, mkdir, unlink } from 'fs/promises';
import fs from 'fs';




export async function mosySqlInsert(tbl, fieldsAndValuesJson, formBody) {
  const conn = await connectDB();
  
  let magicColumns = [];
  let magicValues = [];

  for (let key in fieldsAndValuesJson) {
    const value = fieldsAndValuesJson[key];
    
    if (value === "?") {
      const formKey = `txt_${key}`;
      const formValue = formBody[formKey];

      if (formValue !== undefined) {
        magicColumns.push(`\`${key}\``);
        magicValues.push(formValue);
      }
    } else {
      magicColumns.push(`\`${key}\``);
      magicValues.push(value);
    }
  }

  const preparedCols = magicColumns.join(", ");
  const placeholders = magicValues.map(() => '?').join(", ");
  const query = `INSERT INTO \`${activeDB}\`.\`${tbl}\` (${preparedCols}) VALUES (${placeholders})`;

  try {
    const [result] = await conn.execute(query, magicValues);
    return { message: 'Data inserted successfully', record_id: result.insertId };
  } catch (err) {
    throw new Error(`Insert failed: ${err.message}`);
  } finally {
    await conn.end();
  }
}

export async function mosySqlUpdate(tbl, fieldsAndValuesJson, formBody, whereStr = "") {
  const conn = await connectDB();

  if (!whereStr || whereStr.trim() === "") {
    throw new Error(`Unsafe update blocked: Missing WHERE clause while updating '${tbl}'`);
  }

  let updatePairs = [];
  let magicValues = [];

  for (let key in fieldsAndValuesJson) {
    const value = fieldsAndValuesJson[key];

    if (value === "?") {
      const formKey = `txt_${key}`;
      const formValue = formBody[formKey];

      if (formValue !== undefined) {
        updatePairs.push(`\`${key}\` = ?`);
        magicValues.push(formValue);
      }
    } else {
      updatePairs.push(`\`${key}\` = ?`);
      magicValues.push(value);
    }
  }

  const updateStr = updatePairs.join(", ");
  const whereClause = `WHERE ${whereStr}`;

  const query = `UPDATE \`${activeDB}\`.\`${tbl}\` SET ${updateStr} ${whereClause}`;

  try {
    const [result] = await conn.execute(query, magicValues);

    return {
      message: 'Data updated successfully',
      affectedRows: result.affectedRows,
    };
  } catch (err) {
    throw new Error(`Update failed: ${err.message}`);
  } finally {
    await conn.end();
  }
}

// Base64 encode in Node.js with error handling
export function base64Encode(str) {
  try {
    return Buffer.from(str).toString('base64');
  } catch (error) {
    console.error('Error encoding to Base64:', error.message);
    return "";
  }
}

// Base64 decode in Node.js with error handling
export function base64Decode(encodedStr) {
  try {
    return Buffer.from(encodedStr, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Error decoding from Base64:', error.message);
    return "";
  }
}



export async function mosyUploadFile(fileObj, subDir = 'uploads/users') 
{
  try {
    // Base upload path inside your app folder (NOT public)
    //const baseUploadDir = path.join(process.cwd(), subDir);
    const baseUploadDir = path.join(process.cwd(), 'storage', subDir);

    // Ensure the folder exists
    if (!fs.existsSync(baseUploadDir)) {
      await mkdir(baseUploadDir, { recursive: true });
    }

    // Save the file
    const buffer = Buffer.from(await fileObj.arrayBuffer());
    const fileName = `${Date.now()}_${fileObj.name}`;
    const filePath = path.join(baseUploadDir, fileName);

    await writeFile(filePath, buffer);

    const relativePath =path.join(subDir, fileName);

    return `${subDir}/${fileName}`;  // ✅ proper URL/path

  } catch (err) {
    console.error('[UPLOAD ERROR]', err);
    throw new Error('File upload failed');
  }
}

export async function mosyDeleteFile(relativePath) {
  try {
    const fullPath = path.join(process.cwd(), 'storage', relativePath);

    await unlink(fullPath);

    console.log(`[DELETE] File deleted: ${relativePath}`);
    return true;
  } catch (err) {
    console.error(`[DELETE ERROR] Could not delete file: ${relativePath}`, err);
    throw new Error(`Failed to delete file: ${err.message}`);
  }
}



async function mosyMutateRow(row, mutations = {}, mutationClass) {
  const enrichedRow = { ...row };

  //console.log("mosyMutateRow mutationClass keys:", Object.keys(mutationClass));
  //console.log("mosyMutateRow functionCols keys:", Object.keys(mutations));

  for (const [key, argList] of Object.entries(mutations)) {
    try {
      const func = mutationClass[key];

      if (typeof func === 'function') {
        // Use enrichedRow in case earlier mutations added fields we need
        const result = await func(enrichedRow, ...(argList || []));
        enrichedRow[key] = result ?? ''; // Safe default
       /// console.log(`✅ Added mutation column "${key}":`, result);
      } else {
        enrichedRow[key] = ''; // Function missing
        console.warn(`⚠️ No mutation function found for "${key}". Key added as empty string.`);
      }

    } catch (err) {
      enrichedRow[key] = ''; // Error safety fallback
      console.error(`❌ Error running mutation for "${key}". Setting empty:`, err);
    }
  }

  return enrichedRow;
}



export async function mosySmartSelect(sql, mutations = {}, mutationClass, source="default") 
{
  
  //console.log("mosySmartSelect source ", source);
  //console.log("🔍 mutationClass keys:", Object.keys(mutationClass || {}));
  //console.log("🧩 mutations keys:", Object.keys(mutations || {}));

  const conn = await connectDB();
  
  try {
    const [rows] = await conn.execute(sql);

    const numberedRows = rows.map((row, index) => ({
      row_count: index + 1,
      ...row,
    }));

    // Apply mutations if provided
    if (mutations && mutationClass) {
      //console.log("under mutatioooooooooon", mutations)
      const enrichedRows = await Promise.all(
        numberedRows.map(row =>
          mosyMutateRow(row, mutations, mutationClass)
        )
      );
    //console.log("enrichedRows dlfklkklkdl", numberedRows)
      
      return enrichedRows;
    }
    
    //console.log("numberedRows row", numberedRows)

    return numberedRows;

  } finally {
    conn.end();
  }
}


// Pagination helper
export function mosyPaginate(totalRows, requestedPage, recordsPerPage) {
  const pageCount = Math.ceil(totalRows / recordsPerPage);
  const firstRow = (requestedPage - 1) * recordsPerPage;
  return [firstRow, pageCount];
}

// Main function with default-safe handling
export async function mosyFlexSelect(queryParams = {}, mutations = {}, mutationClass={}) {
  // Set default fallback values
  const defaultTbl = 'tablesample';
  const defaultPagination = 'j:default_page_no:15:1';
  const defaultColStr = 'Kg=='; // "*"
  const defaultWhereStr = '';

  const {
    tbl = defaultTbl,
    colstr = defaultColStr,
    q = defaultWhereStr,
    pagination = defaultPagination,
    function_cols = '',
    [pagination?.split(':')[1]]: pageToken = '1'
  } = queryParams;

  let sql = '';
  let dataLimit = 10;
  let finalResult = {};
  let loopOrRowType = 'l';
  let pageNumber = parseInt(pageToken) || 1;

  // Decode base64 and URI
  const decodedColStr = base64Decode(colstr || defaultColStr);
  const decodedWhereStr = (base64Decode(q || ''));

  //console.log("mosyFlexSelect mutationClass keys:", Object.keys(mutationClass));
  //console.log("mosyFlexSelect functionCols keys:", Object.keys(mutations));  
  
  // Handle pagination
  if (pagination && pagination.includes(':')) {
    const [type, token, limit, forcePage] = pagination.split(':');
    loopOrRowType = type || 'j';
    dataLimit = parseInt(limit) || 10;
    pageNumber = parseInt(forcePage || pageToken) || 1;

    const paginationSql = `SELECT ${decodedColStr} FROM \`${activeDB}\`.\`${tbl}\` ${decodedWhereStr}`;
    const totalRecords = await mosySmartSelect(paginationSql);
    const [firstRow, pageCount] = mosyPaginate(totalRecords.length, pageNumber, dataLimit);

    sql = `SELECT ${decodedColStr} FROM \`${activeDB}\`.\`${tbl}\` ${decodedWhereStr} LIMIT ${firstRow}, ${dataLimit}`;
    const pagedData = await mosySmartSelect(sql, mutations, mutationClass, "pagedData");

    finalResult = {
      data: pagedData,
      first_row: firstRow,
      page_count: pageCount,
      //query_string: sql,
      //pagination_sql: paginationSql
    };
  } else {
    sql = `SELECT ${decodedColStr} FROM \`${activeDB}\`.\`${tbl}\` ${decodedWhereStr}`;
    const results = await mosySmartSelect(sql, mutations, mutationClass, "nopageed_data ");
    finalResult = {
      data: results,
      first_row: '',
      page_count: '',
      //query_string: sql,
      //pagination_sql: ''
    };
  }

  return finalResult;
}


// ==========================================
// Helper: SUM query on a column with WHERE
// ==========================================
export async function mosySumRows(table, columnToSum, whereStr = '') {
  const sql = `SELECT SUM(${columnToSum}) AS total FROM \`${activeDB}\`.\`${table}\` ${whereStr}`;
  const results = await mosySmartSelect(sql);
  return results[0]?.total ?? 0;
}

// ==========================================
// Helper: COUNT records in a table with WHERE
// ==========================================
export async function mosyCountRows(table, whereStr = '') {
  const sql = `SELECT COUNT(*) AS total FROM \`${activeDB}\`.\`${table}\` ${whereStr}`;
  
  const results = await mosySmartSelect(sql);
  //console.log(`mosyCountRows ${sql}` , results)

  return results[0]?.total ?? 0;
}

// ==========================================
// Helper: Get one record by column = value
// ==========================================
export async function mosyQddata(table, column, value) {
  const sql = `SELECT * FROM \`${activeDB}\`.\`${table}\` WHERE \`${column}\` = '${value}' LIMIT 1`;
  const results = await mosySmartSelect(sql);
  //console.log("mosyQddata results ", results)
  //console.log("mosyQddata sql ", sql)
    
  return results[0] || null;
}

// ==========================================
// Helper: Flexible select with where/group/order
// ==========================================
export async function mosyQuickSel(table, whereStr = '', returnType = 'l') {
  const sql = `SELECT * FROM \`${activeDB}\`.\`${table}\` ${whereStr}`;
  const results = await mosySmartSelect(sql);

  if (returnType === 'r') {
    return results[0] || null;
  }
  return results;
}

export async function mosyFlexQuickSel(table, cols="*", whereStr = '', returnType = 'l') {
  const sql = `SELECT ${cols} FROM \`${activeDB}\`.\`${table}\` ${whereStr}`;
  const results = await mosySmartSelect(sql);

  if (returnType === 'r') {
    return results[0] || null;
  }
  return results;
}

export async function mosySqlDelete(table, whereStr) {
  try {
    const conn = await connectDB();
    const sql = `DELETE FROM \`${activeDB}\`.\`${table}\` ${whereStr}`;
    const [result] = await conn.execute(sql);
    return { status: 'success', affectedRows: result.affectedRows };
  } catch (error) {
    console.error("❌ Delete error:", error.message);
    return { status: 'error', message: error.message };
  }
}



export function mmres(str) {
  if (typeof str !== 'string') return str;

  return str
    .replace(/\\/g, '\\\\')   // Escape backslashes
    .replace(/\0/g, '\\0')     // Null byte
    .replace(/\n/g, '\\n')     // Newline
    .replace(/\r/g, '\\r')     // Carriage return
    .replace(/'/g, "\\'")      // Single quotes
    .replace(/"/g, '\\"')      // Double quotes
    .replace(/\x1a/g, '\\Z');  // Substitute char (Ctrl+Z)
}


export function BuildFilterQuery(cols = [], keyword = "") {
  const term = keyword.trim();
  if (!term) return "";

  const escaped = mmres(term);
  const conditions = cols.map((col) => `${col} LIKE '%${escaped}%'`);
  return `(${conditions.join(" OR ")})`;
}

export function toNum(value, decimalPlaces = 0) {
  if (isNaN(value)) return '0';

  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
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

export function mosyNl2br(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/(?:\r\n|\r|\n)/g, '<br>');
}

export function mosyFormartDate(dateInput, format = 'dmy') {
  if (!dateInput) return '';

  const date = new Date(dateInput);
  if (isNaN(date)) return 'Invalid date';

  const day = date.getDate();
  const dayPadded = String(day).padStart(2, '0');
  const month = date.getMonth();
  const monthPadded = String(month + 1).padStart(2, '0');
  const year = date.getFullYear();
  const shortYear = String(year).slice(-2);
  const dayName = date.toLocaleString('en-US', { weekday: 'long' });
  const monthName = date.toLocaleString('en-US', { month: 'long' });
  const shortMonth = date.toLocaleString('en-US', { month: 'short' });

  const suffix = getOrdinalSuffix(day);

  switch (format.toLowerCase()) {
    case 'dmy':
      return `${dayPadded}/${monthPadded}/${year}`;
    case 'ymd':
      return `${year}-${monthPadded}-${dayPadded}`;
    case 'mdy':
      return `${monthPadded}/${dayPadded}/${year}`;
    case 'short':
      return `${dayPadded} ${shortMonth} ${year}`;
    case 'dot':
      return `${dayPadded}.${monthPadded}.${shortYear}`;
    case 'verbose':
      return `${dayName}, ${day}${suffix} ${monthName} ${year}`;
    case 'short-ordinal':
      return `${day}${suffix} ${shortMonth} ${year}`;
    default:
      return date.toDateString();
  }
}

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}
