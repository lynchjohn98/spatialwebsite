"use client";
import { useRouter } from "next/navigation";

export default function HomepageHelpButton() {
  const router = useRouter();

  return (
    <button
      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition-all duration-300 text-center font-medium"
      onClick={() => router.push("/help")}
    >
      Need Help?
    </button>
  );
}