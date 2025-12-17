
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr, mosyRightNow, mosyQuickSel } from '../../../apiUtils/dataControl/dataUtils';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddAssetalarms, UpdateAssetalarms } from '../assetalarms/AssetalarmsDbGateway';
import { sendEmail, sendPrimarySMS } from '../../tunnel/tunnelUtils';


export async function POST(AssetalarmsRequest) {
  try {

    const { token , payload} = await AssetalarmsRequest.json();    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(AssetalarmsRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }

    const deviceData  = payload.device_data
    const logData = payload.log_data

        //--- Begin  asset_alarms inputs array ---// 
        const AssetalarmsInputsArr = {

          "alarm_time" : mosyRightNow(), 
          "alarm_type" : logData.alarm_type, 
          "description" : logData.description, 
          "device_serial" : deviceData.serial_number, 
          "site_id" : deviceData._sites_site_name_site_id, 
          "status" : "Open", 
          "ack_status" : "Open", 
          "close_status" : "Open", 
          "reg_date" : mosyRightNow(), 

        };

    const newId = magicRandomStr(10);

    const mutatedDataArray = mutateInputArray("asset_alarms", AssetalarmsInputsArr, AssetalarmsRequest, newId, authData);

    const newKey = newId
  //--- End asset_alarms inputs array --//

  //is there an existing asset_alarms record ?
    const existingOpenAssetalarms = await mosyQuickSel("asset_alarms", `where alarm_type = '${logData.alarm_type}' and status = 'open' and device_serial = '${deviceData.serial_number}' `,"r");  

    const message = `Geofence alert - Device -  ${deviceData?.device_name} / Site - ${deviceData._sites_site_name_site_id}   Report time : ${mosyRightNow()}` ;

    if(existingOpenAssetalarms.primkey==""){
    
    const result = await AddAssetalarms(newId, mutatedDataArray, {}, authData, `  primkey ='${token}' `);     
    
    return Response.json({
        status: 'success',
        message: result.message,
        asset_alarms_uptoken: result.record_id
    });
  }else{
    return Response.json({
      status: 'success',
      message: result.message,
      asset_alarms_uptoken: existingOpenAssetalarms.primkey
  });
  }

  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}