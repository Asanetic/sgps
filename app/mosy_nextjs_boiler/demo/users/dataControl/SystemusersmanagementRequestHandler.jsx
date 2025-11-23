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
export async function insertSystemusersmanagement() {
 //console.log(`Form system_users insert sent `)

  return await mosyPostFormData({
    formId: 'system_users_profile_form',
    url: apiRoutes.systemusersmanagement.base,
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateSystemusersmanagement() {

  //console.log(`Form system_users update sent `)

  return await mosyPostFormData({
    formId: 'system_users_profile_form',
    url: apiRoutes.systemusersmanagement.base,
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateSystemusersmanagementFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('system_users_mosy_action');
 
 //console.log(`Form system_users submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_system_users') {

      actionMessage ='Record added succesfully!';

      result = await insertSystemusersmanagement();
    }

    if (actionType === 'update_system_users') {

      actionMessage ='Record updated succesfully!';

      result = await updateSystemusersmanagement();
    }

    if (result?.status === 'success') {
      
      const system_usersUptoken = btoa(result.system_users_uptoken || '');

      //set id key
      setters.setSystemusersmanagementUptoken(system_usersUptoken);
      
      //update url with new system_usersUptoken
      mosyUpdateUrlParam('system_users_uptoken', system_usersUptoken)

      setters.setSystemusersmanagementActionStatus('update_system_users')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: system_usersUptoken,
        actionName : actionType,
        actionType : 'system_users_form_submission'
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


export async function initSystemusersmanagementProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing System Users Management' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.systemusersmanagement.base,
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initSystemusersmanagementProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('users Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching users data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteSystemusersmanagement(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.systemusersmanagement.delete,
        params: { 
          _system_users_delete_record: (token), 
          },
      });

      console.log('Token DeleteSystemusersmanagement '+token)
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


export async function getSystemusersmanagementListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
     
  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qsystem_users_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.systemusersmanagement.base,
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qsystem_users_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getSystemusersmanagementListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('users Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching users data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadSystemusersmanagementListData(customQueryStr, setters) {

    const gftSystemusersmanagement = MosyFilterEngine('system_users', true);
    let finalFilterStr = btoa(gftSystemusersmanagement);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setSystemusersmanagementLoading(true);
    
    const systemusersmanagementListData = await getSystemusersmanagementListData(finalFilterStr);
    
    setters.setSystemusersmanagementLoading(false)
    setters.setSystemusersmanagementListData(systemusersmanagementListData?.data)

    setters.setSystemusersmanagementListPageCount(systemusersmanagementListData?.page_count)


    return systemusersmanagementListData

}
  
  
export async function systemusersmanagementProfileData(customQueryStr, setters, router, customProfileData={}) {

    const systemusersmanagementTokenId = mosyUrlParam('system_users_uptoken');
    
    const deleteParam = mosyUrlParam('system_users_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedSystemusersmanagementToken = '0';
    if (systemusersmanagementTokenId) {
      
      decodedSystemusersmanagementToken = atob(systemusersmanagementTokenId); // Decode the record_id
      setters.setSystemusersmanagementUptoken(systemusersmanagementTokenId);
      setters.setSystemusersmanagementActionStatus('update_system_users');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawSystemusersmanagementQueryStr =`where primkey ='${decodedSystemusersmanagementToken}'`
    if(customQueryStr!='')
    {
      // if no system_users_uptoken set , use customQueryStr
      if (!systemusersmanagementTokenId) {
       rawSystemusersmanagementQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initSystemusersmanagementProfileData(rawSystemusersmanagementQueryStr)

    if(deleteParam){
      popDeleteDialog(systemusersmanagementTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setSystemusersmanagementNode(finalProfileData)
    
    
}
  
  

export function InteprateSystemusersmanagementEvent(data) {
     
  //console.log('🎯 Systemusersmanagement Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_system_users){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setSystemusersmanagementCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('SystemusersmanagementProfileTray')

    
    mosyUpdateUrlParam('system_users_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_system_users){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add system_users `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('SystemusersmanagementProfileTray')
      }
    }
     
  }

  if(childActionName.update_system_users){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update system_users `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('SystemusersmanagementProfileTray')
        
      }
    }
  }

  if(childActionName.delete_system_users){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../users/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteSystemusersmanagement(deleteToken).then(data=>{
  
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
       deleteUrlParam('system_users_delete');
        
    }
  
  });

}