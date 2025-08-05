"use client"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ResponsiveQuiz from "../../../../../components/quiz_questions/ResponsiveQuiz";
import { quizData } from "../../../../../utils/quiz_data/practice_quiz"; 
import { submitTeacherQuiz } from "../../../../services/teacher_actions";

export default function PretestPage() {
  
  const router = useRouter();
  const [quizStarted, setQuizStarted] = useState(false);
  const [teacherData, setTeacherData] = useState(null);


  const startQuiz = () => {
    setQuizStarted(true);
  };

  useEffect(() => {
      try {
        if (sessionStorage.getItem("teacherData") !== null) {
          setTeacherData(JSON.parse(sessionStorage.getItem("teacherData")));
        } 
      } catch (error) {
        console.error("Error parsing teacher data from sessionStorage:", error);
      }
    }, []);

  const handleQuizComplete = async (results) => {
    try {
      const payload = {
        teacherData: teacherData,
        quizData: results
      };
      payload.teacherData.practicequiz_complete = true;
      await submitTeacherQuiz(payload);
    } catch (error) {
      console.error("Error saving pretest results:", error);
    }
    setTimeout(() => {
      router.push("/teacher/training");
    }, 7000);
  };


  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-gray-800 rounded-lg p-8 max-w-lg w-full text-center">
            <h1 className="text-3xl font-bold mb-4">{quizData.title}</h1>
            <p className="text-white mb-6">
              {quizData.description}
            </p>   
            <div className="space-y-3 mb-6 text-sm text-white">
              <div className="flex justify-between">
                <span>Questions:</span>
                <span>{quizData.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Limit:</span>
                <span>{Math.floor((quizData.timeLimit || 600) / 60)} minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Total Points:</span>
                <span>{quizData.questions.reduce((sum, q) => sum + q.points, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Question Types:</span>
                <span>Multiple Choice, Multiple Select, Text Input</span>
              </div>
            </div>
            <div className="bg-gray-900 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-white mb-2">Instructions:</h3>
              <ul className="text-sm text-white space-y-1">
                <li>• Read each question carefully</li>
                <li>• For multiple select questions, choose ALL correct answers</li>
                <li>• For text input, be precise with your answers</li>
                <li>• You can navigate between questions using the sidebar</li>
                <li>• Your quiz will auto-submit when time expires</li>
              </ul>
            </div>
            <button
              onClick={startQuiz}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium text-lg transition-colors"
            >
              Start Quiz
            </button>        
          </div>
        </div>
      </div>
    );
  }
  return <ResponsiveQuiz teacherData={teacherData} quizData={quizData} onQuizComplete={handleQuizComplete} />;
}


