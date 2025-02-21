"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VisibilityTable({ tableTitle, tableData, moniker }) {
  const [showTable, setShowTable] = useState(false);
  const [data, setData] = useState(tableData); // ✅ Track visibility state
  const router = useRouter();

  // ✅ Toggle visibility function
  const toggleVisibility = (index) => {
    setData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, visible: !item.visible } : item
      )
    );
  };

  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg shadow-md m-4">
      {/* ✅ Clickable Header */}
      <div
        className="flex items-center justify-between cursor-pointer text-white text-xl font-semibold bg-gray-700 p-3 rounded-lg transition-all duration-300"
        onClick={() => setShowTable(!showTable)}
      >
        <h1> {tableTitle} </h1>
        <span className="text-2xl transition-transform duration-300 transform">
          {showTable ? "▲" : "▼"}
        </span>
      </div>

      {/* ✅ Smooth Animated Collapsible Table */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          showTable ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <table className="table-auto w-full border-collapse border border-gray-600 mt-2">
          <thead className="bg-gray-700">
            <tr>
              <th className="border border-gray-600 px-4 py-2">{moniker} Name</th>
              <th className="border border-gray-600 px-4 py-2">{moniker} Description</th>
              <th className="border border-gray-600 px-4 py-2">{moniker} Visible</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border border-gray-600 px-4 py-2">
                <td className="border border-gray-600 px-4 py-2">{item.name}</td>
                <td className="border border-gray-600 px-4 py-2">{item.description}</td>

                {/* ✅ Visibility Toggle */}
                <td className="border border-gray-600 px-4 py-2 text-center">
                  <button
                    onClick={() => toggleVisibility(index)}
                    className="text-2xl transition-all"
                  >
                    {item.visible ? (
                      <span className="text-green-500">✅</span>
                    ) : (
                      <span className="text-red-500">❌</span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
