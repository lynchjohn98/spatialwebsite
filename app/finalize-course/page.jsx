"use client";
import { insertCourseSettings, insertNewCourse } from "../actions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateJoinCode } from "../../utils/helpers";
import { validateTeacherCode } from "../../utils/helpers";
import { generateDefaultModuleQuizInformation } from "../actions";
import { generateDefaultStudent } from "../actions";


export default function FinalizeCourse() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [courseData, setCourseData] = useState(null);
  const [joinCode, setJoinCode] = useState("");
  const [teacherCode, setTeacherCode] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("courseData");
    if (storedData) {
      setCourseData(JSON.parse(storedData));
    }
  }, []);

  if (!courseData) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-center flex-1">
          <p className="text-xl">Loading course data...</p>
        </div>
      </div>
    );
  }

  const getJoinCode = () => {
    setJoinCode(generateJoinCode());
  };

  const handleCopyCredentials = () => {
    const textToCopy = `Course Join Code: ${joinCode}\nTeacher Password: ${password}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = async () => {
    if (!courseData.name || !courseData.school || !courseData.classType) {
      alert("Error: Course details are missing.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (!joinCode) {
      alert("Please generate a join code before creating the course.");
      return;
    }

    if (teacherCode.length === 0) {
      alert("Please enter the course creation password.");
      return;
    }

    if (!validateTeacherCode(teacherCode)) {
      alert(
        "Invalid teacher code. Please reach out to spatial@gmail.com for a code."
      );
      return;
    }

    try {
      const otherData = await generateDefaultModuleQuizInformation();
      
      const allCourseData = {
        name: courseData.name,
        school: courseData.school,
        classType: courseData.classType,
        joinCode: joinCode,
        password: password,
      };

      const result = await insertNewCourse(allCourseData);
      const studentResult = await generateDefaultStudent(result.courseId);
      
      const allPayload = {
        courseSettings: JSON.stringify(allCourseData),
        moduleSettings: JSON.stringify(otherData.modules),
        quizSettings: JSON.stringify(otherData.quizzes),
        studentSettings: JSON.stringify(studentResult.data),
        courseId: result.courseId
      };
      
      const result2 = await insertCourseSettings(allPayload);

      setSuccessMessage({
        courseName: courseData.name,
        joinCode: joinCode,
        password: password
      });
      
    } catch (error) {
      console.error("Error creating course:", error);
      alert("There was an error creating your course. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4 py-8">
        <div className="w-full max-w-md">
          {successMessage ? (
            <div className="bg-green-800 p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Course Created Successfully!</h2>
              <p className="mb-2">A new course for teacher <span className="font-semibold">{successMessage.courseName}</span> has been created.</p>
              <p className="mb-2">Please make sure to save the following credentials:</p>
              <div className="bg-gray-800 p-4 rounded-md mb-4">
                <div className="mb-3">
                  <p className="text-sm text-gray-300 mb-1">Course Join Code:</p>
                  <p className="font-mono text-lg bg-gray-700 p-2 rounded">{successMessage.joinCode}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-300 mb-1">Teacher Password:</p>
                  <p className="font-mono text-lg bg-gray-700 p-2 rounded">{successMessage.password}</p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleCopyCredentials}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
                >
                  {copied ? "Copied!" : "Copy Join Code & Password"}
                </button>
                
                <button
                  onClick={() => router.push("/")}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition-colors"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                <h1 className="text-2xl font-bold mb-4 text-center">Finalize Your Course</h1>
                
                <div className="bg-gray-800 p-4 rounded-md">
                  <h2 className="text-lg font-semibold mb-3">Course Information</h2>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex">
                      <span className="font-medium min-w-32">Teacher Name:</span>
                      <span>{courseData.name}</span>
                    </div>
                    
                    <div className="flex">
                      <span className="font-medium min-w-32">School Name:</span>
                      <span>{courseData.school}</span>
                    </div>
                    
                    <div className="flex">
                      <span className="font-medium min-w-32">Course Type:</span>
                      <span>{courseData.classType}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-lg font-medium mb-2">
                      Create Your Teacher Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-blue-200 rounded text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-lg font-medium mb-2">
                      Confirm Your Teacher Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded bg-blue-200 text-black"
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <label className="block text-lg font-medium mb-2">
                    Your Course Join Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      
                      value={joinCode}
                      readOnly
                      className="flex-1 px-4 py-2 rounded text-black bg-gray-100"
                      placeholder="Click generate to create code"
                    />
                    <button
                      onClick={getJoinCode}
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-lg font-medium mb-2">
                    Admin Course Creation Password
                  </label>
                  <input
                    type="password"
                    value={teacherCode}
                    onChange={(e) => setTeacherCode(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-blue-200 text-black"
                    placeholder="Enter admin password"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    This is the administrator password required to create new courses.
                  </p>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium transition-colors"
                  >
                    Create Course
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}