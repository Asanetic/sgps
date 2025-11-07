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
import { inteprateRegisteredsitesFormAction, registeredsitesProfileData , popDeleteDialog, InteprateRegisteredsitesEvent } from '../dataControl/RegisteredsitesRequestHandler';

//state management
import { useRegisteredsitesState } from '../dataControl/RegisteredsitesStateManager';

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


//import InteprateDevicelistEvent Event manager
import {InteprateDevicelistEvent} from '../../devices/dataControl/DevicelistRequestHandler';

//import DevicelistList component
import DevicelistList from '../../devices/uiControl/DevicelistList';



// export profile


export default function RegisteredsitesProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="RegisteredsitesMainProfilePage",
    parentProfileItemId = "RegisteredsitesProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Registeredsites states
  const [stateItem, stateItemSetters] = useRegisteredsitesState(settersOverrides);
  const sitesNode = stateItem.registeredsitesNode
  
  // -- basic states --//
  const paramRegisteredsitesUptoken  = stateItem.registeredsitesUptoken
  const registeredsitesActionStatus = stateItem.registeredsitesActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setRegisteredsitesNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postRegisteredsitesFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateRegisteredsitesFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postRegisteredsitesFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("RegisteredsitesProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    registeredsitesProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="RegisteredsitesProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0 bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0 ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postRegisteredsitesFormData} encType="multipart/form-data" id="sites_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {sitesNode?.primkey ? (  <span>{`Site profile / ${sitesNode?.site_name}`}</span> ) :(<span> New Site</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramRegisteredsitesUptoken && (
                  <DeleteButton
                  src="RegisteredsitesMainProfilePage"
                  tableName="sites"
                  uptoken={paramRegisteredsitesUptoken}
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
                
                
                
                {paramRegisteredsitesUptoken && (
                  <>
                  
                </>
              )}
              
              {paramRegisteredsitesUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="RegisteredsitesMainProfilePage"
                tableName="sites"
                uptoken={paramRegisteredsitesUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="RegisteredsitesMainProfilePage"
                tableName="sites"
                link="./profile"
                label="New Site"
                icon="map-pin" />
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
                  <div className="col-md-5 text-center">Site Details</div>
                  <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                </h5>
                
                <div className="col-md-12 pt-3 p-0" id=""></div>
                
                <div className="row justify-content-start col-md-12 p-0 m-0 ">
                  
                  <MosySmartField
                  module="sites"
                  field="site_name"
                  label="Site Name"
                  value={sitesNode?.site_name || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="title"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                  
                  <MosySmartField
                  module="sites"
                  field="remark"
                  label="Remark / Notes"
                  value={sitesNode?.remark || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="textarea"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                  
                  <MosySmartField
                  module="sites"
                  field="manager"
                  label="Manager"
                  value={sitesNode?.manager || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="sites"
                  field="contact_person"
                  label="Contact Person"
                  value={sitesNode?.contact_person || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                </div>
                
              </div>
              
              <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                  <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                  <div className="col-md-5 text-center">Location Details</div>
                  <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                </h5>
                
                <div className="col-md-12 pt-3 p-0" id=""></div>
                
                <div className="row justify-content-start col-md-12 p-0 m-0 ">
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label className="d-none">Country</label>
                    
                    <SmartDropdown
                    apiEndpoint={apiRoutes.registeredsites.base}
                    idField="primkey"
                    labelField="country"
                    inputName="txt_country"
                    label="Country"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={sitesNode?.country || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label className="d-none">City</label>
                    
                    <SmartDropdown
                    apiEndpoint={apiRoutes.registeredsites.base}
                    idField="primkey"
                    labelField="city"
                    inputName="txt_city"
                    label="City"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={sitesNode?.city || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label className="d-none">County</label>
                    
                    <SmartDropdown
                    apiEndpoint={apiRoutes.registeredsites.base}
                    idField="primkey"
                    labelField="county"
                    inputName="txt_county"
                    label="County"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={sitesNode?.county || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label className="d-none">Town</label>
                    
                    <SmartDropdown
                    apiEndpoint={apiRoutes.registeredsites.base}
                    idField="primkey"
                    labelField="town"
                    inputName="txt_town"
                    label="Town"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={sitesNode?.town || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label className="d-none">Building</label>
                    
                    <SmartDropdown
                    apiEndpoint={apiRoutes.registeredsites.base}
                    idField="primkey"
                    labelField="building"
                    inputName="txt_building"
                    label="Building"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={sitesNode?.building || ""}
                    />
                  </div>
                  
                  
                  <MosySmartField
                  module="sites"
                  field="latitude"
                  label="Latitude (Y)"
                  value={sitesNode?.latitude || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="sites"
                  field="longitude"
                  label="Longitude (X)"
                  value={sitesNode?.longitude || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="sites"
                  field="location_address"
                  label="Address description"
                  value={sitesNode?.location_address || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-8"}}
                  />
                  
                  
                  <MosySmartField
                  module="sites"
                  field="remark"
                  label="Remark / Notes"
                  value={sitesNode?.remark || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="textarea"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                  
                  <input className="form-control" id="txt_created_at" name="txt_created_at" value={sitesNode?.created_at || ""} placeholder="Date Created" type="hidden"/>
                  
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
                  module="sites"
                  field="total_devices"
                  label="Total Devices"
                  value={sitesNode?.total_devices || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons
                  src="RegisteredsitesMainProfilePage"
                  tblName="sites"
                  extraClass="optional-custom-class"
                  
                  />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="sites_uptoken" name="sites_uptoken" value={paramRegisteredsitesUptoken}/>
              <input type="hidden" id="sites_mosy_action" name="sites_mosy_action" value={registeredsitesActionStatus}/>
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
        {sitesNode?.primkey && (
          <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
            <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Devices at this Site`} </h5>
            
            <div className="col-md-12 p-2 text-right ">
              <a href={`?sites_mosyfilter=${btoa(`site_id='${sitesNode?.record_id}'`)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
            </div>
            
            <DevicelistList
            key={`${customQueryStr}-${localEventSignature}`}
            dataIn={{
              parentStateSetters : stateItemSetters,
              parentUseEffectKey : localEventSignature,
              showNavigationIsle:false,
              showDataControlSections:false,
              customQueryStr : btoa(`where site_id='${sitesNode?.record_id}'`),
              customProfilePath:"../devices/profile"
              
            }}
            
            dataOut={{
              setChildDataOut: InteprateDevicelistEvent,
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

