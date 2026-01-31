import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Bell, MessageSquareMore } from "lucide-react";
import adminImage from "../../assets/image/adminkickclick.jpg";

const Header = ({ showDrawer }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsCount] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();

  const adminProfile = {
    name: "James",
    role: "admin",
  };

  const notifications = [
    { message: "A new user joined your app.", time: "Fri, 12:30pm" },
    { message: "Profile report received.", time: "Fri, 12:30pm" },
    { message: "A new verification request.", time: "Fri, 12:30pm" },
    { message: "New comment on your post.", time: "Fri, 12:30pm" },
  ];

  const isMessagesActive = location.pathname === "/messages";

  return (
    <div className="relative mt-2">
      <div
       
        className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-md"
      >
        {/*============================= Left Section============================= */}
        <div className="flex items-center gap-4">
          <RxHamburgerMenu
            className="text-2xl text-blue-800 cursor-pointer lg:hidden"
            onClick={showDrawer}
          />
          <div>
            <h2 className="font-semibold text-gray-800 text-md">
              Welcome, {adminProfile.name}
            </h2>
            <p className="text-sm text-gray-500">Have a nice day!</p>
          </div>
        </div>

        {/* =============================Right Section============================= */}
        <div className="flex items-center gap-4">
          {/* Message Icon */}
          <Link
            to="/messages"
            className={`relative p-2 transition border rounded-full hover:bg-blue-50 ${
              isMessagesActive ? "bg-[#319FCA] text-white border-[#319FCA]" : "text-blue-700 border-[#319FCA]"
            }`}
          >
            <MessageSquareMore />
          </Link>

          {/* Notification Icon */}
          <button
            className="relative p-2 text-blue-700 transition border border-[#319FCA] rounded-full hover:bg-blue-50"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <IoMdNotificationsOutline className="text-xl" />
            {notificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-red-500 h-3 w-3 rounded-full border border-white"></span>
            )}
          </button>

          {/* Profile Icon */}
          <Link to="/settings/profile" >
          <div className="p-2 text-blue-700 transition border border-blue-500 rounded-full hover:bg-blue-50">
            <img
              src={adminImage}
              alt="Admin"
              className="object-cover w-5 h-5 rounded-full"
            />
          </div>
          </Link>
        </div>
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-4 top-[72px] z-50 p-4 bg-white rounded-md shadow-xl w-80">
          <h2 className="text-lg font-semibold text-center border-b pb-2 text-[#2c3e50]">
            Notifications
          </h2>

          <div className="mt-4 space-y-4">
            {notifications.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="bg-[#f1f5f9] p-2 rounded-md">
                  <Bell className="text-[#1e293b]" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1e293b]">
                    {item.message}
                  </p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setShowNotifications(false);
              navigate("/notifications");
            }}
            className="mt-6 w-full bg-[#71abe0] text-white py-2 rounded-md hover:bg-blue-400 transition duration-200"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
