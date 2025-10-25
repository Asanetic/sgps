
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert sites 
export async function AddRegisteredsites(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("sites", mutatedDataArray, body);
   
  return result;
}


//update sites 
export async function UpdateRegisteredsites(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("sites", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete sites 
export async function DeleteRegisteredsites(tokenId, whereStr)
{  
  const result = await mosySqlDelete("sites", whereStr);

  return result;
}

