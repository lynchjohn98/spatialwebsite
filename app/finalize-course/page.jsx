"use client";
import { insertCourseSettings, insertNewCourse } from "../actions";
import { useState, useEffect, useRef } from "react";
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
  const [showPassword, setShowPassword] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("courseData");
    if (storedData) {
      setCourseData(JSON.parse(storedData));
    }
    function handleClickOutside(event) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowTooltip(false);
      }
    }

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

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
      alert("Please enter the course creation code.");
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
        joinCode: joinCode,
        password: password,
        county: courseData.county,
        urbanicity: courseData.urbanicity,
        schoolGender: courseData.schoolGender,
        deis: courseData.deis,
        schoolLanguage: courseData.schoolLanguage,
        courseResearch: courseData.courseResearch,
        courseResearchType: courseData.courseResearchType,
      };

      const result = await insertNewCourse(allCourseData);
      const studentResult = await generateDefaultStudent(result.courseId);

      const allPayload = {
        courseSettings: JSON.stringify(allCourseData),
        moduleSettings: JSON.stringify(otherData.modules),
        quizSettings: JSON.stringify(otherData.quizzes),
        studentSettings: JSON.stringify(studentResult.data),
        courseId: result.courseId,
      };

      const result2 = await insertCourseSettings(allPayload);

      setSuccessMessage({
        courseName: courseData.name,
        joinCode: joinCode,
        password: password,
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
              <h2 className="text-2xl font-bold mb-4">
                Course Created Successfully!
              </h2>
              <p className="mb-2">
                A new course for teacher{" "}
                <span className="font-semibold">
                  {successMessage.courseName}
                </span>{" "}
                has been created.
              </p>
              <p className="mb-2">
                Please make sure to save the following credentials:
              </p>
              <div className="bg-gray-800 p-4 rounded-md mb-4">
                <div className="mb-3">
                  <p className="text-sm text-gray-300 mb-1">
                    Course Join Code:
                  </p>
                  <p className="font-mono text-lg bg-gray-700 p-2 rounded">
                    {successMessage.joinCode}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-300 mb-1">
                    Teacher Password:
                  </p>
                  <div className="relative">
                    <p className="font-mono text-lg bg-gray-700 p-2 rounded pr-12">
                      {showPassword
                        ? successMessage.password
                        : "•".repeat(successMessage.password.length)}
                    </p>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
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
                <div className="flex justify-between items-center mb-4">
                  <div></div> {/* Empty div for spacing */}
                  <h1 className="text-2xl font-bold">
                    Finalize Course Details:
                  </h1>
                  <button
                    ref={buttonRef}
                    onClick={() => setShowTooltip(!showTooltip)}
                    className="w-6 h-6 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Show field explanations"
                  >
                    ?
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Teacher Name:</span>
                    <span className="text-lg">{courseData.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">County:</span>
                    <span className="text-lg">{courseData.county}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Urbanicity:</span>
                    <span className="text-lg">{courseData.urbanicity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">School Gender:</span>
                    <span className="text-lg">{courseData.schoolGender}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">DEIS Status:</span>
                    <span className="text-lg">{courseData.deis}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">School Language:</span>
                    <span className="text-lg">{courseData.schoolLanguage}</span>
                  </div>
                  {courseData.courseResearch === "true" && (
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        Course Research Type:
                      </span>
                      <span className="text-lg">
                        {courseData.courseResearchType}
                      </span>
                    </div>
                  )}
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
                    Admin Course Creation Code
                  </label>
                  <input
                    type="password"
                    value={teacherCode}
                    onChange={(e) => setTeacherCode(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-blue-200 text-black"
                    placeholder="Enter admin code"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    This is an administrative code required to create new
                    courses.
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

      {/* Overylay for textbox to provide further explanations of the information needed */}

      {showTooltip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-lg w-full mx-4 relative transform transition-all duration-300 ease-in-out scale-100 opacity-100 shadow-2xl">
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white text-lg transition-colors"
              aria-label="Close explanations"
            >
              ×
            </button>

            <h3 className="font-bold text-2xl mb-4 text-blue-300 pr-8">
              What do I need to provide?
            </h3>

            <div className="space-y-4 text-sm max-h-96 overflow-y-auto">
              <div className="mb-4">
                The following section asks for a <b> Teacher Password </b>, a
                generated <b> course join code </b>, and an{" "}
                <b> admin course creation password </b>.
              </div>

              <div>
                <span className="font-semibold text-blue-200 text-base">
                  Teacher Password:
                </span>
                <p className="text-white-300 mt-1">
                  This is your password that you will use to log in as a teacher
                  to your course. You will need to confirm it and remember it.
                </p>
              </div>

              <div>
                <span className="font-semibold text-blue-200 text-base">
                  Course Join Code:
                </span>
                <p className="text-white-300 mt-1">
                  This is an automatically generated code that you will use in
                  combination with your self-created teacher password to log in
                  to your course. You can generate it by clicking the "Generate"
                  button.
                </p>
              </div>

              <div>
                <span className="font-semibold text-blue-200 text-base">
                  Admin Course Creation Code:
                </span>
                <p className="text-white-300 mt-1">
                  This is a preset code that will be provided to you that will
                  need to be entered to finalize the course generation. If you
                  do NOT have this code, please contact a member of the team for
                  assistance.{" "}
                </p>
              </div>

              <div>
                Please make sure to make a note of your teacher password and
                course join code.
              </div>
            </div>

            {/* Close Button at Bottom */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowTooltip(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
