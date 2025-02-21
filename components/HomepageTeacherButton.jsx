"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateTeacherCode } from "../utils/helpers"; // Import the helper function

export default function HomepageTeacherButton() {
  const [showInput, setShowInput] = useState(false); // Show/hide input box
  const [teacherCode, setTeacherCode] = useState(""); // Store input value
  const [message, setMessage] = useState(""); // Store success/error message
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/teacher-join"); 
  };

  return (
    <div>
      <button
        className="text-xl bg-blue-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
        onClick={handleButtonClick}
      >
        Join Course as Teacher
      </button>
      
    </div>
  );
}
