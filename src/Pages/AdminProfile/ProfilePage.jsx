import { useState } from "react";
import { LuPenLine } from "react-icons/lu";
import { Link } from "react-router-dom";
import EditProfile from "./EditProfile";
import ChangePass from "./ChangePass";
import Profile from "./Profile"; // ✅ Added missing import

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("/settings/profile");
  const [profilePic, setProfilePic] = useState(null);

  const getTabTitle = () => {
    switch (activeTab) {
      case "/settings/profile":
        return "Profile";
      case "/settings/editProfile":
        return "Edit Profile";
      case "/settings/changePassword":
        return "Change Password";
      default:
        return "";
    }
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div
        style={{ boxShadow: "0px 1px 6px 0px rgba(0, 0, 0, 0.24)" }}
        className="mx-auto mt-16"
      >
        {/* Header with title */}
        <div className="bg-[#71abe0] p-5 rounded-t-xl text-[#ffff]">
          <div>
            <Link to="/" className="px-10 text-3xl font-bold text-start">
              {getTabTitle()}
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mx-auto">
          {/* Profile Picture */}
          <div className="w-full">
            <div className="mt-10 ">
              <div className="w-[122px] relative h-[122px] mx-auto rounded-full border-4 shadow-xl flex justify-center items-center">
                <img
                  src={profilePic || ""}
                  alt="profile"
                  className="w-32 h-32 overflow-hidden rounded-full"
                />
                <div className="absolute right-0 p-2 rounded-full shadow-md cursor-pointer bottom-2">
                  <label htmlFor="profilePicUpload" className="cursor-pointer">
                    <LuPenLine />
                  </label>
                  <input
                    type="file"
                    id="profilePicUpload"
                    className="hidden"
                    onChange={handleProfilePicChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-center gap-5 my-5 font-semibold text-md md:text-xl">
            <p
              onClick={() => setActiveTab("/settings/profile")}
              className={`cursor-pointer pb-1 ${
                activeTab === "/settings/profile"
                  ? "border-b-2 border-[#319FCA] text-[#319FCA]"
                  : ""
              }`}
            >
              Profile
            </p>
            <p
              onClick={() => setActiveTab("/settings/editProfile")}
              className={`cursor-pointer pb-1 ${
                activeTab === "/settings/editProfile"
                  ? "border-b-2 border-[#319FCA] text-[#319FCA]"
                  : ""
              }`}
            >
              Edit Profile
            </p>
          </div>

          {/* Tab Content */}
          <div className="flex items-center justify-center p-5 rounded-md">
            <div className="w-full max-w-3xl">
              {activeTab === "/settings/profile" && (
                <Profile setActiveTab={setActiveTab} />
              )}
              {activeTab === "/settings/editProfile" && <EditProfile />}
              {activeTab === "/settings/changePassword" && <ChangePass />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
