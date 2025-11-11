
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Devicesummary 
export const DevicesummaryRowMutations = {

  //dope  _sites_site_name_site_id column to the response
  _sites_site_name_site_id : async (row)=>{

    const data_res = await mosyQddata("sites", "record_id", row.site_id);
    return data_res?.site_name ?? row.site_id;

  },

  
  //dope site_code column to the response              
  site_code: async (row) => {

    const data_res = await mosyQddata(`sites`, `record_id`, row.site_id);;

    return data_res?.site_code;

  },

  
  //dope installation_longitude column to the response              
  installation_longitude: async (row) => {

    const data_res = await mosyQddata(`sites`, `record_id`, row.site_id);;

    return data_res?.longitude;

  },

  
  //dope installation_latitude column to the response              
  installation_latitude: async (row) => {

    const data_res = await mosyQddata(`sites`, `record_id`, row.site_id);;

    return data_res?.latitude;

  }
}
