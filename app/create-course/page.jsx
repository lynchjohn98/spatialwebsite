"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateTeacherCode } from "../../utils/helpers"; // Import the helper function
import { schools } from "../../utils/helpers"; // Import the schools array

export default function CreateCourse() {
  const [showInput, setShowInput] = useState(false); // Show/hide input box
  const [teacherCode, setTeacherCode] = useState(""); // Store input value
  const [message, setMessage] = useState(""); // Store success/error message
  const router = useRouter();

  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [classType, setClassType] = useState("");
  const [customSchool, setCustomSchool] = useState("");

  const handleNext = () => {
    const finalSchoolName = school === "other" ? customSchool : school;
    if (!name || !finalSchoolName || !classType) {
      alert("Please fill in all fields before proceeding.");
      return;
    }
    sessionStorage.setItem(
      "courseData",
      JSON.stringify({ name, school: finalSchoolName, classType })
    );
    router.push("/finalize-course");
  };

  const handleCodeSubmission = () => {
    if (validateTeacherCode(teacherCode)) {
      alert("Correct code, now entering course creation");
      alert("Use supabase code now to generate the course");
    } else {
      setMessage("Invalid code. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black">
      <div className="flex flex-row items-center justify-center">
        <h1 className="text-lg font-semibold">Enter Your Name: </h1>
        <input
          className="text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Type here..."
        ></input>
      </div>
      <div className="flex flex-row items-center justify-center">
        <div className="flex flex-col  bg-black text-white">
          <div className="flex flex-row items-center justify-center gap-2">
            <label htmlFor="school" className="text-lg font-semibold">
              Select Your School:
            </label>
            <select
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="border p-2 rounded text-black"
            >
              <option value="">-- Choose a School --</option>
              {schools.map((school, index) => (
                <option key={index} value={school}>
                  {school}
                </option>
              ))}
              <option value="other">Other (Type Below)</option>
            </select>
          </div>

          {/* Input field for custom school name */}
          {school === "other" && (
            <div className="mt-4">
              <label htmlFor="customSchool" className="text-lg font-semibold">
                Enter Your School Name:
              </label>
              <input
                type="text"
                id="customSchool"
                placeholder="Type your school name..."
                value={customSchool}
                onChange={(e) => setCustomSchool(e.target.value)}
                className="border p-2 rounded text-black mt-2"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row items-center justify-center">
        <h1 className="text-lg font-semibold">Select Your Class Type:</h1>
        <button
          className={`px-4 py-2 rounded ${
            classType === "Experimental"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setClassType("Experimental")}
        >
          Experimental
        </button>

        <button
          className={`px-4 py-2 rounded ${
            classType === "Control"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => setClassType("Control")}
        >
          Control
        </button>
      </div>

      <button
        className="text-xl bg-blue-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
}
