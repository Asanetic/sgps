
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert device_list 
export async function AddDevicesummary(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("device_list", mutatedDataArray, body);
   
  return result;
}


//update device_list 
export async function UpdateDevicesummary(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("device_list", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete device_list 
export async function DeleteDevicesummary(tokenId, whereStr)
{  
  const result = await mosySqlDelete("device_list", whereStr);

  return result;
}

