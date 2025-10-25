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
import { inteprateDevicelistFormAction, devicelistProfileData , popDeleteDialog, InteprateDevicelistEvent } from '../dataControl/DevicelistRequestHandler';

//state management
import { useDevicelistState } from '../dataControl/DevicelistStateManager';

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


//import InteprateDevicealarmsEvent Event manager
import {InteprateDevicealarmsEvent} from '../../devicealarms/dataControl/DevicealarmsRequestHandler';

//import DevicealarmsList component
import DevicealarmsList from '../../devicealarms/uiControl/DevicealarmsList';

//import InteprateDevicegpslogsEvent Event manager
import {InteprateDevicegpslogsEvent} from '../../gpslogs/dataControl/DevicegpslogsRequestHandler';

//import DevicegpslogsList component
import DevicegpslogsList from '../../gpslogs/uiControl/DevicegpslogsList';
import TrackerMapData from '../../maps/tracker/trackerdata';
import { viewLastGPS } from '../../AppCore/coreUtils';



// export profile


export default function DevicelistProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="DevicelistMainProfilePage",
    parentProfileItemId = "DevicelistProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Devicelist states
  const [stateItem, stateItemSetters] = useDevicelistState(settersOverrides);
  const device_listNode = stateItem.devicelistNode
  
  // -- basic states --//
  const paramDevicelistUptoken  = stateItem.devicelistUptoken
  const devicelistActionStatus = stateItem.devicelistActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setDevicelistNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postDevicelistFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateDevicelistFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postDevicelistFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("DevicelistProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    devicelistProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="DevicelistProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postDevicelistFormData} encType="multipart/form-data" id="device_list_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {device_listNode?.primkey ? (  <span>{`Device profile / ${device_listNode?.device_name}`} </span> ) :(<span> New Device</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramDevicelistUptoken && (
                  <DeleteButton
                  src="DevicelistMainProfilePage"
                  tableName="device_list"
                  uptoken={paramDevicelistUptoken}
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
                
                
                
                {paramDevicelistUptoken && (
                  <>
                <MosyActionButton
                  label=" View Last Location "
                  icon="map-marker"
                  onClick={()=>{viewLastGPS(device_listNode?.primkey)}}
                  />
                </>
              )}
              
              {paramDevicelistUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="DevicelistMainProfilePage"
                tableName="device_list"
                uptoken={paramDevicelistUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="DevicelistMainProfilePage"
                tableName="device_list"
                link="./profile"
                label="New Device"
                icon="plus-circle" />
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
                  <div className="col-md-5 text-center">Device Information</div>
                  <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                </h5>
                
                <div className="col-md-12 pt-3 p-0" id=""></div>
                
                <div className="row justify-content-start col-md-12 p-0 m-0 ">
                  
                  <MosySmartField
                  module="device_list"
                  field="device_name"
                  label="Device Name"
                  value={device_listNode?.device_name || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="title"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                  
                  <MosySmartField
                  module="device_list"
                  field="serial_number"
                  label="Serial Number"
                  value={device_listNode?.serial_number || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                  />
                  
                  <LiveSearchDropdown
                  apiEndpoint={apiRoutes.registeredsites.base}
                  tblName="sites"
                  parentTable="device_list"
                  inputName="txt__sites_site_name_site_id"
                  hiddenInputName="txt_site_id"
                  valueField="record_id"
                  displayField="site_name"
                  label="Location site"
                  defaultValue={{ record_id: device_listNode?.site_id || "", site_name: device_listNode?._sites_site_name_site_id || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>  console.log("Data seleted")}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-6 hive_data_cell "
                  context={{hostParent : hostParent}}
                  />
                  
                  <MosySmartField
                  module="device_list"
                  field="geofence"
                  label="Geofence cordinates "
                  value={device_listNode?.geofence || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="textarea"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                  
                  <MosySmartField
                  module="device_list"
                  field="manufacture_date"
                  label="Manufacture Date"
                  value={device_listNode?.manufacture_date || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="date"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="device_list"
                  field="date_installed"
                  label="Installation Date"
                  value={device_listNode?.date_installed || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="date"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="device_list"
                  field="remark"
                  label="Remark"
                  value={device_listNode?.remark || ""}
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
                  
                  <input className="form-control" id="txt_site_name" name="txt_site_name" value={device_listNode?.site_name || ""} placeholder="Site Name" type="hidden"/>
                  
                  
                  <input className="form-control" id="txt_reg_date" name="txt_reg_date" value={device_listNode?.reg_date || ""} placeholder="Registration Date" type="hidden"/>
                  
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons
                  src="DevicelistMainProfilePage"
                  tblName="device_list"
                  extraClass="optional-custom-class"
                  
                  />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="device_list_uptoken" name="device_list_uptoken" value={paramDevicelistUptoken}/>
              <input type="hidden" id="device_list_mosy_action" name="device_list_mosy_action" value={devicelistActionStatus}/>
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
        {device_listNode?.primkey && (
          <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
            <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Device alarms History`} </h5>
            
            <DevicealarmsList
            key={`${customQueryStr}-${localEventSignature}`}
            dataIn={{
              parentStateSetters : stateItemSetters,
              parentUseEffectKey : localEventSignature,
              showNavigationIsle:false,
              showDataControlSections:false,
              customQueryStr : btoa(`where  device_id='${device_listNode?.record_id}' `),
              customProfilePath:""
              
            }}
            
            dataOut={{
              setChildDataOut: InteprateDevicealarmsEvent,
              setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
            }}
            />
          </section>
        )}
        
        <style jsx global>{`
        .data_list_section {
          display: none;
        }
        .bottom_tbl_handler{
          padding-bottom:70px!important;
        }
        `}
      </style>
      {device_listNode?.primkey && (
        <section className="col-md-12 m-0 bg-white pt-5 p-0 ">

            {device_listNode?.device_logs?.length >0 &&(<>
            <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Latest device location`} </h5>
            
            <TrackerMapData 
            className="col-md-12 mb-4"
             device_id={device_listNode.primkey}/>
            </>)}
            
            <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3 mt-5"> {`GPS Logs History`} </h5>
                      
          <div className="col-md-12 p-2 text-right ">
            <a href={`?device_list_mosyfilter=${btoa(`device_id='${device_listNode?.record_id}'`)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
          </div>
          
          <DevicegpslogsList
          key={`${customQueryStr}-${localEventSignature}`}
          dataIn={{
            parentStateSetters : stateItemSetters,
            parentUseEffectKey : localEventSignature,
            showNavigationIsle:false,
            showDataControlSections:false,
            customQueryStr : btoa(`where device_id='${device_listNode?.record_id}'`),
            customProfilePath:"../gpslogs/profile"
            
          }}
          
          dataOut={{
            setChildDataOut: InteprateDevicegpslogsEvent,
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

