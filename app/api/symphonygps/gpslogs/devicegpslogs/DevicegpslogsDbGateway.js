
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert gps_logs 
export async function AddDevicegpslogs(newId, mutatedDataArray, body, authData)
{
  mutatedDataArray.record_id = newId
       
  const result = await mosySqlInsert("gps_logs", mutatedDataArray, body);
   
  return result;
}


//update gps_logs 
export async function UpdateDevicegpslogs(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("gps_logs", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete gps_logs 
export async function DeleteDevicegpslogs(tokenId, whereStr)
{  
  const result = await mosySqlDelete("gps_logs", whereStr);

  return result;
}

