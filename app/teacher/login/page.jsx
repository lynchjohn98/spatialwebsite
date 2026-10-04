"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loginTeacherAccount } from "../../library/services/teacher_actions";
import {
  validateTeacherCredentials,
  resetTeacherPassword,
} from "../../library/services/teacher_services/walkthrough_services";
import ResponsiveButton from "../../../components/page_blocks/ResponsiveButton";

export default function TeacherMainPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Password reset modal state ---
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState("validate"); // 'validate' or 'newPassword'
  const [resetUsername, setResetUsername] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Prefetch the homepage so navigation after login is near-instant
  useEffect(() => {
    router.prefetch("/teacher/homepage");
  }, [router]);

  const handleLogin = async () => {
    if (isLoading) return; // guard against double submits
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await loginTeacherAccount({
        username,
        password,
      });
      if (result.error) {
        console.error("Login error:", result.error);
        setError("Incorrect password. Please try again.");
        setIsLoading(false); // only reset on failure
      } else {
        sessionStorage.setItem("teacherData", JSON.stringify(result.data));
        // Leave isLoading true: we're navigating away, so the form
        // shouldn't re-render before the homepage takes over.
        router.push("/teacher/homepage");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const openResetModal = () => {
    setShowResetModal(true);
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    resetForm();
  };

  const handleResetBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeResetModal();
    }
  };

  const handleValidateCredentials = async () => {
    setResetError("");
    setIsValidating(true);

    if (!resetUsername || !adminCode) {
      setResetError("Please enter both username and admin code");
      setIsValidating(false);
      return;
    }

    try {
      const validationResult = await validateTeacherCredentials(
        resetUsername,
        adminCode
      );

      if (validationResult.success) {
        setResetStep("newPassword");
        setResetError("");
      } else if (validationResult.error === "username_not_found") {
        setResetError("Username does not exist. Please check and try again.");
      } else if (validationResult.error === "invalid_code") {
        setResetError(
          "Invalid admin code. Please verify with your administrator."
        );
      } else {
        setResetError("Validation failed. Please try again.");
      }
    } catch (error) {
      setResetError("An error occurred. Please try again later.");
    } finally {
      setIsValidating(false);
    }
  };

  const handlePasswordReset = async () => {
    setResetError("");
    setIsResetting(true);

    if (!newPassword || !confirmPassword) {
      setResetError("Please fill in both password fields");
      setIsResetting(false);
      return;
    }

    if (newPassword.length < 8) {
      setResetError("Password must be at least 8 characters long");
      setIsResetting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      setIsResetting(false);
      return;
    }

    try {
      const resetResult = await resetTeacherPassword(
        resetUsername,
        newPassword
      );

      if (resetResult.success) {
        alert("Password reset successfully! Please log in with your new password.");
        closeResetModal();
      } else {
        setResetError("Failed to reset password. Please try again.");
      }
    } catch (error) {
      setResetError("An error occurred. Please try again later.");
    } finally {
      setIsResetting(false);
    }
  };

  const resetForm = () => {
    setResetStep("validate");
    setResetUsername("");
    setAdminCode("");
    setNewPassword("");
    setConfirmPassword("");
    setResetError("");
    setShowAdminCode(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/teacher")}
              className="flex items-center text-gray-300 hover:text-white transition-colors group"
            >
              <svg
                className="h-5 w-5 mr-2 group-hover:translate-x-[-2px] transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Back to Teacher Options</span>
            </button>

            <div className="text-sm text-gray-400">Teacher Login</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M4 12h11" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Teacher Login
            </h1>
            <p className="text-gray-400 leading-relaxed">
              Sign in to access your spatial thinking training dashboard
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-600/20 border border-red-500 text-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-60"
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-200">
                  Password
                </label>
                <button
                  type="button"
                  onClick={openResetModal}
                  className="text-xs text-blue-400 hover:text-blue-300 underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-60"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isLoading) handleLogin();
                  }}
                />
              </div>
            </div>

            {/* Login Button */}
            <div>
              <ResponsiveButton
                className="w-full py-3 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white"
                label={isLoading ? "Logging in..." : "Log into account"}
                onClick={handleLogin}
                disabled={isLoading}
              />
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">or</span>
              </div>
            </div>

            {/* Create Account Button */}
            <div>
              <ResponsiveButton
                className="w-full py-3 rounded-lg font-medium transition-colors bg-gray-600 hover:bg-gray-500 text-white border border-gray-500"
                label="Need an account? Create one here"
                onClick={() => router.push("/teacher/create")}
              />
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-4">
              Need help getting started?
            </p>
            <button
              onClick={() => router.push("/teacher/walkthrough")}
              className="text-blue-400 hover:text-blue-300 text-sm underline transition-colors"
            >
              View Teacher Walkthrough →
            </button>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleResetBackdropClick}
        >
          <div className="bg-gray-800/95 border border-gray-700 rounded-xl shadow-2xl p-6 max-w-md w-full">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Password Reset</h2>
              <button
                onClick={closeResetModal}
                className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg p-1 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {resetStep === "validate" ? (
              <>
                <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                  Enter your username and admin code to reset your password.
                </p>

                <div className="mb-4">
                  <input
                    type="text"
                    value={resetUsername}
                    onChange={(e) => setResetUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    disabled={isValidating}
                  />
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <input
                      type={showAdminCode ? "text" : "password"}
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      placeholder="Enter admin code"
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      disabled={isValidating}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminCode(!showAdminCode)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showAdminCode ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Contact your administrator if you don't have the code
                  </p>
                </div>

                <button
                  onClick={handleValidateCredentials}
                  disabled={isValidating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  {isValidating ? "Validating..." : "Verify Identity"}
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                  Create a new password for{" "}
                  <span className="text-white font-medium">{resetUsername}</span>
                </p>

                <div className="mb-4">
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min. 8 characters)"
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      disabled={isResetting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showNewPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      disabled={isResetting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePasswordReset}
                  disabled={isResetting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-medium transition-colors mb-3"
                >
                  {isResetting ? "Resetting..." : "Reset Password"}
                </button>

                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  ← Back to verification
                </button>
              </>
            )}

            {resetError && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{resetError}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}