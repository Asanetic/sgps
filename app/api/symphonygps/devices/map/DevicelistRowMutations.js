
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Devicelist 
export const DevicelistRowMutations = {

  //dope  _sites_site_name_site_id column to the response
  _sites_site_name_site_id : async (row)=>{

    const data_res = await mosyQddata("sites", "record_id", row.site_id);
    return data_res?.site_name ?? row.site_id;

  },

  
  //dope device_logs column to the response              
  device_logs: async (row) => {

    const data_res = await mosyFlexQuickSel('gps_logs', `timestamp, log_type, latitude, longitude,battery, remark`, `where device_id ='${row?.record_id}' order  by primkey desc limit 100 `);;

    return data_res;

  }
}
