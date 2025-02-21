"use client";
import { useRouter } from "next/navigation";

export default function HomepageStudentButton() {
  const router = useRouter();

  return (
    <button
      className="text-xl bg-blue-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
      onClick={() => router.push("/student-join")} // Redirects only on click
    >
      Join Course As Student
    </button>
  );
}
