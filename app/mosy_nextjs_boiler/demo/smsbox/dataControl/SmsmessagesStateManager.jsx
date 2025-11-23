
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultSmsmessagesStateDefaults = {

  //state management for list page
  smsmessagesListData : [],
  smsmessagesListPageCount : 1,
  smsmessagesLoading: true,  
  parentUseEffectKey : 'loadSmsmessagesList',
  localEventSignature: 'loadSmsmessagesList',
  smsmessagesQuerySearchStr: '',

  
  //for profile page
  smsNode : {},
  smsmessagesActionStatus : 'add_sms',
  paramsmsmessagesUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  smsmessagesUptoken:'',
  smsmessagesNode : {},
  activeScrollId : 'SmsmessagesProfileTray',
  
  //dataScript
  smsmessagesCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useSmsmessagesState(overrides = {}) {
  const combinedDefaults = { ...defaultSmsmessagesStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

