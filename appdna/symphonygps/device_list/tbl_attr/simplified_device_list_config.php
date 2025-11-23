<?php
////1. device_list

//"primkey" , "record_id" , "device_name" , "date_installed" , "manufacture_date" , "serial_number" , "remark" , "site_id" , "site_name" , "reg_date" , <br><br>

////1. device_list

//"primkey" , "record_id" , "device_name" , "date_installed" , "manufacture_date" , "serial_number" , "remark" , "site_id" , "site_name" , "reg_date" , "hive_site_id" , "hive_site_name" , "geofence" , <br><br>


//{{table_cols_head}}

/// A.I. NOTES :  please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable 

  // =========================
  // Core definitions
  // =========================
  $primary_table__="device_list";
  $__page_title ="Device summary";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"devicesummary",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"devicesummary",
    "multigrid_col_span"=>"9"      

  ];
  
  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
          "device_list" => ["site_code","installation_longitude","installation_latitude"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"site_name" => "checkblank(getarr_val_(\$device_node,'site_name'),'Unknown Site')"
        ],

//"primkey" , "record_id" , "log_type" , "site_name" , "device_id" , "battery" , "latitude" , "longitude" , "log_details" , "speed" , "remark" , "timestamp" , "created_at" , "hive_site_id" , "hive_site_name" , <br><br>
      
        // Custom query hooks for Next.js
        "custom_next_js_query_line_cols" => [
            "device_logs" => [
                "function" => "await mosyFlexQuickSel('gps_logs', `timestamp, log_type, latitude, longitude,battery, remark`, `where device_id ='\${row?.record_id}' order  by primkey desc limit 10 `);",
                "args" => [],
                "return" => "data_res"
            ],
            "installation_longitude" => [
                "function" => "await mosyQddata(`sites`, `record_id`, row.site_id);",
                "args" => [],
                "return" => "data_res?.longitude"
            ],
            "installation_latitude" => [
                "function" => "await mosyQddata(`sites`, `record_id`, row.site_id);",
                "args" => [],
                "return" => "data_res?.latitude"
            ], 
            "site_code" => [
                "function" => "await mosyQddata(`sites`, `record_id`, row.site_id);",
                "args" => [],
                "return" => "data_res?.site_code"
            ],           
          
        ]
    ],


    // =========================
    // UI schema section
    // =========================
    "page_layout" => [

        // Column order
        "desired_column_order" => [
            "device_list" => ["primkey","record_id","device_name","serial_number","site_name","site_id","site_code","geofence","date_installed","manufacture_date","remark","reg_date"]
        ],

        // Grouped inputs
        "form_input_segmentation_arr" => [
            "device_list" => [
                "Device Information" => ["device_name","serial_number","site_id","site_code","geofence","installation_latitude","installation_longitude","date_installed","remark"],
            ]
        ],

        "image_columns" => [], 
        "default_col_class" => "col-md-6",
        "hidden_inputs" => ["reg_date","site_name"], 
        "print_tables" => [], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","site_name","geofence"], 
        "running_bal_col_tbl" => [], 
        "grid_tbl" => [], 
        "view_tbl_only" => [], 
        "sum_cols_list" => [], 
        "textarea_array" => ["remark","geofence"], 
        "content_editable" => [], 

        "static_drop_down_array" => [
            //"device_type" => "Tracker,P300,AVL03,Custom"
        ],

        "dynamic_drop_down_array" => [], 
        "password_columns" => [], 
        "title_columns" => ["device_name"], 
        "date_columns" => ["date_installed","manufacture_date","reg_date"],
        "datetime_columns" => [],

        "rename_cols_array" => [
          
            "device_name" => "Device Name",
            "serial_number" => "Serial Number",
            "date_installed" => "Installation Date:col-md-4",
            "manufacture_date" => "Manufacture Date",
            "site_name" => "Site Name",
            "installation_latitude" => "Installation latitude:col-md-4",
            "installation_longitude" => "Installation longitude:col-md-4",
            "site_code" => "Site code",
            "site_id" => "Location site",
            "geofence" => "Geofence cordinates ",
            "reg_date" => "Registration Date"
        ],

        "rename_tables_array" => [
            "device_list" => "Devices"
        ],

        "new_label_buttons_arr" => [ 
            "device_list" => "plus-circle:New Device:{`Device profile / \${device_listNode?.device_name}`} "
        ],

        "profile_pic_style" => "width:100px; height:100px; border-radius:8px;"
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
        "custom_query_line_cols" => [], 
        "custom_multi_grid_rows" => [
           "device_logs"=>[
             "table"=>"device_logs",
             "link"=>"ping_list",
             "query"=>"device_id='{{record_id}}'",
             "title"=>"Device Ping History",
             "columns"=>["timestamp","log_type","longitude","latitude","battery"],
          ]
        ], 
        "custom_profile_col_data" => ["site_code"=>"?","installation_latitude"=>"?","installation_longitude"=>"?"], 
        "custom_profile_default_data" => [],
        "connection_cols" => [ 
           "site_id" => "sites:record_id:site_name:apiRoutes.registeredsites.base"
        ]
    ]
  
  ];

  /// button you want on the list page
  $list_btn_table_array=[

    $primary_table__=>[
       //"refresh: Sync Devices "=>"syncDeviceData()",
       //"upload: Import Devices "=>"uploadDeviceData()"
    ],  
  ];


  /// buttons you want on the profile /form page
  $profile_btn_table_array=[

    $primary_table__=>[
       //"signal: Test Ping "=>"triggerDevicePing()",
      "map-marker: View Last Location "=>'viewDeviceOnMap(`${device_listNode?.primkey}`)'
    ],

  ];


  //// on each row you add more actions eg, view logs, send command
  $global_new_drop_down_link_arr=[

      $primary_table__=>[
         //"map: View GPS Logs"=>"viewDeviceLogs()",
         //"wifi: Ping Device"=>"sendPingRequest()"
    ],
  ];


  ///append mini list for interlinked data eg device & gps logs
  $interlink_lists=[
    
   "Devicealarms"=>[ 
     "filter_str"=>" device_id='\${device_listNode?.record_id}' ",
     "module_name"=>"Devicealarms",
     "list_title"=>"Device alarms History",
     "event_name"=>"InteprateDevicealarmsEvent",
     "event_path"=>"../../devicealarms/dataControl/DevicealarmsRequestHandler",     
     "module_path"=>"../../devicealarms/uiControl/DevicealarmsList",     
     "list_url"=>"",
     "profile_url"=>"",
   ],
       "relatedLogs"=>[ 
     "filter_str"=>"device_id='\${device_listNode?.record_id}'",
     "module_name"=>"Devicegpslogs",
     "list_title"=>"GPS Logs History",
     "event_name"=>"InteprateDevicegpslogsEvent",
     "event_path"=>"../../gpslogs/dataControl/DevicegpslogsRequestHandler",     
     "module_path"=>"../../gpslogs/uiControl/DevicegpslogsList",     
     "list_url"=>"",
     "profile_url"=>"../gpslogs/profile",
   ]
  ];
   
  ///append mini profile for interlinked data
  $interlink_profile=[
   /*"linkedSite"=>[ 
     "filter_str"=>"record_id='{deviceNode?.site_id}'",
     "module_name"=>"Sites",
     "profile_title"=>"Related Site",
     "event_name"=>"InteprateSitesEvent",
     "event_path"=>"../../sites/dataControl/SitesRequestHandler",     
     "list_table_name"=>"sites",
   ]*/
  ];  

  ///for interlinked data included as component
  $customProfileData="{}";

  ///=================================== basic template setup 

  $override_def_col_size="col-md-6 hive_data_cell ";
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
