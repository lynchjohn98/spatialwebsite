// components/HomepageStudentButton.jsx
"use client";
import { useRouter } from "next/navigation";

export default function ResponsiveButton({ label, onClick }) {
  return (
    <button
      className="w-full  bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none text-white py-3 px-2 rounded-md transition-all duration-300 text-center font-medium text-sm sm:text-base"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
