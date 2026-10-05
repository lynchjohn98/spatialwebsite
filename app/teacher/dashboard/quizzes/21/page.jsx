"use client";
import { useEffect, useState } from "react";
import ResponsiveSurvey from "../../../../../components/quiz_questions/ResponsiveSurvey";
import { quizData } from "../../../../library/quiz_data/post_intervention_survey"; // swap for the survey this page shows
import { submitTeacherSurvey } from "../../../../library/services/teacher_services/teacher_quiz";

const QUIZZES_HREF = "/teacher/dashboard/quizzes";

export default function TeacherSurveyPage() {
  const [teacherData, setTeacherData] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "missing"

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("teacherData");
      if (stored) {
        setTeacherData(JSON.parse(stored));
        setStatus("ready");
      } else {
        setStatus("missing");
      }
    } catch (error) {
      console.error("Error reading teacherData from sessionStorage:", error);
      setStatus("missing");
    }
  }, []);

  // Return the server action's result so the survey can show an error
  // (and let the teacher retry) instead of a false "Thank you".
  const handleSurveyComplete = (surveyResults) =>
    submitTeacherSurvey({
      survey_results: surveyResults,
      teacher_data: teacherData,
    });

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <p className="text-lg text-gray-300">Loading survey…</p>
      </div>
    );
  }

  if (status === "missing") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-800/70 p-8 text-center">
          <h2 className="mb-2 text-xl font-bold text-white">Session expired</h2>
          <p className="mb-6 text-gray-300">
            We couldn&apos;t find your teacher details. Please return to your dashboard and open the survey again.
          </p>
          <a
            href={QUIZZES_HREF}
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Return to Quizzes
          </a>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveSurvey
      data={quizData}
      onSurveyComplete={handleSurveyComplete}
      exitHref={QUIZZES_HREF}
    />
  );
}