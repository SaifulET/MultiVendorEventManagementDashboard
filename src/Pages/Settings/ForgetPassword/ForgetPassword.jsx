import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
export default function SettingsForgotPassword() {
  const [email, setEmail] = useState('');
 const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
   navigate("/settings/otp")
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-4 mt-20">
      <div className="w-full ">
        {/* Header */}
        <div className="bg-[#B74140] text-white p-4 rounded-t-lg flex items-center">
          <Link to={`/settings/change-password`}>
            <button className="mr-4">
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
          </button>
          </Link>
        
          <h1 className="text-2xl font-medium">Forgot Password</h1>
        </div>

        {/* Content */}
        <div className="bg-white p-8 rounded-b-lg shadow-sm">
          <p className="text-gray-800 text-lg mb-8">
            Enter your email address to ger a verification code for resetting your password.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-800 font-medium mb-3">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#B74140] hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              Get OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}