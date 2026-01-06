
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Devicelist 
export const DevicelistRowMutations = {

  //dope  _sites_site_name_site_id column to the response
  _sites_site_name_site_id : async (row)=>{

    const data_res = await mosyQddata("sites", "record_id", row.site_id);
    return data_res?.site_name ?? row.site_id;

  },

  
  //dope device_logs column to the response              
  device_logs: async (row, {startDate, endDate}={}) => {
  
    const hasStart = startDate !== undefined && startDate !== "";
    const hasEnd   = endDate   !== undefined && endDate   !== "";

    console.log(`device log request data has ${hasEnd} has start ${hasStart}`, startDate, endDate);

    if (hasStart && hasEnd) {
  
      const formatDate = (v) =>
        v ? v.replace("T", " ") + ":00" : "";
  
      const start = formatDate(startDate);
      const end   = formatDate(endDate);
  
      const data_res = await mosyFlexQuickSel(
        "gps_logs",
        "timestamp, log_type, latitude, longitude, battery, remark",
        `
          where device_id='${row?.record_id}'
          and latitude!=''
          and longitude!=''
          and timestamp BETWEEN '${start}' AND '${end}'
          order by primkey desc
          limit 300
        `
      );
  
      return data_res;
    }
  
    // fallback — latest 10
    const data_res = await mosyFlexQuickSel(
      "gps_logs",
      "timestamp, log_type, latitude, longitude, battery, remark",
      `
        where device_id='${row?.record_id}'
        and latitude!=''
        and longitude!=''
        order by primkey desc
        limit 300
      `
    );
  
    return data_res;
  }
  

  
}
