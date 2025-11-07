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
import { loadDevicegpslogsListData, popDeleteDialog, InteprateDevicegpslogsEvent  } from '../dataControl/DevicegpslogsRequestHandler';

//state management
import { useDevicegpslogsState } from '../dataControl/DevicegpslogsStateManager';

import logo from '../../../img/logo/logo.png'; // outside public!

//large text
import ReactMarkdown from 'react-markdown';

//routes manager
///handle routes
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();


//export list

export default function DevicegpslogsList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../gpslogs/profile",
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
  
  //manage Devicegpslogs states
  const [stateItem, stateItemSetters] = useDevicegpslogsState(settersOverrides);
  
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
    
    loadDevicegpslogsListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  
  return (
    
    <div className={`col-md-12 bg-white p-0 m-0  ${showDataControlSections && ("main_list_container")}  `} style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"gps_logs", keyword:stateItem.devicegpslogsQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Device GPS Logs </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_gps_logs" name="txt_gps_logs" className="custom-search-input form-control" placeholder="Search in Device GPS Logs "
          onChange={(e) => stateItemSetters.setDevicegpslogsQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qgps_logs_btn" name="qgps_logs_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="DevicegpslogsList" link={customProfilePath} label="New Log Entry" icon="map-marker" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "gps_logs_print_card", defaultTitle:"Device GPS Logs"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("gps_logs_data_table", "Device GPS Logs.xlsx")}
        >
        <i className="fa fa-arrow-right "></i> Export to excel
      </div>
    </div>
    <div className="col-md-12 m-0 p-0" id="gps_logs_print_card">
      <table className="table table-hover  text-left printTarget" id="gps_logs_data_table">
        <thead className="text-uppercase">
          <tr>
            <th scope="col">#</th>
            
            <th scope="col"><b>Log Type</b></th>
            <th scope="col"><b>Site Name</b></th>
            <th scope="col"><b>Device ID</b></th>
            <th scope="col"><b>Battery Level</b></th>
            <th scope="col"><b>Latitude (Y)</b></th>
            <th scope="col"><b>Longitude (X)</b></th>
            <th scope="col"><b>Speed (km/h)</b></th>
            <th scope="col"><b>Remark</b></th>
            <th scope="col"><b>Log Time</b></th>
            <th scope="col"><b>Created At</b></th>
            <th scope="col"><b>Log Details</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.devicegpslogsLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="12" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Device GPS Logs ...</h5>
              </td>
            </tr>
          ) : stateItem.devicegpslogsListData?.length > 0 ? (
            stateItem.devicegpslogsListData.map((listgps_logs_result, index) => {
              
              
              
              return(
                <Fragment key={`_row_${listgps_logs_result.primkey}`}>
                  <tr key={listgps_logs_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn"><b>{listgps_logs_result.row_count}</b></div>
                        <div className="table_cell_dropdown-content">
                          <MosySmartDropdownActions
                          tblName="gps_logs"
                          setters={{
                            
                            childStateSetters: stateItemSetters,
                            parentStateSetters: parentStateSetters
                            
                          }}
                          
                          attributes={`${listgps_logs_result.primkey}:${customProfilePath}:false`}
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          
                          />
                          
                        </div>
                      </div>
                    </td>
                    
                    <td scope="col"><span title={listgps_logs_result.log_type}>{magicTrimText(listgps_logs_result.log_type, 70)}</span></td>
                    <td scope="col"><span title={listgps_logs_result.site_name}>{magicTrimText(listgps_logs_result._sites_site_name_site_name, 70)}</span></td>
                    <td scope="col"><span title={listgps_logs_result.device_id}>{magicTrimText(listgps_logs_result._device_list_device_name_device_id, 70)}</span></td>
                    <td scope="col"><span title={listgps_logs_result.battery}>{magicTrimText(listgps_logs_result.battery, 70)}</span></td>
                    <td scope="col"><span title={listgps_logs_result.latitude}>{magicTrimText(listgps_logs_result.latitude, 70)}</span></td>
                    <td scope="col"><span title={listgps_logs_result.longitude}>{magicTrimText(listgps_logs_result.longitude, 70)}</span></td>
                    <td scope="col"><span title={listgps_logs_result.speed}>{magicTrimText(listgps_logs_result.speed, 70)}</span></td>
                    <td scope="col"><span>
                      <ReactMarkdown>
                        
                        {magicTrimText(listgps_logs_result.remark, 70)}
                        
                      </ReactMarkdown>
                    </span></td>
                    <td scope="col"><span title={listgps_logs_result.timestamp}>{mosyFormatDateOnly(listgps_logs_result.timestamp)}</span></td>
                    <td scope="col"><span title={listgps_logs_result.created_at}>{mosyFormatDateOnly(listgps_logs_result.created_at)}</span></td>
                    <td scope="col"><span>
                      <ReactMarkdown>
                        
                        {magicTrimText(listgps_logs_result.log_details, 70)}
                        
                      </ReactMarkdown>
                    </span></td>
                    
                  </tr>
                  
                  
                </Fragment>)
                
              })
              
            ) : (
              
              <tr><td colSpan="12" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no gps logs records found</h6>
                  
                  <AddNewButton src="DevicegpslogsList"  link={customProfilePath} label="New Log Entry" icon="map-marker" />
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
              <th scope="col"><b></b></th>
              <th scope="col"><b></b></th>
              
            </tr>
          </tbody>
          
        </table>
      </div>
      <MosyPaginationUi
      src="DevicegpslogsList"
      tblName="gps_logs"
      totalPages={stateItem.devicegpslogsListPageCount}
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

