"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { generateStudentCode } from "../utils/helpers";

const StudentTable = forwardRef(({ tableTitle, tableData }, ref) => {
  console.log("Raw tableData:", tableData);

  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    if (typeof tableData === 'string') {
      try {
        const parsedData = JSON.parse(tableData);
        setData(Array.isArray(parsedData) ? parsedData : [parsedData]);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
        setData([]);
      }
    } else {
      setData(Array.isArray(tableData) ? tableData : tableData ? [tableData] : []);
    }
  }, [tableData]);

  const addStudent = () => {
    const newStudent = {
      first_name: "",
      last_name: "",
      gender: "Other",
      other: "",
      student_join_code: generateStudentCode(),
    };
    setData([...data, newStudent]);
  };

  const updateStudent = (index, field, value) => {
    setData(prevData => 
      prevData.map((student, i) => 
        i === index ? { ...student, [field]: value } : student
      )
    );
  };

  const removeStudent = (index) => {
    setData(prevData => prevData.filter((_, i) => i !== index));
  };

  const regenerateJoinCode = (index) => {
    const newCode = generateStudentCode();
    updateStudent(index, 'student_join_code', newCode);
  };

  useImperativeHandle(ref, () => ({
    getUpdatedData: () => data,
    getUpdatedJsonString: () => JSON.stringify(data),
    addStudent,
    removeStudent
  }));

  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg shadow-md m-4">
      <div
        className="flex items-center justify-between cursor-pointer text-white text-xl font-semibold bg-gray-700 p-3 rounded-lg transition-all duration-300"
        onClick={() => setShowTable(!showTable)}
      >
        <h1>{tableTitle}</h1>
        <span className="text-2xl transition-transform duration-300 transform">
          {showTable ? "▲" : "▼"}
        </span>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          showTable ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="overflow-auto max-h-[400px] mt-2">
          <table className="table-auto w-full border-collapse border border-gray-600 min-w-[700px]">
            <thead className="bg-gray-700 sticky top-0 z-10">
              <tr>
                <th className="border border-gray-600 px-4 py-2">First Name</th>
                <th className="border border-gray-600 px-4 py-2">Last Name</th>
                <th className="border border-gray-600 px-4 py-2">Gender</th>
                <th className="border border-gray-600 px-4 py-2">Other</th>
                <th className="border border-gray-600 px-4 py-2">Join Code</th>
                <th className="border border-gray-600 px-4 py-2 w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="border border-gray-600 px-2 py-2">
                      <input
                        type="text"
                        value={student.first_name || ''}
                        onChange={(e) => updateStudent(index, 'first_name', e.target.value)}
                        className="w-full bg-gray-700 text-white p-1 rounded"
                      />
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      <input
                        type="text"
                        value={student.last_name || ''}
                        onChange={(e) => updateStudent(index, 'last_name', e.target.value)}
                        className="w-full bg-gray-700 text-white p-1 rounded"
                      />
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      <select
                        value={student.gender || 'Other'}
                        onChange={(e) => updateStudent(index, 'gender', e.target.value)}
                        className="w-full bg-gray-700 text-white p-1 rounded"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      <input
                        type="text"
                        value={student.other || ''}
                        onChange={(e) => updateStudent(index, 'other', e.target.value)}
                        className="w-full bg-gray-700 text-white p-1 rounded"
                      />
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      <div className="flex items-center">
                        <span className="bg-blue-900 px-2 py-1 rounded font-mono text-sm">
                          {student.student_join_code}
                        </span>
                        <button
                          onClick={() => regenerateJoinCode(index)}
                          className="ml-2 p-1 rounded-full bg-gray-600 hover:bg-blue-600 transition-colors"
                          title="Regenerate join code"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="border border-gray-600 px-2 py-2 text-center">
                      <button
                        onClick={() => removeStudent(index)}
                        className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                        title="Remove student"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center border border-gray-600 px-4 py-2"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Add Student Button - Outside of the scrollable area */}
        <div className="mt-3 flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={addStudent}
          >
            Add Student
          </button>
        </div>
      </div>
    </div>
  );
});

// Add display name for better debugging
StudentTable.displayName = "StudentTable";

export default StudentTable;