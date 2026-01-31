import { useState } from 'react';
import { Eye, EyeOff, Upload } from 'lucide-react';

export default function CreateAdmin() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
    profileImage: null
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center ">
      <div className="w-full rounded-lg bg-white border border-gray-300">
        {/* Header */}
        <div className="bg-[#B74140] px-6 py-4 rounded-md">
          <h1 className="text-white text-xl font-medium">Create Admin</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#B74140]"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#B74140]"
            />
          </div>

          {/* Password Fields Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* New Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#B74140] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#B74140] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Profile Image</label>
            <div className="border border-gray-300 p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="profileImage" className="cursor-pointer flex flex-col items-center">
                <Upload className="text-gray-400 mb-2" size={24} />
                <span className="text-sm text-gray-500">Upload Image</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#B74140] text-white py-3 hover:bg-[#9d3735] transition-colors font-medium"
          >
            Create Admin
          </button>
        </form>
      </div>
    </div>
  );
}