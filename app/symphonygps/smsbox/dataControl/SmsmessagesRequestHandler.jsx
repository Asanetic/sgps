'use client';
//hive / data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//action modals 
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//filter util
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

//routes manager
///handle routes 
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();

//insert data
export async function insertSmsmessages() {
 //console.log(`Form sms insert sent `)

  return await mosyPostFormData({
    formId: 'sms_profile_form',
    url: apiRoutes.smsmessages.base,
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateSmsmessages() {

  //console.log(`Form sms update sent `)

  return await mosyPostFormData({
    formId: 'sms_profile_form',
    url: apiRoutes.smsmessages.base,
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateSmsmessagesFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('sms_mosy_action');
 
 //console.log(`Form sms submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_sms') {

      actionMessage ='Record added succesfully!';

      result = await insertSmsmessages();
    }

    if (actionType === 'update_sms') {

      actionMessage ='Record updated succesfully!';

      result = await updateSmsmessages();
    }

    if (result?.status === 'success') {
      
      const smsUptoken = btoa(result.sms_uptoken || '');

      //set id key
      setters.setSmsmessagesUptoken(smsUptoken);
      
      //update url with new smsUptoken
      mosyUpdateUrlParam('sms_uptoken', smsUptoken)

      setters.setSmsmessagesActionStatus('update_sms')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: smsUptoken,
        actionName : actionType,
        actionType : 'sms_form_submission'
      };
            
      
    } else {
      MosyNotify({message:"A small error occured. Kindly try again", iconColor :'text-danger'})
      
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
    }

  } catch (error) {
    console.error('Form error:', error);
    
    MosyNotify({message:`A small error occured.  ${error}`, iconColor :'text-danger'})
    
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
  } 
}


export async function initSmsmessagesProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
         
    delivery_receipt : [],

  }
  

  MosyNotify({message : 'Refreshing SMS Messages' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.smsmessages.base,
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initSmsmessagesProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('smsbox Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching smsbox data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteSmsmessages(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.smsmessages.delete,
        params: { 
          _sms_delete_record: (token), 
          },
      });

      console.log('Token DeleteSmsmessages '+token)
      if (response.status === 'success') {

        closeMosyModal();

        return response.data; // ✅ Return the data
      } else {
        console.error('Error deleting systemusers data:', response.message);
        closeMosyModal();
        
        return []; // Safe fallback
      }
    } catch (err) {
      console.error('Error:', err);
      closeMosyModal();
      
      return []; //  Even safer fallback
    }

}


export async function getSmsmessagesListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
         
    delivery_receipt : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qsms_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.smsmessages.base,
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qsms_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getSmsmessagesListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('smsbox Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching smsbox data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadSmsmessagesListData(customQueryStr, setters) {

    const gftSmsmessages = MosyFilterEngine('sms', true);
    let finalFilterStr = btoa(gftSmsmessages);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setSmsmessagesLoading(true);
    
    const smsmessagesListData = await getSmsmessagesListData(finalFilterStr);
    
    setters.setSmsmessagesLoading(false)
    setters.setSmsmessagesListData(smsmessagesListData?.data)

    setters.setSmsmessagesListPageCount(smsmessagesListData?.page_count)


    return smsmessagesListData

}
  
  
export async function smsmessagesProfileData(customQueryStr, setters, router, customProfileData={}) {

    const smsmessagesTokenId = mosyUrlParam('sms_uptoken');
    
    const deleteParam = mosyUrlParam('sms_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedSmsmessagesToken = '0';
    if (smsmessagesTokenId) {
      
      decodedSmsmessagesToken = atob(smsmessagesTokenId); // Decode the record_id
      setters.setSmsmessagesUptoken(smsmessagesTokenId);
      setters.setSmsmessagesActionStatus('update_sms');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawSmsmessagesQueryStr =`where primkey ='${decodedSmsmessagesToken}'`
    if(customQueryStr!='')
    {
      // if no sms_uptoken set , use customQueryStr
      if (!smsmessagesTokenId) {
       rawSmsmessagesQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initSmsmessagesProfileData(rawSmsmessagesQueryStr)

    if(deleteParam){
      popDeleteDialog(smsmessagesTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setSmsmessagesNode(finalProfileData)
    
    
}
  
  

export function InteprateSmsmessagesEvent(data) {
     
  //console.log('🎯 Smsmessages Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_sms){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setSmsmessagesCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('SmsmessagesProfileTray')

    
    mosyUpdateUrlParam('sms_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_sms){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add sms `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('SmsmessagesProfileTray')
      }
    }
     
  }

  if(childActionName.update_sms){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update sms `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('SmsmessagesProfileTray')
        
      }
    }
  }

  if(childActionName.delete_sms){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../smsbox/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteSmsmessages(deleteToken).then(data=>{
  
        childSetters?.setSnackMessage("Record deleted succesfully!")
        childSetters?.setParentUseEffectKey(magicRandomStr());
        childSetters?.setLocalEventSignature(magicRandomStr());

        if(router){
          router.push(`${afterDeleteUrl}?snack_alert=Record Deleted successfully!`)
        }
                  
      })
  
    },
  
    onNo: () => {
  
      // Remove the param from the URL
       closeMosyModal()
       deleteUrlParam('sms_delete');
        
    }
  
  });

}