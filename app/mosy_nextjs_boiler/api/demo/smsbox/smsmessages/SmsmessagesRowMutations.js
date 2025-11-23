
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Smsmessages 
export const SmsmessagesRowMutations = {

  
  //dope delivery_receipt column to the response              
  delivery_receipt: async (row) => {

    const data_res = {};

    return row?.delivery_report;

  }
}
