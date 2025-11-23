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
export async function insertAssetalarms() {
 //console.log(`Form asset_alarms insert sent `)

  return await mosyPostFormData({
    formId: 'asset_alarms_profile_form',
    url: apiRoutes.assetalarms.base,
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateAssetalarms() {

  //console.log(`Form asset_alarms update sent `)

  return await mosyPostFormData({
    formId: 'asset_alarms_profile_form',
    url: apiRoutes.assetalarms.base,
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateAssetalarmsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('asset_alarms_mosy_action');
 
 //console.log(`Form asset_alarms submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_asset_alarms') {

      actionMessage ='Record added succesfully!';

      result = await insertAssetalarms();
    }

    if (actionType === 'update_asset_alarms') {

      actionMessage ='Record updated succesfully!';

      result = await updateAssetalarms();
    }

    if (result?.status === 'success') {
      
      const asset_alarmsUptoken = btoa(result.asset_alarms_uptoken || '');

      //set id key
      setters.setAssetalarmsUptoken(asset_alarmsUptoken);
      
      //update url with new asset_alarmsUptoken
      mosyUpdateUrlParam('asset_alarms_uptoken', asset_alarmsUptoken)

      setters.setAssetalarmsActionStatus('update_asset_alarms')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: asset_alarmsUptoken,
        actionName : actionType,
        actionType : 'asset_alarms_form_submission'
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


export async function initAssetalarmsProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _sites_site_name_site_id : [],
    
    device_key : [],
    
    device_name : [],

  }
  

  MosyNotify({message : 'Refreshing Asset Alarms' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.assetalarms.base,
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initAssetalarmsProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('assetalarms Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching assetalarms data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteAssetalarms(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.assetalarms.delete,
        params: { 
          _asset_alarms_delete_record: (token), 
          },
      });

      console.log('Token DeleteAssetalarms '+token)
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


export async function getAssetalarmsListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
               
    _sites_site_name_site_id : [],
    
    device_key : [],
    
    device_name : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qasset_alarms_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.assetalarms.base,
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qasset_alarms_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getAssetalarmsListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('assetalarms Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching assetalarms data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadAssetalarmsListData(customQueryStr, setters) {

    const gftAssetalarms = MosyFilterEngine('asset_alarms', true);
    let finalFilterStr = btoa(gftAssetalarms);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setAssetalarmsLoading(true);
    
    const assetalarmsListData = await getAssetalarmsListData(finalFilterStr);
    
    setters.setAssetalarmsLoading(false)
    setters.setAssetalarmsListData(assetalarmsListData?.data)

    setters.setAssetalarmsListPageCount(assetalarmsListData?.page_count)


    return assetalarmsListData

}
  
  
export async function assetalarmsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const assetalarmsTokenId = mosyUrlParam('asset_alarms_uptoken');
    
    const deleteParam = mosyUrlParam('asset_alarms_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedAssetalarmsToken = '0';
    if (assetalarmsTokenId) {
      
      decodedAssetalarmsToken = atob(assetalarmsTokenId); // Decode the record_id
      setters.setAssetalarmsUptoken(assetalarmsTokenId);
      setters.setAssetalarmsActionStatus('update_asset_alarms');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawAssetalarmsQueryStr =`where primkey ='${decodedAssetalarmsToken}'`
    if(customQueryStr!='')
    {
      // if no asset_alarms_uptoken set , use customQueryStr
      if (!assetalarmsTokenId) {
       rawAssetalarmsQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initAssetalarmsProfileData(rawAssetalarmsQueryStr)

    if(deleteParam){
      popDeleteDialog(assetalarmsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setAssetalarmsNode(finalProfileData)
    
    
}
  
  

export function InteprateAssetalarmsEvent(data) {
     
  //console.log('🎯 Assetalarms Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_asset_alarms){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setAssetalarmsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('AssetalarmsProfileTray')

    
    mosyUpdateUrlParam('asset_alarms_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_asset_alarms){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add asset_alarms `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('AssetalarmsProfileTray')
      }
    }
     
  }

  if(childActionName.update_asset_alarms){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update asset_alarms `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('AssetalarmsProfileTray')
        
      }
    }
  }

  if(childActionName.delete_asset_alarms){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../assetalarms/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteAssetalarms(deleteToken).then(data=>{
  
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
       deleteUrlParam('asset_alarms_delete');
        
    }
  
  });

}