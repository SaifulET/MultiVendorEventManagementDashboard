import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "../../../config/api";

const OTP_LENGTH = 6;

const postAuth = async (endpoint, body) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Request failed. Please try again.");
  }

  return result;
};

export default function SettingsForgotPassword() {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array.from({ length: OTP_LENGTH }, () => ""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    resetMessages();
    setIsLoading(true);

    try {
      await postAuth("forgot-password", { email });
      setSuccessMessage("OTP sent to your email.");
      setStep("otp");
    } catch (requestError) {
      setError(requestError.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const nextOtp = [...otp];
    nextOtp[index] = value.slice(-1);
    setOtp(nextOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    resetMessages();
    const verificationCode = otp.join("");

    if (verificationCode.length !== OTP_LENGTH) {
      setError(`Please enter the ${OTP_LENGTH}-digit OTP.`);
      return;
    }

    setIsLoading(true);

    try {
      await postAuth("verify-email", { email, otp: verificationCode });
      setSuccessMessage("OTP verified. Set your new password.");
      setStep("password");
    } catch (verifyError) {
      setError(verifyError.message || "Failed to verify OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    resetMessages();
    setIsResending(true);

    try {
      await postAuth("resend-verification-otp", { email });
      setSuccessMessage("OTP resent to your email.");
    } catch (resendError) {
      setError(resendError.message || "Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    resetMessages();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await postAuth("reset-password", {
        email,
        otp: otp.join(""),
        newPassword,
      });
      setSuccessMessage("Password reset successfully.");
      setTimeout(() => navigate("/settings"), 800);
    } catch (resetError) {
      setError(resetError.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    resetMessages();

    if (step === "password") {
      setStep("otp");
      return;
    }

    if (step === "otp") {
      setStep("email");
      return;
    }

    navigate("/settings/change-password");
  };

  return (
    <div className="flex items-start justify-center min-h-screen py-4 mt-20 bg-gray-50">
      <div className="w-full">
        <div className="bg-[#B74140] text-white p-4 rounded-t-lg flex items-center">
          <button type="button" onClick={handleBack} className="mr-4">
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

          <h1 className="text-2xl font-medium">Forgot Password</h1>
        </div>

        <div className="p-8 bg-white rounded-b-lg shadow-sm">
          {error && (
            <div className="p-3 mb-5 text-sm text-red-600 border border-red-100 rounded bg-red-50">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 mb-5 text-sm text-green-600 border border-green-100 rounded bg-green-50">
              {successMessage}
            </div>
          )}

          {step === "email" && (
            <>
              <p className="mb-8 text-lg text-gray-800">
                Enter your email address to get a verification code for resetting your password.
              </p>

              <form onSubmit={handleRequestOtp}>
                <div className="mb-6">
                  <label className="block mb-3 font-medium text-gray-800">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 text-gray-600 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#B74140] hover:bg-[#a03635] text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-60"
                >
                  {isLoading ? "Sending..." : "Get OTP"}
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp}>
              <p className="mb-8 text-lg text-center text-gray-800">
                Please check your email. We sent a code to {email}.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    value={digit}
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    className="w-14 h-14 text-2xl font-semibold text-center transition-colors border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between px-1 mb-6">
                <span className="text-sm text-gray-600">Didn't receive code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-sm text-gray-800 underline transition-colors hover:text-blue-600 disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend"}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#B74140] hover:bg-[#a03635] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handleResetPassword}>
              <p className="mb-8 text-lg text-gray-800">
                Create a new password for {email}.
              </p>

              <div className="mb-6">
                <label className="block mb-3 font-medium text-gray-800">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full px-4 py-3 pr-11 text-gray-600 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-3 font-medium text-gray-800">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="w-full px-4 py-3 pr-11 text-gray-600 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#B74140] hover:bg-[#a03635] text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-60"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}

          <div className="mt-5 text-center">
            <Link to="/settings" className="text-sm text-gray-600 hover:underline">
              Back to settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
