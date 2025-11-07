-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 23, 2025 at 12:57 PM
-- Server version: 5.6.24
-- PHP Version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `authmaster`
--

-- --------------------------------------------------------

--
-- Table structure for table `page_manifest_`
--

CREATE TABLE IF NOT EXISTS `page_manifest_` (
  `primkey` int(255) NOT NULL,
  `manikey` varchar(500) NOT NULL,
  `page_group` varchar(500) NOT NULL,
  `site_id` varchar(500) NOT NULL,
  `page_url` varchar(500) NOT NULL,
  `hive_site_id` varchar(500) NOT NULL,
  `hive_site_name` varchar(500) NOT NULL,
  `project_id` varchar(500) NOT NULL,
  `project_name` varchar(500) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `page_manifest_`
--

INSERT INTO `page_manifest_` (`primkey`, `manikey`, `page_group`, `site_id`, `page_url`, `hive_site_id`, `hive_site_name`, `project_id`, `project_name`) VALUES
(1, 'appdna', 'Mpesa', '', 'appdna', '', '', '', ''),
(2, 'disbursmentwebhook', 'Mpesa', '', 'disbursmentwebhook', '', '', '', ''),
(3, 'initrecon', 'Mpesa', '', 'initrecon', '', '', '', ''),
(4, 'mosy_paginate', 'Mpesa', '', 'mosy_paginate', '', '', '', ''),
(5, 'mpesacollections_list', 'Mpesa', '', 'mpesacollections_list', '', '', '', ''),
(6, 'mpesacollections_profile', 'Mpesa', '', 'mpesacollections_profile', '', '', '', ''),
(7, 'overall_user_functions_list', 'Mpesa', '', 'overall_user_functions_list', '', '', '', ''),
(8, 'paymentwebhook', 'Mpesa', '', 'paymentwebhook', '', '', '', ''),
(9, 'reconciliations_list', 'Mpesa', '', 'reconciliations_list', '', '', '', ''),
(10, 'reconciliations_profile', 'Mpesa', '', 'reconciliations_profile', '', '', '', ''),
(11, 'role_functions_list', 'Mpesa', '', 'role_functions_list', '', '', '', ''),
(12, 'role_functions_profile', 'Mpesa', '', 'role_functions_profile', '', '', '', ''),
(13, 'sysconfigs_list', 'Mpesa', '', 'sysconfigs_list', '', '', '', ''),
(14, 'sysconfigs_profile', 'Mpesa', '', 'sysconfigs_profile', '', '', '', ''),
(15, 'system_role_bundles_list', 'User role management', '', 'system_role_bundles_list', '', '', '', ''),
(16, 'system_role_bundles_profile', 'User role management', '', 'system_role_bundles_profile', '', '', '', ''),
(17, 'system_users_list', 'Mpesa', '', 'system_users_list', '', '', '', ''),
(18, 'system_users_profile', 'Mpesa', '', 'system_users_profile', '', '', '', ''),
(19, 'system_users_w_roles_list', 'Mpesa', '', 'system_users_w_roles_list', '', '', '', ''),
(20, 'system_users_w_roles_profile', 'Mpesa', '', 'system_users_w_roles_profile', '', '', '', ''),
(21, 'trxrecon', 'Mpesa', '', 'trxrecon', '', '', '', ''),
(22, 'acc_control', 'User roles', '', 'acc_control', '', '', '', ''),
(23, 'bundle_functions_list', 'User roles', '', 'bundle_functions_list', '', '', '', ''),
(24, 'bundle_functions_profile', 'User roles', '', 'bundle_functions_profile', '', '', '', ''),
(25, 'login', 'User roles', '', 'login', '', '', '', ''),
(26, 'register', 'User roles', '', 'register', '', '', '', ''),
(27, 'resetpassword', 'User roles', '', 'resetpassword', '', '', '', ''),
(28, 'saconfig', 'User roles', '', 'saconfig', '', '', '', ''),
(29, 'sasplash', 'User roles', '', 'sasplash', '', '', '', ''),
(30, 'sauth_oauth', 'User roles', '', 'sauth_oauth', '', '', '', ''),
(31, 'sauth_sessionlogout', 'User roles', '', 'sauth_sessionlogout', '', '', '', ''),
(32, 'sauth_sessionmonitor', 'User roles', '', 'sauth_sessionmonitor', '', '', '', ''),
(33, 'sa_access', 'User roles', '', 'sa_access', '', '', '', ''),
(34, 'superadmin_acc_control', 'User roles', '', 'superadmin_acc_control', '', '', '', ''),
(35, 'userdenied', 'Basic pages', '', 'userdenied', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `system_role_bundles`
--

CREATE TABLE IF NOT EXISTS `system_role_bundles` (
  `primkey` int(255) NOT NULL,
  `record_id` varchar(500) NOT NULL,
  `bundle_id` varchar(500) NOT NULL,
  `bundle_name` varchar(500) NOT NULL,
  `remark` blob NOT NULL,
  `hive_site_id` varchar(500) NOT NULL,
  `hive_site_name` varchar(500) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `system_role_bundles`
--

INSERT INTO `system_role_bundles` (`primkey`, `record_id`, `bundle_id`, `bundle_name`, `remark`, `hive_site_id`, `hive_site_name`) VALUES
(1, 'GPEEEE0', '5PT77YI2YB', 'Super user', '', '', ''),
(2, 'SAKKRGH', 'ZHQBB44RD1', 'Mpesa user', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `system_users`
--

CREATE TABLE IF NOT EXISTS `system_users` (
  `primkey` int(255) NOT NULL,
  `user_id` varchar(500) NOT NULL,
  `name` varchar(500) NOT NULL,
  `email` varchar(500) NOT NULL,
  `tel` varchar(500) NOT NULL,
  `login_password` varchar(500) NOT NULL,
  `ref_id` varchar(500) NOT NULL,
  `regdate` datetime NOT NULL,
  `user_no` varchar(500) NOT NULL,
  `user_pic` varchar(500) NOT NULL,
  `user_gender` varchar(500) NOT NULL,
  `last_seen` varchar(500) NOT NULL,
  `about` blob NOT NULL,
  `hive_site_id` varchar(500) NOT NULL,
  `hive_site_name` varchar(500) NOT NULL,
  `auth_token` varchar(500) NOT NULL,
  `token_status` varchar(500) NOT NULL,
  `token_expiring_in` varchar(500) NOT NULL,
  `project_id` varchar(500) NOT NULL,
  `project_name` varchar(500) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `system_users`
--

INSERT INTO `system_users` (`primkey`, `user_id`, `name`, `email`, `tel`, `login_password`, `ref_id`, `regdate`, `user_no`, `user_pic`, `user_gender`, `last_seen`, `about`, `hive_site_id`, `hive_site_name`, `auth_token`, `token_status`, `token_expiring_in`, `project_id`, `project_name`) VALUES
(1, '1FN4ZHN', 'Superadmin', 'superadmin', '', 'admin001', 'ZH1OA9PUWQ', '2024-12-28 19:45:56', '', 'img/system_users_user_pic/log-bg_SVGLD.jpg', '', '', '', 'LLRR0ZKOXRTCOHN_2024-12-28-07-45-56-pm', 'Superadmin', '08ZQCN6TVG02X3LPBJJGGAWJ49COOYV2ZC5FDV9ZPJRHASR40LVL6G66MAAJRL9WCCP0SZP2WIWS1DBE1JMM9HUOJ6L9630M37MGKYKZHCEY6T9JHCPIQEV1SYBV0H477XWSQTRTG1A0O4KLA079L69AFLDC7QMOOKKZ9JDHSM', 'Active', '2025-03-18 16:42:55', '', ''),
(2, '4GMRQ72', 'Levy Levy', 'jereasanya@gmail.com', '0710766390', 'alex', '4WNDB69H58', '2025-01-02 13:51:36', '', 'img/system_users_user_pic/avatar-11_D2YMF.jpg', '', '', '', '', '', 'YM1VA8EFIU8E77XBHIA2WHO6LCYM4TETL4XRMYUX9KZA4NPABGVWFNTMJIDE8PVQMH6JBKNBD530FZV4J9UMBPBYUJ63PHQI1QU6E2UKVMLM36EV4Y67KM75IFCNK4Y6TVUPUEEPRZG449BG3IVO7FG7K8W2SMJPYV83NNCPZ6', 'Active', '2025-03-13 17:44:56', '', ''),
(3, 'NCPLHWZ', 'Jeremiah Alex mgr', 'jerrymgr', '0710766390', 'admin001', 'SHZMXAWFO0', '2025-03-12 07:31:16', '', '', '', '', '', '', '', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `user_bundle_role_functions`
--

CREATE TABLE IF NOT EXISTS `user_bundle_role_functions` (
  `primkey` int(255) NOT NULL,
  `record_id` varchar(500) NOT NULL,
  `bundle_id` varchar(500) NOT NULL,
  `bundle_name` varchar(500) NOT NULL,
  `role_id` varchar(500) NOT NULL,
  `role_name` varchar(500) NOT NULL,
  `remark` blob NOT NULL,
  `hive_site_id` varchar(500) NOT NULL,
  `hive_site_name` varchar(500) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_bundle_role_functions`
--

INSERT INTO `user_bundle_role_functions` (`primkey`, `record_id`, `bundle_id`, `bundle_name`, `role_id`, `role_name`, `remark`, `hive_site_id`, `hive_site_name`) VALUES
(1, 'RHZGTZE', '5PT77YI2YB', 'Accountant', 'Basic pages', '', '', '', ''),
(2, 'T5D609X', '5PT77YI2YB', 'Accountant', 'User roles', '', '', '', ''),
(3, 'G6C5BJX', '5PT77YI2YB', 'Accountant', 'Mpesa', '', '', '', ''),
(4, 'NYZME5V', '5PT77YI2YB', 'Accountant', 'User role management', '', '', '', ''),
(5, '5W1VI8J', 'ZHQBB44RD1', 'Mpesa user', 'Mpesa', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `user_manifest_`
--

CREATE TABLE IF NOT EXISTS `user_manifest_` (
  `primkey` int(255) NOT NULL,
  `admin_mkey` varchar(500) NOT NULL,
  `user_id` varchar(500) NOT NULL,
  `user_name` varchar(500) NOT NULL,
  `role_id` varchar(500) NOT NULL,
  `site_id` varchar(500) NOT NULL,
  `role_name` varchar(500) NOT NULL,
  `hive_site_id` varchar(500) NOT NULL,
  `hive_site_name` varchar(500) NOT NULL,
  `project_id` varchar(500) NOT NULL,
  `project_name` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `page_manifest_`
--
ALTER TABLE `page_manifest_`
  ADD PRIMARY KEY (`primkey`);

--
-- Indexes for table `system_role_bundles`
--
ALTER TABLE `system_role_bundles`
  ADD PRIMARY KEY (`primkey`);

--
-- Indexes for table `system_users`
--
ALTER TABLE `system_users`
  ADD PRIMARY KEY (`primkey`);

--
-- Indexes for table `user_bundle_role_functions`
--
ALTER TABLE `user_bundle_role_functions`
  ADD PRIMARY KEY (`primkey`);

--
-- Indexes for table `user_manifest_`
--
ALTER TABLE `user_manifest_`
  ADD PRIMARY KEY (`primkey`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `page_manifest_`
--
ALTER TABLE `page_manifest_`
  MODIFY `primkey` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=36;
--
-- AUTO_INCREMENT for table `system_role_bundles`
--
ALTER TABLE `system_role_bundles`
  MODIFY `primkey` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `system_users`
--
ALTER TABLE `system_users`
  MODIFY `primkey` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `user_bundle_role_functions`
--
ALTER TABLE `user_bundle_role_functions`
  MODIFY `primkey` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `user_manifest_`
--
ALTER TABLE `user_manifest_`
  MODIFY `primkey` int(255) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
