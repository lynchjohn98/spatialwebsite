"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useRouter } from "next/navigation";

const VisibilityTable = forwardRef(({ tableTitle, tableData, moniker, maxHeight = "400px" }, ref) => {
  const [showTable, setShowTable] = useState(false);
  const [data, setData] = useState([]);
  const router = useRouter();

  // Parse the JSON data when the component loads or tableData changes
  useEffect(() => {
    if (typeof tableData === 'string') {
      try {
        // Parse the JSON string
        const parsedData = JSON.parse(tableData);
        setData(parsedData);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
        setData([]);
      }
    } else {
      // If it's already an object (array), use it directly
      setData(Array.isArray(tableData) ? tableData : []);
    }
  }, [tableData]);

  // Toggle visibility function
  const toggleVisibility = (index) => {
    setData((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            visibility: item.visibility === "Yes" ? "No" : "Yes"
          };
        }
        return item;
      })
    );
  };

  // Expose methods to parent component using useImperativeHandle
  useImperativeHandle(ref, () => ({
    // Return the current data
    getUpdatedData: () => data,
    
    // Get JSON string of the data
    getUpdatedJsonString: () => JSON.stringify(data)
  }));

  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg shadow-md m-4">
      {/* Header section */}
      <div
        className="flex items-center justify-between cursor-pointer text-white text-xl font-semibold bg-gray-700 p-3 rounded-lg transition-all duration-300"
        onClick={() => setShowTable(!showTable)}
      >
        <h1> {tableTitle} </h1>
        <span className="text-2xl transition-transform duration-300 transform">
          {showTable ? "▲" : "▼"}
        </span>
      </div>

      {/* Table container with animation */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          showTable ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Fixed header table */}
        <div className="relative mt-2">
          {/* Table header - fixed */}
          <table className="table-auto w-full border-collapse border border-gray-600 sticky top-0">
            <thead className="bg-gray-700">
              <tr>
                <th className="border border-gray-600 px-4 py-2">{moniker} Name</th>
                <th className="border border-gray-600 px-4 py-2">{moniker} Description</th>
                <th className="border border-gray-600 px-4 py-2 w-24">{moniker} Visible</th>
              </tr>
            </thead>
          </table>
          
          {/* Scrollable table body - INCREASED HEIGHT */}
          <div className={`overflow-y-auto`} style={{ maxHeight: maxHeight }}>
            <table className="table-auto w-full border-collapse border border-gray-600">
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border border-gray-600 hover:bg-gray-700">
                    <td className="border border-gray-600 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-600 px-4 py-2">{item.description}</td>

                    {/* Visibility Toggle */}
                    <td className="border border-gray-600 px-4 py-2 text-center w-24">
                      <button
                        onClick={() => toggleVisibility(index)}
                        className="text-2xl transition-all"
                        aria-label={`Toggle visibility for ${item.name}`}
                      >
                        {item.visibility === "Yes" ? (
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
      </div>
    </div>
  );
});

// Add display name for better debugging
VisibilityTable.displayName = "VisibilityTable";

export default VisibilityTable;