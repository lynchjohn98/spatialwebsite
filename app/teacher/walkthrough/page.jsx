"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ExpandableVideo from "../../../components/module_blocks/ExpandableVideo";
import {
  validateTeacherCredentials,
  resetTeacherPassword,
} from "../../../app/library/services/teacher_services/walkthrough_services";

export default function TeacherWalkthroughPage() {
  const router = useRouter();
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

  // Support form states
  const [supportEmail, setSupportEmail] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportSent, setSupportSent] = useState(false);
  const handleValidateCredentials = async () => {
    setResetError("");
    setIsValidating(true);

    if (!resetUsername || !adminCode) {
      setResetError("Please enter both username and admin code");
      setIsValidating(false);
      return;
    }

    try {
      // Call the combined server action
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
        alert("Password reset successfully! Redirecting to login...");
        router.push("/teacher/login");
      } else {
        setResetError("Failed to reset password. Please try again.");
      }
    } catch (error) {
      setResetError("An error occurred. Please try again later.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleSendSupport = () => {
    if (!supportEmail || !supportMessage) {
      alert("Please fill in both your email and message");
      return;
    }

    const subject = encodeURIComponent("Teacher Support Request");
    const body = encodeURIComponent(
      `Support Request from Teacher Portal\n\n` +
        `From: ${supportEmail}\n\n` +
        `Message:\n${supportMessage}\n\n` +
        `---\n` +
        `Sent from Teacher Help Center`
    );
    console.log("GENERATING THIS MAIL", subject, body);
    window.location.href = `mailto:lynchjohn98@gmail.com?subject=${subject}&body=${body}`;
    setSupportSent(true);
    setTimeout(() => setSupportSent(false), 5000);
  };

  const resetForm = () => {
    setResetStep("validate");
    setResetUsername("");
    setAdminCode("");
    setNewPassword("");
    setConfirmPassword("");
    setResetError("");
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      {/* Sticky Header */}
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
              <span className="font-medium">Back to Teacher Portal</span>
            </button>

            <div className="text-sm text-gray-400">Help & Support</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Teacher Help Center
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Reset your password, create a new account, or watch a video
            walkthrough of the platform.
          </p>
        </div>

        {/* Help Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Password Reset Section */}
          <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 hover:border-blue-500 transition-all duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Password Reset
              </h3>

              {resetStep === "validate" ? (
                <>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Enter your username and admin code to reset your password.
                  </p>

                  {/* Username Input */}
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

                  {/* Admin Code Input with Show/Hide */}
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
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
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
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Create a new password for{" "}
                    <span className="text-white font-medium">
                      {resetUsername}
                    </span>
                  </p>

                  {/* New Password Input with Show/Hide */}
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
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input with Show/Hide */}
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
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
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

              {/* Error Message */}
              {resetError && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{resetError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Creation Guide */}
          <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 hover:border-green-500 transition-all duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Getting Started Guide
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                New to the platform? Follow this step-by-step guide to create
                your account and get started.
              </p>
            </div>

            {/* Step-by-step guide */}
            <div className="text-left space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">
                    Create Your Account
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Choose a username and secure password
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">Complete Pre-Test</h4>
                  <p className="text-gray-400 text-sm">
                    Take the PSVT:R assessment to unlock features
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">Explore Training</h4>
                  <p className="text-gray-400 text-sm">
                    Access spatial thinking training modules
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">Create Your Course</h4>
                  <p className="text-gray-400 text-sm">
                    Set up classes and manage students
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/teacher/create")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors mt-6"
            >
              Start Creating Account
            </button>
          </div>

          {/* Video Walkthrough */}
          <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 hover:border-purple-500 transition-all duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Video Tutorial
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Watch our comprehensive walkthrough video to see the platform in
                action and learn key features.
              </p>
            </div>

            {/* Video Component */}
            <div className="mb-6">
              <ExpandableVideo
                videoId=""
                title="Spatial Thinking Platform Walkthrough"
                description="Complete guide to using the teacher portal and training modules"
              />
            </div>

            {/* Video Topics */}
            <div className="text-left">
              <h4 className="text-white font-medium mb-3">Video covers:</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Account setup and navigation
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Taking assessments and training
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Creating and managing courses
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Student enrollment and tracking
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Support Contact Section */}
        <div className="mt-12 bg-gray-800/50 border border-gray-600 rounded-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-3 text-white">
              Need Additional Help?
            </h2>
            <p className="text-gray-400">
              Send us a message and we'll get back to you as soon as possible
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="Your email address"
                className="px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Subject (optional)"
                className="px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="Describe your question or issue in detail..."
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none mb-4"
            />

            <button
              onClick={handleSendSupport}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Send Support Request
            </button>

            {supportSent && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
                <p className="text-green-400 text-center">
                  Email sent successfully, please check your inbox for a response.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
