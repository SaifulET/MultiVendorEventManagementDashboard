import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function SettingsEmailVerification() {
  const [code, setCode] = useState(['', '', '', '']);
  const [isResending, setIsResending] = useState(false);
const navigate = useNavigate();
  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };
const arrowback=()=>{
    navigate("/settings/forget-password")
}
  const handleVerify = () => {
    const verificationCode = code.join('');
    if (verificationCode.length === 4) {
     navigate("/settings")
    }
  };

  const handleResend = () => {
    setIsResending(true);
    // Add resend logic here
    setTimeout(() => {
      setIsResending(false);
     
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-4 mt-20">
      <div className="w-full  bg-white rounded-lg shadow-sm overflow-hidden mt-8">
        {/* Header */}
        <div className="bg-[#B74140] px-6 py-4 flex items-center">
          <button  onClick={arrowback} className="text-white mr-4 hover:bg-blue-600 rounded p-1 transition-colors">
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
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </button>
          <h1 className="text-white text-2xl font-semibold">Settings</h1>
        </div>

        {/* Content */}
        <div className="px-6 py-12">
          <div className="max-w-md mx-auto">
            {/* Instruction Text */}
            <p className="text-gray-800 text-center text-lg mb-8">
              Please check your email. We have sent a code to contact @gmail.com
            </p>

            {/* Code Input Boxes */}
            <div className="flex justify-center gap-4 mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-16 h-16 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="–"
                />
              ))}
            </div>

            {/* Resend Link */}
            <div className="flex justify-between items-center mb-6 px-1">
              <span className="text-sm text-gray-600">Didn't receive code?</span>
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-sm text-gray-800 underline hover:text-blue-600 transition-colors disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend'}
              </button>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              className="w-full bg-[#B74140] hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors "
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}