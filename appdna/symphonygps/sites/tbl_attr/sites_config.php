<?php

  //sites //"primkey" , "record_id" , "site_name" , "site_code" , "country" , "city" , "county" , "town" , "building" , "latitude" , "longitude" , "location_address" , "remark" , "created_at" , "hive_site_id" , "hive_site_name" , "manager" , "manager_mobile" , "manager_email" , "contact_person" , "contact_person_mobile" , "contact_person_email" ,
  
  
//{{table_cols_head}}

/// A.I. NOTES :  please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable 

  // =========================
  // Core definitions
  // =========================
  $primary_table__="sites";
  $__page_title ="Registered Sites";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"gpssites",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"sitesreport",
    "multigrid_col_span"=>"9"      

  ];
  
  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
          "sites" => ["total_devices","device_list"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"remark" => "checkblank(getarr_val_(\$site_node,'remark'),'No remarks')"
        ],

        // Custom query hooks for Next.js
        "custom_next_js_query_line_cols" => [
            "total_devices" => [
                "function" => "await mosyCountRows('device_list', `where site_id ='\${row?.record_id}'`);",
                "args" => [],
                "return" => "data_res"
            ],
          
            "device_list" => [
                "function" => " await mosyFlexQuickSel('device_list', '*', `WHERE site_id='\${row?.record_id}'`, 'l');

                  // Loop and append GPS logs to each device
                  for (let i = 0; i < data_res.length; i++) {
                    const device = data_res[i];
                    const gpsLogs = await mosyFlexQuickSel('gps_logs', '*', `WHERE device_id='\${device.record_id}' limit 5`, 'l');

                    // Add logs into current device entry
                    data_res[i].gps_logs = gpsLogs;
                  }",
              
                "args" => [],
                "return" => "data_res"
            ]          
        ]
    ],

//sites //"primkey" , "record_id" , "site_name" , "country" , "city" , "county" , "town" , "building" , "latitude" , "longitude" , "location_address" , "remark" , "created_at" , "hive_site_id" , "hive_site_name" ,    
    // =========================
    // UI schema section
    // =========================
    "page_layout" => [

        // Column order
        "desired_column_order" => [
            "sites" => ["primkey","record_id","site_name","site_code","manager",
"contact_person","vendor","total_devices","latitude","longitude","location_address","remark","created_at"]
        ],

        // Grouped inputs
        "form_input_segmentation_arr" => [
            "sites" => [
                "Site Details" => ["site_name","site_code"],
                "Manager and contact person" => ["management_company","manager","manager_mobile","manager_email","contact_person","contact_person_mobile","contact_person_email"],
                "Company security & Vendor" => ["vendor","vendor_contact_person" , "vendor_contacts","company_security_manager" , "company_security_contacts"],
                "Response team" => ["response_team_contact_person" , "response_team_contacts" , "crew_commander_contact_person" , "crew_commander_contacts" , "vehicle_reg_number" , "alternate_phone_number"],
                "Location Details" => [ "country" , "county" , "town" , "location_address","latitude","longitude","total_devices","remark","created_at"]
              
            ]
        ],
//"primkey" , "record_id" , "site_name" , "site_code" , "country" , "city" , "county" , "town" , "latitude" , "longitude" , "location_address" , "remark" , "created_at" , "hive_site_id" , "hive_site_name" , "manager" , "manager_mobile" , "manager_email" , "contact_person" , "contact_person_mobile" , "contact_person_email" , "company_security_manager" , "company_security_contacts" , "vendor_contact_person" , "vendor_contacts" , "response_team_contact_person" , "response_team_contacts" , "crew_commander_contact_person" , "crew_commander_contacts" , "vehicle_reg_number" , "alternate_phone_number" , 

        "image_columns" => [],
        "default_col_class" => "col-md-6",
        "hidden_inputs" => ["created_at"], 
        "print_tables" => ["sites"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name", "device_list","city"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name", "device_list","remark","city","manager_email","manager_mobile","contact_person_email","contact_person_mobile","created_at","response_team_contact_person" , "response_team_contacts" , "crew_commander_contact_person" , "crew_commander_contacts" , "vehicle_reg_number" , "alternate_phone_number","company_security_manager" , "company_security_contacts","vendor_contact_person" , "vendor_contacts", "country","county"], 
        "running_bal_col_tbl" => [], 
        "grid_tbl" => [], 
        "view_tbl_only" => [], 
        "sum_cols_list" => [], 
        "textarea_array" => ["remark"], 
        "content_editable" => [], 

        "static_drop_down_array" => [
            //"region" => "Nairobi,Mombasa,Kisumu,Eldoret,Nakuru"
        ],

        "dynamic_drop_down_array" => ["building","town","county","country","city","vendor","management_company"], 
        "password_columns" => [], 
        "title_columns" => ["location_address"], 
        "date_columns" => ["created_at"],
        "datetime_columns" => [],

        "rename_cols_array" => [ 
            "site_name" => "Site Name:col-md-6",
            "site_code" => "Site Id:col-md-6",
            "vendor_contact_person" => "Vendor contact person:col-md-4",
            "vendor_contacts" => "Vendor contacts:col-md-4",
            "company_security_contacts" => "Security Manager contacts:col-md-4",
            "company_security_manager" => "Security Manager:col-md-4",
            "vendor_contacts" => "Vendor contacts:col-md-4",
            "vendor"=>"Vendor company:col-md-4",
            "latitude" => "Latitude (Y)",
            "town" => "Distribution region",
            "longitude" => "Longitude (X)",
            "location_address" => "Address description:col-md-12",
            "remark" => "Remark / Notes",
            "created_at" => "Date Created"
          
        ],

        "rename_tables_array" => [
            "sites" => "Sites"
        ],

        "new_label_buttons_arr" => [ 
            "sites" => "map-pin:New Site:{`Site profile / \${sitesNode?.site_code} - \${sitesNode?.site_name}`}"
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:10%;"
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
        "custom_query_line_cols" => [], 
        "custom_multi_grid_rows" => [
          /* "linkedDevices"=>[
             "table"=>"devices",
             "link"=>"devices_list",
             "query"=>"site_id='{{record_id}}'",
             "title"=>"Devices under this site",
             "columns"=>["device_name","device_id","status","last_ping"],
          ]*/
        ], 
        "custom_profile_col_data" => ["total_devices"=>"?"], 
        "custom_profile_default_data" => [],
        "connection_cols" => [ 
           //"device_id" => "devices:device_id:device_name:apiRoutes.devices.base"
        ]
    ]
  
  ];

  /// button you want on the list page
  $list_btn_table_array=[

    $primary_table__=>[
       //"refresh: Sync Sites "=>"syncSitesData()",
       //"upload: Import Sites "=>"uploadSitesData()"
    ],  
  ];


  /// buttons you want on the profile /form page
  $profile_btn_table_array=[

    $primary_table__=>[
       "map: View on map"=>"loadSitePage({record_id:sitesNode?.record_id})"
    ],

  ];


  //// on each row you add more actions eg, view devices, send alert
  $global_new_drop_down_link_arr=[

      $primary_table__=>[
         //"eye: View Devices"=>"viewSiteDevices()",
         //"bell: Trigger Alert"=>"sendSiteAlert()"
    ],
  ];


  ///append mini list for interlinked data eg sites & devices
  $interlink_lists=[
   "relatedDevices"=>[ 
     "filter_str"=>"site_id='\${sitesNode?.record_id}'",
     "module_name"=>"Devicesummary",
     "list_title"=>"Devices at this Site",
     "event_name"=>"InteprateDevicesummaryEvent",
     "event_path"=>"../../devicesummary/dataControl/DevicesummaryRequestHandler",     
     "module_path"=>"../../devicesummary/uiControl/DevicesummaryList",     
     "list_url"=>"",
     "profile_url"=>"../devicesummary/profile",
   ]
  ];
   
  ///append mini profile for interlinked data
  $interlink_profile=[
   /*"linkedAlarm"=>[ 
     "filter_str"=>"site_id='{sitesNode?.record_id}'",
     "module_name"=>"Devicelist",
     "profile_title"=>"Manage devices",
     "event_name"=>"InteprateSitesEvent",
     "event_path"=>"",     
     "module_path"=>"../../devices/uiControl/DevicelistProfile",     
     "list_table_name"=>"devices_list",
   ]*/
  ];  

  ///for interlinked data included as component
  $customProfileData="{}";

  ///=================================== basic template setup 
  $override_def_col_size="col-md-4 hive_data_cell ";
  $override_segmentation_section_class="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section";

  $additional_details_segment_title="";
  $col_size_def='col-md-12';
  $def_profile_container_class="col-md-12 rounded text-left p-2 mb-0 bg-white ";
  $def_profile_inner_container_class='` profile_container col-md-12 m-0 p-0 ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`';  
  $override_justify_class="justify-content-start";
  $overide_img_section_class="col-md-6 mr-lg-5";
  $override_large_col_size="col-md-12 hive_data_cell";
  $image_style_="rounded_avatar";
  ///=================================== basic template setup 

?>
