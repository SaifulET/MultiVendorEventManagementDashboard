import React from "react";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import useAuthStore from "../../store/useAuthStore";
import {
  DEFAULT_PROFILE_IMAGE,
  getProfileImageSrc,
} from "../../lib/profileImage";

const Header = ({ showDrawer }) => {
  const user = useAuthStore((state) => state.user);
  const profileImage = getProfileImageSrc(user, DEFAULT_PROFILE_IMAGE);

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
              Welcome, {user?.fullName || "Admin"}
            </h2>
            <p className="text-sm text-gray-500">Have a nice day!</p>
          </div>
        </div>

        {/* =============================Right Section============================= */}
        <div className="flex items-center gap-4">
          {/* Profile Icon */}
          <Link to="/settings/profile" >
          <div className="p-2 text-blue-700 transition border border-[#B74140] rounded-full hover:bg-blue-50">
            <img
              src={profileImage}
              alt="Admin"
              className="object-cover w-5 h-5 rounded-full"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = DEFAULT_PROFILE_IMAGE;
              }}
            />
          </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
