
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {RegisteredsitesRowMutations} from './RegisteredsitesRowMutations';

import listRegisteredsitesRowMutationsKeys from './RegisteredsitesMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddRegisteredsites, UpdateRegisteredsites } from './RegisteredsitesDbGateway';


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
      tbl: 'sites',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('sites', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('sites', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listRegisteredsitesRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, RegisteredsitesRowMutations);

      return Response.json({
        status: 'success',
        message: 'Registeredsites data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Registeredsites failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(RegisteredsitesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = RegisteredsitesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await RegisteredsitesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await RegisteredsitesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(RegisteredsitesRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const RegisteredsitesFormAction = body.sites_mosy_action;
    const sites_uptoken_value = base64Decode(body.sites_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  sites inputs array ---// 
  const RegisteredsitesInputsArr = {

    "site_name" : "?", 
    "site_code" : "?", 
    "manager" : "?", 
    "contact_person" : "?", 
    "vendor" : "?", 
    "latitude" : "?", 
    "longitude" : "?", 
    "location_address" : "?", 
    "remark" : "?", 
    "created_at" : "?", 
    "country" : "?", 
    "city" : "?", 
    "county" : "?", 
    "town" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 
    "manager_mobile" : "?", 
    "manager_email" : "?", 
    "contact_person_mobile" : "?", 
    "contact_person_email" : "?", 
    "company_security_manager" : "?", 
    "company_security_contacts" : "?", 
    "vendor_contact_person" : "?", 
    "vendor_contacts" : "?", 
    "response_team_contact_person" : "?", 
    "response_team_contacts" : "?", 
    "crew_commander_contact_person" : "?", 
    "crew_commander_contacts" : "?", 
    "vehicle_reg_number" : "?", 
    "alternate_phone_number" : "?", 

  };

  //--- End sites inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('sites',RegisteredsitesInputsArr, RegisteredsitesRequest, newId, authData)

    if (RegisteredsitesFormAction === "add_sites") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Registeredsites
      const result = await AddRegisteredsites(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        sites_uptoken: result.record_id
      });
      
    }
    
    if (RegisteredsitesFormAction === "update_sites") {
      
      // update table Registeredsites
      const result = await UpdateRegisteredsites(newId, mutatedDataArray, body, authData, `primkey='${sites_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        sites_uptoken: sites_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${RegisteredsitesFormAction}`
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