"use client";
import { retrieveTeacherCourse } from "../actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TeacherJoin() {
  const [joinCode1, joinCodeSet1] = useState("");
  const [joinCode2, joinCodeSet2] = useState("");
  const [password, passwordSet] = useState("");

  const router = useRouter();
  const handleSubmit = async () => {
    let joinCode = (joinCode1 + "-" + joinCode2).toUpperCase();
    let payload = { joinCode: joinCode, password: password };
    const result = await retrieveTeacherCourse(payload);
    if (result.error) {
      alert("Invalid credentials. Access denied.");
    } else {
      sessionStorage.setItem("courseData", JSON.stringify(result.data));
      router.push("/teacher-dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black">
      This is the teacher join page. Please enter the course join code that was
      generated during creating your course and the password you created.
      <div className="flex flex-row items-center justify-center">
        <input
          type="text"
          className="text-black"
          onChange={(e) => joinCodeSet1(e.target.value)}
          placeholder="Enter course join code here"
        ></input>
        <p> - </p>

        <input
          type="text"
          className="text-black"
          onChange={(e) => joinCodeSet2(e.target.value)}
          placeholder="Enter course join code here"
        ></input>
      </div>
      <div className="flex flex-row items-center justify-center">
        <input
          type="text"
          className="text-black"
          onChange={(e) => passwordSet(e.target.value)}
          placeholder="Enter the teacher password created during course creation"
        ></input>
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
