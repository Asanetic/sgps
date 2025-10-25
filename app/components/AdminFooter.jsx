import DynamicModalProvider from "./DynamicModalProvider";

import {FloatingUpgradeButton} from '../mosybilling/PremuimBtn';

export default function AdminFooter() {
  return (
    <>
      {/* DOM targets */}
      <div id="snack_box"></div>
      <div id="ajax_snack_id"></div>
      <div id="dialog_box"></div>
      <div id="ajax_snack"></div>
      <div id="alert_box"></div>
      <div id="magic_alert"></div>
      <DynamicModalProvider />
      <FloatingUpgradeButton/>


    </>
  );
}
