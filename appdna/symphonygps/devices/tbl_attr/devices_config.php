<?php
//
//{{table_cols_head}}

/// A.I. NOTES :  please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable 

  // =========================
  // Core definitions
  // =========================
  $primary_table__="farmers";
  $__page_title ="Farmers collection history";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"farmercollections",     
    "primary_key"=>"primkey",
    "record_id"=>"farmer_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"farmersreport",
    "multigrid_col_span"=>"9"      

  ];
  
  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
           "farmers" => ["collection_history"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"location" => "checkblank(getarr_val_(\$farmer_node,'location'),'Unknown')"
        ],

        // Custom query hooks for Next.js
        "custom_next_js_query_line_cols" => [
            "collection_history" => [
                "function" => "await mosyFlexQuickSel('milk_collections', `collection_date, quantity_litres, collection_id, session`, `where farmer_id ='\${row?.farmer_id}'`);
",
                "args" => [],
                "return" => "data_res"
            ],
            "societies" => [
                "function" => "await mosyCountRows('societies', `where farmer_id ='\${row?.record_id}'`)",
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
            "farmers" => ["primkey","record_id","farmer_id","farmer_name","farmer_number","phone","location","date_registered"]
        ],

        // Grouped inputs
        "form_input_segmentation_arr" => [
            "farmers" => [
                "Farmer Details" => ["farmer_name","farmer_number","phone","location","date_registered"]
            ]
        ],

        "image_columns" => [],
        "default_col_class" => "col-md-6",
        "hidden_inputs" => [], 
        "print_tables" => ["farmers"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","password"], 
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => [], 
        "textarea_array" => [], 
        "content_editable" => [], 

        "static_drop_down_array" => [
            //"location" => "Nairobi,Kisumu,Eldoret,Nakuru"
        ],

        "dynamic_drop_down_array" => ["location"], 
        "password_columns" => [], 
        "title_columns" => ["farmer_name"], 
        "date_columns" => ["date_registered"],
        "datetime_columns" => [],

        "rename_cols_array" => [ 
            "farmer_name" => "Full Name",
            "farmer_number" => "Account Number",
            "phone" => "Phone Number",
            "location" => "Location",
            "date_registered" => "Registration Date"
        ],

        "rename_tables_array" => [
            "farmers" => "Farmers"
        ],

        "new_label_buttons_arr" => [ 
            "farmers" => "user-plus:New Farmer:{`Farmer profile / \${farmersNode?.farmer_name}`}"
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:10%;"
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
        "custom_query_line_cols" => [], 
        "custom_multi_grid_rows" => [
          /* "collection_history"=>[
         "table"=>"milk_collections",
         "link"=>"transactions_list",
         "query"=>"farmer_id='{{farmer_id}}'",
         "title"=>"Collection history",
         "columns"=>["collection_date","session","quantity_litres","collection_id"],
          ]*/
          
        ], 
        "custom_profile_col_data" => [], 
        "custom_profile_default_data" => [],
        "connection_cols" => [ 
           //"society_id" => "societies:society_id:society_name:apiRoutes.societies.base"
        ]
    ]
  
  ];

  /// button you want on the list page
  $list_btn_table_array=[

    $primary_table__=>[
       //"refresh: Sync Farmers "=>"syncFarmerData()",
       //"upload: Import Farmers "=>"uploadFarmerData()"
    ],  
  ];


  /// buttons you want on the profile /form page
  $profile_btn_table_array=[

    $primary_table__=>[
       // "sms: Send SMS "=>"sendFarmerSMS()"
    ],

  ];


  //// on each row you add more actions eg, view collections, send message
  $global_new_drop_down_link_arr=[

      $primary_table__=>[
         //"tint: View Collections"=>"viewFarmerCollections()",
         //"envelope: Send SMS"=>"sendFarmerSMS()"
    ],
  ];


  ///append mini list for interlinked data eg farmers & collections
  $interlink_lists=[
   /*"relatedCollections"=>[ 
     "filter_str"=>"farmer_id='\${farmersNode?.farmer_id}'",
     "module_name"=>"Milkcollections",
     "list_title"=>"Milk Collections history",
     "event_name"=>"InteprateMilkcollectionsEvent",
     "event_path"=>"../../milkcollections/dataControl/MilkcollectionsRequestHandler",     
     "module_path"=>"../../milkcollections/uiControl/MilkcollectionsList",     
     "list_url"=>"../milkcollections/list",
     "profile_url"=>"../milkcollections/profile",
   ]*/
   
  ];
   
  ///append mini profile for interlinked data
  $interlink_profile=[
   
   /*"linkedSociety"=>[ 
     "filter_str"=>"society_id='{farmersNode?.society_id}'",
     "module_name"=>"Societies",
     "profile_title"=>"Related Society",
     "event_name"=>"InteprateFarmersEvent",
     "event_path"=>"../../farmers/dataControl/FarmersRequestHandler",     
     "list_table_name"=>"societies",
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
