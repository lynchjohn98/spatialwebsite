"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { generateStudentUsername } from "../../app/library/helpers/helpers";
import { useRouter } from "next/navigation";

const TeacherHeader = forwardRef(
  ({ tableTitle, tableData, teacherName, schoolName }, ref) => {
    <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => router.push("/teacher/homepage")}
            className="flex items-center text-gray-300 hover:text-white transition-colors group"
          >
            <svg
              className="h-5 w-5 mr-2 group-hover:translate-x-[-2px] transition-transform"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Back to Homepage</span>
          </button>

          <div className="text-sm text-gray-400">
            {allCourses.length} Course{allCourses.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>;
  }
);
