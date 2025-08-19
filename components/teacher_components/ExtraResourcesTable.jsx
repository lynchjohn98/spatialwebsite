"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supplementalMaterialInformation } from "../../app/library/helpers/helpers";

export default function ExtraResourcesTable({ tableTitle }) {
  const [showTable, setShowTable] = useState(false);
  const router = useRouter();

  const handleDownload = (url) => {
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
    } else if (url) {
      window.location.href = url;
    } else {
      console.error("Download URL is missing");
    }
  };

  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg shadow-md m-4">
      {/* Header section */}
      <div
        className="flex items-center justify-between cursor-pointer text-white text-xl font-semibold bg-gray-700 p-3 rounded-lg transition-all duration-300"
        onClick={() => setShowTable(!showTable)}
      >
        <h1>{tableTitle || "Extra Resources"}</h1>
        <span className="text-2xl transition-transform duration-300 transform">
          {showTable ? "▲" : "▼"}
        </span>
      </div>

      {/* Table container with animation */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          showTable ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Fixed header table */}
        <div className="relative mt-2">
          {/* Table header - fixed */}
          <table className="table-auto w-full border-collapse border border-gray-600 sticky top-0">
            <thead className="bg-gray-700">
              <tr>
                <th className="border border-gray-600 px-4 py-2">Resource Name</th>
                <th className="border border-gray-600 px-4 py-2">Description</th>
                <th className="border border-gray-600 px-4 py-2 w-24">Download</th>
              </tr>
            </thead>
          </table>
          
          {/* Scrollable table body */}
          <div className="max-h-[250px] overflow-y-auto">
            <table className="table-auto w-full border-collapse border border-gray-600">
              <tbody>
                {supplementalMaterialInformation.map((resource, index) => (
                  <tr key={index} className="border border-gray-600 hover:bg-gray-700">
                    <td className="border border-gray-600 px-4 py-2">{resource.title}</td>
                    <td className="border border-gray-600 px-4 py-2">{resource.description}</td>

                    {/* Download button */}
                    <td className="border border-gray-600 px-4 py-2 text-center w-24">
                      <button
                        onClick={() => handleDownload(resource.downloadUrl)}
                        className="text-blue-400 hover:text-blue-300 transition-all"
                        title={`Download ${resource.title}`}
                        disabled={!resource.downloadUrl}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-6 w-6 mx-auto" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke={resource.downloadUrl ? "currentColor" : "#666"}
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}