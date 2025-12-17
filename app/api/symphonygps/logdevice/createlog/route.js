//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {DevicegpslogsRowMutations} from './DevicegpslogsRowMutations';

import listDevicegpslogsRowMutationsKeys from './DevicegpslogsMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddDevicegpslogs, UpdateDevicegpslogs } from './DevicegpslogsDbGateway';


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
      tbl: 'gps_logs',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('gps_logs', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('gps_logs', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listDevicegpslogsRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, DevicegpslogsRowMutations);

      return Response.json({
        status: 'success',
        message: 'Devicegpslogs data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Devicegpslogs failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(DevicegpslogsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = DevicegpslogsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await DevicegpslogsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await DevicegpslogsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(DevicegpslogsRequest);
     
    // if (!isTokenValid) {
    //   return Response.json(
    //     { status: 'unauthorized', message: tokenError },
    //     { status: 403 }
    //   );
    // }
    
    const DevicegpslogsFormAction = body.gps_logs_mosy_action;
    const gps_logs_uptoken_value = base64Decode(body.gps_logs_uptoken);
    
    const newId = magicRandomStr(7);

    console.log("Devicegpslogs Form Action:", body);
  //--- Begin  gps_logs inputs array ---// 
  const DevicegpslogsInputsArr = {

    "log_type" : body.log_type || "", 
    "device_id" : body.device_id || "", 
    "battery" : body.battery || "", 
    "latitude" : body.latitude || "", 
    "longitude" : body.longitude || "", 
    "speed" : body.speed || "", 
    "remark" : body.remark || "", 
    "timestamp" : body.timestamp || ""
  };

  //--- End gps_logs inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('gps_logs',DevicegpslogsInputsArr, DevicegpslogsRequest, newId, authData)

      mutatedDataArray.record_id = newId;
      
      // Insert into table Devicegpslogs
      const result = await AddDevicegpslogs(newId, mutatedDataArray, body, authData);            

      return Response.json({
        status: 'success',
        message: result.message,
        gps_logs_uptoken: result.record_id
      });
          
  

  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}
