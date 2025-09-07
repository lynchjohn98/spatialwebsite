"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ExpandableVideo from "../../../components/module_blocks/ExpandableVideo";
export default function TeacherHelpPage() {
  const router = useRouter();
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    if (!sessionStorage.getItem("teacherData")) {
      router.push("/teacher/login");
      return;
    }
  }, []); // Placeholder for useEffect if needed in future

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const helpCategories = [
    {
      id: "account-management",
      title: "Account Creation and Management",
      icon: "👤",
      color: "from-blue-500 to-cyan-500",
      videos: [
        {
          videoId: "https://youtu.be/bleGiJtmxbI",
          title: "Creating Your Teacher Account",
          description: "Learn how to register and set up your teacher account",
        },
      ],
    },
    {
      id: "teacher-training",
      title: "Teacher Training and Progress",
      icon: "🎓",
      color: "from-purple-500 to-pink-500",
      videos: [
        {
          videoId: "https://youtu.be/ZxYS_oCNqIM",
          title: "Complete Teacher Training Overview",
          description:
            "Step-by-step guide through all training modules and requirements",
        },
      ],
    },
    {
      id: "course-management",
      title: "Course Creation and Management",
      icon: "📚",
      color: "from-green-500 to-teal-500",
      videos: [
        {
          videoId: "https://youtu.be/r1GHn7hdQS0",
          title: "Course Setup and Configuration",
          description:
            "Create courses, manage settings, and control visibility",
        },
      ],
    },
    {
      id: "student-management",
      title: "Student Management and Progress Tracking",
      icon: "👥",
      color: "from-orange-500 to-red-500",
      videos: [
        {
          videoId: "https://youtu.be/lQBxZhuwWiw",
          title: "Student Enrollment and Progress Monitoring",
          description: "Add students and track their progress",
        },
      ],
    },
  ];

  const fullDemos = [
    {
      videoId: "https://youtu.be/tDV6CiMCrXk",
      title: "Complete Spatial Thinking LMS Walkthrough",
      description:
        "Full demonstration of making a teacher account, creating a course, adding students, and tracking progress",
      icon: "🎬",
      color: "from-indigo-500 to-purple-500",
    },
    {
      videoId: "https://youtu.be/HMcChKCtot0",
      title: "End-to-End Semester Management",
      description:
        "Demonstration from Dr. Gavin Duffy and Dr. Sheryl Sorby from training event",
      icon: "📹",
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
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

            <div className="text-sm text-gray-400">Video Help Center</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Teacher Video Tutorials
          </h1>
          <p className="text-gray-400 text-lg">
            Click on any category to view helpful video tutorials
          </p>
        </div>

        {/* Main Categories */}
        <div className="space-y-4 mb-8">
          {helpCategories.map((category) => (
            <div
              key={category.id}
              className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <h2
                    className={`text-xl font-semibold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}
                  >
                    {category.title}
                  </h2>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedCategories[category.id] ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Video List using ExpandableVideo component */}
              {expandedCategories[category.id] && (
                <div className="px-6 pb-6 border-t border-gray-700">
                  <div className="pt-4 space-y-3">
                    {category.videos.map((video, index) => (
                      <ExpandableVideo
                        key={index}
                        videoId={video.videoId}
                        title={video.title}
                        description={video.description}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Full Demo Walkthroughs Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Complete Walkthrough Demos
          </h2>
          <div className="space-y-4">
            {fullDemos.map((demo, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg border border-gray-700 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{demo.icon}</span>
                  <div>
                    <h3
                      className={`text-lg font-semibold bg-gradient-to-r ${demo.color} bg-clip-text text-transparent`}
                    >
                      {demo.title}
                    </h3>
                    <span className="text-sm text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full inline-block mt-1">
                      Full Demo
                    </span>
                  </div>
                </div>
                <ExpandableVideo
                  videoId={demo.videoId}
                  title={demo.title}
                  description={demo.description}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="mt-12 grid md:grid-cols-1 gap-4">
          <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-lg border border-green-700/50 p-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Support Contact
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              Need additional help? Contact support
            </p>
            <p className="text-green-400 text-sm font-medium">
              lynchjohn98@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
