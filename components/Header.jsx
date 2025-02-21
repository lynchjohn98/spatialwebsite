"use client";

export default function Header({ setIsSidebarOpen }) {
  return (
    <button
      className="absolute top-4 left-4 bg-gray-700 p-2 rounded md:hidden"
      onClick={() => setIsSidebarOpen((prev) => !prev)}
    >
      ☰
    </button>
  );
}
