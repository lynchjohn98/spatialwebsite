"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { countyNumbers } from "../../app/library/helpers/clienthelpers";

const StudentTable = forwardRef(
  (
    {
      tableTitle,
      tableData,
      teacherName,
      countyName,
      courseData,
      onRemoveStudent, // New prop to handle backend deletion
    },
    ref
  ) => {
    const [data, setData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false); // Track removal state

    // Get default gender from course data
    const getDefaultGender = () => {
      if (courseData?.course_gender === "Male") return "Male";
      if (courseData?.course_gender === "Female") return "Female";
      return "Other";
    };

    useEffect(() => {
      if (typeof tableData === "string") {
        try {
          const parsedData = JSON.parse(tableData);
          const cleanedData = Array.isArray(parsedData)
            ? parsedData
            : [parsedData];
          const updatedData = cleanedData.map((student) => ({
            ...student,
            gender: student.gender || getDefaultGender(),
            age: student.age || "",
            esl_status: student.esl_status || "No",
            // Map student_join_code to student_username for backward compatibility
            student_username:
              student.student_username || student.student_join_code || "",
            student_consent: student.student_consent || false,
          }));
          setData(updatedData);
        } catch (error) {
          console.error("Error parsing JSON data:", error);
          setData([]);
        }
      } else {
        const cleanedData = Array.isArray(tableData)
          ? tableData
          : tableData
          ? [tableData]
          : [];
        const updatedData = cleanedData.map((student) => ({
          ...student,
          gender: student.gender || getDefaultGender(),
          age: student.age || "",
          esl_status: student.esl_status || "No",
          student_username:
            student.student_username || student.student_join_code || "",
          student_consent: student.student_consent || false,
        }));
        setData(updatedData);
      }
    }, [tableData, courseData]);

    const addStudent = () => {
      const newStudent = {
        first_name: "",
        last_name: "",
        gender: getDefaultGender(), // Use course default gender
        age: "",
        esl_status: "No",
        other: "",
        student_username: "", // Changed from student_join_code
        student_consent: false,
      };
      setData([...data, newStudent]);
    };

    // Current format: firstname2chars + lastname2chars + teacher2chars + countyNumber
    // Example: "jo" + "sm" + "ms" + "01" = "josms01"
    const generateStudentUsername = (
      firstName,
      lastName,
      teacherName,
      countyName,
      existingUsernames = []
    ) => {
      const cleanLastName = lastName
        .toLowerCase()
        .replace(/[^a-z]/g, "")
        .slice(0, 2)
        .padEnd(2, "x");
      const cleanFirstInitial =
        firstName.toLowerCase().replace(/[^a-z]/g, "")[0] || "x";
      const countyCode = countyNumbers[countyName] || "00";

      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      let username;
      let attempts = 0;

      do {
        // 3 random characters instead of 1
        const random = Array.from(
          { length: 3 },
          () => chars[Math.floor(Math.random() * chars.length)]
        ).join("");

        username = `${cleanLastName}${cleanFirstInitial}${random}${countyCode}`;
        attempts++;
      } while (existingUsernames.includes(username) && attempts < 1000);

      return username;
    };

    // Updated regenerateUsername function
    const regenerateUsername = (index) => {
      const student = data[index];
      if (
        student.first_name &&
        student.last_name &&
        teacherName &&
        countyName
      ) {
        const newUsername = generateStudentUsername(
          student.first_name,
          student.last_name,
          teacherName,
          countyName
        );
        updateStudent(index, "student_username", newUsername);
      }
    };

    // Updated updateStudent function
    const updateStudent = (index, field, value) => {
      setData((prevData) =>
        prevData.map((student, i) => {
          if (i === index) {
            const updatedStudent = { ...student, [field]: value };



            // Auto-generate username when first name OR last name is entered/changed
            if (
              (field === "first_name" || field === "last_name") &&
              updatedStudent.first_name?.trim() &&
              updatedStudent.last_name?.trim() &&
              teacherName &&
              countyName
            ) {
              updatedStudent.student_username = generateStudentUsername(
                updatedStudent.first_name.trim(),
                updatedStudent.last_name.trim(),
                teacherName,
                countyName
              );
            }

            return updatedStudent;
          }
          return student;
        })
      );
    };

    // Enhanced removeStudent function with confirmation and backend integration
    const removeStudent = async (index) => {
      const student = data[index];
      const studentName =
        student.first_name && student.last_name
          ? `${student.first_name} ${student.last_name}`
          : student.student_username || "this student";

      // Show confirmation dialog
      const confirmMessage =
        `Are you sure you want to remove ${studentName} from this course?\n\n` +
        `⚠️ WARNING: This will permanently delete all of the student's data including:\n` +
        `• Profile information\n` +
        `• Course progress\n` +
        `• Assessment results\n` +
        `• All associated records\n\n` +
        `This action cannot be undone.`;

      const isConfirmed = window.confirm(confirmMessage);

      if (!isConfirmed) {
        return; // User cancelled
      }

      setIsRemoving(true);

      try {
        // If we have a backend handler function passed as prop
        if (onRemoveStudent) {
          // Call the backend function with student data
          // This should be your purge function from student_management.jsx
          const result = await onRemoveStudent({
            studentId: student.id || student.student_id, // Adjust based on your data structure
            studentUsername: student.student_username,
            courseId: courseData?.id || courseData?.course_id,
            index: index,
            studentData: student,
          });

          if (result.success) {
            // Remove from local state only if backend deletion succeeded
            setData((prevData) => prevData.filter((_, i) => i !== index));

            // Show success message
            alert(`Successfully removed ${studentName} from the course.`);
          } else {
            // Show error message if backend deletion failed
            alert(
              `Failed to remove ${studentName}: ${
                result.error || "Unknown error occurred"
              }`
            );
          }
        } else {
          // Fallback: Just remove from local state if no backend handler provided
          console.warn(
            "No backend handler provided for student removal. Only removing from UI."
          );
          setData((prevData) => prevData.filter((_, i) => i !== index));
          alert(
            `${studentName} has been removed from the list (local only - no backend handler provided).`
          );
        }
      } catch (error) {
        console.error("Error removing student:", error);
        alert(
          `Error removing student: ${error.message || "Unknown error occurred"}`
        );
      } finally {
        setIsRemoving(false);
      }
    };

    const validateAge = (value) => {
      const num = parseInt(value);
      if (isNaN(num)) return "";
      if (num < 14) return "14";
      if (num > 17) return "17";
      return value;
    };

    useImperativeHandle(ref, () => ({
      getUpdatedData: () => data,
      getUpdatedJsonString: () => JSON.stringify(data),
      addStudent,
      removeStudent,
    }));

    // Show gender column only if course is Mixed or not specified
    const shouldShowGenderColumn =
      !courseData?.course_gender ||
      courseData.course_gender === "Mixed" ||
      courseData.course_gender === "Other";

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
          {/* Show course gender info if it's single-gender */}
          {courseData?.course_gender &&
            (courseData.course_gender === "Male" ||
              courseData.course_gender === "Female") && (
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-2 mt-2 mb-2">
                <p className="text-sm text-blue-300">
                  ℹ️ This is a <strong>{courseData.course_gender}</strong>{" "}
                  course. All students will default to{" "}
                  {courseData.course_gender} gender.
                </p>
              </div>
            )}

          {/* Loading overlay when removing student */}
          {isRemoving && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 rounded-lg">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <p className="text-white">Removing student...</p>
              </div>
            </div>
          )}

          <div className="overflow-auto max-h-[400px] mt-2 relative">
            <table className="table-auto w-full border-collapse border border-gray-600 min-w-[900px]">
              <thead className="bg-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="border border-gray-600 px-4 py-2">
                    First Name
                  </th>
                  <th className="border border-gray-600 px-4 py-2">
                    Last Name
                  </th>
                  {shouldShowGenderColumn && (
                    <th className="border border-gray-600 px-4 py-2">Gender</th>
                  )}
                  <th className="border border-gray-600 px-4 py-2">Age</th>

                  <th className="border border-gray-600 px-4 py-2">Username</th>
                  <th className="border border-gray-600 px-4 py-2 w-20">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="border border-gray-600 px-2 py-2">
                        <input
                          type="text"
                          value={student.first_name || ""}
                          onChange={(e) =>
                            updateStudent(index, "first_name", e.target.value)
                          }
                          className="w-full bg-gray-700 text-white p-1 rounded"
                          placeholder="Enter first name"
                          disabled={isRemoving}
                        />
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        <input
                          type="text"
                          value={student.last_name || ""}
                          onChange={(e) =>
                            updateStudent(index, "last_name", e.target.value)
                          }
                          className="w-full bg-gray-700 text-white p-1 rounded"
                          placeholder="Enter last name"
                          disabled={isRemoving}
                        />
                        {student.last_name && !student.student_username && (
                          <p className="text-xs text-yellow-400 mt-1">
                            Username will generate when you enter both names
                          </p>
                        )}
                      </td>
                      {shouldShowGenderColumn && (
                        <td className="border border-gray-600 px-2 py-2">
                          <select
                            value={student.gender || "Other"}
                            onChange={(e) =>
                              updateStudent(index, "gender", e.target.value)
                            }
                            className="w-full bg-gray-700 text-white p-1 rounded mb-1"
                            disabled={isRemoving}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </td>
                      )}
                      <td className="border border-gray-600 px-2 py-2">
                        <div className="flex flex-col gap-1">
                          <select
                            value={student.age || ""}
                            onChange={(e) =>
                              updateStudent(index, "age", e.target.value)
                            }
                            className="w-full bg-gray-700 text-white p-1 rounded text-sm"
                            disabled={isRemoving}
                          >
                            <option value="">Select Age</option>
                            <option value="<14">Under 14</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value=">17">Over 17</option>
                          </select>
                        </div>
                      </td>

                      <td className="border border-gray-600 px-2 py-2">
                        <div className="flex items-center">
                          <span className="bg-blue-900 px-2 py-1 rounded font-mono text-xs flex-1 mr-2 break-all">
                            {student.student_username || "Enter both names"}
                          </span>
                          {student.first_name && student.last_name && (
                            <button
                              onClick={() => regenerateUsername(index)}
                              className="p-1 rounded-full bg-gray-600 hover:bg-blue-600 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Regenerate username"
                              disabled={isRemoving}
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
                          className="bg-red-600 hover:bg-red-700 text-white p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Remove student from course"
                          disabled={isRemoving}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={shouldShowGenderColumn ? "7" : "6"}
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
              {!shouldShowGenderColumn && courseData?.course_gender && (
                <span className="ml-2">
                  | Course Gender: {courseData.course_gender}
                </span>
              )}
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={addStudent}
              disabled={isRemoving}
            >
              Add Student
            </button>
          </div>
        </div>
      </div>
    );
  }
);

// Add display name for better debugging
StudentTable.displayName = "StudentTable";

export default StudentTable;
