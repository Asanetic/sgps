
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert gps_logs 
export async function AddDevicealarms(newId, mutatedDataArray, body, authData)
{

  //check for existing 
  const result = await mosySqlInsert("gps_logs", mutatedDataArray, body);
   
  return result;
}


//update gps_logs 
export async function UpdateDevicealarms(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("gps_logs", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete gps_logs 
export async function DeleteDevicealarms(tokenId, whereStr)
{  
  const result = await mosySqlDelete("gps_logs", whereStr);

  return result;
}

