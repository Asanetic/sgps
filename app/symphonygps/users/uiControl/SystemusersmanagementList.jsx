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
import { loadSystemusersmanagementListData, popDeleteDialog, InteprateSystemusersmanagementEvent  } from '../dataControl/SystemusersmanagementRequestHandler';

//state management
import { useSystemusersmanagementState } from '../dataControl/SystemusersmanagementStateManager';

import logo from '../../../img/logo/logo.png'; // outside public!

//large text
import ReactMarkdown from 'react-markdown';

//routes manager
import apiRoutes from '../../AppRoutes/apiRoutes.json'


//export list

export default function SystemusersmanagementList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../users/profile",
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
  
  //manage Systemusersmanagement states
  const [stateItem, stateItemSetters] = useSystemusersmanagementState(settersOverrides);
  
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
    
    loadSystemusersmanagementListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  
  return (
    
    <div className={`col-md-12 bg-white p-0 m-0  ${showDataControlSections && ("main_list_container")}  `} style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"system_users", keyword:stateItem.systemusersmanagementQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> System Users Management </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_system_users" name="txt_system_users" className="custom-search-input form-control" placeholder="Search in System Users Management "
          onChange={(e) => stateItemSetters.setSystemusersmanagementQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qsystem_users_btn" name="qsystem_users_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="SystemusersmanagementList" link={customProfilePath} label="New User" icon="user-plus" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="system_users_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              <th>Profile Picture</th>
              <th scope="col"><b>Full Name</b></th>
              <th scope="col"><b>Email Address</b></th>
              <th scope="col"><b>Phone Number</b></th>
              <th scope="col"><b>User Number</b></th>
              <th scope="col"><b>Gender</b></th>
              <th scope="col"><b>Last Seen</b></th>
              <th scope="col"><b>Ref Id</b></th>
              <th scope="col"><b>Registration Date</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.systemusersmanagementLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="9" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading System Users Management ...</h5>
                </td>
              </tr>
            ) : stateItem.systemusersmanagementListData?.length > 0 ? (
              stateItem.systemusersmanagementListData.map((listsystem_users_result, index) => {
                
                
                
                return(
                  <Fragment key={`_row_${listsystem_users_result.primkey}`}>
                    <tr key={listsystem_users_result.primkey}>
                      <td>
                        <div className="table_cell_dropdown">
                          <div className="table_cell_dropbtn"><b>{listsystem_users_result.row_count}</b></div>
                          <div className="table_cell_dropdown-content">
                            <MosySmartDropdownActions
                            tblName="system_users"
                            setters={{
                              
                              childStateSetters: stateItemSetters,
                              parentStateSetters: parentStateSetters
                              
                            }}
                            
                            attributes={`${listsystem_users_result.primkey}:${customProfilePath}:false`}
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            
                            />
                            
                          </div>
                        </div>
                      </td>
                      
                      <td>
                        <MosyImageViewer
                        media={`/api/mediaroom?media=${btoa((listsystem_users_result.user_pic || ""))}`}
                        mediaRoot={""}
                        defaultLogo={logo.src}
                        imageClass="small_thumbnail"
                        />
                      </td>
                      <td scope="col"><span title={listsystem_users_result.name}>{magicTrimText(listsystem_users_result.name, 70)}</span></td>
                      <td scope="col"><span title={listsystem_users_result.email}>{magicTrimText(listsystem_users_result.email, 70)}</span></td>
                      <td scope="col"><span title={listsystem_users_result.tel}>{magicTrimText(listsystem_users_result.tel, 70)}</span></td>
                      <td scope="col"><span title={listsystem_users_result.user_no}>{magicTrimText(listsystem_users_result.user_no, 70)}</span></td>
                      <td scope="col"><span title={listsystem_users_result.user_gender}>{magicTrimText(listsystem_users_result.user_gender, 70)}</span></td>
                      <td scope="col"><span title={listsystem_users_result.last_seen}>{magicTrimText(listsystem_users_result.last_seen, 70)}</span></td>
                      <td scope="col"><span title={listsystem_users_result.ref_id}>{magicTrimText(listsystem_users_result.ref_id, 70)}</span></td>
                      <td scope="col"><span title={listsystem_users_result.regdate}>{mosyFormatDateOnly(listsystem_users_result.regdate)}</span></td>
                      
                    </tr>
                    
                    
                  </Fragment>)
                  
                })
                
              ) : (
                
                <tr><td colSpan="10" className="text-muted">
                  
                  
                  <div className="col-md-12 text-center mt-4">
                    <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no system users records found</h6>
                    
                    <AddNewButton src="SystemusersmanagementList"  link={customProfilePath} label="New User" icon="user-plus" />
                    <div className="col-md-12 pt-5 " id=""></div>
                  </div>
                </td></tr>
                
              )}
              
              <tr className="bg-light">
                <th></th>
                <th></th>
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
          src="SystemusersmanagementList"
          tblName="system_users"
          totalPages={stateItem.systemusersmanagementListPageCount}
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
  
