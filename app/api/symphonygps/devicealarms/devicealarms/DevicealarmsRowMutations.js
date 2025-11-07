
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Devicealarms 
export const DevicealarmsRowMutations = {

  //dope  _sites_site_name_site_name column to the response
  _sites_site_name_site_name : async (row)=>{

    const data_res = await mosyQddata("sites", "record_id", row.site_name);
    return data_res?.site_name ?? row.site_name;

  },

  //dope  _device_list_device_name_device_id column to the response
  _device_list_device_name_device_id : async (row)=>{

    const data_res = await mosyQddata("device_list", "record_id", row.device_id);
    return data_res?.device_name ?? row.device_id;

  }
}
