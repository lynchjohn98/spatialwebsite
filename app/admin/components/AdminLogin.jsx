// AdminLogin.jsx
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export function AdminLogin({ onAuthorized }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePasscodeChange = (e) => {
    setPasscode(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setError("");
    const adminPasscode = "1234"; 
    
    if (passcode === adminPasscode) {
      sessionStorage.setItem("adminAuthorized", "true");
      onAuthorized();
    } else {
      setError("Invalid admin passcode. Please try again.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4 py-8">
        <div className="w-full max-w-md">
          <div className="p-6 rounded-lg shadow-lg mb-8">
            <h1 className="text-2xl font-bold mb-1 text-center">Admin Access</h1>
            <p className="text-center">
              Enter the admin passcode to access the administrative dashboard.
            </p>
          </div>
          
          <div className="space-y-6">
            {error && (
              <div className="bg-red-800 text-white p-3 rounded-md">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-lg font-medium mb-2">
                Admin Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={handlePasscodeChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full px-4 py-3 rounded bg-blue-200 text-black"
                placeholder="Enter admin passcode"
              />
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-3 rounded-md font-medium transition-colors
                  ${isLoading 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'}`}
              >
                {isLoading ? 'Verifying...' : 'Access Admin Panel'}
              </button>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => router.push("/")}
                className="text-blue-300 hover:text-blue-200 transition-colors text-sm"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}