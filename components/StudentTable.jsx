"use client";
import { generateStudentCode } from "../utils/helpers";
import { useState, useEffect } from "react";

export default function StudentTable({ tableTitle, tableData }) {
  console.log("Raw tableData:", tableData);

  // ✅ Ensure `tableData` is always an array
  const data = Array.isArray(tableData) ? tableData : [tableData]; // Wrap in array if needed
  console.log("Processed Data:", data);

  const [showTable, setShowTable] = useState(false);

  const addStudent = () => {
    const newStudent = {
      first_name: "",
      last_name: "",
      student_code: generateStudentCode(),
      gender: "Other",
      other: ""
    };
  }

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

      {/* ✅ Ensure the table is visible when showTable is true */}
      {showTable && (
        <table className="table-auto w-full border-collapse border border-gray-600 mt-2">
          <thead className="bg-gray-700">
            <tr>
              <th className="border border-gray-600 px-4 py-2">First Name</th>
              <th className="border border-gray-600 px-4 py-2">Last Name</th>
              <th className="border border-gray-600 px-4 py-2">Student Code</th>
              <th className="border border-gray-600 px-4 py-2">Gender</th>
              <th className="border border-gray-600 px-4 py-2">Other</th>
              <th className="border border-gray-600 px-4 py-2">Join Code</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((student, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="border border-gray-600 px-4 py-2">
                    {student.first_name}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {student.last_name}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {student.student_code}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {student.gender}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {student.other}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {student.student_join_code}
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
            <tr>
              <td colSpan="6" className="border border-gray-600 px-4 py-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    const newStudent = {
                      first_name: "",
                      last_name: "",
                      student_code: generateStudentCode(),
                      gender: "",
                      other: "",
                      student_join_code: "",
                    };
                    setData([...data, newStudent]);
                  }}
                >
                  Add Student
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
