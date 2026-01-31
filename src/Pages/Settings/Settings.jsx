import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { MdPrivacyTip } from "react-icons/md";
import { RiTerminalWindowLine } from "react-icons/ri";

const Settings = () => {
  const subItems = [
    {
      icon: <CiUser className="w-5 h-5" />,
      label: "Change Password",
      link: "/settings/change-password",
    },
    {
      icon: <FaEdit className="w-5 h-5" />,
      label: "About Us",
      link: "/settings/about-us",
    },
    {
      icon: <MdPrivacyTip className="w-5 h-5" />,
      label: "Privacy Policy",
      link: "/settings/privacy-policy",
    },
    {
      icon: <RiTerminalWindowLine className="w-5 h-5" />,
      label: "Terms & Conditions",
      link: "/settings/terms-condition",
    },
    {
      icon: <RiTerminalWindowLine className="w-5 h-5" />,
      label: "Our Mission",
      link: "/settings/ourmission",
    },
    {
      icon: <RiTerminalWindowLine className="w-5 h-5" />,
      label: "Our Vision",
      link: "/settings/ourvision",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        
        className="border border-1 border-gray-200 mx-auto mt-20 rounded-md "
      >
        {/* Header */}
        <div className="px-6 py-8  bg-[#B74140] rounded-tl-md rounded-tr-md ">
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
        </div>

        {/* ==========================Menu Items ==========================*/}
        <div className="mx-4 mt-4">
          {subItems.map((item, index) => (
            <div key={index}>
              <Link to={item.link}>
                <div className="flex items-center justify-between w-full px-2 py-4 transition-colors hover:bg-gray-50">
                  <p className="text-xl font-medium">
                    {item.label}
                  </p>
                  <ChevronRight className="text-black size-6" />
                </div>
              </Link>
              {index < subItems.length - 1 && (
                <div className="border-2 border-b border-[#9D9FA2]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
