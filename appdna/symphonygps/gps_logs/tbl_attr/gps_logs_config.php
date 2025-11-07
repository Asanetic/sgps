<?php
////1. gps_logs

//"primkey" , "record_id" , "log_type" , "site_name" , "device_id" , "battery" , "latitude" , "longitude" , "log_details" , "speed" , "remark" , "timestamp" , "created_at" , "hive_site_id" , "hive_site_name" , <br><br>

//{{table_cols_head}}

/// A.I. NOTES :  please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable 

// =========================
// Core definitions
// =========================
$primary_table__ = "gps_logs";
$__page_title = "Device GPS Logs";

$core_module_configs_ = [

  //important
  "primary_table" => $primary_table__,
  "table_alias" => "gpslogs",
  "primary_key" => "primkey",
  "record_id" => "record_id",
  "main_page_title" => $__page_title,
  "api_endpoint_name" => "gpslogsreport",
  "multigrid_col_span" => "9"
];

// =========================
// UI Blueprint
// =========================
$novanest_module_ui_blueprint_ = [

  // =========================
  // Database schema section
  // =========================
  "db_schema" => [
    "custom_tbl_cols" => [],
    "custom_profile_default_data" => [],
    "custom_next_js_query_line_cols" => []
  ],

  // =========================
  // UI schema section
  // =========================
  "page_layout" => [
    "desired_column_order" => [
      "gps_logs" => [
        "primkey", "record_id", "log_type", "site_name", "device_id", "battery",
        "latitude", "longitude", "speed", "remark", "timestamp", "created_at"
      ]
    ],

    "form_input_segmentation_arr" => [
      "gps_logs" => [
        "Log Details" => [
          "log_type", "site_name", "device_id", "battery", "latitude",
          "longitude", "speed", "remark"
        ]
      ]
    ],

    "image_columns" => [],
    "default_col_class" => "col-md-6",
    "hidden_inputs" => [],
    "print_tables" => ["gps_logs"],
    "skip_cols_profile" => ["hive_site_id", "hive_site_name"],
    "skip_cols_list" => ["hive_site_id", "hive_site_name"],
    "running_bal_col_tbl" => [],
    "grid_tbl" => [],
    "view_tbl_only" => [],
    "sum_cols_list" => [],
    "textarea_array" => ["log_details", "remark"],
    "content_editable" => [],

    "static_drop_down_array" => [
      //"log_type" => "Position Update,Battery Report,Speed Alert,Geofence Alert"
    ],

    "dynamic_drop_down_array" => [],
    "password_columns" => [],
    "title_columns" => ["device_id"],
    "date_columns" => ["timestamp", "created_at"],
    "datetime_columns" => ["timestamp", "created_at"],

    "rename_cols_array" => [
      "record_id" => "Log Record ID",
      "log_type" => "Log Type",
      "site_name" => "Site Name",
      "device_id" => "Device ID",
      "battery" => "Battery Level",
      "latitude" => "Latitude (Y)",
      "longitude" => "Longitude (X)",
      "log_details" => "Log Details",
      "speed" => "Speed (km/h)",
      "remark" => "Remark",
      "timestamp" => "Log Time",
      "created_at" => "Created At"
    ],

    "rename_tables_array" => [
      "gps_logs" => "GPS Logs"
    ],

    "new_label_buttons_arr" => [
      "gps_logs" => "map-marker:New Log Entry:{`GPS Log / \${gps_logsNode?.record_id}`}"
    ],

    "profile_pic_style" => "width:80px; height:80px; border-radius:10%;"
  ],

  // =========================
  // Behaviour schema section
  // =========================
  "data_behaviour" => [
    "custom_query_line_cols" => [],
    "custom_multi_grid_rows" => [],
    "custom_profile_col_data" => [],
    "custom_profile_default_data" => [],
    "connection_cols" => [
      "site_name" => "sites:record_id:site_name:apiRoutes.registeredsites.base",
      "device_id" => "device_list:record_id:device_name:apiRoutes.devicelist.base"

    ]
  ]
];

// =========================
// Buttons & Actions
// =========================
$list_btn_table_array = [
  $primary_table__ => [
    //"refresh: Sync Logs" => "syncGPSLogsData()"
  ],
];

$profile_btn_table_array = [
  $primary_table__ => [
    //"map: View Location" => "viewGPSLogMap()"
  ],
];

$global_new_drop_down_link_arr = [
  $primary_table__ => [
    //"globe: View Route" => "viewDeviceRoute()"
  ],
];

$interlink_lists = [];
$interlink_profile = [];
$customProfileData = "{}";

// =========================
// Basic Template Setup
// =========================
$override_def_col_size = "col-md-6 hive_data_cell";
$override_segmentation_section_class = "col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section";
$additional_details_segment_title = "";
$col_size_def = 'col-md-12';
$def_profile_container_class = "col-md-12 rounded text-left p-2 mb-0  bg-white ";
$def_profile_inner_container_class = '` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`';
$override_justify_class = "justify-content-start";
$overide_img_section_class = "col-md-6 mr-lg-5";
$override_large_col_size = "col-md-12 hive_data_cell";
$image_style_ = "rounded_avatar";
?>
