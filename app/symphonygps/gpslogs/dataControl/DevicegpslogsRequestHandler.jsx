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
export async function insertDevicegpslogs() {
 //console.log(`Form gps_logs insert sent `)

  return await mosyPostFormData({
    formId: 'gps_logs_profile_form',
    url: apiRoutes.devicegpslogs.base,
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateDevicegpslogs() {

  //console.log(`Form gps_logs update sent `)

  return await mosyPostFormData({
    formId: 'gps_logs_profile_form',
    url: apiRoutes.devicegpslogs.base,
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateDevicegpslogsFormAction(e, setters) {
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

      result = await insertDevicegpslogs();
    }

    if (actionType === 'update_gps_logs') {

      actionMessage ='Record updated succesfully!';

      result = await updateDevicegpslogs();
    }

    if (result?.status === 'success') {
      
      const gps_logsUptoken = btoa(result.gps_logs_uptoken || '');

      //set id key
      setters.setDevicegpslogsUptoken(gps_logsUptoken);
      
      //update url with new gps_logsUptoken
      mosyUpdateUrlParam('gps_logs_uptoken', gps_logsUptoken)

      setters.setDevicegpslogsActionStatus('update_gps_logs')
    
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


export async function initDevicegpslogsProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _sites_site_name_site_name : [],
          
    _device_list_device_name_device_id : [],

  }
  

  MosyNotify({message : 'Refreshing Device GPS Logs' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.devicegpslogs.base,
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initDevicegpslogsProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('gpslogs Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching gpslogs data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteDevicegpslogs(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.devicegpslogs.delete,
        params: { 
          _gps_logs_delete_record: (token), 
          },
      });

      console.log('Token DeleteDevicegpslogs '+token)
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


export async function getDevicegpslogsListData(qstr = "") {
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
      endpoint: apiRoutes.devicegpslogs.base,
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qgps_logs_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getDevicegpslogsListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('gpslogs Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching gpslogs data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadDevicegpslogsListData(customQueryStr, setters) {

    const gftDevicegpslogs = MosyFilterEngine('gps_logs', true);
    let finalFilterStr = btoa(gftDevicegpslogs);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setDevicegpslogsLoading(true);
    
    const devicegpslogsListData = await getDevicegpslogsListData(finalFilterStr);
    
    setters.setDevicegpslogsLoading(false)
    setters.setDevicegpslogsListData(devicegpslogsListData?.data)

    setters.setDevicegpslogsListPageCount(devicegpslogsListData?.page_count)


    return devicegpslogsListData

}
  
  
export async function devicegpslogsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const devicegpslogsTokenId = mosyUrlParam('gps_logs_uptoken');
    
    const deleteParam = mosyUrlParam('gps_logs_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedDevicegpslogsToken = '0';
    if (devicegpslogsTokenId) {
      
      decodedDevicegpslogsToken = atob(devicegpslogsTokenId); // Decode the record_id
      setters.setDevicegpslogsUptoken(devicegpslogsTokenId);
      setters.setDevicegpslogsActionStatus('update_gps_logs');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawDevicegpslogsQueryStr =`where primkey ='${decodedDevicegpslogsToken}'`
    if(customQueryStr!='')
    {
      // if no gps_logs_uptoken set , use customQueryStr
      if (!devicegpslogsTokenId) {
       rawDevicegpslogsQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initDevicegpslogsProfileData(rawDevicegpslogsQueryStr)

    if(deleteParam){
      popDeleteDialog(devicegpslogsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setDevicegpslogsNode(finalProfileData)
    
    
}
  
  

export function InteprateDevicegpslogsEvent(data) {
     
  //console.log('🎯 Devicegpslogs Child gave us:', data);

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

    parentSetter?.setDevicegpslogsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('DevicegpslogsProfileTray')

    
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
        parentStateSetter?.setActiveScrollId('DevicegpslogsProfileTray')
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
        parentStateSetter?.setActiveScrollId('DevicegpslogsProfileTray')
        
      }
    }
  }

  if(childActionName.delete_gps_logs){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../gpslogs/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteDevicegpslogs(deleteToken).then(data=>{
  
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