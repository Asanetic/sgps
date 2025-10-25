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
export async function insert() {
 //console.log(`Form user_manifest_ insert sent `)

  return await mosyPostFormData({
    formId: 'user_manifest__profile_form',
    url: apiRoutes..base,
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function update() {

  //console.log(`Form user_manifest_ update sent `)

  return await mosyPostFormData({
    formId: 'user_manifest__profile_form',
    url: apiRoutes..base,
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('user_manifest__mosy_action');
 
 //console.log(`Form user_manifest_ submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_user_manifest_') {

      actionMessage ='Record added succesfully!';

      result = await insert();
    }

    if (actionType === 'update_user_manifest_') {

      actionMessage ='Record updated succesfully!';

      result = await update();
    }

    if (result?.status === 'success') {
      
      const user_manifest_Uptoken = btoa(result.user_manifest__uptoken || '');

      //set id key
      setters.setUptoken(user_manifest_Uptoken);
      
      //update url with new user_manifest_Uptoken
      mosyUpdateUrlParam('user_manifest__uptoken', user_manifest_Uptoken)

      setters.setActionStatus('update_user_manifest_')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: user_manifest_Uptoken,
        actionName : actionType,
        actionType : 'user_manifest__form_submission'
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


export async function initProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing ' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes..base,
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log(' Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching  data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function Delete(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes..delete,
        params: { 
          _user_manifest__delete_record: (token), 
          },
      });

      console.log('Token Delete '+token)
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


export async function getListData(qstr = "") {
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
  const pageNo = mosyUrlParam('quser_manifest__page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes..base,
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:quser_manifest__page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by  desc`),
        src : btoa(`getListData`)
        },
    });

    if (response.status === 'success') {
      //console.log(' Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching  data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadListData(customQueryStr, setters) {

    const gft = MosyFilterEngine('user_manifest_', true);
    let finalFilterStr = btoa(gft);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setLoading(true);
    
    const ListData = await getListData(finalFilterStr);
    
    setters.setLoading(false)
    setters.setListData(ListData?.data)

    setters.setListPageCount(ListData?.page_count)


    return ListData

}
  
  
export async function ProfileData(customQueryStr, setters, router, customProfileData={}) {

    const TokenId = mosyUrlParam('user_manifest__uptoken');
    
    const deleteParam = mosyUrlParam('user_manifest__delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedToken = '0';
    if (TokenId) {
      
      decodedToken = atob(TokenId); // Decode the record_id
      setters.setUptoken(TokenId);
      setters.setActionStatus('update_user_manifest_');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawQueryStr =`where primkey ='${decodedToken}'`
    if(customQueryStr!='')
    {
      // if no user_manifest__uptoken set , use customQueryStr
      if (!TokenId) {
       rawQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initProfileData(rawQueryStr)

    if(deleteParam){
      popDeleteDialog(TokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setNode(finalProfileData)
    
    
}
  
  

export function InteprateEvent(data) {
     
  //console.log('🎯  Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_user_manifest_){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('ProfileTray')

    
    mosyUpdateUrlParam('user_manifest__uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_user_manifest_){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add user_manifest_ `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('ProfileTray')
      }
    }
     
  }

  if(childActionName.update_user_manifest_){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update user_manifest_ `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('ProfileTray')
        
      }
    }
  }

  if(childActionName.delete_user_manifest_){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='..//list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      Delete(deleteToken).then(data=>{
  
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
       deleteUrlParam('user_manifest__delete');
        
    }
  
  });

}