"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TeacherHelpPage() {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const helpSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      color: 'from-blue-500 to-cyan-500',
      topics: [
        {
          question: 'How do I create my teacher account?',
          answer: 'Navigate to the registration page and enter your details including name, email, and school information. You\'ll receive a confirmation email to verify your account.',
          videoPlaceholder: 'Account Creation Tutorial'
        },
        {
          question: 'How do I create a new course?',
          answer: 'From your homepage, click the "Create Course" button. Fill in the course details including name, language, county, and demographic information. Select whether this is a research course and configure the appropriate settings.',
          videoPlaceholder: 'Course Setup Guide'
        },
        {
          question: 'What is a course join code?',
          answer: 'Each course automatically generates a unique 8-character join code (e.g., "abc123de"). Share this code with your students so they can join your course. You can copy the code from your courses page.',
          videoPlaceholder: 'Understanding Join Codes'
        }
      ]
    },
    {
      id: 'student-management',
      title: 'Student Management',
      icon: '👥',
      color: 'from-purple-500 to-pink-500',
      topics: [
        {
          question: 'How do I add students to my course?',
          answer: 'Go to Course Settings and use the Student Table. You can add students individually by entering their first name, last name, age, and ESL status. Each student will receive a unique username automatically generated based on their information.',
          videoPlaceholder: 'Adding Students Tutorial'
        },
        {
          question: 'What if two students have the same name?',
          answer: 'The system automatically generates unique usernames even for students with identical names by adding a random character. You can also manually regenerate usernames using the refresh button next to each username.',
          videoPlaceholder: 'Managing Duplicate Names'
        },
        {
          question: 'How do I remove a student from my course?',
          answer: 'In the Student Table within Course Settings, click the red "X" button next to the student you want to remove. Remember to save your changes using the "Submit Changes" button at the bottom.',
          videoPlaceholder: 'Removing Students'
        },
        {
          question: 'Can I bulk import students?',
          answer: 'Currently, students are added individually through the Student Table. Make sure to save all changes after adding multiple students.',
          videoPlaceholder: 'Student Import Process'
        }
      ]
    },
    {
      id: 'research-consent',
      title: 'Research & Consent Management',
      icon: '📋',
      color: 'from-green-500 to-teal-500',
      topics: [
        {
          question: 'How do I track student research consent?',
          answer: 'Navigate to the Research Consent page from your course menu. Use the checkbox system to mark which students have provided consent, including parent consent and student assent. You can add dates and notes for each student.',
          videoPlaceholder: 'Consent Tracking Overview'
        },
        {
          question: 'How do I upload consent forms?',
          answer: 'On the Research Consent page, use the drag-and-drop area or click "Select Files" to upload PDF scans, images, or documents of signed consent forms. Files are securely stored and can be viewed or deleted as needed.',
          videoPlaceholder: 'Uploading Consent Forms'
        },
        {
          question: 'What file types are supported for consent forms?',
          answer: 'The system supports PDF files, images (JPG, PNG), and document files (DOC, DOCX). Files can be uploaded individually or in bulk by selecting multiple files at once.',
          videoPlaceholder: 'Supported File Types'
        },
        {
          question: 'How do I update student consent status in bulk?',
          answer: 'Use the "Select All" checkbox in the consent table header to mark all students at once, or update them individually. Click "Save Consent Data" to save changes, and "Update Student Consent Settings" to sync with the main student database.',
          videoPlaceholder: 'Bulk Consent Updates'
        }
      ]
    },
    {
      id: 'visibility-settings',
      title: 'Module & Quiz Visibility',
      icon: '👁️',
      color: 'from-orange-500 to-red-500',
      topics: [
        {
          question: 'How do I control what students can see?',
          answer: 'Go to Course Settings and use the Module Visibility and Quiz Visibility tables. Click the checkmark/X icons to toggle visibility for each module or quiz. Green checkmarks mean visible, red X means hidden.',
          videoPlaceholder: 'Visibility Controls Tutorial'
        },
        {
          question: 'Do I need to complete training before making modules visible?',
          answer: 'Yes, the system will warn you if you try to make modules visible without completing the required training components (Getting Started, Introduction Video, Mini Lecture, Quiz, Software, and Workbook).',
          videoPlaceholder: 'Training Requirements'
        },
        {
          question: 'When do visibility changes take effect?',
          answer: 'Visibility changes take effect immediately after clicking "Submit Changes" at the bottom of the settings page. Students will see updated content on their next page refresh.',
          videoPlaceholder: 'Understanding Visibility Updates'
        },
        {
          question: 'Can I schedule module visibility?',
          answer: 'Currently, visibility is controlled manually. You need to log in and update the settings when you want to make modules available to students.',
          videoPlaceholder: 'Module Scheduling Options'
        }
      ]
    },
    {
      id: 'quiz-assessment',
      title: 'Quizzes & Assessments',
      icon: '📝',
      color: 'from-indigo-500 to-blue-500',
      topics: [
        {
          question: 'What types of questions are on the quizzes?',
          answer: 'Quizzes include three types of questions: Multiple Choice (select one answer), Multiple Select (select all that apply), and Text Input (type your answer). Each quiz provides an overview of question types before starting.',
          videoPlaceholder: 'Quiz Question Types'
        },
        {
          question: 'Can students retake quizzes?',
          answer: 'Quiz retake policies depend on your course settings. Check the quiz visibility settings to configure whether students can retake quizzes and how many attempts are allowed.',
          videoPlaceholder: 'Quiz Retake Settings'
        },
        {
          question: 'How do I view student quiz results?',
          answer: 'Access the Gradebook or Student Progress section from your course dashboard to view detailed quiz results, including individual responses and overall scores.',
          videoPlaceholder: 'Viewing Quiz Results'
        },
        {
          question: 'Are quiz answers saved automatically?',
          answer: 'Yes, student answers are saved as they progress through the quiz. If a student loses connection, they can resume from where they left off.',
          videoPlaceholder: 'Auto-Save Features'
        }
      ]
    },
    {
      id: 'course-settings',
      title: 'Course Configuration',
      icon: '⚙️',
      color: 'from-gray-500 to-gray-600',
      topics: [
        {
          question: 'How do I update course details?',
          answer: 'Navigate to Course Settings to modify course name, language, demographics, and research settings. Remember to save changes using the "Submit Changes" button.',
          videoPlaceholder: 'Course Settings Overview'
        },
        {
          question: 'What are DEIS schools?',
          answer: 'DEIS (Delivering Equality of Opportunity in Schools) is an Irish Department of Education program for schools in disadvantaged areas. Select "DEIS" or "Non-DEIS" based on your school\'s designation.',
          videoPlaceholder: 'Understanding DEIS'
        },
        {
          question: 'Can I change the course join code?',
          answer: 'Course join codes are automatically generated and cannot be manually changed. If you need a new code, you would need to create a new course.',
          videoPlaceholder: 'Join Code Management'
        },
        {
          question: 'How do I delete a course?',
          answer: 'From the "View Your Courses" page, click the delete button (trash icon) next to the course. Confirm the deletion in the popup. Warning: This permanently removes all associated data including students and grades.',
          videoPlaceholder: 'Course Deletion Process'
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: '🔧',
      color: 'from-red-500 to-pink-500',
      topics: [
        {
          question: 'Students can\'t join my course',
          answer: 'Verify the join code is correct and that students are entering it exactly as shown (case-sensitive). Check that the course is active and hasn\'t been deleted.',
          videoPlaceholder: 'Troubleshooting Join Issues'
        },
        {
          question: 'Changes aren\'t saving',
          answer: 'Always click "Submit Changes" or "Save" buttons after making modifications. Check your internet connection and try refreshing the page if issues persist.',
          videoPlaceholder: 'Fixing Save Issues'
        },
        {
          question: 'File upload fails',
          answer: 'Ensure files are under the size limit and in supported formats (PDF, JPG, PNG, DOC, DOCX). Check your internet connection and try uploading files one at a time if bulk upload fails.',
          videoPlaceholder: 'Upload Troubleshooting'
        },
        {
          question: 'Missing student progress data',
          answer: 'Student progress records are created automatically when students are added. If data is missing, try refreshing the page or re-saving the student information.',
          videoPlaceholder: 'Data Recovery Tips'
        }
      ]
    }
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
            
            <div className="text-sm text-gray-400">
              Help Center
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Teacher Help Center
          </h1>
   
        </div>

        {/* Help Sections */}
        <div className="space-y-6">
          {helpSections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <h2 className={`text-xl font-semibold bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
                    {section.title}
                  </h2>
                  <span className="text-sm text-gray-400">
                    ({section.topics.length} topics)
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedSections[section.id] ? 'rotate-180' : ''
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

              {/* Section Content */}
              {expandedSections[section.id] && (
                <div className="px-6 pb-6 space-y-6 border-t border-gray-700">
                  {section.topics.map((topic, index) => (
                    <div
                      key={index}
                      className="py-4 border-b border-gray-700/50 last:border-0"
                    >
                      {/* Question */}
                      <h3 className="font-medium text-white mb-3 flex items-start">
                        <span className="text-blue-400 mr-2">Q:</span>
                        {topic.question}
                      </h3>
                      
                      {/* Answer */}
                      <div className="text-gray-300 pl-6 mb-4">
                        <span className="text-green-400 mr-2">A:</span>
                        {topic.answer}
                      </div>
                      
                      {/* Video Placeholder */}
                      <div className="ml-6 mt-3">
                        <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                              <svg 
                                className="w-6 h-6 text-gray-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                                />
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-200">
                              Video Tutorial: {topic.videoPlaceholder}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Video coming soon
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-700/50 p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
          <p className="text-gray-300 mb-4">
            If further assistance is needed, please email <b>lynchjohn98@gmail.com</b> with SpatialLMS in the subject line.
          </p>
        </div>
      </div>
    </div>
  );
}