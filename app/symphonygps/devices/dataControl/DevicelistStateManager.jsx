
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultDevicelistStateDefaults = {

  //state management for list page
  devicelistListData : [],
  devicelistListPageCount : 1,
  devicelistLoading: true,  
  parentUseEffectKey : 'loadDevicelistList',
  localEventSignature: 'loadDevicelistList',
  devicelistQuerySearchStr: '',

  
  //for profile page
  device_listNode : {},
  devicelistActionStatus : 'add_device_list',
  paramdevicelistUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  devicelistUptoken:'',
  devicelistNode : {},
  activeScrollId : 'DevicelistProfileTray',
  
  //dataScript
  devicelistCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useDevicelistState(overrides = {}) {
  const combinedDefaults = { ...defaultDevicelistStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

