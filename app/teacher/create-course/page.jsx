"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { counties } from "../../library/helpers/clienthelpers";
import { getTeacherData } from "../../library/services/teacher_actions";

export default function CreateCourse() {
  const router = useRouter();
  const [county, setCounty] = useState("");
  const [urbanicity, setUrbanicity] = useState("");
  const [schoolGender, setSchoolGender] = useState("");
  const [deis, setDeis] = useState("");
  const [schoolLanguage, setSchoolLanguage] = useState("");
  const [courseResearchType, setCourseResearchType] = useState("");
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleNext = () => {
    if (
      !county ||
      !urbanicity ||
      !schoolGender ||
      !deis ||
      !schoolLanguage ||
      !courseResearchType
    ) {
      alert("Please fill in all fields before proceeding.");
      return;
    }
    sessionStorage.setItem(
      "courseData",
      JSON.stringify({
        name: teacherData.name,
        county,
        urbanicity,
        schoolGender,
        deis,
        schoolLanguage,
        courseResearch: true,       // always true
        courseResearchType,         // "Control" | "Experimental" | "Unknown"
      })
    );
    router.push("/teacher/finalize-course");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
      <div className="w-full max-w-md sm:max-w-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
          Create Your New Course
        </h1>
        <p className="text-lg mb-4 text-center">
          In the following form, please enter your school's details.
        </p>

        <div className="space-y-6">

          <div className="space-y-2">
            <label htmlFor="teacherName" className="block text-lg font-medium">
              Teacher Name:
            </label>
            <input
              id="teacherName"
              className="w-full px-4 py-2 rounded bg-gray-100 text-gray-700 border border-gray-300 cursor-not-allowed"
              value={teacherData?.name || ""}
              readOnly
              type="text"
              tabIndex={-1}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="county" className="block text-lg font-medium">
              Select County:
            </label>
            <select
              id="county"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              tabIndex={2}
            >
              <option value="">-- Choose a County --</option>
              {counties.map((county, index) => (
                <option key={index} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="urbanicity" className="block text-lg font-medium">
              Select Urbanicity:
            </label>
            <select
              id="urbanicity"
              value={urbanicity}
              onChange={(e) => setUrbanicity(e.target.value)}
              className="w-full px-4 py-2 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              tabIndex={3}
            >
              <option value="">-- Choose Urbanicity --</option>
              <option value="Urban">Urban</option>
              <option value="Suburban">Suburban</option>
              <option value="Rural">Rural</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="schoolGender" className="block text-lg font-medium">
              Select School Gender:
            </label>
            <select
              id="schoolGender"
              value={schoolGender}
              onChange={(e) => setSchoolGender(e.target.value)}
              className="w-full px-4 py-2 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              tabIndex={4}
            >
              <option value="">-- Choose School Gender --</option>
              <option value="Male">All Male</option>
              <option value="Female">All Female</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="deis" className="block text-lg font-medium">
              Select DEIS Status:
            </label>
            <select
              id="deis"
              value={deis}
              onChange={(e) => setDeis(e.target.value)}
              className="w-full px-4 py-2 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              tabIndex={5}
            >
              <option value="">-- Choose DEIS Status --</option>
              <option value="DEIS">DEIS</option>
              <option value="Non-DEIS">Non-DEIS</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="schoolLanguage" className="block text-lg font-medium">
              Select School Language:
            </label>
            <select
              id="schoolLanguage"
              value={schoolLanguage}
              onChange={(e) => setSchoolLanguage(e.target.value)}
              className="w-full px-4 py-2 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              tabIndex={6}
            >
              <option value="">-- Choose School Language --</option>
              <option value="Irish">Irish</option>
              <option value="English">English</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="courseResearchType" className="block text-lg font-medium">
              What type of course is this?
            </label>
            <select
              id="courseResearchType"
              value={courseResearchType}
              onChange={(e) => setCourseResearchType(e.target.value)}
              className="w-full px-4 py-2 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              tabIndex={7}
            >
              <option value="">-- Pick course type --</option>
              <option value="Control">Control</option>
              <option value="Experimental">Experimental</option>
              <option value="Unknown">I don't know</option>
            </select>
          </div>

          {/* Next Button */}
          <div className="pt-4">
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 focus:ring-offset-gray-900"
              onClick={handleNext}
              tabIndex={8}
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}