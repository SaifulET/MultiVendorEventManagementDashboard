import { useState } from "react";
import { LuPenLine } from "react-icons/lu";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profilePic, setProfilePic] = useState("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop");

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-6 mt-6">
      <div className="w-full  bg-white rounded-xl border border-1 border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#B74140] p-6">
          <h1 className="text-white text-2xl font-bold">Profile</h1>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center mt-12">
          <div className="relative">
            <img
              src={profilePic}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
              <label htmlFor="profilePicUpload" className="cursor-pointer">
                <LuPenLine className="w-5 h-5 text-gray-600" />
              </label>
              <input
                type="file"
                id="profilePicUpload"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePicChange}
              />
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="text-center mt-4">
          <h2 className="text-2xl font-semibold text-gray-800">Mr. Admin</h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-8 mt-6 border-b">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "profile"
                ? "text-[#B74140] border-b-2 border-[#B74140]"
                : "text-gray-500"
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "password"
                ? "text-[#B74140] border-b-2 border-[#B74140]"
                : "text-gray-500"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "profile" ? (
            <EditProfileTab />
          ) : (
            <ChangePasswordTab />
          )}
        </div>
      </div>
    </div>
  );
}

function EditProfileTab() {
  const [formData, setFormData] = useState({
    username: "userdemo",
    email: "email@gmail.com",
    contact: "+1 222 333 4444"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          User Name
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B74140] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B74140] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Contact No
        </label>
        <input
          type="tel"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B74140] focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#B74140] text-white py-3 rounded-md font-medium hover:bg-[#A03736] transition-colors"
      >
        Update Profile
      </button>
    </form>
  );
}

function ChangePasswordTab() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password updated");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Current Password
        </label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="*******"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B74140] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          New Password
        </label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="*******"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B74140] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="*******"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B74140] focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#B74140] text-white py-3 rounded-md font-medium hover:bg-[#A03736] transition-colors"
      >
        Update Password
      </button>
    </form>
  );
}

export default ProfilePage;