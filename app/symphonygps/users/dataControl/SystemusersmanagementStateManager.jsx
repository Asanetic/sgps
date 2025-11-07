
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultSystemusersmanagementStateDefaults = {

  //state management for list page
  systemusersmanagementListData : [],
  systemusersmanagementListPageCount : 1,
  systemusersmanagementLoading: true,  
  parentUseEffectKey : 'loadSystemusersmanagementList',
  localEventSignature: 'loadSystemusersmanagementList',
  systemusersmanagementQuerySearchStr: '',

  
  //for profile page
  system_usersNode : {},
  systemusersmanagementActionStatus : 'add_system_users',
  paramsystemusersmanagementUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  systemusersmanagementUptoken:'',
  systemusersmanagementNode : {},
  activeScrollId : 'SystemusersmanagementProfileTray',
  
  //dataScript
  systemusersmanagementCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useSystemusersmanagementState(overrides = {}) {
  const combinedDefaults = { ...defaultSystemusersmanagementStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

