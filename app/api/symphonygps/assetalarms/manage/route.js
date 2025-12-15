
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr, mosyRightNow } from '../../../apiUtils/dataControl/dataUtils';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { UpdateAssetalarms } from '../assetalarms/AssetalarmsDbGateway';


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


    const updateArr = {

        "status" : payload.new_status, 
        "ack_status" : "Acknowledged", 
        "close_status" : payload.close_status, 
        "ack_by" : authData.name
    
      };

    if(payload.new_status=="Closed")
    {
      updateArr.closed_by = authData.name
      updateArr.close_time = mosyRightNow()
    }

    if(payload.new_status=="Acknowledged")
    {
        updateArr.ack_time = mosyRightNow()
    }
    
    const newId = magicRandomStr(10);

    const mutatedDataArray = mutateInputArray("asset_alarms", updateArr, AssetalarmsRequest, newId, authData);

  //--- End asset_alarms inputs array --//

    const result = await UpdateAssetalarms(newId, mutatedDataArray, {}, authData, `  primkey ='${token}' `);     
        
    return Response.json({
        status: 'success',
        message: result.message,
        asset_alarms_uptoken: result.record_id
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