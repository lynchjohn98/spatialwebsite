"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { generateJoinCode } from "../../library/helpers/helpers";
import { getTeacherData } from "../../library/services/teacher_actions";
import {
  insertCourseSettings,
  insertNewCourse,
  generateDefaultModuleQuizInformation,
} from "../../library/services/course_actions";
export default function FinalizeCourse() {
  const router = useRouter();

  const [courseData, setCourseData] = useState(null);
  const [joinCode, setJoinCode] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tooltipRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const storedData = JSON.parse(sessionStorage.getItem("teacherData"));
        if (!storedData?.id) {
          console.error("No teacher ID found in sessionStorage");
          setIsLoading(false);
          return;
        }
        const result = await getTeacherData(storedData);
        if (result.success && result.data) {
          const freshData = result.data;
          setTeacherData(freshData);
          sessionStorage.setItem("teacherData", JSON.stringify(freshData));
        } else {
          setTeacherData(storedData);
        }
      } catch (error) {
        console.error("Error loading teacher data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeacherData();
  }, []);

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
    const textToCopy = `Course Join Code: ${joinCode}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = async () => {
    if (!joinCode) {
      alert("Please generate a join code before creating the course.");
      return;
    }

    try {
      const otherData = await generateDefaultModuleQuizInformation();
      const allCourseData = {
        name: teacherData.name,
        teacher_id: teacherData.id,
        joinCode: joinCode,
        county: courseData.county,
        urbanicity: courseData.urbanicity,
        schoolGender: courseData.schoolGender,
        deis: courseData.deis,
        schoolLanguage: courseData.schoolLanguage,
        courseResearch: courseData.courseResearch,
        courseResearchType: courseData.courseResearchType,
        courseName: courseName || "Default Course",
      };

      const result = await insertNewCourse(allCourseData);

      console.log("INFORMATION FROM REGULAR RESULT", result);
      const allPayload = {
        courseSettings: JSON.stringify(allCourseData),
        moduleSettings: JSON.stringify(otherData.modules),
        quizSettings: JSON.stringify(otherData.quizzes),
        studentSettings: JSON.stringify({}), // Initialize with empty JSON
        courseId: result.courseId,
      };
      const result2 = await insertCourseSettings(allPayload);
      console.log("RESULT 2 ITEMS ", result2);
      setSuccessMessage({
        courseName: courseName,
        joinCode: joinCode,
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
                <div>
                  <p className="text-sm text-gray-300 mb-1">Course Name:</p>
                  <div className="relative">
                    <p className="font-mono text-lg bg-gray-700 p-2 rounded">
                      {successMessage.courseName}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-300 mb-1">
                    Course Join Code:
                  </p>
                  <p className="font-mono text-lg bg-gray-700 p-2 rounded">
                    {successMessage.joinCode}
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleCopyCredentials}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
                >
                  {copied ? "Copied!" : "Copy Join Code"}
                </button>

                <button
                  onClick={() => router.push("/teacher/homepage")}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition-colors"
                >
                  Return to Homepage
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
                <label className="block text-lg font-medium mb-2">
                  Your Course Name (Optional):
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="flex-1 px-4 py-2 rounded text-black bg-gray-100"
                    placeholder="Enter course name"
                  />
                </div>
              </div>

              <div className="space-y-6">
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
                The following section asks for a <b> Join Code </b>, which is
                generated by the button. Please mark this down to distinguish
                between your courses.
              </div>

              <div>
                <span className="font-semibold text-blue-200 text-base">
                  Course Join Code:
                </span>
                <p className="text-white-300 mt-1">
                  This is an automatically generated code that you will use to
                  access the teacher dashboard of your courses. Each course you
                  create will have a unique join code.
                </p>
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
