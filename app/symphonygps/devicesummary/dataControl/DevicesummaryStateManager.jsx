
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultDevicesummaryStateDefaults = {

  //state management for list page
  devicesummaryListData : [],
  devicesummaryListPageCount : 1,
  devicesummaryLoading: true,  
  parentUseEffectKey : 'loadDevicesummaryList',
  localEventSignature: 'loadDevicesummaryList',
  devicesummaryQuerySearchStr: '',

  
  //for profile page
  device_listNode : {},
  devicesummaryActionStatus : 'add_device_list',
  paramdevicesummaryUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  devicesummaryUptoken:'',
  devicesummaryNode : {},
  activeScrollId : 'DevicesummaryProfileTray',
  
  //dataScript
  devicesummaryCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useDevicesummaryState(overrides = {}) {
  const combinedDefaults = { ...defaultDevicesummaryStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

