
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Assetalarms 
export const AssetalarmsRowMutations = {

  //dope  _sites_site_name_site_id column to the response
  _sites_site_name_site_id : async (row)=>{

    const data_res = await mosyQddata("sites", "record_id", row.site_id);
    return data_res?.site_name ?? row.site_id;

  },

  
  //dope device_key column to the response              
  device_key: async (row) => {

    const data_res = await mosyQddata('device_list', `serial_number`, `${row?.device_serial}`);;

    return data_res?.primkey;

  },

  
  //dope device_name column to the response              
  device_name: async (row) => {

    const data_res = await mosyQddata('device_list', `serial_number`, `${row?.device_serial}`);;

    return data_res?.device_name;

  }
}
