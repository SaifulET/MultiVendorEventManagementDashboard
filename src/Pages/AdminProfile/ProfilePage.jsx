import { useEffect, useMemo, useState } from "react";
import { LuPenLine } from "react-icons/lu";
import useAuthStore from "../../store/useAuthStore";
import {
  changeAdminPassword,
  fetchAdminProfile,
  updateAdminProfile,
  uploadAdminProfileImage,
} from "../../lib/adminProfileApi";

const fallbackProfilePic = "/profile.jpg";

const pickProfileImage = (profile) =>
  profile?.profileImage ||
  profile?.profileImageUrl ||
  profile?.imageUrl ||
  profile?.image ||
  profile?.url ||
  profile?.avatar ||
  profile?.photo ||
  profile?.profilePicture ||
  fallbackProfilePic;

const getProfileFromResult = (result) =>
  result?.data?.user || result?.data?.admin || result?.data || {};

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [profilePic, setProfilePic] = useState(fallbackProfilePic);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const accessToken = useAuthStore((state) => state.accessToken);
  const storedUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const displayProfile = useMemo(
    () => profile || storedUser || {},
    [profile, storedUser]
  );

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!accessToken) {
        setError("Please sign in again to view your profile.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const result = await fetchAdminProfile(accessToken);
        const nextProfile = getProfileFromResult(result);

        if (!isMounted) return;

        setProfile(nextProfile);
        setUser(nextProfile);
        setProfilePic(pickProfileImage(nextProfile));
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load profile.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [accessToken, setUser]);

  const handleProfilePicChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file || !accessToken) return;

    const previewUrl = URL.createObjectURL(file);
    setProfilePic(previewUrl);
    setIsUploadingImage(true);
    setError("");
    setMessage("");

    try {
      const result = await uploadAdminProfileImage(accessToken, file);
      const uploadedProfile = getProfileFromResult(result);
      const nextProfile = {
        ...displayProfile,
        ...uploadedProfile,
      };

      setProfile(nextProfile);
      setUser(nextProfile);
      setProfilePic(pickProfileImage(nextProfile));
      setMessage(result?.message || "Profile image updated successfully.");
    } catch (err) {
      setProfilePic(pickProfileImage(displayProfile));
      setError(err.message || "Failed to upload profile image.");
    } finally {
      URL.revokeObjectURL(previewUrl);
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  return (
    <div className="min-h-screen py-6 mt-6 bg-gray-50">
      <div className="w-full overflow-hidden bg-white border border-gray-200 rounded-xl">
        <div className="bg-[#B74140] p-6">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
        </div>

        <div className="flex justify-center mt-12">
          <div className="relative">
            <img
              src={profilePic}
              alt="Profile"
              className="object-cover w-32 h-32 bg-gray-100 border-4 border-white rounded-full shadow-lg"
            />
            <div className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md">
              <label htmlFor="profilePicUpload" className="cursor-pointer">
                <LuPenLine className="w-5 h-5 text-gray-600" />
              </label>
              <input
                type="file"
                id="profilePicUpload"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePicChange}
                disabled={isUploadingImage}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {displayProfile?.fullName || "Admin"}
          </h2>
          {displayProfile?.role && (
            <p className="mt-1 text-sm capitalize text-gray-500">
              {displayProfile.role}
            </p>
          )}
          {isUploadingImage && (
            <p className="mt-2 text-sm text-gray-500">Uploading image...</p>
          )}
        </div>

        <div className="flex justify-center gap-8 mt-6 border-b">
          <button
            type="button"
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
            type="button"
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

        <div className="p-8">
          {error && (
            <div className="px-4 py-3 mb-5 text-sm text-red-700 border border-red-200 rounded-md bg-red-50">
              {error}
            </div>
          )}
          {message && (
            <div className="px-4 py-3 mb-5 text-sm text-green-700 border border-green-200 rounded-md bg-green-50">
              {message}
            </div>
          )}

          {activeTab === "profile" ? (
            <EditProfileTab
              accessToken={accessToken}
              isLoading={isLoading}
              profile={displayProfile}
              setError={setError}
              setMessage={setMessage}
              setProfile={setProfile}
              setUser={setUser}
            />
          ) : (
            <ChangePasswordTab
              accessToken={accessToken}
              setError={setError}
              setMessage={setMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EditProfileTab({
  accessToken,
  isLoading,
  profile,
  setError,
  setMessage,
  setProfile,
  setUser,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      fullName: profile?.fullName || "",
      email: profile?.email || "",
      phoneNumber: profile?.phoneNumber || "",
    });
  }, [profile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      setError("Please sign in again to update your profile.");
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const result = await updateAdminProfile(accessToken, {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
      });
      const updatedProfile = {
        ...profile,
        ...getProfileFromResult(result),
      };

      setProfile(updatedProfile);
      setUser(updatedProfile);
      setMessage(result?.message || "Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          disabled={isLoading || isSaving}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B74140] focus:border-transparent disabled:bg-gray-100"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Contact No
        </label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          disabled={isLoading || isSaving}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B74140] focus:border-transparent disabled:bg-gray-100"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || isSaving}
        className="w-full bg-[#B74140] text-white py-3 rounded-md font-medium hover:bg-[#A03736] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSaving ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}

function ChangePasswordTab({ accessToken, setError, setMessage }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      setMessage("");
      return;
    }

    if (!accessToken) {
      setError("Please sign in again to change your password.");
      setMessage("");
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const result = await changeAdminPassword(accessToken, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage(result?.message || "Password changed successfully.");
    } catch (err) {
      setError(err.message || "Failed to change password.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PasswordInput
        label="Current Password"
        name="currentPassword"
        value={formData.currentPassword}
        onChange={handleChange}
        disabled={isSaving}
      />
      <PasswordInput
        label="New Password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
        disabled={isSaving}
      />
      <PasswordInput
        label="Confirm Password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        disabled={isSaving}
      />

      <button
        type="submit"
        disabled={isSaving}
        className="w-full bg-[#B74140] text-white py-3 rounded-md font-medium hover:bg-[#A03736] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSaving ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}

function PasswordInput({ label, name, value, onChange, disabled }) {
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">{label}</label>
      <input
        type="password"
        name={name}
        value={value}
        onChange={onChange}
        placeholder="********"
        disabled={disabled}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B74140] focus:border-transparent disabled:bg-gray-100"
      />
    </div>
  );
}

export default ProfilePage;
