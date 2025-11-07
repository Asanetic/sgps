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
export async function insertDevicealarms() {
 //console.log(`Form gps_logs insert sent `)

  return await mosyPostFormData({
    formId: 'gps_logs_profile_form',
    url: apiRoutes.devicealarms.base,
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateDevicealarms() {

  //console.log(`Form gps_logs update sent `)

  return await mosyPostFormData({
    formId: 'gps_logs_profile_form',
    url: apiRoutes.devicealarms.base,
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateDevicealarmsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('gps_logs_mosy_action');
 
 //console.log(`Form gps_logs submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_gps_logs') {

      actionMessage ='Record added succesfully!';

      result = await insertDevicealarms();
    }

    if (actionType === 'update_gps_logs') {

      actionMessage ='Record updated succesfully!';

      result = await updateDevicealarms();
    }

    if (result?.status === 'success') {
      
      const gps_logsUptoken = btoa(result.gps_logs_uptoken || '');

      //set id key
      setters.setDevicealarmsUptoken(gps_logsUptoken);
      
      //update url with new gps_logsUptoken
      mosyUpdateUrlParam('gps_logs_uptoken', gps_logsUptoken)

      setters.setDevicealarmsActionStatus('update_gps_logs')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: gps_logsUptoken,
        actionName : actionType,
        actionType : 'gps_logs_form_submission'
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


export async function initDevicealarmsProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _sites_site_name_site_name : [],
          
    _device_list_device_name_device_id : [],

  }
  

  MosyNotify({message : 'Refreshing Device Alarms' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.devicealarms.base,
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initDevicealarmsProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('devicealarms Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching devicealarms data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteDevicealarms(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.devicealarms.delete,
        params: { 
          _gps_logs_delete_record: (token), 
          },
      });

      console.log('Token DeleteDevicealarms '+token)
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


export async function getDevicealarmsListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
               
    _sites_site_name_site_name : [],
          
    _device_list_device_name_device_id : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qgps_logs_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.devicealarms.base,
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qgps_logs_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getDevicealarmsListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('devicealarms Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching devicealarms data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadDevicealarmsListData(customQueryStr, setters) {

    const gftDevicealarms = MosyFilterEngine('gps_logs', true);
    let finalFilterStr = btoa(gftDevicealarms);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setDevicealarmsLoading(true);
    
    const devicealarmsListData = await getDevicealarmsListData(finalFilterStr);
    
    setters.setDevicealarmsLoading(false)
    setters.setDevicealarmsListData(devicealarmsListData?.data)

    setters.setDevicealarmsListPageCount(devicealarmsListData?.page_count)


    return devicealarmsListData

}
  
  
export async function devicealarmsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const devicealarmsTokenId = mosyUrlParam('gps_logs_uptoken');
    
    const deleteParam = mosyUrlParam('gps_logs_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedDevicealarmsToken = '0';
    if (devicealarmsTokenId) {
      
      decodedDevicealarmsToken = atob(devicealarmsTokenId); // Decode the record_id
      setters.setDevicealarmsUptoken(devicealarmsTokenId);
      setters.setDevicealarmsActionStatus('update_gps_logs');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawDevicealarmsQueryStr =`where primkey ='${decodedDevicealarmsToken}'`
    if(customQueryStr!='')
    {
      // if no gps_logs_uptoken set , use customQueryStr
      if (!devicealarmsTokenId) {
       rawDevicealarmsQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initDevicealarmsProfileData(rawDevicealarmsQueryStr)

    if(deleteParam){
      popDeleteDialog(devicealarmsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setDevicealarmsNode(finalProfileData)
    
    
}
  
  

export function InteprateDevicealarmsEvent(data) {
     
  //console.log('🎯 Devicealarms Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_gps_logs){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setDevicealarmsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('DevicealarmsProfileTray')

    
    mosyUpdateUrlParam('gps_logs_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_gps_logs){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add gps_logs `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('DevicealarmsProfileTray')
      }
    }
     
  }

  if(childActionName.update_gps_logs){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update gps_logs `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('DevicealarmsProfileTray')
        
      }
    }
  }

  if(childActionName.delete_gps_logs){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../devicealarms/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteDevicealarms(deleteToken).then(data=>{
  
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
       deleteUrlParam('gps_logs_delete');
        
    }
  
  });

}