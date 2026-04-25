import { useEffect, useState } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import { API_BASE_URL } from "../../config/api";
import useAuthStore from "../../store/useAuthStore";

const INITIAL_FORM_DATA = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  profileImage: null,
};

const parseResponse = async (response, fallbackMessage) => {
  const text = await response.text();
  let result = {};

  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = { message: text };
  }

  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || result?.error || fallbackMessage);
  }

  return result;
};

export default function CreateAdmin() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0] || null;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      updateField("profileImage", null);
      setPreviewUrl("");
      return;
    }

    updateField("profileImage", file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
    setMessage("");
  };

  const resetForm = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFormData(INITIAL_FORM_DATA);
    setPreviewUrl("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!accessToken) {
      setError("Please sign in again to create an admin.");
      setMessage("");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password do not match.");
      setMessage("");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const payload = new FormData();
      payload.append("fullName", formData.fullName.trim());
      payload.append("email", formData.email.trim());
      payload.append("password", formData.password);

      if (formData.profileImage) {
        payload.append("profileImage", formData.profileImage);
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/admin/admin-users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
      });

      const result = await parseResponse(response, "Failed to create admin.");

      setMessage(result?.message || "Admin created successfully.");
      resetForm();
    } catch (submitError) {
      setError(submitError.message || "Failed to create admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full overflow-hidden bg-white border border-gray-300 rounded-lg">
        <div className="px-6 py-4 bg-[#B74140] rounded-md">
          <h1 className="text-xl font-medium text-white">Create Admin</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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

          <div>
            <label className="block mb-2 text-sm text-gray-700">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#B74140]"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#B74140]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  placeholder="********"
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 focus:outline-none focus:border-[#B74140]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(event) =>
                    updateField("confirmPassword", event.target.value)
                  }
                  placeholder="********"
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 focus:outline-none focus:border-[#B74140]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-700">
              Profile Image
            </label>
            <div className="space-y-4">
              <div className="border border-gray-300 p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isSubmitting}
                  className="hidden"
                />
                <label
                  htmlFor="profileImage"
                  className="flex flex-col items-center cursor-pointer"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Selected profile preview"
                      className="object-cover w-24 h-24 mb-3 border border-gray-200 rounded-full"
                    />
                  ) : (
                    <Upload className="mb-2 text-gray-400" size={24} />
                  )}
                  <span className="text-sm text-gray-500">
                    {previewUrl ? "Change Image" : "Upload Image"}
                  </span>
                  {formData.profileImage?.name && (
                    <span className="mt-2 text-xs text-gray-400">
                      {formData.profileImage.name}
                    </span>
                  )}
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#B74140] py-3 font-medium text-white transition-colors hover:bg-[#9d3735] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
