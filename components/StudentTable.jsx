"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateStudentCode } from "../utils/helpers";

export default function StudentTable({ tableTitle, tableData }) {
  const [showTable, setShowTable] = useState(false);
  const [data, setData] = useState(tableData); // ✅ Proper state tracking
  const router = useRouter();

  // ✅ Edit Student Data
  const handleEditStudent = (index, field, value) => {
    setData((prev) =>
      prev.map((student, i) =>
        i === index ? { ...student, [field]: value } : student
      )
    );
  };

  // ✅ Generate New Student Code
  const handleRegenerateCode = (index) => {
    setData((prev) =>
      prev.map((student, i) =>
        i === index
          ? { ...student, student_code: generateStudentCode() }
          : student
      )
    );
  };

  const handleAddStudent = () => {
    const newStudent = {
      first_name: "",
      last_name: "",
      student_code: generateStudentCode(), // Generate unique student code
      gender: "Other",
      grade: "",
    };
    setData([...data, newStudent]); // Add to the list
  };

  const updateCustomGender = (index) => {
    setData((prev) =>
      prev.map((s, i) =>
        i === index && s.customGender.trim()
          ? { ...s, gender: s.customGender, isEditingGender: false } // ✅ Save custom gender
          : s
      )
    );
  };

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
        <table className="table-auto w-full border-collapse border border-gray-600 mt-2">
          <thead className="bg-gray-700">
            <tr>
              <th className="border border-gray-600 px-4 py-2">First Name</th>
              <th className="border border-gray-600 px-4 py-2">Last Name</th>
              <th className="border border-gray-600 px-4 py-2">Student Code</th>
              <th className="border border-gray-600 px-4 py-2">Gender</th>
              <th className="border border-gray-600 px-4 py-2">
                Grade (Year) / Age
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((student, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  {/* ✅ Editable First Name */}
                  <td className="border border-gray-600 px-4 py-2">
                    <input
                      type="text"
                      value={student.first_name}
                      onChange={(e) =>
                        handleEditStudent(index, "first_name", e.target.value)
                      }
                      className="bg-transparent border-none w-full text-white"
                    />
                  </td>

                  {/* ✅ Editable Last Name */}
                  <td className="border border-gray-600 px-4 py-2">
                    <input
                      type="text"
                      value={student.last_name}
                      onChange={(e) =>
                        handleEditStudent(index, "last_name", e.target.value)
                      }
                      className="bg-transparent border-none w-full text-white"
                    />
                  </td>

                  {/* ✅ Student Code with Regenerate Button */}
                  <td className="border border-gray-600 px-4 py-2 flex items-center justify-between">
                    <span className="font-mono">{student.student_code}</span>
                    <button
                      onClick={() => handleRegenerateCode(index)}
                      className="ml-2 text-blue-400 hover:text-blue-600 transition-all"
                    >
                      🔄
                    </button>
                  </td>

                  <td>
                    <td className="border border-gray-600 px-4 py-2 flex items-center">
                      <select
                        value={student.gender}
                        onChange={(e) => {
                          const newGender = e.target.value;
                          setData((prev) =>
                            prev.map((s, i) =>
                              i === index
                                ? {
                                    ...s,
                                    gender: newGender,
                                    customGender:
                                      newGender === "Other" ? "" : null, // ✅ Reset if not "Other"
                                    isEditingGender: newGender === "Other", // ✅ Show input when "Other" is selected
                                  }
                                : s
                            )
                          );
                        }}
                        className="bg-transparent border-none w-full text-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Prefer Not To Say">
                          Prefer Not To Say
                        </option>
                        <option value="Other">Other</option>
                      </select>

                      {/* ✅ Show Input Field when "Other" is Selected */}
                      {student.gender === "Other" &&
                        student.isEditingGender && (
                          <div className="flex items-center ml-2">
                            <input
                              type="text"
                              placeholder="Enter Gender"
                              value={student.customGender}
                              onChange={(e) =>
                                setData((prev) =>
                                  prev.map((s, i) =>
                                    i === index
                                      ? { ...s, customGender: e.target.value }
                                      : s
                                  )
                                )
                              }
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  student.customGender.trim()
                                ) {
                                  updateCustomGender(index);
                                }
                              }}
                              className="bg-gray-900 text-white border border-gray-600 px-2 py-1 rounded w-32"
                            />
                            {/* ✅ Checkmark Button to Confirm */}
                            <button
                              onClick={() => updateCustomGender(index)}
                              className="ml-2 text-green-400 hover:text-green-600 transition-all"
                            >
                              ✅
                            </button>
                          </div>
                        )}
                    </td>
                  </td>

                  {/* ✅ Editable Grade */}
                  <td className="border border-gray-600 px-4 py-2">
                    <input
                      type="text"
                      value={student.grade}
                      onChange={(e) =>
                        handleEditStudent(index, "grade", e.target.value)
                      }
                      className="bg-transparent border-none w-full text-white"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center border border-gray-600 px-4 py-2"
                >
                  No students added yet.
                </td>
              </tr>
            )}
            {/* ✅ Add Student Row */}
            <tr>
              <td
                colSpan="5"
                className="text-center border border-gray-600 px-4 py-2"
              >
                <button
                  onClick={handleAddStudent}
                  className="text-green-400 hover:text-green-600 transition-all text-2xl"
                >
                  ➕ Add Student
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
