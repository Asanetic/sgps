
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {AssetalarmsRowMutations} from './AssetalarmsRowMutations';

import listAssetalarmsRowMutationsKeys from './AssetalarmsMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddAssetalarms, UpdateAssetalarms } from './AssetalarmsDbGateway';


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
      tbl: 'asset_alarms',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('asset_alarms', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('asset_alarms', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listAssetalarmsRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, AssetalarmsRowMutations);

      return Response.json({
        status: 'success',
        message: 'Assetalarms data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Assetalarms failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(AssetalarmsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = AssetalarmsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await AssetalarmsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await AssetalarmsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(AssetalarmsRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const AssetalarmsFormAction = body.asset_alarms_mosy_action;
    const asset_alarms_uptoken_value = base64Decode(body.asset_alarms_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  asset_alarms inputs array ---// 
  const AssetalarmsInputsArr = {

    "alarm_time" : "?", 
    "alarm_type" : "?", 
    "description" : "?", 
    "device_serial" : "?", 
    "site_id" : "?", 
    "status" : "?", 
    "ack_status" : "?", 
    "ack_by" : "?", 
    "close_status" : "?", 
    "reg_date" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 
    "closed_by" : "?", 

  };

  //--- End asset_alarms inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('asset_alarms',AssetalarmsInputsArr, AssetalarmsRequest, newId, authData)

    if (AssetalarmsFormAction === "add_asset_alarms") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Assetalarms
      const result = await AddAssetalarms(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        asset_alarms_uptoken: result.record_id
      });
      
    }
    
    if (AssetalarmsFormAction === "update_asset_alarms") {
      
      // update table Assetalarms
      const result = await UpdateAssetalarms(newId, mutatedDataArray, body, authData, `primkey='${asset_alarms_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        asset_alarms_uptoken: asset_alarms_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${AssetalarmsFormAction}`
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