
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert sms 
export async function AddSmsmessages(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("sms", mutatedDataArray, body);
   
  return result;
}


//update sms 
export async function UpdateSmsmessages(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("sms", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete sms 
export async function DeleteSmsmessages(tokenId, whereStr)
{  
  const result = await mosySqlDelete("sms", whereStr);

  return result;
}

