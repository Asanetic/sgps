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
export async function insertDevicelist() {
 //console.log(`Form device_list insert sent `)

  return await mosyPostFormData({
    formId: 'device_list_profile_form',
    url: apiRoutes.devicelist.base,
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateDevicelist() {

  //console.log(`Form device_list update sent `)

  return await mosyPostFormData({
    formId: 'device_list_profile_form',
    url: apiRoutes.devicelist.base,
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateDevicelistFormAction(e, setters) {
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

      result = await insertDevicelist();
    }

    if (actionType === 'update_device_list') {

      actionMessage ='Record updated succesfully!';

      result = await updateDevicelist();
    }

    if (result?.status === 'success') {
      
      const device_listUptoken = btoa(result.device_list_uptoken || '');

      //set id key
      setters.setDevicelistUptoken(device_listUptoken);
      
      //update url with new device_listUptoken
      mosyUpdateUrlParam('device_list_uptoken', device_listUptoken)

      setters.setDevicelistActionStatus('update_device_list')
    
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


export async function initDevicelistProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _sites_site_name_site_id : [],
    
    device_logs : [],

  }
  

  MosyNotify({message : 'Refreshing Device List' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.devicelist.base,
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initDevicelistProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('devices Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching devices data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteDevicelist(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.devicelist.delete,
        params: { 
          _device_list_delete_record: (token), 
          },
      });

      console.log('Token DeleteDevicelist '+token)
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


export async function getDevicelistListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
               
    _sites_site_name_site_id : [],
    
    device_logs : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qdevice_list_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.devicelist.base,
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qdevice_list_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getDevicelistListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('devices Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching devices data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadDevicelistListData(customQueryStr, setters) {

    const gftDevicelist = MosyFilterEngine('device_list', true);
    let finalFilterStr = btoa(gftDevicelist);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setDevicelistLoading(true);
    
    const devicelistListData = await getDevicelistListData(finalFilterStr);
    
    setters.setDevicelistLoading(false)
    setters.setDevicelistListData(devicelistListData?.data)

    setters.setDevicelistListPageCount(devicelistListData?.page_count)


    return devicelistListData

}
  
  
export async function devicelistProfileData(customQueryStr, setters, router, customProfileData={}) {

    const devicelistTokenId = mosyUrlParam('device_list_uptoken');
    
    const deleteParam = mosyUrlParam('device_list_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedDevicelistToken = '0';
    if (devicelistTokenId) {
      
      decodedDevicelistToken = atob(devicelistTokenId); // Decode the record_id
      setters.setDevicelistUptoken(devicelistTokenId);
      setters.setDevicelistActionStatus('update_device_list');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawDevicelistQueryStr =`where primkey ='${decodedDevicelistToken}'`
    if(customQueryStr!='')
    {
      // if no device_list_uptoken set , use customQueryStr
      if (!devicelistTokenId) {
       rawDevicelistQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initDevicelistProfileData(rawDevicelistQueryStr)

    if(deleteParam){
      popDeleteDialog(devicelistTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setDevicelistNode(finalProfileData)
    
    
}
  
  

export function InteprateDevicelistEvent(data) {
     
  //console.log('🎯 Devicelist Child gave us:', data);

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

    parentSetter?.setDevicelistCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('DevicelistProfileTray')

    
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
        parentStateSetter?.setActiveScrollId('DevicelistProfileTray')
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
        parentStateSetter?.setActiveScrollId('DevicelistProfileTray')
        
      }
    }
  }

  if(childActionName.delete_device_list){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../devices/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteDevicelist(deleteToken).then(data=>{
  
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