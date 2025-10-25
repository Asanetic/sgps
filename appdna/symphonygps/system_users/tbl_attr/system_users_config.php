<?php

////1. system_users

//"login_password" , "primkey" , "user_id" , "name" , "email" , "tel" , "ref_id" , "regdate" , "user_no" , "user_pic" , "user_gender" , "last_seen" , "about" , "hive_site_id" , "hive_site_name" , "auth_token" , "token_status" , "token_expiring_in" , "project_id" , "project_name" , <br><br>


//{{table_cols_head}}

/// A.I. NOTES :  please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable 

  // =========================
  // Core definitions
  // =========================
  $primary_table__="system_users";
  $__page_title ="System Users Management";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"users",     
    "primary_key"=>"primkey",
    "record_id"=>"user_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"systemusers",
    "multigrid_col_span"=>"9"      

  ];
  
  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
           //"system_users" => ["last_seen","auth_token","token_status","token_expiring_in"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"user_gender" => "checkblank(getarr_val_(\$user_node,'user_gender'),'Unknown')"
        ],

        // Custom query hooks for Next.js
        "custom_next_js_query_line_cols" => [
           /* "last_seen" => [
                "function" => "await mosyGetRow('system_users', `last_seen`, `where user_id ='\${row?.user_id}'`)",
                "args" => [],
                "return" => "data_res?.last_seen"
            ],
            "auth_sessions" => [
                "function" => "await mosyCountRows('system_users', `where token_status ='active' AND user_id ='\${row?.user_id}'`)",
                "args" => [],
                "return" => "data_res?.total"
            ]*/
        ]
    ],


    // =========================
    // UI schema section
    // =========================
    "page_layout" => [

        // Column order
        "desired_column_order" => [
            "system_users" => ["primkey","user_id","name","email","tel","user_no","user_pic","user_gender","about","login_password","last_seen","auth_token","token_status","token_expiring_in","project_id","project_name","ref_id","hive_site_id","hive_site_name","regdate"]
        ],

        // Grouped inputs
        "form_input_segmentation_arr" => [
            "system_users" => [
                "User Details" => ["name","email","tel","user_gender","about"],
                "Security" => ["login_password","auth_token","token_status","token_expiring_in"]
            ]
        ],

        "image_columns" => ["user_pic"],
        "default_col_class" => "col-md-6",
        "hidden_inputs" => [], 
        "print_tables" => [], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name","auth_token","about" , "hive_site_id" , "hive_site_name" , "auth_token" , "token_status" , "token_expiring_in" , "project_id" , "project_name"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","login_password","auth_token","about" , "hive_site_id" , "hive_site_name" , "auth_token" , "token_status" , "token_expiring_in" , "project_id" , "project_name"], 
        "running_bal_col_tbl" => [], 
        "grid_tbl" => [], 
        "view_tbl_only" => [], 
        "sum_cols_list" => [], 
        "textarea_array" => ["about"], 
        "content_editable" => [], 

        "static_drop_down_array" => [
            "user_gender" => "Male,Female,Other"
        ],

        "dynamic_drop_down_array" => ["project_id"], 
        "password_columns" => ["login_password"], 
        "title_columns" => ["name"], 
        "date_columns" => ["regdate"],
        "datetime_columns" => ["last_seen"],

        "rename_cols_array" => [ 
            "name" => "Full Name",
            "email" => "Email Address",
            "tel" => "Phone Number",
            "user_no" => "User Number",
            "user_pic" => "Profile Picture",
            "user_gender" => "Gender",
            "about" => "About User",
            "regdate" => "Registration Date",
            "last_seen" => "Last Seen",
            "auth_token" => "Auth Token",
            "token_status" => "Token Status",
            "token_expiring_in" => "Token Expiry (mins)"
        ],

        "rename_tables_array" => [
            "system_users" => "System Users"
        ],

        "new_label_buttons_arr" => [ 
            "system_users" => "user-plus:New User:{`System user profile / \${system_usersNode?.name}`} "
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:50%;"
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
        "custom_query_line_cols" => [], 
        "custom_multi_grid_rows" => [
          "auth_sessions"=>[
             "table"=>"system_users",
             "link"=>"auth_list",
             "query"=>"user_id='{{user_id}}' AND token_status='active'",
             "title"=>"Active Sessions",
             "columns"=>["auth_token","token_status","token_expiring_in","last_seen"],
          ]
          
        ], 
        "custom_profile_col_data" => [], 
        "custom_profile_default_data" => [],
        "connection_cols" => [ 
           //"project_id" => "projects:project_id:project_name:apiRoutes.projects.base"
        ]
    ]
  
  ];

  /// button you want on the list page
  $list_btn_table_array=[

    $primary_table__=>[
       //"refresh: Sync Users "=>"syncSystemUsers()",
       //"upload: Import Users "=>"uploadSystemUsers()"
    ],  
  ];


  /// buttons you want on the profile /form page
  $profile_btn_table_array=[

    $primary_table__=>[
       // "sms: Send SMS "=>"sendUserSMS()"
    ],

  ];


  //// on each row you add more actions eg, view sessions, reset password
  $global_new_drop_down_link_arr=[

      $primary_table__=>[
         //"eye: View Sessions"=>"viewUserSessions()",
         //"key: Reset Password"=>"resetUserPassword()"
    ],
  ];


  ///append mini list for interlinked data eg sessions
  $interlink_lists=[
   /*"relatedSessions"=>[ 
     "filter_str"=>"user_id='\${usersNode?.user_id}'",
     "module_name"=>"Authsessions",
     "list_title"=>"User Sessions",
     "event_name"=>"InteprateSystemusersEvent",
     "event_path"=>"../../systemusers/dataControl/SystemusersRequestHandler",     
     "module_path"=>"../../systemusers/uiControl/SystemusersList",     
     "list_url"=>"../systemusers/list",
     "profile_url"=>"../systemusers/profile",
   ]*/
   
  ];
   
  ///append mini profile for interlinked data
  $interlink_profile=[

   /*"linkedProject"=>[ 
     "filter_str"=>"project_id='{usersNode?.project_id}'",
     "module_name"=>"Projects",
     "profile_title"=>"Related Project",
     "event_name"=>"InteprateProjectsEvent",
     "event_path"=>"../../projects/dataControl/ProjectsRequestHandler",     
     "list_table_name"=>"projects",
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
