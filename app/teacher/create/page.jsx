"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTeacherAccount } from "../../library/services/teacher_actions";
import { loginTeacherAccount } from "../../library/services/teacher_actions";
import ResponsiveButton from "../../../components/page_blocks/ResponsiveButton";

export default function TeacherCreatePage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState(false);
  const [psvtrStatus, setPsvtrStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!name.trim()) {
      setError("Name is required");
      setIsLoading(false);
      return;
    }

    if (!username.trim()) {
      setError("Username is required");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    const payload = {
      name: name.trim(),
      username: username.trim(),
      password,
      pretest_complete: false,
      posttest_complete: false,
      training_complete: false,
      premodule_training: false,
      module1_training: false,
      module2_training: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (trainingStatus && psvtrStatus) {
      payload.training_complete = true;
      payload.pretest_complete = true;
      payload.posttest_complete = true;
      payload.premodule_training = true;
      payload.module1_training = true;
      payload.module2_training = true;
    } else if (psvtrStatus) {
      payload.pretest_complete = true;
      payload.posttest_complete = true;
    } else if (trainingStatus) {
      payload.training_complete = true;
      payload.premodule_training = true;
      payload.module1_training = true;
      payload.module2_training = true;
    }

    try {
      // Pass the payload properties directly, not wrapped in another object
      const response = await createTeacherAccount(payload);

      if (response.error) {
        setError(response.error);
      } else {
        try {
          const result = await loginTeacherAccount({
            username,
            password,
          });

          if (result.error) {
            console.error("Login error:", result.error);
            setError("Invalid credentials. Please try again.");
          } else {
            sessionStorage.setItem("teacherData", JSON.stringify(result.data));
            router.push("/teacher/homepage");
          }
        } catch (error) {
          console.error("Unexpected error:", error);
          setError("An error occurred. Please try again.");
        }
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

            <div className="text-sm text-gray-400">Create Account</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Create Teacher Account
            </h1>
            <p className="text-gray-400 leading-relaxed">
              Join our spatial thinking training platform and enhance your teaching skills
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 sm:p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-600/20 border border-red-500 text-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="teacherName" className="block text-sm font-medium mb-2 text-gray-200">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="teacherName"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Enter your full name"
                    tabIndex={1}
                    required
                  />
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-200">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    placeholder="Choose a username"
                    tabIndex={2}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-200">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min 6 characters)"
                    tabIndex={3}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-green-400 transition-colors"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.414 1.414M14.12 14.12L9.878 9.878m4.242 4.242L9.878 9.878" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="passwordConfirmation" className="block text-sm font-medium mb-2 text-gray-200">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    id="passwordConfirmation"
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    tabIndex={4}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-green-400 transition-colors"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.414 1.414M14.12 14.12L9.878 9.878m4.242 4.242L9.878 9.878" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordConfirmation && password !== passwordConfirmation && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Training Status Checkbox - FULLY CLICKABLE */}
              <label 
                htmlFor="training-completed" 
                className="block bg-gray-700/30 border border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-700/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-5">
                    <input
                      id="training-completed"
                      type="checkbox"
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                      checked={trainingStatus}
                      onChange={(e) => {
                        if (e.target.checked) {
                          sessionStorage.setItem("teacherTrainingCompleted", "true");
                          setTrainingStatus(true);
                        } else {
                          sessionStorage.removeItem("teacherTrainingCompleted");
                          setTrainingStatus(false);
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-200">
                      I have already completed the teacher training
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Check this box if you've previously completed spatial thinking training modules
                    </p>
                  </div>
                </div>
              </label>

              {/* PSVTR Status Checkbox - FULLY CLICKABLE */}
              <label 
                htmlFor="psvtr-completed" 
                className="block bg-gray-700/30 border border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-700/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-5">
                    <input
                      id="psvtr-completed"
                      type="checkbox"
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                      checked={psvtrStatus}
                      onChange={(e) => {
                        if (e.target.checked) {
                          sessionStorage.setItem("psvtrCompleted", "true");
                          setPsvtrStatus(true);
                        } else {
                          sessionStorage.removeItem("psvtrCompleted");
                          setPsvtrStatus(false);
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-200">
                      I have already completed the PSVT:R Pre-Test
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Check this box if you've previously completed the Purdue Spatial Visualization Test: Revised (PSVT:R) on another account you have created.
                    </p>
                  </div>
                </div>
              </label>

              {/* Submit Button */}
              <div className="pt-2">
                <ResponsiveButton
                  label={isLoading ? "Creating Account..." : "Create Account"}
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg font-medium transition-colors bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white"
                />
              </div>
            </form>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-4">
              Already have an account?
            </p>
            <button
              onClick={() => router.push("/teacher/login")}
              className="text-green-400 hover:text-green-300 text-sm underline transition-colors"
            >
              Sign in here →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}