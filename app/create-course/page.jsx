"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateTeacherCode, schools } from "../../utils/helpers";

export default function CreateCourse() {
  const [teacherCode, setTeacherCode] = useState("");
  const [message, setMessage] = useState("");
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
      <div className="w-full max-w-md sm:max-w-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
          Create Your New Course
        </h1>
        
        <div className="space-y-6">

          <div className="space-y-2">
            <label htmlFor="teacherName" className="block text-lg font-medium">
              Enter Your Name
            </label>
            <input
              id="teacherName"
              className="w-full px-4 py-2 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Your full name"
              tabIndex={1}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="school" className="block text-lg font-medium">
              Select Your School
            </label>
            <select
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-4 py-2 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              tabIndex={2}
            >
              <option value="">-- Choose a School --</option>
              {schools.map((school, index) => (
                <option key={index} value={school}>
                  {school}
                </option>
              ))}
              <option value="other" >Other (Type Below)</option>
            </select>
          </div>
          
          {school === "other" && (
            <div className="space-y-2">
              <label htmlFor="customSchool" className="block text-lg font-medium">
                Enter Your School Name
              </label>
              <input
                id="customSchool"
                type="text"
                placeholder="Type your school name..."
                value={customSchool}
                onChange={(e) => setCustomSchool(e.target.value)}
                className="w-full px-4 py-2 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                tabIndex={3}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-lg font-medium">
              Select Your Class Type
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  classType === "Experimental"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black hover:bg-gray-400"
                }`}
                onClick={() => setClassType("Experimental")}
                tabIndex={4}
              >
                Experimental
              </button>

              <button
                type="button"
                className={`flex-1 px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  classType === "Control"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black hover:bg-gray-400"
                }`}
                onClick={() => setClassType("Control")}
                tabIndex={5}
              >
                Control
              </button>
            </div>
          </div>
          
          {/* Next Button */}
          <div className="pt-4">
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 focus:ring-offset-gray-900"
              onClick={handleNext}
              tabIndex={6}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}