// components/module/ReturnButton.jsx
import { useRouter } from "next/navigation";

export default function ReturnButton({ destination = "/teacher-dashboard/modules", label = "Return to Modules" }) {
  const router = useRouter();

  const handleReturn = () => {
    router.push(destination);
  };

  return (
    <button
      onClick={handleReturn}
      className="flex items-center text-white hover:text-blue-300 transition-colors mb-6"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
      {label}
    </button>
  );
}