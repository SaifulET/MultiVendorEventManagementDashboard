import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { changeAdminPassword } from "../../lib/adminProfileApi";

const ChangePassword = () => {
  const [visibleFields, setVisibleFields] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const accessToken = useAuthStore((state) => state.accessToken);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const toggleVisibility = (fieldName) => {
    setVisibleFields({
      ...visibleFields,
      [fieldName]: !visibleFields[fieldName],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto mt-16 overflow-hidden border border-gray-200 rounded-2xl">
        <div className="flex items-center px-4 py-4 bg-[#B74140]">
          <Link
            to="/settings"
            className="p-1 mr-3 text-white transition-colors rounded hover:bg-[#A03736]"
            aria-label="Back to settings"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-medium text-white">Change Password</h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md p-6 mx-auto space-y-5">
          {error && (
            <div className="px-4 py-3 text-sm text-red-700 border border-red-200 rounded-md bg-red-50">
              {error}
            </div>
          )}
          {message && (
            <div className="px-4 py-3 text-sm text-green-700 border border-green-200 rounded-md bg-green-50">
              {message}
            </div>
          )}

          <PasswordField
            label="Current Password"
            name="currentPassword"
            value={formData.currentPassword}
            isVisible={visibleFields.currentPassword}
            onChange={handleChange}
            onToggle={() => toggleVisibility("currentPassword")}
            disabled={isSaving}
          />
          <PasswordField
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            isVisible={visibleFields.newPassword}
            onChange={handleChange}
            onToggle={() => toggleVisibility("newPassword")}
            disabled={isSaving}
          />
          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            isVisible={visibleFields.confirmPassword}
            onChange={handleChange}
            onToggle={() => toggleVisibility("confirmPassword")}
            disabled={isSaving}
          />

          <Link
            to="/settings/forget-password"
            className="inline-block underline text-[#B74140]"
          >
            Forget Password
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 font-medium text-white transition-colors bg-[#B74140] rounded hover:bg-[#A03736] focus:outline-none focus:ring-2 focus:ring-[#B74140] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

function PasswordField({
  label,
  name,
  value,
  isVisible,
  onChange,
  onToggle,
  disabled,
}) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required
          className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B74140] focus:border-transparent disabled:bg-gray-100"
          placeholder="********"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
          aria-label={isVisible ? `Hide ${label}` : `Show ${label}`}
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
