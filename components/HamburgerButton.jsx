"use client";

export default function HamburgerButton({ onClick }) {
  return (
    <button
      className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-700 text-white md:hidden hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
  );
}