
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultRegisteredsitesStateDefaults = {

  //state management for list page
  registeredsitesListData : [],
  registeredsitesListPageCount : 1,
  registeredsitesLoading: true,  
  parentUseEffectKey : 'loadRegisteredsitesList',
  localEventSignature: 'loadRegisteredsitesList',
  registeredsitesQuerySearchStr: '',

  
  //for profile page
  sitesNode : {},
  registeredsitesActionStatus : 'add_sites',
  paramregisteredsitesUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  registeredsitesUptoken:'',
  registeredsitesNode : {},
  activeScrollId : 'RegisteredsitesProfileTray',
  
  //dataScript
  registeredsitesCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useRegisteredsitesState(overrides = {}) {
  const combinedDefaults = { ...defaultRegisteredsitesStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

