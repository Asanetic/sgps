'use client';
//React
import { useEffect, useState ,Fragment } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';


//print utils
import { exportTableToExcel } from '../../../MosyUtils/exportToExcel';
import { mosyPrintToPdf } from '../../../MosyUtils/hiveUtils';



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
import { loadDevicelistListData, popDeleteDialog, InteprateDevicelistEvent  } from '../dataControl/DevicelistRequestHandler';

//state management
import { useDevicelistState } from '../dataControl/DevicelistStateManager';

import logo from '../../../img/logo/logo.png'; // outside public!

//large text
import ReactMarkdown from 'react-markdown';

//routes manager
///handle routes
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();


//export list

export default function DevicelistList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../devices/profile",
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
  
  //manage Devicelist states
  const [stateItem, stateItemSetters] = useDevicelistState(settersOverrides);
  
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
    
    loadDevicelistListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  
  return (
    
    <div className={`col-md-12 bg-white p-0 m-0  ${showDataControlSections && ("main_list_container")}  `} style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"device_list", keyword:stateItem.devicelistQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Device List </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_device_list" name="txt_device_list" className="custom-search-input form-control" placeholder="Search in Device List "
          onChange={(e) => stateItemSetters.setDevicelistQuerySearchStr(e.target.value)}
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
            
            
            <AddNewButton src="DevicelistList" link={customProfilePath} label="New Device" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "device_list_print_card", defaultTitle:"Device List"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("device_list_data_table", "Device List.xlsx")}
        >
        <i className="fa fa-arrow-right "></i> Export to excel
      </div>
    </div>
    <div className="col-md-12 m-0 p-0" id="device_list_print_card">
      <table className="table table-hover  text-left printTarget" id="device_list_data_table">
        <thead className="text-uppercase">
          <tr>
            <th scope="col">#</th>
            
            <th scope="col"><b>Device Name</b></th>
            <th scope="col"><b>Serial Number</b></th>
            <th scope="col"><b>Location site</b></th>
            <th scope="col"><b>Installation Date</b></th>
            <th scope="col"><b>Manufacture Date</b></th>
            <th scope="col"><b>Remark</b></th>
            <th scope="col"><b>Registration Date</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.devicelistLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="9" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Device List ...</h5>
              </td>
            </tr>
          ) : stateItem.devicelistListData?.length > 0 ? (
            stateItem.devicelistListData.map((listdevice_list_result, index) => {
              
              
              //init device_logs mini list items
              const device_logs_device_logsMiniList = Array.isArray(listdevice_list_result.device_logs) ? listdevice_list_result.device_logs : [];
              
              
              
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
                    <td scope="col"><span title={listdevice_list_result.date_installed}>{mosyFormatDateOnly(listdevice_list_result.date_installed)}</span></td>
                    <td scope="col"><span title={listdevice_list_result.manufacture_date}>{mosyFormatDateOnly(listdevice_list_result.manufacture_date)}</span></td>
                    <td scope="col"><span>
                      <ReactMarkdown>
                        
                        {magicTrimText(listdevice_list_result.remark, 70)}
                        
                      </ReactMarkdown>
                    </span></td>
                    <td scope="col"><span title={listdevice_list_result.reg_date}>{mosyFormatDateOnly(listdevice_list_result.reg_date)}</span></td>
                    
                  </tr>
                  
                  
                  <tr className="bg-light">
                    <td>-</td>
                    <td colSpan="9">
                      {/*<!-- Start  Title ribbon-->*/}
                      <div className="col-md-12 row p-2  justify-content-center p-0">
                        <div className="col text-left h6"><b>{`Device Ping History`}</b></div>
                        <div className="col-md-12 border-bottom border_set"></div>
                      </div>
                      {/*<!-- End Title ribbon-->*/}
                      
                      {Array.isArray(listdevice_list_result.device_logs) && listdevice_list_result.device_logs.length > 0 ? (
                        <>
                        {/*-- Start Table --*/}
                        <div className="table-responsive data-tables">
                          <table className="table table-hover text-left">
                            <thead className="text-uppercase">
                              <tr>
                                <th>#</th>
                                <th>timestamp</th>
                                <th>log type</th>
                                <th>longitude</th>
                                <th>latitude</th>
                                <th>battery</th>
                                
                              </tr>
                            </thead>
                            <tbody>
                              {listdevice_list_result.device_logs.map((device_list_device_logs_record, idx) => (
                                <tr key={`mini_list_${device_list_device_logs_record.row_count}`}>
                                  <td><b>{device_list_device_logs_record.row_count}</b></td>
                                  <td>{magicTrimText(device_list_device_logs_record.timestamp,70)}</td>
                                  <td>{magicTrimText(device_list_device_logs_record.log_type,70)}</td>
                                  <td>{magicTrimText(device_list_device_logs_record.longitude,70)}</td>
                                  <td>{magicTrimText(device_list_device_logs_record.latitude,70)}</td>
                                  <td>{magicTrimText(device_list_device_logs_record.battery,70)}</td>
                                  
                                </tr>
                              ))}
                              
                            </tbody>
                            <tfoot>
                              <tr>
                                <td></td>
                                
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                
                              </tr>
                            </tfoot>
                            
                          </table>
                        </div>
                        {/*<!-- End Table -->*/}
                        {/*<!-- Start  Title ribbon-->*/}
                        <div className="col-md-12 row p-2  justify-content-center p-0">
                          <div className="col text-left multigrid_view_more skip_print no-export "><a href={`ping_list?device_logs_mosyfilter=${btoa(`device_id='${listdevice_list_result.record_id}'`)}&mosytitle=${btoa(`Device Ping History`)}`}></a></div>
                        </div>
                        {/*<!-- End Title ribbon--> */}
                      </>
                    ) : (
                      <div className="col-md-12 text-center " id="">No Device Logs records found</div>
                      
                    )}
                    
                  </td>
                </tr>
                
                
                
              </Fragment>)
              
            })
            
          ) : (
            
            <tr><td colSpan="9" className="text-muted">
              
              
              <div className="col-md-12 text-center mt-4">
                <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no devices records found</h6>
                
                <AddNewButton src="DevicelistList"  link={customProfilePath} label="New Device" icon="plus-circle" />
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
            
          </tr>
        </tbody>
        
      </table>
    </div>
    <MosyPaginationUi
    src="DevicelistList"
    tblName="device_list"
    totalPages={stateItem.devicelistListPageCount}
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

