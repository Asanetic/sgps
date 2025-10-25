
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {SmsmessagesRowMutations} from './SmsmessagesRowMutations';

import listSmsmessagesRowMutationsKeys from './SmsmessagesMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddSmsmessages, UpdateSmsmessages } from './SmsmessagesDbGateway';


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
      tbl: 'sms',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('sms', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('sms', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listSmsmessagesRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, SmsmessagesRowMutations);

      return Response.json({
        status: 'success',
        message: 'Smsmessages data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Smsmessages failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(SmsmessagesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SmsmessagesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SmsmessagesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SmsmessagesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SmsmessagesRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const SmsmessagesFormAction = body.sms_mosy_action;
    const sms_uptoken_value = base64Decode(body.sms_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  sms inputs array ---// 
  const SmsmessagesInputsArr = {

    "recipient_phone" : "?", 
    "message_body" : "?", 
    "status" : "?", 
    "sent_at" : "?", 
    "delivery_report" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 

  };

  //--- End sms inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('sms',SmsmessagesInputsArr, SmsmessagesRequest, newId, authData)

    if (SmsmessagesFormAction === "add_sms") 
    {
      
      mutatedDataArray.sms_id = newId;
      
      // Insert into table Smsmessages
      const result = await AddSmsmessages(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        sms_uptoken: result.record_id
      });
      
    }
    
    if (SmsmessagesFormAction === "update_sms") {
      
      // update table Smsmessages
      const result = await UpdateSmsmessages(newId, mutatedDataArray, body, authData, `primkey='${sms_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        sms_uptoken: sms_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${SmsmessagesFormAction}`
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