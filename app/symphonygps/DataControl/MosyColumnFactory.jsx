const MosyColumnFactory = {

   //-- asset_alarms cols--//
  asset_alarms: ["record_id", "alarm_type", "alarm_time", "device_serial", "site_id", "ack_status", "status", "description", "ack_by", "close_status", "reg_date", "hive_site_id", "hive_site_name", "closed_by", "ack_time", "close_time"],

   //-- device_list cols--//
  device_list: ["record_id", "device_name", "date_installed", "serial_number", "remark", "reg_date", "hive_site_id", "hive_site_name", "geofence", "site_id", "site_name", "low_battery_level"],

   //-- device_pings cols--//
  device_pings: ["record_id", "device_id", "ping_time", "signal_strength", "battery_level", "remark", "status", "created_at", "hive_site_id", "hive_site_name"],

   //-- gps_logs cols--//
  gps_logs: ["record_id", "log_type", "site_name", "device_id", "battery", "latitude", "longitude", "log_details", "speed", "remark", "timestamp", "created_at", "hive_site_id", "hive_site_name"],

   //-- page_manifest_ cols--//
  page_manifest_: ["manikey", "page_group", "site_id", "page_url", "hive_site_id", "hive_site_name", "project_id", "project_name"],

   //-- sites cols--//
  sites: ["record_id", "site_name", "site_code", "country", "city", "county", "town", "latitude", "longitude", "location_address", "remark", "created_at", "hive_site_id", "hive_site_name", "manager", "manager_mobile", "manager_email", "contact_person", "contact_person_mobile", "contact_person_email", "company_security_manager", "company_security_contacts", "vendor_contact_person", "vendor_contacts", "response_team_contact_person", "response_team_contacts", "crew_commander_contact_person", "crew_commander_contacts", "vehicle_reg_number", "alternate_phone_number"],

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