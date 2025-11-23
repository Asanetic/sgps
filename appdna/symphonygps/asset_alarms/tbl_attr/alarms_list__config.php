<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE
  
////1. asset_alarms

//"primkey" , "record_id" , "alarm_type" , "alarm_time" , "device_serial" , "site_id" , "ack_status" , "status" , "description" , "ack_by" , "close_status" , "reg_date" , <br><br>


//{{table_cols_head}}

//Important A.I notes below 
  
//important columns on list :  __    
//important columns on profile :  __    

/*================= How the module related to the whole app / app flow ==================== 



================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of farmers please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .
//A.I Notes  : max list col should be have 7 data important and relevant columns  , skip_cols_list the rest. eg if table have 20 cols  "skip_cols_list" => ["hive_site_id","hive_site_name", + the 13 cols ],  hive_site_id and hive_site_name should always be skipped in skip_cols_list skip_cols_profile

  // =========================
  // Core definitions
  // =========================
  $primary_table__="asset_alarms";
  $__page_title ="Asset Alarms";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"assetalarms",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"assetalarmsreport",
    "multigrid_col_span"=>"9"      

  ];
  
  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
           "asset_alarms" => ["device_key","device_name"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"location" => "checkblank(getarr_val_(\$alarm_node,'location'),'Unknown')"
        ],

        // Custom query hooks for Next.js
        "custom_next_js_query_line_cols" => [
            "device_key" => [
                "function" => "await mosyQddata('device_list', `serial_number`, `\${row?.device_serial}`);",
                "args" => [],
                "return" => "data_res?.primkey"
            ],
            "device_name" => [
                "function" => "await mosyQddata('device_list', `serial_number`, `\${row?.device_serial}`);",
                "args" => [],
                "return" => "data_res?.device_name"
            ],
          
            "device_alarms_count" => [
                "function" => "await mosyCountRows('asset_alarms', `where device_serial ='\${row?.device_serial}'`)",
                "args" => [],
                "return" => "data_res?.total"
            ]
        ]
    ],


    // =========================
    // UI schema section
    // =========================
    "page_layout" => [

        // Column order
        "desired_column_order" => [
            "asset_alarms" => ["primkey","record_id","alarm_id","alarm_time","alarm_type","description","device_serial","site_id","status"]
        ],

        // Grouped inputs
        "form_input_segmentation_arr" => [
            "asset_alarms" => [
                "Alarm Details" => ["alarm_type","alarm_time","device_serial","site_id","ack_status","ack_by","close_status","status","closed_by","device_name","description","reg_date"]
            ]
        ],

        "image_columns" => [],
        "default_col_class" => "col-md-6",
        "hidden_inputs" => [], 
        "print_tables" => ["asset_alarms"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name","reg_date"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","password","reg_date","ack_status","device_key"], 
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => [], 
        "textarea_array" => ["description"], 
        "content_editable" => [], 

        "static_drop_down_array" => [
            "alarm_type" => "Battery, Motion, Geofence", 
            "ack_status" => "Open,Acknowledged,Closed",
            "close_status" => "Open,Closed,Pending,Ack" 
        ],

        "dynamic_drop_down_array" => [], // if its here dont add it to connection_cols and vice versa 
        "password_columns" => [], 
        "title_columns" => [], 
        "date_columns" => ["reg_date"],
        "datetime_columns" => ["alarm_time"],

        "rename_cols_array" => [ 
            "alarm_type" => "Alarm Type",
            "alarm_time" => "Alarm Time",
            "device_serial" => "Device Serial",
            "site_id" => "Site",
            "ack_status" => "Acknowledgement Status",
            "ack_by" => "Acknowledged By",
            "close_status" => "Close Status",
            "status" => "Current Status",
            "description" => "Description",
            "reg_date" => "Recorded Date"
        ],

        "rename_tables_array" => [
            "asset_alarms" => "Asset Alarms"
        ],

        "new_label_buttons_arr" => [ 
            "asset_alarms" => "alert:New Alarm:{`Alarm type - \${asset_alarmsNode?.alarm_type} / Device -  \${asset_alarmsNode?.device_serial}`}" // node formart tablenameNode eg acc_renewalsNode
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:10%;"
    ],
    
    "import"=>[
      "asset_alarms"=>"alarm_id,alarm_type,alarm_time,device_serial,site_id,ack_status,status,description,ack_by,close_status,reg_date"
    ],
    
    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
          
       "add_grid_check_boxes"=>[
          "asset_alarms_list"=>"loadAssetAlarms()"
        ],
      
        "custom_query_line_cols" => [], 
      
        //Ai Notes  dont clear this custom_multi_grid_rows instead customize if possible
        "custom_multi_grid_rows" => [
          /* "alarm_history"=>[
         "table"=>"alarm_logs",
         "link"=>"alarm_logs_list",
         "query"=>"alarm_id='{{alarm_id}}'",
         "title"=>"Alarm history",
         "columns"=>["log_time","log_level","message","log_id"],
          ]*/
          
        ], 
        "custom_profile_col_data" => ["status"=>"?","ack_by"=>"?","closed_by"=>"?","ack_status"=>"?","device_name"=>"?","device_key"=>"?"], 
        "custom_profile_default_data" => [],
        "connection_cols" => [ 
           "site_id" => "sites:record_id:site_name:apiRoutes.registeredsites.base"
        ]
    ]
  
  ];

  /// Ai Notes  button you want on the list page dont remove commented code replace instead
  $list_btn_table_array=[

    $primary_table__=>[
       //"refresh: Sync Alarms "=>"syncAlarmData()",
       "calendar: Filter by date "=>"filterAlarmDate()",
       "bell: Filter by alarm type "=>"filterAlarmType()",
       "info-circle: Filter by status "=>"filterAlarmStatus()",
       "microchip: Filter by device "=>"filterDeviceName()"
    ],  
  ];


  /// Ai Notes buttons you want on the profile /form page dont remove commented code replace instead
  $profile_btn_table_array=[

    $primary_table__=>[
       // "sms: Notify Site Manager "=>"notifySiteManager()"
       "check-square: Acknowledge"=>'acknowledgeAlarm(`${asset_alarmsNode?.primkey}`)',
       "lock: Close issue "=>'closeAlarm(`${asset_alarmsNode?.primkey}`)',
       "map-marker: Realtime track"=>"trackAlarm(`\${asset_alarmsNode?.device_key}`)"

    ],

  ];


  ////Ai Notes  on each row you add more actions eg, view history, acknowledge dont remove commented code replace instead
  $global_new_drop_down_link_arr=[

      $primary_table__=>[
         "check-square: Acknowledge"=>'acknowledgeAlarm(`${listasset_alarms_result.primkey}`)',
       "map-marker: Realtime track"=>'trackAlarm(`${listasset_alarms_result.device_key}`)'
        
    ],
  ];


  ///Ai Notes  append mini list for interlinked data eg alarms & logs dont remove commented code replace instead
  $interlink_lists=[
   "relatedAlarmLogs"=>[ 
     "filter_str"=>"device_serial='\${asset_alarmsNode?.device_serial}'",
     "module_name"=>"Assetalarms",
     "list_title"=>"Device Alarm history",
     "event_name"=>"InteprateAssetalarmsEvent",
     "event_path"=>"",     
     "module_path"=>"./AssetalarmsList",     
     "list_url"=>"../alarm_logs/list",
     "profile_url"=>"",
   ]
   
  ];
   
  ///Ai Notes append mini profile for interlinked data dont remove commented code replace instead
  $interlink_profile=[
   
   /*"linkedSite"=>[ 
     "filter_str"=>"site_id='{asset_alarmsNode?.site_id}'",
     "module_name"=>"Sites",
     "profile_title"=>"Related Site",
     "event_name"=>"InteprateAssetAlarmsEvent",
     "event_path"=>"../../sites/dataControl/SitesRequestHandler",     
     "list_table_name"=>"sites",
   ]*/
   
  ];  

  ///for interlinked data included as component
  $customProfileData="{}";

  ///=================================== basic template setup 

  $override_def_col_size="col-md-4 hive_data_cell ";
  $override_segmentation_section_class="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section";

  $additional_details_segment_title="";

  $col_size_def='col-md-12';

  $def_profile_container_class="col-md-12 rounded text-left p-2 mb-0  bg-white ";
  $def_profile_inner_container_class='` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`';  
  $override_justify_class="justify-content-start";
  $overide_img_section_class="col-md-6 mr-lg-5";
  $override_large_col_size="col-md-12 hive_data_cell";
  $image_style_="rounded_avatar";
  ///=================================== basic template setup 

?>
