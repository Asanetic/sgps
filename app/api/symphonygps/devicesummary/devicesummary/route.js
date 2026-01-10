
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {DevicesummaryRowMutations} from './DevicesummaryRowMutations';

import listDevicesummaryRowMutationsKeys from './DevicesummaryMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddDevicesummary, UpdateDevicesummary } from './DevicesummaryDbGateway';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const encodedMutations = searchParams.get('mutations');

    let requestedMutationsObj = {};
    if (encodedMutations) {
      try {
        const decodedMutations = Buffer.from(encodedMutations, 'base64').toString('utf-8');
        requestedMutationsObj = JSON.parse(decodedMutations);
      } catch (err) {
        console.error('Mutation decode failed:', err);
      }
    }

    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(request);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    

    // ✅ Provide default fallbacks
    const enhancedParams = {
      tbl: 'device_list',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('device_list', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('device_list', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listDevicesummaryRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, DevicesummaryRowMutations);

      return Response.json({
        status: 'success',
        message: 'Devicesummary data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Devicesummary failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(DevicesummaryRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = DevicesummaryRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await DevicesummaryRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await DevicesummaryRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(DevicesummaryRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const DevicesummaryFormAction = body.device_list_mosy_action;
    const device_list_uptoken_value = base64Decode(body.device_list_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  device_list inputs array ---// 
  const DevicesummaryInputsArr = {

    "device_name" : "?", 
    "serial_number" : "?", 
    "site_name" : "?", 
    "site_id" : "?", 
    "device_location" : "?", 
    "geofence_limit_distance" : "?", 
    "geofence" : "?", 
    "date_installed" : "?", 
    "remark" : "?", 
    "reg_date" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 
    "low_battery_level" : "?", 
    "speed_alert_value" : "?", 

  };

  //--- End device_list inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('device_list',DevicesummaryInputsArr, DevicesummaryRequest, newId, authData)

    if (DevicesummaryFormAction === "add_device_list") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Devicesummary
      const result = await AddDevicesummary(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        device_list_uptoken: result.record_id
      });
      
    }
    
    if (DevicesummaryFormAction === "update_device_list") {
      
      // update table Devicesummary
      const result = await UpdateDevicesummary(newId, mutatedDataArray, body, authData, `primkey='${device_list_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        device_list_uptoken: device_list_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${DevicesummaryFormAction}`
    }, { status: 400 });

  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}