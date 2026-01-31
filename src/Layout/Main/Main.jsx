import React, { useState } from "react";
import { Outlet,  } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Drawer } from "antd";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Bell } from "lucide-react";
import Header from "../../Components/Sidebar/Header";

const MainLayout = () => {
  const onClose = () => setOpen(false);
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const showDrawer = () => setOpen(true);
  const toggleNotificationDropdown = () =>
    setShowNotifications(!showNotifications);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 z-10 hidden h-full shadow-md w-72 lg:block">
        <Sidebar />
      </div>

      {/* Drawer for Mobile */}
      <Drawer placement="left" onClose={onClose} open={open} width={250}>
        <Sidebar />
      </Drawer>

      {/* Main Content Wrapper */}
      <div className="flex flex-col flex-1 h-full lg:ml-72">
        {/* Styled Header */}
        <div className="fixed left-0 z-20 px-[32px] rounded-lg bg-gray-50 subtract-width lg:ml-72">
          <Header
            showDrawer={showDrawer}
            toggleNotificationDropdown={toggleNotificationDropdown}
          />
        </div>

        {/* Scrollable Outlet Section */}
        <div className="flex-1 p-[32px] overflow-y-auto  bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
