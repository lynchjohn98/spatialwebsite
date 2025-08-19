"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { generateStudentUsername } from "../../utils/helpers";



const StudentTable = forwardRef(({ tableTitle, tableData, teacherName, schoolName }, ref) => {
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  
  useEffect(() => {
    if (typeof tableData === 'string') {
      try {
        const parsedData = JSON.parse(tableData);
        const cleanedData = Array.isArray(parsedData) ? parsedData : [parsedData];
        const updatedData = cleanedData.map(student => ({
          ...student,
          gender: student.gender || 'Not Disclosed',
          genderOther: student.genderOther || '',
          age: student.age || '',
          esl_status: student.esl_status || 'No'
        }));
        setData(updatedData);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
        setData([]);
      }
    } else {
      const cleanedData = Array.isArray(tableData) ? tableData : tableData ? [tableData] : [];
      const updatedData = cleanedData.map(student => ({
        ...student,
        gender: student.gender || 'Not Disclosed',
        genderOther: student.genderOther || '',
        age: student.age || '',
        esl_status: student.esl_status || 'No'
      }));
      setData(updatedData);
    }
  }, [tableData]);

  const addStudent = () => {
    const newStudent = {
      first_name: "",
      last_name: "",
      gender: "Not Disclosed",
      genderOther: "",
      age: "",
      esl_status: "No",
      other: "",
      student_join_code: "", // Will be generated when last name is entered
    };
    setData([...data, newStudent]);
  };

  const updateStudent = (index, field, value) => {
    setData(prevData => 
      prevData.map((student, i) => {
        if (i === index) {
          const updatedStudent = { ...student, [field]: value };
          
          // Clear genderOther if gender is not "Other"
          if (field === 'gender' && value !== 'Other') {
            updatedStudent.genderOther = '';
          }
          
          // Auto-generate username when last name is entered or changed
          if (field === 'last_name' && value.trim() && teacherName && schoolName) {
            updatedStudent.student_join_code = generateStudentUsername(
              value.trim(),
              teacherName,
              schoolName
            );
          }
          
          return updatedStudent;
        }
        return student;
      })
    );
  };

  const removeStudent = (index) => {
    setData(prevData => prevData.filter((_, i) => i !== index));
  };

  const regenerateUsername = (index) => {
    const student = data[index];
    if (student.last_name && teacherName && schoolName) {
      const newUsername = generateStudentUsername(
        student.last_name,
        teacherName,
        schoolName
      );
      updateStudent(index, 'student_join_code', newUsername);
    }
  };

  const validateAge = (value) => {
    const num = parseInt(value);
    if (isNaN(num)) return '';
    if (num < 10) return '10';
    if (num > 20) return '20';
    return value;
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
          <table className="table-auto w-full border-collapse border border-gray-600 min-w-[900px]">
            <thead className="bg-gray-700 sticky top-0 z-10">
              <tr>
                <th className="border border-gray-600 px-4 py-2">First Name</th>
                <th className="border border-gray-600 px-4 py-2">Last Name</th>
                <th className="border border-gray-600 px-4 py-2">Gender</th>
                <th className="border border-gray-600 px-4 py-2">Age</th>
                <th className="border border-gray-600 px-4 py-2">ESL Status</th>
                <th className="border border-gray-600 px-4 py-2">Username</th>
                <th className="border border-gray-600 px-4 py-2 w-20">Remove</th>
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
                        placeholder="Enter first name"
                      />
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      <input
                        type="text"
                        value={student.last_name || ''}
                        onChange={(e) => updateStudent(index, 'last_name', e.target.value)}
                        className="w-full bg-gray-700 text-white p-1 rounded"
                        placeholder="Enter last name"
                      />
                      {student.last_name && !student.student_join_code && (
                        <p className="text-xs text-yellow-400 mt-1">
                          Username will generate when you enter the last name
                        </p>
                      )}
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      <select
                        value={student.gender || 'Not Disclosed'}
                        onChange={(e) => updateStudent(index, 'gender', e.target.value)}
                        className="w-full bg-gray-700 text-white p-1 rounded mb-1"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Not Disclosed">Not Disclosed</option>
                      </select>
                      {student.gender === 'Other' && (
                        <input
                          type="text"
                          value={student.genderOther || ''}
                          onChange={(e) => updateStudent(index, 'genderOther', e.target.value)}
                          className="w-full bg-gray-600 text-white p-1 rounded text-xs"
                          placeholder="Please specify"
                        />
                      )}
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      <div className="flex flex-col gap-1">
                        <select
                          value={student.age || ''}
                          onChange={(e) => updateStudent(index, 'age', e.target.value)}
                          className="w-full bg-gray-700 text-white p-1 rounded text-sm"
                        >
                          <option value="">Select Age</option>
                          {Array.from({ length: 11 }, (_, i) => i + 10).map(age => (
                            <option key={age} value={age}>{age}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="10"
                          max="20"
                          value={student.age || ''}
                          onChange={(e) => updateStudent(index, 'age', validateAge(e.target.value))}
                          className="w-full bg-gray-600 text-white p-1 rounded text-xs"
                          placeholder="Or type (10-20)"
                        />
                      </div>
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      <select
                        value={student.esl_status || 'No'}
                        onChange={(e) => updateStudent(index, 'esl_status', e.target.value)}
                        className="w-full bg-gray-700 text-white p-1 rounded"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                        <option value="Unknown">Unknown</option>
                      </select>
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      <div className="flex items-center">
                        <span className="bg-blue-900 px-2 py-1 rounded font-mono text-xs flex-1 mr-2 break-all">
                          {student.student_join_code || 'Enter last name first'}
                        </span>
                        {student.last_name && (
                          <button
                            onClick={() => regenerateUsername(index)}
                            className="p-1 rounded-full bg-gray-600 hover:bg-blue-600 transition-colors flex-shrink-0"
                            title="Regenerate username"
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
                        )}
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
        
        <div className="mt-3 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Total Students: {data.length}
          </div>
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