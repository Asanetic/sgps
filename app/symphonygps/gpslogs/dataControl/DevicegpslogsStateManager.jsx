
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultDevicegpslogsStateDefaults = {

  //state management for list page
  devicegpslogsListData : [],
  devicegpslogsListPageCount : 1,
  devicegpslogsLoading: true,  
  parentUseEffectKey : 'loadDevicegpslogsList',
  localEventSignature: 'loadDevicegpslogsList',
  devicegpslogsQuerySearchStr: '',

  
  //for profile page
  gps_logsNode : {},
  devicegpslogsActionStatus : 'add_gps_logs',
  paramdevicegpslogsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  devicegpslogsUptoken:'',
  devicegpslogsNode : {},
  activeScrollId : 'DevicegpslogsProfileTray',
  
  //dataScript
  devicegpslogsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useDevicegpslogsState(overrides = {}) {
  const combinedDefaults = { ...defaultDevicegpslogsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

