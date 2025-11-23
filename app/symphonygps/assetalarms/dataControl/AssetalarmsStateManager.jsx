
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultAssetalarmsStateDefaults = {

  //state management for list page
  assetalarmsListData : [],
  assetalarmsListPageCount : 1,
  assetalarmsLoading: true,  
  parentUseEffectKey : 'loadAssetalarmsList',
  localEventSignature: 'loadAssetalarmsList',
  assetalarmsQuerySearchStr: '',

  
  //for profile page
  asset_alarmsNode : {},
  assetalarmsActionStatus : 'add_asset_alarms',
  paramassetalarmsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  assetalarmsUptoken:'',
  assetalarmsNode : {},
  activeScrollId : 'AssetalarmsProfileTray',
  
  //dataScript
  assetalarmsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useAssetalarmsState(overrides = {}) {
  const combinedDefaults = { ...defaultAssetalarmsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

