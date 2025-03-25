"use client";
import { useState, useEffect, Fragment } from "react";

export default function StudentGradeTable({ gradesData = [] }) {
  const [quizGroups, setQuizGroups] = useState({});
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gradesData || gradesData.length === 0) {
      setQuizGroups({});
      setLoading(false);
      return;
    }

    // Group attempts by quiz_id
    const groups = {};
    gradesData.forEach(grade => {
      // Parse answers JSON if it's a string
      const parsedAnswers = typeof grade.answers === 'string' 
        ? JSON.parse(grade.answers) 
        : grade.answers;
      
      // Use created_at if time_start is null
      const attemptDate = grade.time_start ? new Date(grade.time_start) : new Date(grade.created_at);
      
      // Initialize quiz group if not exists
      if (!groups[grade.quiz_id]) {
        groups[grade.quiz_id] = {
          quiz_id: grade.quiz_id,
          quiz_name: `Quiz ${grade.quiz_id}`,
          attempts: []
        };
      }
      
      // Add attempt to quiz group
      groups[grade.quiz_id].attempts.push({
        id: grade.id,
        attempt_number: grade.attempt_number,
        score: grade.score,
        created_at: new Date(grade.created_at),
        time_start: grade.time_start ? new Date(grade.time_start) : null,
        time_end: grade.time_end ? new Date(grade.time_end) : null,
        date: attemptDate,
        answers: parsedAnswers
      });
    });

    // Calculate additional metrics for each quiz group
    Object.values(groups).forEach(group => {
      // Sort attempts by date (newest first)
      group.attempts.sort((a, b) => b.date - a.date);
      
      // Find highest score
      if (group.attempts.length > 0) {
        group.highestScore = Math.max(...group.attempts.map(a => a.score));
        group.latestAttempt = group.attempts[0];
      }
    });

    setQuizGroups(groups);
    setLoading(false);
  }, [gradesData]);

  const toggleQuizExpand = (quizId) => {
    setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  if (Object.keys(quizGroups).length === 0) {
    return (
      <div className="w-full bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-3">Your Grades</h2>
        <div className="bg-gray-700 p-3 rounded text-center">
          No quiz attempts found.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Grades</h2>
      
      <div className="overflow-auto max-h-[70vh]">
        <table className="w-full border-collapse border border-gray-600">
          <thead className="bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-600 px-3 py-2 text-left">Quiz</th>
              <th className="border border-gray-600 px-3 py-2 text-center">Score</th>
              <th className="border border-gray-600 px-3 py-2 text-center">Date</th>
              <th className="border border-gray-600 px-3 py-2 text-center">Attempts</th>
              <th className="border border-gray-600 px-3 py-2 text-center w-16">Details</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(quizGroups).map((quiz) => (
              <Fragment key={quiz.quiz_id}>
                <tr className="hover:bg-gray-700">
                  <td className="border border-gray-600 px-3 py-2 font-medium">
                    {quiz.quiz_name}
                  </td>
                  <td className="border border-gray-600 px-3 py-2 text-center">
                    <span className="inline-block px-2 py-1 rounded bg-blue-800">
                      {quiz.highestScore} pts
                    </span>
                  </td>
                  <td className="border border-gray-600 px-3 py-2 text-center">
                    {quiz.latestAttempt?.date.toLocaleDateString() || "N/A"}
                  </td>
                  <td className="border border-gray-600 px-3 py-2 text-center">
                    {quiz.attempts.length}
                  </td>
                  <td className="border border-gray-600 px-3 py-2 text-center">
                    <button
                      onClick={() => toggleQuizExpand(quiz.quiz_id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded w-8 h-8 flex items-center justify-center mx-auto"
                    >
                      {expandedQuiz === quiz.quiz_id ? "▲" : "▼"}
                    </button>
                  </td>
                </tr>
                
                {/* Expanded details row */}
                {expandedQuiz === quiz.quiz_id && (
                  <tr>
                    <td colSpan="5" className="border border-gray-600 p-0">
                      <div className="bg-gray-900 p-3">
                        <h3 className="text-lg font-medium mb-2">Attempt History</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-700">
                            <thead className="bg-gray-800">
                              <tr>
                                <th className="border border-gray-700 px-2 py-1 text-center">Attempt</th>
                                <th className="border border-gray-700 px-2 py-1 text-center">Score</th>
                                <th className="border border-gray-700 px-2 py-1 text-center">Date</th>
                                <th className="border border-gray-700 px-2 py-1 text-center">Answers</th>
                              </tr>
                            </thead>
                            <tbody>
                              {quiz.attempts.map((attempt, index) => (
                                <tr key={index} className="hover:bg-gray-800">
                                  <td className="border border-gray-700 px-2 py-1 text-center">
                                    #{attempt.attempt_number || index + 1}
                                  </td>
                                  <td className="border border-gray-700 px-2 py-1 text-center">
                                    {attempt.score} pts
                                  </td>
                                  <td className="border border-gray-700 px-2 py-1 text-center">
                                    {attempt.date.toLocaleString()}
                                  </td>
                                  <td className="border border-gray-700 px-2 py-1 text-sm">
                                    {Object.entries(attempt.answers).map(([qid, answer]) => {
                                      let answerText = '';
                                      
                                      if (answer.selectedOptionText) {
                                        // Format for multiple choice with text
                                        answerText = answer.selectedOptionText;
                                      } else if (answer.selectedOption) {
                                        // Format for multiple choice without text
                                        answerText = `Option ${answer.selectedOption}`;
                                      } else if (answer.selectedOptionsWithText) {
                                        // Format for multiple select with text
                                        answerText = answer.selectedOptionsWithText
                                          .map(opt => opt.text)
                                          .join(', ');
                                      } else if (answer.selectedOptions) {
                                        // Format for multiple select without text
                                        answerText = answer.selectedOptions.join(', ');
                                      } else if (answer.textAnswer) {
                                        // Format for text input
                                        answerText = answer.textAnswer;
                                      }
                                      
                                      return (
                                        <div key={qid} className="mb-1">
                                          <span className="font-medium">{qid}:</span> {answerText}
                                        </div>
                                      );
                                    })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}