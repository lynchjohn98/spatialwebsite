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
  // In your fetchCourseSettings function, after parsing quiz settings:
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

        // Filter quiz settings by type
        const moduleQuizzes = parsedQuizSettings.filter(
          (q) => !q.type || q.type === "module"
        );
        const surveys = parsedQuizSettings.filter((q) => q.type === "survey");
        const prePostTests = parsedQuizSettings.filter(
          (q) => q.type === "pre_post_test"
        );

        setCourseSettings(settings);
        setStudentData(parsedStudentSettings);
        setModuleData(parsedModuleSettings);
        setQuizData(moduleQuizzes);
        setSurveyData(surveys);
        setPrePostData(prePostTests);

        console.log("Module Quizzes:", moduleQuizzes);
        console.log("Surveys:", surveys);
        console.log("Pre/Post Tests:", prePostTests);
      }
      // ... rest of your code
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCourseSettings();
  }, []);

  const checkTrainingCompletion = () => {
    // Normalize function to handle module names consistently
    const normalizeName = (s) =>
      String(s || "")
        .replace(/^Module\s*\d+\s*:\s*/i, "")
        .trim()
        .toLowerCase();

    // Pretty names for display
    const pretty = {
      getting_started: "Getting Started",
      introduction_video: "Introduction Video",
      mini_lecture: "Mini Lecture",
      quiz: "Quiz",
      software: "Software",
      workbook: "Workbook",
    };

    const REQUIRED_FIELDS = Object.keys(pretty);

    const updatedModuleData =
      moduleTableRef.current?.getUpdatedData() || moduleData;

    const allModuleProgress = moduleProgress?.[0]?.module_progress || {};

    console.log(
      "Checking training completion with module data:",
      moduleProgress
    );
    console.log("Updated module data:", updatedModuleData);
    console.log("All module progress:", allModuleProgress);

    // Build a normalized index of progress by name
    const progressByName = Object.fromEntries(
      Object.entries(allModuleProgress).map(([k, v]) => [normalizeName(k), v])
    );

    console.log("Progress by normalized name:", progressByName);

    const incompleteMods = [];

    updatedModuleData.forEach((mod) => {
      if (mod.visibility !== "Yes") return;

      const key = normalizeName(mod.name); // e.g., "combining solids"
      const progress = progressByName[key];

      console.log(`Checking module "${mod.name}" (normalized: "${key}")`);

      if (!progress) {
        // No record found for this module name
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

    // Check for incomplete training modules
    const incomplete = checkTrainingCompletion();
    if (incomplete.length > 0) {
      setIncompleteModules(incomplete);
      setShowTrainingWarning(true);
      return;
    }

    // Proceed with saving if all training is complete
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

      // Combine all quiz types back together for storage
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
        <div className="max-w-3xl mx-auto mb-6 p-4 bg-gray-800 rounded-lg shadow-md text-center">
          <p className="text-lg">
            This is your course settings page. The student table will allow you
            to input information regarding the students in your course and
            provide them their join codes. The module and quiz visibility tables
            will allow you to toggle the visibility of modules and quizzes for
            your students.
          </p>
          <p className="mt-3 font-bold text-yellow-300">
            Please make sure to always press SUBMIT CHANGES at the bottom when
            you are done making changes. Your changes WILL NOT save until you
            press SUBMIT CHANGES.
          </p>
        </div>

        {/* Show save message if present */}
        {saveMessage.text && (
          <div
            className={`mb-4 p-3 rounded-lg text-center font-bold ${
              saveMessage.type === "success"
                ? "bg-green-800 text-white"
                : "bg-red-800 text-white"
            }`}
          >
            {saveMessage.text}
          </div>
        )}

        <h3 className="text-xl font-bold mb-2 text-cyan-400">
          Module Settings
        </h3>
        <VisibilityTable
          ref={moduleTableRef}
          tableTitle={"Module Visibility"}
          tableData={moduleData}
          moniker={"Module"}
        />

        {/* Pre/Post Test Visibility */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2 text-purple-400">
            Assessment Settings
          </h3>
          <VisibilityTable
            ref={prePostTableRef}
            tableTitle={"Pre/Post Test Visibility"}
            tableData={prePostData}
            moniker={"Assessment"}
          />
        </div>

        {/* Module Quiz Visibility */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2 text-green-400">
            Quiz Settings
          </h3>
          <VisibilityTable
            ref={quizTableRef}
            tableTitle={"Module Quiz Visibility"}
            tableData={quizData}
            moniker={"Quiz"}
          />
        </div>

        {/* Survey Visibility */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2 text-orange-400">
            Survey Settings
          </h3>
          <VisibilityTable
            ref={surveyTableRef}
            tableTitle={"Survey Visibility"}
            tableData={surveyData}
            moniker={"Survey"}
          />
        </div>

        <div className="mt-3 border border-gray-600 rounded bg-gray-700 p-3 flex justify-center">
          <button
            className={`${
              isSaving
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded transition-colors duration-200`}
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Submit Changes"}
          </button>
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
