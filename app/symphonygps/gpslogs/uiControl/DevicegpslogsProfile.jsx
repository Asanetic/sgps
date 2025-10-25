'use client';

//React
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';


//components
import { MosyAlertCard, MosyNotify ,closeMosyModal } from  '../../../MosyUtils/ActionModals';
import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//basic utils
import { mosyScrollTo , deleteUrlParam, mosyFormInputHandler,mosyUrlParam  } from '../../../MosyUtils/hiveUtils';

//data control and processors
import { inteprateDevicegpslogsFormAction, devicegpslogsProfileData , popDeleteDialog, InteprateDevicegpslogsEvent } from '../dataControl/DevicegpslogsRequestHandler';

//state management
import { useDevicegpslogsState } from '../dataControl/DevicegpslogsStateManager';

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




// export profile


export default function DevicegpslogsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="DevicegpslogsMainProfilePage",
    parentProfileItemId = "DevicegpslogsProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Devicegpslogs states
  const [stateItem, stateItemSetters] = useDevicegpslogsState(settersOverrides);
  const gps_logsNode = stateItem.devicegpslogsNode
  
  // -- basic states --//
  const paramDevicegpslogsUptoken  = stateItem.devicegpslogsUptoken
  const devicegpslogsActionStatus = stateItem.devicegpslogsActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setDevicegpslogsNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postDevicegpslogsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateDevicegpslogsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postDevicegpslogsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("DevicegpslogsProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    devicegpslogsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="DevicegpslogsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postDevicegpslogsFormData} encType="multipart/form-data" id="gps_logs_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {gps_logsNode?.primkey ? (  <span>{`GPS Log / ${gps_logsNode?.record_id}`}</span> ) :(<span> New Log Entry</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramDevicegpslogsUptoken && (
                  <DeleteButton
                  src="DevicegpslogsMainProfilePage"
                  tableName="gps_logs"
                  uptoken={paramDevicegpslogsUptoken}
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
                
                
                
                {paramDevicegpslogsUptoken && (
                  <>
                  
                </>
              )}
              
              {paramDevicegpslogsUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="DevicegpslogsMainProfilePage"
                tableName="gps_logs"
                uptoken={paramDevicegpslogsUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="DevicegpslogsMainProfilePage"
                tableName="gps_logs"
                link="./profile"
                label="New Log Entry"
                icon="map-marker" />
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
                  <div className="col-md-5 text-center">Log Details</div>
                  <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                </h5>
                
                <div className="col-md-12 pt-3 p-0" id=""></div>
                
                <div className="row justify-content-start col-md-12 p-0 m-0 ">
                  
                  <MosySmartField
                  module="gps_logs"
                  field="log_type"
                  label="Log Type"
                  value={gps_logsNode?.log_type || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell"}}
                  />
                  
                  <LiveSearchDropdown
                  apiEndpoint={apiRoutes.registeredsites.base}
                  tblName="sites"
                  parentTable="gps_logs"
                  inputName="txt__sites_site_name_site_name"
                  hiddenInputName="txt_site_name"
                  valueField="record_id"
                  displayField="site_name"
                  label="Site Name"
                  defaultValue={{ record_id: gps_logsNode?.site_name || "", site_name: gps_logsNode?._sites_site_name_site_name || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>  console.log("Data seleted")}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-6 hive_data_cell"
                  context={{hostParent : hostParent}}
                  />
                  <LiveSearchDropdown
                  apiEndpoint={apiRoutes.devicelist.base}
                  tblName="device_list"
                  parentTable="gps_logs"
                  inputName="txt__device_list_device_name_device_id"
                  hiddenInputName="txt_device_id"
                  valueField="record_id"
                  displayField="device_name"
                  label="Device ID"
                  defaultValue={{ record_id: gps_logsNode?.device_id || "", device_name: gps_logsNode?._device_list_device_name_device_id || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>  console.log("Data seleted")}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-6 hive_data_cell"
                  context={{hostParent : hostParent}}
                  />
                  
                  <MosySmartField
                  module="gps_logs"
                  field="battery"
                  label="Battery Level"
                  value={gps_logsNode?.battery || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell"}}
                  />
                  
                  
                  <MosySmartField
                  module="gps_logs"
                  field="latitude"
                  label="Latitude (Y)"
                  value={gps_logsNode?.latitude || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell"}}
                  />
                  
                  
                  <MosySmartField
                  module="gps_logs"
                  field="longitude"
                  label="Longitude (X)"
                  value={gps_logsNode?.longitude || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell"}}
                  />
                  
                  
                  <MosySmartField
                  module="gps_logs"
                  field="speed"
                  label="Speed (km/h)"
                  value={gps_logsNode?.speed || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell"}}
                  />
                  
                  
                  <MosySmartField
                  module="gps_logs"
                  field="remark"
                  label="Remark"
                  value={gps_logsNode?.remark || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="textarea"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                </div>
                
              </div>
              
              <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                  <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                  <div className="col-md-5 text-center"></div>
                  <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                </h5>
                
                <div className="col-md-12 pt-3 p-0" id=""></div>
                
                <div className="row justify-content-start col-md-12 p-0 m-0 ">
                  
                  <MosySmartField
                  module="gps_logs"
                  field="timestamp"
                  label="Log Time"
                  value={gps_logsNode?.timestamp || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="datetime-local"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell"}}
                  />
                  
                  
                  <MosySmartField
                  module="gps_logs"
                  field="created_at"
                  label="Created At"
                  value={gps_logsNode?.created_at || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="datetime-local"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell"}}
                  />
                  
                  
                  <MosySmartField
                  module="gps_logs"
                  field="log_details"
                  label="Log Details"
                  value={gps_logsNode?.log_details || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="textarea"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons
                  src="DevicegpslogsMainProfilePage"
                  tblName="gps_logs"
                  extraClass="optional-custom-class"
                  
                  />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="gps_logs_uptoken" name="gps_logs_uptoken" value={paramDevicegpslogsUptoken}/>
              <input type="hidden" id="gps_logs_mosy_action" name="gps_logs_mosy_action" value={devicegpslogsActionStatus}/>
            </section>
            
            
          </div>
          
        </form>
        
        
        <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
          {/*<hive_mini_list/>*/}
          
          
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

