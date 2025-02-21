"use client";
import { useRouter } from "next/navigation";

export default function HomepageCreateCourseButton() {
  const router = useRouter();

  return (
    <button
      className="text-xl bg-blue-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
      onClick={() => router.push("/create-course")} // Redirects only on click
    >
      Create Course
    </button>
  );
}
