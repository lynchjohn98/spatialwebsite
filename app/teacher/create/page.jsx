"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTeacherAccount } from "../../services/teacher_server";
import { loginTeacherAccount } from "../../services/teacher_server";
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

    try {
      const response = await createTeacherAccount({
        name: name.trim(),
        username: username.trim(),
        password,
      });

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
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
      <div className="w-full max-w-md sm:max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 space-y-4 text-center">
          Create a New Teacher Account
        </h1>
        <div>
          <p className="text-center mb-6">
            Please fill out the form below to create your teacher account.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="teacherName" className="block text-lg font-medium">
              Enter Your Name:
            </label>
            <input
              id="teacherName"
              className="w-full px-4 py-2 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Your full name"
              tabIndex={1}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="block text-lg font-medium">
              Enter Your Username:
            </label>
            <input
              id="username"
              className="w-full px-4 py-2 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Your username"
              tabIndex={2}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-lg font-medium">
              Enter Your Password:
            </label>
            <div className="relative">
              <input
                id="password"
                className="w-full px-4 py-2 pr-12 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                tabIndex={3}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.414 1.414M14.12 14.12L9.878 9.878m4.242 4.242L9.878 9.878"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

          <div className="space-y-2">
            <label
              htmlFor="passwordConfirmation"
              className="block text-lg font-medium"
            >
              Confirm Your Password:
            </label>
            <div className="relative">
              <input
                id="passwordConfirmation"
                className="w-full px-4 py-2 pr-12 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                tabIndex={4}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.414 1.414M14.12 14.12L9.878 9.878m4.242 4.242L9.878 9.878"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
            {passwordConfirmation && password !== passwordConfirmation && (
              <p className="text-red-400 text-sm mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          <div className="flex justify-center mt-8">
            <ResponsiveButton
              label="Create Account"
              type="submit"
              isLoading={isLoading}
            />
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/teacher/login")}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}