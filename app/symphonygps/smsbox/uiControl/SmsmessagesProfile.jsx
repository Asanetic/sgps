'use client';

//React
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';


//components
import { MosyAlertCard, MosyNotify ,closeMosyModal } from  '../../../MosyUtils/ActionModals';
import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//basic utils
import { mosyScrollTo , deleteUrlParam, mosyFormInputHandler, mosyRightNow  } from '../../../MosyUtils/hiveUtils';

//data control and processors
import { inteprateSmsmessagesFormAction, smsmessagesProfileData , popDeleteDialog, InteprateSmsmessagesEvent } from '../dataControl/SmsmessagesRequestHandler';

//state management
import { useSmsmessagesState } from '../dataControl/SmsmessagesStateManager';

//profile components
import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown,
  DeleteButton ,
  MosyImageViewer,
  MosyFileUploadButton
} from '../../UiControl/componentControl';

//def logo
import logo from '../../../img/logo/logo.png'; // outside public!

import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'

///handle routes
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();



//import SmsmessagesList component
import SmsmessagesList from './SmsmessagesList';



// export profile


export default function SmsmessagesProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="SmsmessagesMainProfilePage",
    parentProfileItemId = "SmsmessagesProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Smsmessages states
  const [stateItem, stateItemSetters] = useSmsmessagesState(settersOverrides);
  const smsNode = stateItem.smsmessagesNode
  
  // -- basic states --//
  const paramSmsmessagesUptoken  = stateItem.smsmessagesUptoken
  const smsmessagesActionStatus = stateItem.smsmessagesActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setSmsmessagesNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postSmsmessagesFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateSmsmessagesFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postSmsmessagesFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("SmsmessagesProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    smsmessagesProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="SmsmessagesProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postSmsmessagesFormData} encType="multipart/form-data" id="sms_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {smsNode?.primkey ? (  <span>{`Sent to / ${smsNode?.recipient_phone} / ${smsNode?.status}`}</span> ) :(<span> New SMS</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramSmsmessagesUptoken && (
                  <DeleteButton
                  src="SmsmessagesMainProfilePage"
                  tableName="sms"
                  uptoken={paramSmsmessagesUptoken}
                  stateItemSetters={stateItemSetters}
                  parentStateSetters={parentStateSetters}
                  
                  onDelete={popDeleteDialog}
                  />
                )}
              </div>)}</>
            </h3>
            {/*    Title isle      */}
            
            
            
            {/*    Navigation isle      */}
            <><div className="row justify-content-end m-0 p-0 col-md-12  p-3 bg-white hive_profile_navigation " id="">
              <div className="col-md-4 text-left p-0 hive_profile_nav_back_to_list_tray" id="">
                
                {showNavigationIsle && ( <Link href="./list" className="text-info hive_profile_nav_back_to_list"><i className="fa fa-arrow-left"></i> Back to list</Link>)}
                
              </div>
              <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
                
                
                
                {paramSmsmessagesUptoken && (
                  <>
                  
                </>
              )}
              
              {paramSmsmessagesUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="SmsmessagesMainProfilePage"
                tableName="sms"
                uptoken={paramSmsmessagesUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="SmsmessagesMainProfilePage"
                tableName="sms"
                link="./profile"
                label="New SMS"
                icon="envelope" />
              </>
            )}
            
          </div>
        </div></>
        <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
        {/*    Navigation isle      */}
        <div className="row justify-content-center m-0 p-0 col-md-12" id="">
          {/*    Image section isle      */}
          
          {/*    Image section isle      */}
          
          {/*  //-------------    main content starts here  ------------------------------ */}
          
          
          
          <div className="col-md-12 row justify-content-center m-0  p-0">
            {/*    Input cells section isle      */}
            <div className="col-md-12 row p-0 justify-content-start p-0 m-0">
              <div className="col-md-12 row justify-content-center p-0 m-0">
                <div className="col-md-12 row p-0 justify-content-start p-0 m-0">
                  
                  <MosySmartField
                  module="sms"
                  field="recipient_phone"
                  label="Recipient Phone"
                  value={smsNode?.recipient_phone || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-12"}}
                  />
                  
                  
                  <MosySmartField
                  module="sms"
                  field="message_body"
                  label="Message"
                  value={smsNode?.message_body || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="textarea"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                  
                  <input className="form-control" id="txt_status" name="txt_status" value={smsNode?.status || "Pending"} placeholder="Delivery Status" type="hidden"/>
                  
                  
                  <input className="form-control" id="txt_sent_at" name="txt_sent_at" value={smsNode?.sent_at || mosyRightNow()} placeholder="Sent At" type="hidden"/>
                  
                  
                  <input className="form-control" id="txt_delivery_report" name="txt_delivery_report" value={smsNode?.delivery_report || ""} placeholder="Delivery Report" type="hidden"/>
                  
                  
                  {smsNode?.primkey && (
                    <div className="form-group col-md-12 hive_data_cell  ">
                      <label >Delivery Receipt</label>
                      <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_delivery_receipt" name="div_delivery_receipt" placeholder="Delivery Receipt">{smsNode?.delivery_receipt || ""}</div>
                    </div>)}
                  </div>
                  
                  <div className="col-md-12 text-center">
                    <SubmitButtons
                    src="SmsmessagesMainProfilePage"
                    tblName="sms"
                    extraClass="optional-custom-class"
                    
                    />
                  </div>
                </div></div>
                {/*    Input cells section isle      */}
              </div>
              
              <section className="hive_control">
                <input type="hidden" id="sms_uptoken" name="sms_uptoken" value={paramSmsmessagesUptoken}/>
                <input type="hidden" id="sms_mosy_action" name="sms_mosy_action" value={smsmessagesActionStatus}/>
              </section>
              
              
            </div>
            
          </form>
          
          
          <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
            {/*<hive_mini_list/>*/}
            
            
            
            <style jsx global>{`
            .data_list_section {
              display: none;
            }
            .bottom_tbl_handler{
              padding-bottom:70px!important;
            }
            `}
          </style>
          {smsNode?.primkey && (
            <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
              <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Phone Message history`} </h5>
              
              <SmsmessagesList
              key={`${customQueryStr}-${localEventSignature}`}
              dataIn={{
                parentStateSetters : stateItemSetters,
                parentUseEffectKey : localEventSignature,
                showNavigationIsle:false,
                showDataControlSections:false,
                customQueryStr : btoa(`where recipient_phone='${smsNode?.recipient_phone}'`),
                customProfilePath:""
                
              }}
              
              dataOut={{
                setChildDataOut: InteprateSmsmessagesEvent,
                setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
              }}
              />
            </section>
          )}
        </div>
      </div>
    </div>
    
    
    {/* snack notifications -- */}
    {snackMessage &&(
      <MosySnackWidget
      content={snackMessage}
      duration={5000}
      type="custom"
      onDone={() => {
        stateItemSetters.setSnackMessage("");
        stateItem.snackOnDone(); // Run whats inside onDone
        deleteUrlParam("snack_alert")
      }}
      
      />)}
      {/* snack notifications -- */}
      
      
      {/* ================== End Feature Section========================== ------*/}
    </div>
    
  );
  
}

