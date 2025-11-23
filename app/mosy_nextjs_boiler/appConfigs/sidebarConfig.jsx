// sidebarConfigTracking.js

export const sidebarConfig = [

  // Sites
  {
    type: "submenu",
    label: "Sites",
    icon: "fa fa-map-marker",
    roles: [],
    items: [
      { label: "Site map", href: (routes) => `${routes.cms}/maps/home`, roles: [] },
      { label: "Site list", href: (routes) => `${routes.cms}/gpssites/list`, roles: [] },
      { label: "Add Site", href: (routes) => `${routes.cms}/gpssites/profile`, roles: [] },
    ],
  },

  // Devices
  {
    type: "submenu",
    label: "Trackers",
    icon: "fa fa-microchip",
    roles: [],
    items: [
      { label: "Tracker map", href: (routes) => `${routes.cms}/maps/tracker`, roles: [] },
      { label: "Register Tracker", href: (routes) => `${routes.cms}/devices/profile`, roles: [] },
      { label: "Tracker list", href: (routes) => `${routes.cms}/devicesummary/list`, roles: [] },      
    ],
  },

  // GPS Logs
  { 
    type: "link", 
    label: "Gps logs", 
    icon: "fa fa-location-arrow", 
    href: (routes) => `${routes.cms}/gpslogs/list`, 
    roles: [] 
  },

  { 
    type: "link", 
    label: "Alarms", 
    icon: "fa fa-bell", 
    href: (routes) => `${routes.cms}/devicealarms/list`, 
    roles: [] 
  },

  // { 
  //   type: "link", 
  //   label: "Playback", 
  //   icon: "fa fa-play", 
  //   href: (routes) => `${routes.cms}/playback/devices`, 
  //   roles: [] 
  // },

  // { 
  //   type: "link", 
  //   label: "Realtime", 
  //   icon: "fa fa-bolt", 
  //   href: (routes) => `${routes.cms}/maps/home`, 
  //   roles: [] 
  // },

  // // Reports
  // {
  //   type: "submenu",
  //   label: "Reports",
  //   icon: "fa fa-bar-chart",
  //   roles: [],
  //   items: [
  //     { label: "Movement Reports", href: (routes) => `${routes.cms}/reports/movement`, roles: [] },
  //     { label: "Ping Reports", href: (routes) => `${routes.cms}/reports/pings`, roles: [] },
  //     { label: "Alarm Reports", href: (routes) => `${routes.cms}/reports/alarms`, roles: [] },
  //   ],
  // },
  { 
    type: "link", 
    label: "Device sim", 
    icon: "fa fa-bolt", 
    href: (routes) => `${routes.cms}/maps/devicesim`, 
    roles: [] 
  },
  // Account
  { 
    type: "link", 
    label: "Users", 
    icon: "fa fa-users", 
    href: (routes) => `${routes.cms}/users/list`, 
    roles: [] 
  },
];
