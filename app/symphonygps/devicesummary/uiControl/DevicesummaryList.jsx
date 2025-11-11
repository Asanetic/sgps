'use client';
//React
import { useEffect, useState ,Fragment } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';




//custom utils
import { deleteUrlParam, magicTrimText, mosyUrlParam, mosyFormatDateOnly , mosyFormatDateTime} from '../../../MosyUtils/hiveUtils';
import { mosyFilterUrl } from '../../DataControl/MosyFilterEngine';

//list components
import {
  MosySmartDropdownActions,
  AddNewButton,
  MosyActionButton,
  MosyGridRowOptions,
  MosyPaginationUi,
  DeleteButton,
  MosyImageViewer
} from '../../UiControl/componentControl';

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//data
import { loadDevicesummaryListData, popDeleteDialog, InteprateDevicesummaryEvent  } from '../dataControl/DevicesummaryRequestHandler';

//state management
import { useDevicesummaryState } from '../dataControl/DevicesummaryStateManager';

import logo from '../../../img/logo/logo.png'; // outside public!

//large text
import ReactMarkdown from 'react-markdown';

//routes manager
///handle routes
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();


//export list

export default function DevicesummaryList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../devicesummary/profile",
    showDataControlSections = true,
    parentUseEffectKey = "",
    parentStateSetters=null,
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Devicesummary states
  const [stateItem, stateItemSetters] = useDevicesummaryState(settersOverrides);
  
  const localEventSignature = stateItem.localEventSignature
  const snackMessage = stateItem.snackMessage
  const snackOnDone = stateItem.snackOnDone
  
  //use route navigation system if need be
  const router = useRouter();
  
  useEffect(() => {
    
    const snackUrlAlert = mosyUrlParam("snack_alert")
    if(snackUrlAlert)
    {
      stateItemSetters.setSnackMessage(snackUrlAlert)
    }
    
    loadDevicesummaryListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  
  return (
    
    <div className={`col-md-12 bg-white p-0 m-0  ${showDataControlSections && ("main_list_container")}  `} style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"device_list", keyword:stateItem.devicesummaryQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Device summary </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_device_list" name="txt_device_list" className="custom-search-input form-control" placeholder="Search in Device summary "
          onChange={(e) => stateItemSetters.setDevicesummaryQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qdevice_list_btn" name="qdevice_list_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="DevicesummaryList" link={customProfilePath} label="New Device" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="device_list_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Device Name</b></th>
              <th scope="col"><b>Serial Number</b></th>
              <th scope="col"><b>Location site</b></th>
              <th scope="col"><b>Site code</b></th>
              <th scope="col"><b>Installation Date</b></th>
              <th scope="col"><b>Remark</b></th>
              <th scope="col"><b>Registration Date</b></th>
              <th scope="col"><b>Installation longitude</b></th>
              <th scope="col"><b>Installation latitude</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.devicesummaryLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="10" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Device summary ...</h5>
                </td>
              </tr>
            ) : stateItem.devicesummaryListData?.length > 0 ? (
              stateItem.devicesummaryListData.map((listdevice_list_result, index) => {
                
                
                
                return(
                  <Fragment key={`_row_${listdevice_list_result.primkey}`}>
                    <tr key={listdevice_list_result.primkey}>
                      <td>
                        <div className="table_cell_dropdown">
                          <div className="table_cell_dropbtn"><b>{listdevice_list_result.row_count}</b></div>
                          <div className="table_cell_dropdown-content">
                            <MosySmartDropdownActions
                            tblName="device_list"
                            setters={{
                              
                              childStateSetters: stateItemSetters,
                              parentStateSetters: parentStateSetters
                              
                            }}
                            
                            attributes={`${listdevice_list_result.primkey}:${customProfilePath}:false`}
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            
                            />
                            
                          </div>
                        </div>
                      </td>
                      
                      <td scope="col"><span title={listdevice_list_result.device_name}>{magicTrimText(listdevice_list_result.device_name, 70)}</span></td>
                      <td scope="col"><span title={listdevice_list_result.serial_number}>{magicTrimText(listdevice_list_result.serial_number, 70)}</span></td>
                      <td scope="col"><span title={listdevice_list_result.site_id}>{magicTrimText(listdevice_list_result._sites_site_name_site_id, 70)}</span></td>
                      <td scope="col"><span title={listdevice_list_result.site_code}>{magicTrimText(listdevice_list_result.site_code, 70)}</span></td>
                      <td scope="col"><span title={listdevice_list_result.date_installed}>{mosyFormatDateOnly(listdevice_list_result.date_installed)}</span></td>
                      <td scope="col"><span>
                        <ReactMarkdown>
                          
                          {magicTrimText(listdevice_list_result.remark, 70)}
                          
                        </ReactMarkdown>
                      </span></td>
                      <td scope="col"><span title={listdevice_list_result.reg_date}>{mosyFormatDateOnly(listdevice_list_result.reg_date)}</span></td>
                      <td scope="col"><span title={listdevice_list_result.installation_longitude}>{magicTrimText(listdevice_list_result.installation_longitude, 70)}</span></td>
                      <td scope="col"><span title={listdevice_list_result.installation_latitude}>{magicTrimText(listdevice_list_result.installation_latitude, 70)}</span></td>
                      
                    </tr>
                    
                    
                  </Fragment>)
                  
                })
                
              ) : (
                
                <tr><td colSpan="10" className="text-muted">
                  
                  
                  <div className="col-md-12 text-center mt-4">
                    <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no devices records found</h6>
                    
                    <AddNewButton src="DevicesummaryList"  link={customProfilePath} label="New Device" icon="plus-circle" />
                    <div className="col-md-12 pt-5 " id=""></div>
                  </div>
                </td></tr>
                
              )}
              
              <tr className="bg-light">
                <th></th>
                
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                
              </tr>
            </tbody>
            
          </table>
          
          <MosyPaginationUi
          src="DevicesummaryList"
          tblName="device_list"
          totalPages={stateItem.devicesummaryListPageCount}
          stateItemSetters={stateItemSetters}
          />
        </div>
        
        
      </form>
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
      </div>
    );
    
  }
  
