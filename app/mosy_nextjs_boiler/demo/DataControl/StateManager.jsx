
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultStateDefaults = {

  //state management for list page
  ListData : [],
  ListPageCount : 1,
  Loading: true,  
  parentUseEffectKey : 'loadList',
  localEventSignature: 'loadList',
  QuerySearchStr: '',

  
  //for profile page
  user_manifest_Node : {},
  ActionStatus : 'add_user_manifest_',
  paramUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  Uptoken:'',
  Node : {},
  activeScrollId : 'ProfileTray',
  
  //dataScript
  CustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useState(overrides = {}) {
  const combinedDefaults = { ...defaultStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

