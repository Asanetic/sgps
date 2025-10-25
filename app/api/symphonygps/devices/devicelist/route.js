
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {DevicelistRowMutations} from './DevicelistRowMutations';

import listDevicelistRowMutationsKeys from './DevicelistMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddDevicelist, UpdateDevicelist } from './DevicelistDbGateway';


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
    const mutationsObj = isEmpty(requestedMutationsObj) ? listDevicelistRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, DevicelistRowMutations);

      return Response.json({
        status: 'success',
        message: 'Devicelist data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Devicelist failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(DevicelistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = DevicelistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await DevicelistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await DevicelistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(DevicelistRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const DevicelistFormAction = body.device_list_mosy_action;
    const device_list_uptoken_value = base64Decode(body.device_list_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  device_list inputs array ---// 
  const DevicelistInputsArr = {

    "device_name" : "?", 
    "serial_number" : "?", 
    "site_name" : "?", 
    "site_id" : "?", 
    "geofence" : "?", 
    "date_installed" : "?", 
    "manufacture_date" : "?", 
    "remark" : "?", 
    "reg_date" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 

  };

  //--- End device_list inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('device_list',DevicelistInputsArr, DevicelistRequest, newId, authData)

    if (DevicelistFormAction === "add_device_list") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Devicelist
      const result = await AddDevicelist(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        device_list_uptoken: result.record_id
      });
      
    }
    
    if (DevicelistFormAction === "update_device_list") {
      
      // update table Devicelist
      const result = await UpdateDevicelist(newId, mutatedDataArray, body, authData, `primkey='${device_list_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        device_list_uptoken: device_list_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${DevicelistFormAction}`
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