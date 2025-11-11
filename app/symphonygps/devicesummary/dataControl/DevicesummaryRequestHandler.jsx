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
export async function insertDevicesummary() {
 //console.log(`Form device_list insert sent `)

  return await mosyPostFormData({
    formId: 'device_list_profile_form',
    url: apiRoutes.devicesummary.base,
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateDevicesummary() {

  //console.log(`Form device_list update sent `)

  return await mosyPostFormData({
    formId: 'device_list_profile_form',
    url: apiRoutes.devicesummary.base,
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateDevicesummaryFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('device_list_mosy_action');
 
 //console.log(`Form device_list submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_device_list') {

      actionMessage ='Record added succesfully!';

      result = await insertDevicesummary();
    }

    if (actionType === 'update_device_list') {

      actionMessage ='Record updated succesfully!';

      result = await updateDevicesummary();
    }

    if (result?.status === 'success') {
      
      const device_listUptoken = btoa(result.device_list_uptoken || '');

      //set id key
      setters.setDevicesummaryUptoken(device_listUptoken);
      
      //update url with new device_listUptoken
      mosyUpdateUrlParam('device_list_uptoken', device_listUptoken)

      setters.setDevicesummaryActionStatus('update_device_list')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: device_listUptoken,
        actionName : actionType,
        actionType : 'device_list_form_submission'
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


export async function initDevicesummaryProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _sites_site_name_site_id : [],
    
    site_code : [],
    
    installation_longitude : [],
    
    installation_latitude : [],

  }
  

  MosyNotify({message : 'Refreshing Device summary' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.devicesummary.base,
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initDevicesummaryProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('devicesummary Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching devicesummary data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteDevicesummary(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.devicesummary.delete,
        params: { 
          _device_list_delete_record: (token), 
          },
      });

      console.log('Token DeleteDevicesummary '+token)
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


export async function getDevicesummaryListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
               
    _sites_site_name_site_id : [],
    
    site_code : [],
    
    installation_longitude : [],
    
    installation_latitude : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qdevice_list_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.devicesummary.base,
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qdevice_list_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getDevicesummaryListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('devicesummary Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching devicesummary data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadDevicesummaryListData(customQueryStr, setters) {

    const gftDevicesummary = MosyFilterEngine('device_list', true);
    let finalFilterStr = btoa(gftDevicesummary);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setDevicesummaryLoading(true);
    
    const devicesummaryListData = await getDevicesummaryListData(finalFilterStr);
    
    setters.setDevicesummaryLoading(false)
    setters.setDevicesummaryListData(devicesummaryListData?.data)

    setters.setDevicesummaryListPageCount(devicesummaryListData?.page_count)


    return devicesummaryListData

}
  
  
export async function devicesummaryProfileData(customQueryStr, setters, router, customProfileData={}) {

    const devicesummaryTokenId = mosyUrlParam('device_list_uptoken');
    
    const deleteParam = mosyUrlParam('device_list_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedDevicesummaryToken = '0';
    if (devicesummaryTokenId) {
      
      decodedDevicesummaryToken = atob(devicesummaryTokenId); // Decode the record_id
      setters.setDevicesummaryUptoken(devicesummaryTokenId);
      setters.setDevicesummaryActionStatus('update_device_list');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawDevicesummaryQueryStr =`where primkey ='${decodedDevicesummaryToken}'`
    if(customQueryStr!='')
    {
      // if no device_list_uptoken set , use customQueryStr
      if (!devicesummaryTokenId) {
       rawDevicesummaryQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initDevicesummaryProfileData(rawDevicesummaryQueryStr)

    if(deleteParam){
      popDeleteDialog(devicesummaryTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setDevicesummaryNode(finalProfileData)
    
    
}
  
  

export function InteprateDevicesummaryEvent(data) {
     
  //console.log('🎯 Devicesummary Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_device_list){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setDevicesummaryCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('DevicesummaryProfileTray')

    
    mosyUpdateUrlParam('device_list_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_device_list){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add device_list `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('DevicesummaryProfileTray')
      }
    }
     
  }

  if(childActionName.update_device_list){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update device_list `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('DevicesummaryProfileTray')
        
      }
    }
  }

  if(childActionName.delete_device_list){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../devicesummary/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteDevicesummary(deleteToken).then(data=>{
  
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
       deleteUrlParam('device_list_delete');
        
    }
  
  });

}