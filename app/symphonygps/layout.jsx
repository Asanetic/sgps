import Image from 'next/image';
import userAvatarImg from '../img/useravatar.png'; // outside public!


import AdminNav from '../components/AdminNav';
import AdminFooter from '../components/AdminFooter';

import DashboardClientWrapper from './DashboardClientWrapper';
// app/layout.js

import appConfigs from '../appConfigs/mosyTheme'; // Theme config
import '../css/designer.css';
import MosyUiTheme from '../css/mosyUi.js';
import '../css/fonts.css';
import '../assets/css/font-awesome.min.css';
import '../assets/css/feathericon.min.css';
import '../assets/plugins/morris/morris.css';
import '../assets/css/style.css';

export default function DashboardLayout({ children }) {
  
  const appLogo = appConfigs.mosyAppLogo;
  const appName = appConfigs.mosyAppName;
  const userAvatar = userAvatarImg.src;
  
  console.log(" DashboardLayout LOADED: /nextinvoice/layout");

  return (
    <>
        <MosyUiTheme />
        <DashboardClientWrapper/>

        <AdminNav
        appName={appName}
        appLogo={appLogo}
        userAvatar={userAvatar}
        />
        {children}
        <AdminFooter />
          

    </>
  );
}
