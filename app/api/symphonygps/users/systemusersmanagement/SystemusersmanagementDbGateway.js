
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert system_users 
export async function AddSystemusersmanagement(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("system_users", mutatedDataArray, body);
   
  return result;
}


//update system_users 
export async function UpdateSystemusersmanagement(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("system_users", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete system_users 
export async function DeleteSystemusersmanagement(tokenId, whereStr)
{  
  const result = await mosySqlDelete("system_users", whereStr);

  return result;
}

