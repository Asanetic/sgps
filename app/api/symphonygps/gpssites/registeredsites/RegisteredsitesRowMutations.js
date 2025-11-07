
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Registeredsites 
export const RegisteredsitesRowMutations = {

  
  //dope total_devices column to the response              
  total_devices: async (row) => {

    const data_res = await mosyCountRows('device_list', `where site_id ='${row?.record_id}'`);;

    return data_res;

  },

  
  //dope device_list column to the response              
  device_list: async (row) => {

    const data_res =  await mosyFlexQuickSel('device_list', '*', `WHERE site_id='${row?.record_id}'`, 'l');

                  // Loop and append GPS logs to each device
                  for (let i = 0; i < data_res.length; i++) {
                    const device = data_res[i];
                    const gpsLogs = await mosyFlexQuickSel('gps_logs', '*', `WHERE device_id='${device.record_id}' limit 5`, 'l');

                    // Add logs into current device entry
                    data_res[i].gps_logs = gpsLogs;
                  };

    return data_res;

  }
}
