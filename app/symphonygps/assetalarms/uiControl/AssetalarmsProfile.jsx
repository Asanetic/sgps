'use client';

//React
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';


//components
import { MosyAlertCard, MosyNotify ,closeMosyModal } from  '../../../MosyUtils/ActionModals';
import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//basic utils
import { mosyScrollTo , deleteUrlParam, mosyFormInputHandler,mosyUrlParam ,mosyTonum, disableFormInputs  } from '../../../MosyUtils/hiveUtils';

//data control and processors
import { inteprateAssetalarmsFormAction, assetalarmsProfileData , popDeleteDialog, InteprateAssetalarmsEvent } from '../dataControl/AssetalarmsRequestHandler';

//state management
import { useAssetalarmsState } from '../dataControl/AssetalarmsStateManager';

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

//routes manager
///handle routes
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();


//import AssetalarmsList component
import AssetalarmsList from './AssetalarmsList';

//button function imports
import { acknowledgeAlarm, closeAlarm, trackAlarm } from "../../AppCore/coreUtils";


// export profile


export default function AssetalarmsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="AssetalarmsMainProfilePage",
    parentProfileItemId = "AssetalarmsProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Assetalarms states
  const [stateItem, stateItemSetters] = useAssetalarmsState(settersOverrides);
  const asset_alarmsNode = stateItem.assetalarmsNode
  
  // -- basic states --//
  const paramAssetalarmsUptoken  = stateItem.assetalarmsUptoken
  const assetalarmsActionStatus = stateItem.assetalarmsActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setAssetalarmsNode);
  
  //use route navigation system
  const router = useRouter();
  

  //manage post form
  function postAssetalarmsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateAssetalarmsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postAssetalarmsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("AssetalarmsProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    disableFormInputs("asset_alarms_profile_form")

    assetalarmsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="AssetalarmsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postAssetalarmsFormData} encType="multipart/form-data" id="asset_alarms_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {asset_alarmsNode?.primkey ? (  <span>{`Alarm type - ${asset_alarmsNode?.alarm_type} / Device -  ${asset_alarmsNode?.device_serial}`}</span> ) :(<span> New Alarm</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramAssetalarmsUptoken && (
                  <DeleteButton
                  src="AssetalarmsMainProfilePage"
                  tableName="asset_alarms"
                  uptoken={paramAssetalarmsUptoken}
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
                
                
                
                {paramAssetalarmsUptoken && (
                  <>
                  {asset_alarmsNode?.close_status != "Closed" && (
                    <MosyActionButton
                    label=" Acknowledge"
                    icon="check-square"
                    onClick={()=>{acknowledgeAlarm(`${asset_alarmsNode?.primkey}`)}}
                    />
                  )}
                  
                  <MosyActionButton
                  label=" Close issue "
                  icon="lock"
                  onClick={()=>{closeAlarm(`${asset_alarmsNode?.primkey}`)}}
                  />
                  
                  <MosyActionButton
                  label=" Realtime track"
                  icon="map-marker"
                  onClick={()=>{trackAlarm(`${asset_alarmsNode?.device_key}`)}}
                  />
                  
                </>
              )}
              
              {paramAssetalarmsUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="AssetalarmsMainProfilePage"
                tableName="asset_alarms"
                uptoken={paramAssetalarmsUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="AssetalarmsMainProfilePage"
                tableName="asset_alarms"
                link="./profile"
                label="New Alarm"
                icon="alert" />
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
            <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
              <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                  <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                  <div className="col-md-5 text-center">Alarm Details</div>
                  <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                </h5>
                
                <div className="col-md-12 pt-3 p-0" id=""></div>
                
                <div className="row justify-content-start col-md-12 p-0 m-0 ">
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label >Alarm Type</label>
                    
                    <select name="txt_alarm_type" id="txt_alarm_type" className="form-control">
                      <option  value={asset_alarmsNode?.alarm_type || ""}>{asset_alarmsNode?.alarm_type || "Select Alarm Type"}</option>
                      <option>Battery</option>
                      <option> Motion</option>
                      <option> Geofence</option>
                      
                    </select>
                  </div>
                                    
                <MosySmartField
                  module="asset_alarms"
                  field="alarm_time"
                  label="Alarm Time"
                  value={asset_alarmsNode?.alarm_time || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="datetime-local"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />                  
                  
                <MosySmartField
                  module="asset_alarms"
                  field="device_serial"
                  label="Device Serial"
                  value={asset_alarmsNode?.device_serial || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  <LiveSearchDropdown
                  apiEndpoint={apiRoutes.registeredsites.base}
                  tblName="sites"
                  parentTable="asset_alarms"
                  inputName="txt__sites_site_name_site_id"
                  hiddenInputName="txt_site_id"
                  valueField="record_id"
                  displayField="site_name"
                  label="Site"
                  defaultValue={{ record_id: asset_alarmsNode?.site_id || "", site_name: asset_alarmsNode?._sites_site_name_site_id || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>  console.log("Data seleted")}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-4 hive_data_cell "
                  context={{hostParent : hostParent}}
                  />
                  
                  {asset_alarmsNode?.primkey && (
                    <div className="form-group col-md-4 hive_data_cell  ">
                      <label >Acknowledgement Status</label>
                      <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_ack_status" name="div_ack_status" placeholder="Acknowledgement Status">{asset_alarmsNode?.ack_status || ""}</div>
                    </div>)}
                    
                    {asset_alarmsNode?.primkey && (
                      <div className="form-group col-md-4 hive_data_cell  ">
                        <label >Acknowledged By</label>
                        <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_ack_by" name="div_ack_by" placeholder="Acknowledged By">{asset_alarmsNode?.ack_by || ""}</div>
                      </div>)}
                      
                      {asset_alarmsNode?.primkey && (
                          <div className="form-group col-md-4 hive_data_cell  ">
                            <label >ACK Time</label>
                            <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_closed_by" name="div_closed_by" placeholder="Closed By">{asset_alarmsNode?.ack_time || ""}</div>
                          </div>)}                      
                      <div className="form-group col-md-4 hive_data_cell ">
                        <label >Close Status</label>
                        
                        <select name="txt_close_status" id="txt_close_status" className="form-control">
                          <option  value={asset_alarmsNode?.close_status || ""}>{asset_alarmsNode?.close_status || "Select Close Status"}</option>
                          <option>Open</option>
                          <option>Closed</option>
                          <option>Pending</option>
                          <option>Ack</option>
                          
                        </select>
                      </div>
                      
                      
                      {asset_alarmsNode?.primkey && (
                        <div className="form-group col-md-4 hive_data_cell  ">
                          <label >Current Status</label>
                          <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_status" name="div_status" placeholder="Current Status">{asset_alarmsNode?.status || ""}</div>
                        </div>)}
                        
                        {asset_alarmsNode?.primkey && (
                          <div className="form-group col-md-4 hive_data_cell  ">
                            <label >Closed By</label>
                            <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_closed_by" name="div_closed_by" placeholder="Closed By">{asset_alarmsNode?.closed_by || ""}</div>
                          </div>)}
                          {asset_alarmsNode?.primkey && (
                          <div className="form-group col-md-4 hive_data_cell  ">
                            <label >Close time</label>
                            <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_closed_by" name="div_closed_by" placeholder="Closed By">{asset_alarmsNode?.close_time || ""}</div>
                          </div>)}                          
                          {asset_alarmsNode?.primkey && (
                            <div className="form-group col-md-4 hive_data_cell  ">
                              <label >Device Name</label>
                              <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_device_name" name="div_device_name" placeholder="Device Name">{asset_alarmsNode?.device_name || ""}</div>
                            </div>)}
                            
                            <MosySmartField
                            module="asset_alarms"
                            field="description"
                            label="Alarm notes"
                            value={asset_alarmsNode?.description || ""}
                            onChange={handleInputChange}
                            context={{ hostParent: hostParent  }}
                            inputOverrides={{}}
                            type="textarea"
                            cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                            />
                            
                          </div>
                          
                        </div>
                        
                        <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  d-none  ">
                          <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                            <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                            <div className="col-md-5 text-center"></div>
                            <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                          </h5>
                          
                          <div className="col-md-12 pt-3 p-0" id=""></div>
                          
                          <div className="row justify-content-start col-md-12 p-0 m-0 ">
                            
                            {asset_alarmsNode?.primkey && (
                              <div className="form-group col-md-4 hive_data_cell d-none ">
                                <label >Device Key</label>
                                <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_device_key" name="div_device_key" placeholder="Device Key">{asset_alarmsNode?.device_key || ""}</div>
                              </div>)}
                            </div>
                            
                            <div className="col-md-12 text-center">
                              <SubmitButtons
                              src="AssetalarmsMainProfilePage"
                              tblName="asset_alarms"
                              extraClass="optional-custom-class"
                              
                              />
                            </div>
                          </div></div>
                          {/*    Input cells section isle      */}
                        </div>
                        
                        <section className="hive_control">
                          <input type="hidden" id="asset_alarms_uptoken" name="asset_alarms_uptoken" value={paramAssetalarmsUptoken}/>
                          <input type="hidden" id="asset_alarms_mosy_action" name="asset_alarms_mosy_action" value={assetalarmsActionStatus}/>
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
                    {asset_alarmsNode?.primkey && (
                      <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
                        <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Device Alarm history`} </h5>
                        
                        <AssetalarmsList
                        key={`${customQueryStr}-${localEventSignature}`}
                        dataIn={{
                          parentStateSetters : stateItemSetters,
                          parentUseEffectKey : localEventSignature,
                          showNavigationIsle:false,
                          showDataControlSections:false,
                          customQueryStr : btoa(`where device_serial='${asset_alarmsNode?.device_serial}'`),
                          customProfilePath:""
                          
                        }}
                        
                        dataOut={{
                          setChildDataOut: InteprateAssetalarmsEvent,
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
          
