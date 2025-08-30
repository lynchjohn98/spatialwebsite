"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/teacher_components/TeacherSidebar";
import VisibilityTable from "../../../../components/teacher_components/VisibilityTable";
import ExtraResourcesTable from "../../../../components/teacher_components/ExtraResourcesTable";
import TrainingWarningModal from "../../../../components/teacher_components/TrainingWarningModal.jsx";
import {
  retrieveCourseSettings,
  updateCourseSettings,
} from "../../../library/services/course_actions";
import { fetchTeacherModuleProgress } from "../../../library/services/teacher_actions";
import { createClient } from "../../../utils/supabase/supabase";

export default function Settings() {
  const router = useRouter();
  const [studentSettingsOpen, setStudentSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
  const [showTrainingWarning, setShowTrainingWarning] = useState(false);
  const [incompleteModules, setIncompleteModules] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [courseSettings, setCourseSettings] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [moduleData, setModuleData] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [surveyData, setSurveyData] = useState([]);
  const [prePostData, setPrePostData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moduleProgress, setModuleProgress] = useState({});

  const moduleTableRef = useRef();
  const quizTableRef = useRef();
  const surveyTableRef = useRef();
  const prePostTableRef = useRef();
const fetchCourseSettings = async () => {
  setIsLoading(true);
  const storedData = sessionStorage.getItem("courseData");
  const teacherData = JSON.parse(sessionStorage.getItem("teacherData"));
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    setCourseData(parsedData);
    const response = await retrieveCourseSettings({ id: parsedData.id });
    if (response.success) {
      const settings = response.data;
      const parsedStudentSettings = JSON.parse(
        settings.student_settings || "{}"
      );
      const parsedModuleSettings = JSON.parse(
        settings.module_settings || "[]"
      );
      const parsedQuizSettings = JSON.parse(settings.quiz_settings || "[]");

      // Sort module settings to put Pre-Module first
      const sortedModuleSettings = parsedModuleSettings.sort((a, b) => {
        const aIsPreModule = a.name.toLowerCase().includes('pre-module');
        const bIsPreModule = b.name.toLowerCase().includes('pre-module');
        
        if (aIsPreModule && !bIsPreModule) return -1;
        if (bIsPreModule && !aIsPreModule) return 1;
        
        const aNum = parseInt(a.name.match(/\d+/)?.[0]) || 999;
        const bNum = parseInt(b.name.match(/\d+/)?.[0]) || 999;
        return aNum - bNum;
      });

      // Filter quiz settings by type
      const moduleQuizzes = parsedQuizSettings.filter(
        (q) => !q.type || q.type === "module"
      );
      const surveys = parsedQuizSettings.filter((q) => q.type === "survey");
      const prePostTests = parsedQuizSettings.filter(
        (q) => q.type === "pre_post_test"
      );

      // Sort pre/post tests: pre-tests first, then post-tests
      const sortedPrePostTests = prePostTests.sort((a, b) => {
        const aIsPreTest = a.name.toLowerCase().includes('pre-test');
        const bIsPreTest = b.name.toLowerCase().includes('pre-test');
        
        // If a is pre-test and b is post-test, a comes first
        if (aIsPreTest && !bIsPreTest) return -1;
        // If b is pre-test and a is post-test, b comes first
        if (bIsPreTest && !aIsPreTest) return 1;
        
        // If both are the same type, sort alphabetically
        return a.name.localeCompare(b.name);
      });

      // Fetch teacher module progress
      const progressResponse = await fetchTeacherModuleProgress(teacherData.id);
      if (progressResponse.success) {
        setModuleProgress(progressResponse.data);
      } else {
        console.log("Error fetching progress from teacher");
      }

      setCourseSettings(settings);
      setStudentData(parsedStudentSettings);
      setModuleData(sortedModuleSettings);
      setQuizData(moduleQuizzes);
      setSurveyData(surveys);
      setPrePostData(sortedPrePostTests); // Use sorted pre/post tests
    }
  }
  setIsLoading(false);
};

  useEffect(() => {
    fetchCourseSettings();
  }, []);

  const checkTrainingCompletion = () => {
    const normalizeName = (s) =>
      String(s || "")
        .replace(/^Module\s*\d+\s*:\s*/i, "")
        .trim()
        .toLowerCase();

    const pretty = {
      getting_started: "Getting Started",
      introduction_video: "Introduction Video",
      mini_lecture: "Mini Lecture",
      quiz: "Quiz",
      software: "Software",
      workbook: "Workbook",
    };
    console.log("MODULE PROGRESS ITEM:", moduleProgress);
    const REQUIRED_FIELDS = Object.keys(pretty);
    const updatedModuleData =
      moduleTableRef.current?.getUpdatedData() || moduleData;
      
    const allModuleProgress = moduleProgress[0].module_progress || {};

    const progressByName = Object.fromEntries(
      Object.entries(allModuleProgress).map(([k, v]) => [normalizeName(k), v])
    );

    console.log("Progress by normalized name:", progressByName);

    const incompleteMods = [];

    updatedModuleData.forEach((mod) => {
      if (mod.visibility !== "Yes") return;

      const key = normalizeName(mod.name);
      const progress = progressByName[key];

      console.log(`Checking module "${mod.name}" (normalized: "${key}")`);

      if (!progress) {
        console.log(`No progress data found for module: "${mod.name}"`);
        incompleteMods.push({
          moduleName: mod.name,
          incompleteItems: REQUIRED_FIELDS.map((f) => pretty[f]),
        });
        return;
      }

      const missing = REQUIRED_FIELDS.filter((f) => !Boolean(progress?.[f]));

      if (missing.length) {
        console.log(
          `Module "${mod.name}" has incomplete items:`,
          missing.map((f) => pretty[f])
        );
        incompleteMods.push({
          moduleName: mod.name,
          incompleteItems: missing.map((f) => pretty[f]),
        });
      } else {
        console.log(`Module "${mod.name}" is complete`);
      }
    });

    console.log("Incomplete modules found:", incompleteMods);
    return incompleteMods;
  };

  const handleSaveChanges = async () => {
    if (!courseData || !courseSettings) {
      setSaveMessage({
        type: "error",
        text: "Course data not found. Please try refreshing the page.",
      });
      return;
    }

    const incomplete = checkTrainingCompletion();
    if (incomplete.length > 0) {
      setIncompleteModules(incomplete);
      setShowTrainingWarning(true);
      return;
    }

    await proceedWithSave();
  };

  const proceedWithSave = async () => {
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });

    try {
      const updatedModuleData =
        moduleTableRef.current?.getUpdatedData() || moduleData;
      const updatedQuizData =
        quizTableRef.current?.getUpdatedData() || quizData;
      const updatedSurveyData =
        surveyTableRef.current?.getUpdatedData() || surveyData;
      const updatedPrePostData =
        prePostTableRef.current?.getUpdatedData() || prePostData;

      const allQuizData = [
        ...updatedQuizData,
        ...updatedSurveyData,
        ...updatedPrePostData,
      ];

      const payload = {
        courseId: courseData.id,
        moduleSettings: JSON.stringify(updatedModuleData),
        quizSettings: JSON.stringify(allQuizData),
      };

      const result = await updateCourseSettings(payload);
      if (result.success) {
        setSaveMessage({
          type: "success",
          text: "Course settings updated successfully!",
        });
        setShowTrainingWarning(false);
      } else {
        setSaveMessage({
          type: "error",
          text: `Failed to update settings: ${result.error}`,
        });
      }
    } catch (error) {
      console.error("Error saving course settings:", error);
      setSaveMessage({
        type: "error",
        text: "An unexpected error occurred while saving.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !courseData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-4xl font-bold">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar
        isSidebarOpen={studentSettingsOpen}
        setIsSidebarOpen={setStudentSettingsOpen}
        courseData={courseData}
      />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Main Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Course Settings & Content Management
            </h1>
            <p className="text-gray-400 text-lg">
              Configure visibility settings for all course materials and assessments
            </p>
          </header>

          {/* Important Notice Card */}
          <div className="mb-8 p-6 bg-yellow-900/30 border-2 border-yellow-600/50 rounded-xl shadow-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-yellow-500 mb-2">Important: Save Your Changes</h3>
                <p className="text-gray-300">
                  Changes made to visibility settings are not saved automatically. You must click the 
                  <span className="font-bold text-yellow-400"> SUBMIT CHANGES </span> 
                  button at the bottom of this page to apply your modifications.
                </p>
              </div>
            </div>
          </div>

          {/* Save message if present */}
          {saveMessage.text && (
            <div
              className={`mb-6 p-4 rounded-xl text-center font-bold shadow-lg ${
                saveMessage.type === "success"
                  ? "bg-green-800/50 border border-green-600 text-green-300"
                  : "bg-red-800/50 border border-red-600 text-red-300"
              }`}
            >
              {saveMessage.text}
            </div>
          )}

          {/* Module Settings Section */}
          <section className="mb-10">
            <div className="mb-4 p-4 bg-cyan-900/20 border-l-4 border-cyan-500 rounded-lg">
              <h2 className="text-2xl font-bold text-cyan-400 mb-2">
                📚 Module Content Settings
              </h2>
              <p className="text-gray-300 text-sm">
                Control which learning modules are accessible to students. Modules should be made visible 
                only after you've completed the corresponding training.
              </p>
            </div>
            <VisibilityTable
              ref={moduleTableRef}
              tableTitle={"Module Visibility"}
              tableData={moduleData}
              moniker={"Module"}
            />
          </section>

          {/* Pre/Post Test Settings Section */}
          <section className="mb-10">
            <div className="mb-4 p-4 bg-purple-900/20 border-l-4 border-purple-500 rounded-lg">
              <h2 className="text-2xl font-bold text-purple-400 mb-2">
                📊 Pre/Post Test Assessments
              </h2>
              <p className="text-gray-300 text-sm">
                Students should attempt the three Pre-Test's before accessing other content of the course.
              </p>
            </div>
            <VisibilityTable
              ref={prePostTableRef}
              tableTitle={"Pre/Post Test Visibility"}
              tableData={prePostData}
              moniker={"Assessment"}
            />
          </section>

          {/* Module Quiz Settings Section */}
          <section className="mb-10">
            <div className="mb-4 p-4 bg-green-900/20 border-l-4 border-green-500 rounded-lg">
              <h2 className="text-2xl font-bold text-green-400 mb-2">
                ✏️ Module Quiz Settings
              </h2>
              <p className="text-gray-300 text-sm">
                Enabled modules will have a link to the associated quiz, but it will not be accessible until it is enabled here.
              </p>
            </div>
            <VisibilityTable
              ref={quizTableRef}
              tableTitle={"Module Quiz Visibility"}
              tableData={quizData}
              moniker={"Quiz"}
            />
          </section>

          {/* Survey Settings Section */}
          <section className="mb-10">
            <div className="mb-4 p-4 bg-orange-900/20 border-l-4 border-orange-500 rounded-lg">
              <h2 className="text-2xl font-bold text-orange-400 mb-2">
                📝 Student Survey Settings
              </h2>
              <p className="text-gray-300 text-sm">
                Surveys collect valuable feedback about student experiences and learning preferences. 
                Use these to gather insights and improve your course delivery.
              </p>
            </div>
            <VisibilityTable
              ref={surveyTableRef}
              tableTitle={"Survey Visibility"}
              tableData={surveyData}
              moniker={"Survey"}
            />
          </section>

          {/* Submit Button Section */}
          <div className="mt-12 mb-8">
            <div className="p-6 bg-gray-800 border-2 border-gray-600 rounded-xl shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-gray-300 font-medium">
                    Review your changes carefully before submitting
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    All visibility changes will take effect immediately for students
                  </p>
                </div>
                <button
                  className={`${
                    isSaving
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95"
                  } text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg flex items-center gap-2`}
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Submit Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Training Warning Modal */}
      {showTrainingWarning && (
        <TrainingWarningModal
          incompleteModules={incompleteModules}
          onClose={() => setShowTrainingWarning(false)}
          onProceed={proceedWithSave}
        />
      )}
    </div>
  );
}