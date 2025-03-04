"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { generateStudentCode } from "../utils/helpers";

const StudentTable = forwardRef(({ tableTitle, tableData }, ref) => {
  console.log("Raw tableData:", tableData);

  // Ensure `tableData` is always an array
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  // Initialize data when component loads or tableData changes
  useEffect(() => {
    if (typeof tableData === 'string') {
      try {
        // Parse the JSON string
        const parsedData = JSON.parse(tableData);
        setData(Array.isArray(parsedData) ? parsedData : [parsedData]);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
        setData([]);
      }
    } else {
      // If it's already an object or array, format appropriately
      setData(Array.isArray(tableData) ? tableData : tableData ? [tableData] : []);
    }
  }, [tableData]);

  // Add a new student
  const addStudent = () => {
    const newStudent = {
      first_name: "",
      last_name: "",
      student_code: generateStudentCode(),
      gender: "Other",
      other: "",
      student_join_code: generateStudentCode(),
    };
    setData([...data, newStudent]);
  };

  // Update student data at specific index
  const updateStudent = (index, field, value) => {
    setData(prevData => 
      prevData.map((student, i) => 
        i === index ? { ...student, [field]: value } : student
      )
    );
  };

  // Remove student at specific index
  const removeStudent = (index) => {
    setData(prevData => prevData.filter((_, i) => i !== index));
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    // Get current data
    getUpdatedData: () => data,
    
    // Get JSON string of the data
    getUpdatedJsonString: () => JSON.stringify(data),
    
    // Add student method
    addStudent,
    
    // Remove student method
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

      {/* Animated container for the table */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          showTable ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Container with horizontal and vertical scrolling */}
        <div className="overflow-auto max-h-[400px] mt-2">
          <table className="table-auto w-full border-collapse border border-gray-600 min-w-[700px]">
            <thead className="bg-gray-700 sticky top-0 z-10">
              <tr>
                <th className="border border-gray-600 px-4 py-2">First Name</th>
                <th className="border border-gray-600 px-4 py-2">Last Name</th>
                <th className="border border-gray-600 px-4 py-2">Student Join Code</th>
                <th className="border border-gray-600 px-4 py-2">Gender</th>
                <th className="border border-gray-600 px-4 py-2">Other</th>
                <th className="border border-gray-600 px-4 py-2 w-20">Action</th>
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
                    <td className="border border-gray-600 px-4 py-2 text-center">
                      {student.student_code}
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
                    <td className="border border-gray-600 px-4 py-2 text-center">
                      {student.student_join_code}
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
                    colSpan="7"
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