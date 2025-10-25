const MosyColumnFactory = {

   //-- alarms cols--//
  alarms: ["record_id", "device_id", "alarm_type", "alarm_message", "triggered_at", "remark", "acknowledged", "created_at", "hive_site_id", "hive_site_name"],

   //-- device_list cols--//
  device_list: ["record_id", "device_name", "date_installed", "manufacture_date", "serial_number", "remark", "site_id", "site_name", "reg_date", "hive_site_id", "hive_site_name", "geofence"],

   //-- device_pings cols--//
  device_pings: ["record_id", "device_id", "ping_time", "signal_strength", "battery_level", "remark", "status", "created_at", "hive_site_id", "hive_site_name"],

   //-- gps_logs cols--//
  gps_logs: ["record_id", "log_type", "site_name", "device_id", "battery", "latitude", "longitude", "log_details", "speed", "remark", "timestamp", "created_at", "hive_site_id", "hive_site_name"],

   //-- page_manifest_ cols--//
  page_manifest_: ["manikey", "page_group", "site_id", "page_url", "hive_site_id", "hive_site_name", "project_id", "project_name"],

   //-- sites cols--//
  sites: ["record_id", "site_name", "country", "city", "county", "town", "building", "latitude", "longitude", "location_address", "remark", "created_at", "hive_site_id", "hive_site_name", "manager", "contact_person"],

   //-- system_role_bundles cols--//
  system_role_bundles: ["record_id", "bundle_id", "bundle_name", "remark", "hive_site_id", "hive_site_name"],

   //-- system_users cols--//
  system_users: ["user_id", "name", "email", "tel", "login_password", "ref_id", "regdate", "user_no", "user_pic", "user_gender", "last_seen", "about", "hive_site_id", "hive_site_name", "auth_token", "token_status", "token_expiring_in", "project_id", "project_name"],

   //-- user_bundle_role_functions cols--//
  user_bundle_role_functions: ["record_id", "bundle_id", "bundle_name", "role_id", "role_name", "remark", "hive_site_id", "hive_site_name"],

   //-- user_manifest_ cols--//
  user_manifest_: ["admin_mkey", "user_id", "user_name", "role_id", "site_id", "role_name", "hive_site_id", "hive_site_name", "project_id", "project_name"],


};
export default MosyColumnFactory;