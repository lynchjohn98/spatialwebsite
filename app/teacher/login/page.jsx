"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginTeacherAccount } from "../../services/teacher_actions";
import ResponsiveButton from "../../../components/page_blocks/ResponsiveButton";

export default function TeacherMainPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
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
        setError("Invalid credentials. Please try again.");
      } else {
        sessionStorage.setItem("teacherData", JSON.stringify(result.data));
        router.push("/teacher/homepage");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
        <p className="text-lg">Logging in...</p>
      </div>
    );
  }

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
      <div className="w-full max-w-md sm:max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
          Teacher Login
        </h1>

        <div className="space-y-4">
          <div>
            {error && (
              <div className="p-3 bg-red-600 text-white rounded-lg text-center">
                {error}
              </div>
            )}
            <label className="block text-lg font-medium mb-2">
              Enter your username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">
              Enter your password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <div className="pt-4">
            <ResponsiveButton
              className="w-full py-3 rounded-md font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
              label="Log into account"
              onClick={() => handleLogin()}
            />
          </div>
          <div className="pt-4">
            <ResponsiveButton
              className="mt-4"
              label="Need an account? Create one here."
              onClick={() => router.push("/teacher/create")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
