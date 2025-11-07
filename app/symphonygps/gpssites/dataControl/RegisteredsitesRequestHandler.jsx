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
export async function insertRegisteredsites() {
 //console.log(`Form sites insert sent `)

  return await mosyPostFormData({
    formId: 'sites_profile_form',
    url: apiRoutes.registeredsites.base,
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateRegisteredsites() {

  //console.log(`Form sites update sent `)

  return await mosyPostFormData({
    formId: 'sites_profile_form',
    url: apiRoutes.registeredsites.base,
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateRegisteredsitesFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('sites_mosy_action');
 
 //console.log(`Form sites submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_sites') {

      actionMessage ='Record added succesfully!';

      result = await insertRegisteredsites();
    }

    if (actionType === 'update_sites') {

      actionMessage ='Record updated succesfully!';

      result = await updateRegisteredsites();
    }

    if (result?.status === 'success') {
      
      const sitesUptoken = btoa(result.sites_uptoken || '');

      //set id key
      setters.setRegisteredsitesUptoken(sitesUptoken);
      
      //update url with new sitesUptoken
      mosyUpdateUrlParam('sites_uptoken', sitesUptoken)

      setters.setRegisteredsitesActionStatus('update_sites')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: sitesUptoken,
        actionName : actionType,
        actionType : 'sites_form_submission'
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


export async function initRegisteredsitesProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
         
    total_devices : [],
    
    device_list : [],

  }
  

  MosyNotify({message : 'Refreshing Registered Sites' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.registeredsites.base,
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initRegisteredsitesProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('gpssites Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching gpssites data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteRegisteredsites(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.registeredsites.delete,
        params: { 
          _sites_delete_record: (token), 
          },
      });

      console.log('Token DeleteRegisteredsites '+token)
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


export async function getRegisteredsitesListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
         
    total_devices : [],
    
    device_list : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qsites_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.registeredsites.base,
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qsites_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getRegisteredsitesListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('gpssites Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching gpssites data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadRegisteredsitesListData(customQueryStr, setters) {

    const gftRegisteredsites = MosyFilterEngine('sites', true);
    let finalFilterStr = btoa(gftRegisteredsites);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setRegisteredsitesLoading(true);
    
    const registeredsitesListData = await getRegisteredsitesListData(finalFilterStr);
    
    setters.setRegisteredsitesLoading(false)
    setters.setRegisteredsitesListData(registeredsitesListData?.data)

    setters.setRegisteredsitesListPageCount(registeredsitesListData?.page_count)


    return registeredsitesListData

}
  
  
export async function registeredsitesProfileData(customQueryStr, setters, router, customProfileData={}) {

    const registeredsitesTokenId = mosyUrlParam('sites_uptoken');
    
    const deleteParam = mosyUrlParam('sites_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedRegisteredsitesToken = '0';
    if (registeredsitesTokenId) {
      
      decodedRegisteredsitesToken = atob(registeredsitesTokenId); // Decode the record_id
      setters.setRegisteredsitesUptoken(registeredsitesTokenId);
      setters.setRegisteredsitesActionStatus('update_sites');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawRegisteredsitesQueryStr =`where primkey ='${decodedRegisteredsitesToken}'`
    if(customQueryStr!='')
    {
      // if no sites_uptoken set , use customQueryStr
      if (!registeredsitesTokenId) {
       rawRegisteredsitesQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initRegisteredsitesProfileData(rawRegisteredsitesQueryStr)

    if(deleteParam){
      popDeleteDialog(registeredsitesTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setRegisteredsitesNode(finalProfileData)
    
    
}
  
  

export function InteprateRegisteredsitesEvent(data) {
     
  //console.log('🎯 Registeredsites Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_sites){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setRegisteredsitesCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('RegisteredsitesProfileTray')

    
    mosyUpdateUrlParam('sites_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_sites){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add sites `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('RegisteredsitesProfileTray')
      }
    }
     
  }

  if(childActionName.update_sites){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update sites `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('RegisteredsitesProfileTray')
        
      }
    }
  }

  if(childActionName.delete_sites){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../gpssites/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteRegisteredsites(deleteToken).then(data=>{
  
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
       deleteUrlParam('sites_delete');
        
    }
  
  });

}