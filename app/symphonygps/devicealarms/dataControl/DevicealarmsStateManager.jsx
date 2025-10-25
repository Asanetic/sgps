
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultDevicealarmsStateDefaults = {

  //state management for list page
  devicealarmsListData : [],
  devicealarmsListPageCount : 1,
  devicealarmsLoading: true,  
  parentUseEffectKey : 'loadDevicealarmsList',
  localEventSignature: 'loadDevicealarmsList',
  devicealarmsQuerySearchStr: '',

  
  //for profile page
  gps_logsNode : {},
  devicealarmsActionStatus : 'add_gps_logs',
  paramdevicealarmsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  devicealarmsUptoken:'',
  devicealarmsNode : {},
  activeScrollId : 'DevicealarmsProfileTray',
  
  //dataScript
  devicealarmsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useDevicealarmsState(overrides = {}) {
  const combinedDefaults = { ...defaultDevicealarmsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

