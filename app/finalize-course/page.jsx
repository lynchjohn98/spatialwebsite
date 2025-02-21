"use client";
import { insertCourse } from "../actions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateJoinCode } from "../../utils/helpers";
import { validateTeacherCode } from "../../utils/helpers";


export default function FinalizeCourse() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [courseData, setCourseData] = useState(null);
  const [joinCode, setJoinCode] = useState("");
  const [teacherCode, setTeacherCode] = useState("");
  const [allCourseData, setAllCourseData] = useState([]);


  useEffect(() => {
    const storedData = sessionStorage.getItem("courseData");
    if (storedData) {
      setCourseData(JSON.parse(storedData));
    }
  }, []);
  if (!courseData) {
    return <p className="text-white">Loading...</p>;
  }

  const getJoinCode = () => {
    setJoinCode(generateJoinCode());
  };

  // Validation phase to ensure all fields are selected.
  const handleSubmit = async () => {
    console.log("courseData", courseData);
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

    //Validated all data, send to server side to upload into backend.
    const allCourseData = {
      name: courseData.name,
      school: courseData.school,
      classType: courseData.classType,
      joinCode: joinCode,
      password: password,
    };
    await insertCourse(allCourseData);
    alert("Course created successfully! Please remember your join code and password. Join Code: " + joinCode + " Password: " + password);
    router.push('/')
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black">
      <p> Please ensure the following information is correct: </p>
      <div className="flex flex-row">
        <h1> Teacher Name: </h1>
        <h1> {courseData.name} </h1>
        <h1> School Name: </h1>
        {courseData.school}
        <h1> Course Type: </h1>
        {courseData.classType}
      </div>
      <div className="flex flex-row">
  
</div>
      <div>
        <div className="flex flex-col">
          <div className="flex flex-row">
            <label className="text-klg font-semibold">
              Create Teacher Password:{" "}
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded text-black"
            />
          </div>
          <div className="flex flex-row">
            <label className="text-klg font-semibold">
              Confirm Teacher Password:{" "}
            </label>
            <input
              type="p0assword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 rounded text-black"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <button
          onClick={getJoinCode}
          className="bg-blue-500 px-4 py-2 rounded ml-2"
        >
          Generate Code
        </button>

        <input
          type="text"
          value={joinCode}
          readOnly
          className="border p-2 rounded text-black w-36 text-center"
        />
      </div>

      <div className="flex flex-row">
        <label>Enter Course Creation Password: </label>
        <input
          value={teacherCode}
          onChange={(e) => setTeacherCode(e.target.value)}
          type="text"
          className="border p-2 rounded text-black"
        />
      </div>

      <div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 px-4 py-2 rounded ml-2"
        >
          Create Course
        </button>
      </div>
    </div>
  );
}
