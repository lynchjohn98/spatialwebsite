"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ResponsiveQuiz from "../../../../../components/quiz_questions/ResponsiveQuiz";
import { quizData } from "../../../../library/quiz_data/psvtr_pre_quiz";
import { submitTeacherQuiz } from "../../../../library/services/teacher_actions";

export default function PretestPage() {
  const router = useRouter();
  const [quizStarted, setQuizStarted] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const openInstructionsModal = () => {
    setShowInstructionsModal(true);
  };

  const openAnswer1 = () => {
    setShowAnswer1(true);
  };

  const openAnswer2 = () => {
    setShowAnswer2(true);
  };

  const closeInstructionsModal = () => {
    setShowInstructionsModal(false);
    setShowAnswer1(false);
    setShowAnswer2(false);
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
        quizData: results,
      };
      //Specifically state the quiz that was completed for the backend, this time it was the practice mock quiz
      payload.teacherData.pretest_complete = true;
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
      <div className="bg-gray-900">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-gray-800 rounded-lg p-8 max-w-lg w-full text-center">
            <h1 className="text-3xl font-bold mb-4">{quizData.title}</h1>
            <p className="text-white mb-6">{quizData.description}</p>
            <div className="space-y-3 mb-6 text-sm text-white">
              <div className="flex justify-between">
                <span>Questions:</span>
                <span>{quizData.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Limit:</span>
                <span>
                  {Math.floor((quizData.timeLimit || 600) / 60)} minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Points:</span>
                <span>
                  {quizData.questions.reduce((sum, q) => sum + q.points, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Question Types:</span>
                <span>Multiple Choice</span>
              </div>
            </div>
            <div
              onClick={openInstructionsModal}
              className="bg-yellow-900 border border-yellow-800 rounded-lg p-4 mb-6 text-center cursor-pointer hover:bg-gray-800 transition-colors"
            >
              <p className="text-yellow-200 hover:text-yellow-100 mb-2">
                View Instructions
              </p>
            </div>
            <button
              onClick={startQuiz}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium text-lg transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </div>

        {showInstructionsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto text-center">
              <div className="flex justify-between items-center mb-4">
                <div></div>
                <h2 className="text-2xl font-bold text-white">
                  Test Instructions
                </h2>
                <button
                  onClick={closeInstructionsModal}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="text-white space-y-4">
                <p>
                  Please read the following instructions before taking the
                  following quiz. This test consists of 30 questions designed to
                  see how well you can visualize the rotation of
                  three-dimensional objects. Shown below is an example of the
                  type of question included in the following test.
                </p>

                <div className="space-y-2">
                  <p>
                    <strong>You are to:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>
                      Study how the object in the top line of the question is
                      rotated.
                    </li>
                    <li>
                      Picture in your mind what the object shown in the middle
                      line of the question looks like when rotated in exactly
                      the same manner.
                    </li>
                    <li>
                      Select from among the five drawings (A, B, C, D, or E)
                      given in the bottom line of the question the one that
                      looks like the object rotated in the correct position.
                    </li>
                  </ol>
                </div>

                <div>
                  <img
                    src="/quiz_images/psvtr/psvtr_instruction1.png"
                    alt="PSVT:R Example 1"
                    className="w-full h-auto rounded mb-2"
                  />
                </div>

                <p>
                  <strong>
                    What is the correct answer to the example shown above?
                  </strong>
                </p>
                <div
                  onClick={showAnswer1 ? null : openAnswer1}
                  className={`bg-yellow-900 border border-yellow-800 rounded-lg p-4 mb-6 text-center ${
                    !showAnswer1 ? "cursor-pointer hover:bg-gray-800" : ""
                  } transition-colors`}
                >
                  <p className="text-yellow-200 hover:text-yellow-100 mb-2">
                    {!showAnswer1 ? "View Answer" : ""}
                  </p>
                  {showAnswer1 && (
                    <div className="bg-gray-700 p-3 rounded">
                      <p>
                        <strong>Answer:</strong> Answers A, B, C, and E are
                        wrong. Only drawing D looks like the object rotated
                        according to the given rotation. Remember that each
                        question has only <b>one</b> correct answer.
                      </p>
                    </div>
                  )}
                </div>

                <p>
                  Now look at the next example shown below and try to select the
                  drawing that looks like the object in the correct position
                  when the given rotation is applied.
                </p>

                <p>
                  Notice that the given rotation in this example is more
                  complex.
                </p>

                <div>
                  <img
                    src="/quiz_images/psvtr/psvtr_instruction2.png"
                    alt="PSVT:R Example 2"
                    className="w-full h-auto rounded mb-2"
                  />
                </div>

                <p>
                  <strong>
                    What is the correct answer to this second example?
                  </strong>
                </p>
                <div
                  onClick={showAnswer2 ? null : openAnswer2}
                  className={`bg-yellow-900 border border-yellow-800 rounded-lg p-4 mb-6 text-center ${
                    !showAnswer2 ? "cursor-pointer hover:bg-gray-800" : ""
                  } transition-colors`}
                >
                  <p className="text-yellow-200 hover:text-yellow-100 mb-2">
                    {!showAnswer2 ? "View Answer" : ""}
                  </p>
                  {showAnswer2 && (
                    <div className="bg-gray-700 p-3 rounded">
                      <p>
                        <strong>Answer:</strong> The correct answer for this
                        example is B.
                      </p>
                    </div>
                  )}
                </div>

                <p>
                  When you are ready, please close this window and click "Start
                  Quiz" to begin the PSVT:R. Remember you will have 20 minutes
                  to complete the test before it is automatically submitted.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeInstructionsModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <ResponsiveQuiz
      teacherData={teacherData}
      quizData={quizData}
      onQuizComplete={handleQuizComplete}
    />
  );
}
