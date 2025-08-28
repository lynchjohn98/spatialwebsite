"use client";
import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Maximize2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function StudentResponsiveQuiz({ quizData, onQuizComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [isNoTimeLimit, setIsNoTimeLimit] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(
    quizData?.timeLimit || 600
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const router = useRouter();

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Not Found</h2>
          <p className="text-gray-400">The quiz data could not be loaded.</p>
        </div>
      </div>
    );
  }

  // Check if all questions are answered
  const areAllQuestionsAnswered = () => {
    return quizData.questions.every((question) =>
      isQuestionAnswered(question.id, question.type)
    );
  };

  // Get unanswered questions
  const getUnansweredQuestions = () => {
    return quizData.questions
      .map((question, index) => ({ question, index }))
      .filter(
        ({ question }) => !isQuestionAnswered(question.id, question.type)
      );
  };

  // After setting initial timeRemaining, check if it's no-limit mode
  useEffect(() => {
    // Check if time limit is 3600 seconds or more (1 hour+)
    const noLimit = quizData?.timeLimit >= 3600;
    setIsNoTimeLimit(noLimit);

    // If no time limit, set a large value for tracking purposes
    if (noLimit) {
      setTimeRemaining(quizData?.timeLimit || 3600);
    }
  }, [quizData]);

  useEffect(() => {
    if (isSubmitted || (timeRemaining <= 0 && !isNoTimeLimit)) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        // For no-limit mode, count UP instead of down
        if (isNoTimeLimit) {
          return prev + 1; // Count up to track time spent
        }

        // Normal countdown mode
        if (prev <= 1) {
          forceSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted, isNoTimeLimit]);

  // Timer functionality
  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Force submit when time expires (bypass the incomplete check)
          forceSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  // Format time display
  const formatTime = (seconds) => {
    if (isNoTimeLimit) {
      // For no-limit mode, show elapsed time
      const elapsedSeconds = seconds - (quizData?.timeLimit || 3600);
      const mins = Math.floor(Math.abs(elapsedSeconds) / 60);
      const secs = Math.abs(elapsedSeconds) % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    // Normal countdown display
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle different answer types
  const handleAnswerSelect = (questionId, answer, questionType) => {
    setAnswers((prev) => {
      if (questionType === "multiple-select") {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(answer)
          ? currentAnswers.filter((a) => a !== answer)
          : [...currentAnswers, answer];
        return { ...prev, [questionId]: newAnswers };
      } else {
        return { ...prev, [questionId]: answer };
      }
    });
  };

   const calculateResults = () => {
    let totalScore = 0;
    let maxScore = 0;
    const questionResults = [];

    console.log("INSIDE CALCULATE RESULTS", quizData);

    quizData.questions.forEach((question) => {
      let questionScore = 0;
      let questionMaxScore = question.points || 0;

      const userAnswer = answers[question.id];

      try {
        if (question.type === "multiple-choice") {
          if (question.options && Array.isArray(question.options)) {
            const correctOption = question.options.find((opt) => opt.correct);
            if (userAnswer === correctOption?.id) {
              questionScore = question.points || 1;
            }
          }
        } else if (question.type === "multiple-select") {
          if (question.options && Array.isArray(question.options)) {
            const correctAnswers = question.options
              .filter((opt) => opt.correct)
              .map((opt) => opt.id);
            const userAnswers = userAnswer || [];

            const isCorrect =
              correctAnswers.length === userAnswers.length &&
              correctAnswers.every((ans) => userAnswers.includes(ans));

            if (isCorrect) {
              questionScore = question.points || 1;
            }
          }
        } else if (question.type === "text-input") {
          const userText = (userAnswer || "").toLowerCase().trim();
          const correctAnswers = [
            question.correctAnswer,
            ...(question.alternateAnswers || []),
          ].filter(Boolean).map((ans) => ans.toLowerCase().trim());

          if (correctAnswers.includes(userText)) {
            questionScore = question.points || 1;
          }
        } else if (question.type === "multiple-subselect") {
          if (question.parts && Array.isArray(question.parts)) {
            const multiPartAnswers = userAnswer || {};
            let correctCount = 0;

            question.parts.forEach((part) => {
              const partAnswer = multiPartAnswers[part.id];
              const isCorrect = partAnswer && partAnswer === part.correct;

              if (isCorrect) {
                correctCount += 1;
              }
            });

            questionScore = correctCount;
            questionMaxScore = question.parts.length;
          }
        } else if (question.type === "multiple-parts-subselect") {
          const multiPartAnswers = userAnswer || {};
          let correctCount = 0;
          let totalSubQuestions = 0;

          if (question.parts && Array.isArray(question.parts)) {
            question.parts.forEach((part) => {
              console.log("Evaluating part:", part);
              const partAnswers = multiPartAnswers[part.id] || {};

              if (part.subQuestions && Array.isArray(part.subQuestions)) {
                part.subQuestions.forEach((subQuestion) => {
                  totalSubQuestions += 1;
                  const subAnswer = partAnswers[subQuestion.id];
                  const isCorrect = subAnswer && subAnswer === subQuestion.correct;
                  console.log("Inside here:", subAnswer, isCorrect);
                  if (isCorrect) {
                    correctCount += 1;
                  }
                });
              }
            });

            questionScore = correctCount;
            questionMaxScore = totalSubQuestions > 0 ? totalSubQuestions : question.points || 1;
          }
        } else if (question.type === "single-image-multiple-points") {
          if (question.problems && Array.isArray(question.problems)) {
            const problemAnswers = userAnswer || {};
            let correctCount = 0;
            let totalProblems = question.problems.length;
            
            question.problems.forEach((problem) => {
              const userProblemAnswer = problemAnswers[problem.id];
              if (userProblemAnswer === problem.correctAnswer) {
                correctCount += 1;
              }
            });
            
            questionScore = correctCount;
            questionMaxScore = totalProblems;
          }
        } else {
          console.warn(`Unknown question type: ${question.type} for question ${question.id}`);
        }
      } catch (error) {
        console.error(`Error calculating score for question ${question.id}:`, error);
        questionScore = 0;
        questionMaxScore = question.points || 0;
      }

      totalScore += questionScore;
      maxScore += questionMaxScore;

      questionResults.push({
        questionId: question.id,
        score: questionScore,
        maxScore: questionMaxScore,
        correct: questionScore > 0,
      });
    });

    return { totalScore, maxScore, questionResults };
  };

  // Force submit without checking completion (used for timer expiry)
  const forceSubmit = useCallback(() => {
    if (isSubmitted) return;

    const results = calculateResults();
    const timeSpent = isNoTimeLimit
      ? timeRemaining - (quizData?.timeLimit || 3600) // Actual elapsed time
      : (quizData?.timeLimit || 600) - timeRemaining; // Time used from limit

    setIsSubmitted(true);

    if (onQuizComplete) {
      onQuizComplete({
        quizId: quizData.id,
        quizTitle: quizData.title,
        answers,
        results,
        timeSpent: (quizData?.timeLimit || 600) - timeSpent,
        completedAt: new Date().toISOString(),
      });
    }
  }, [answers, isSubmitted, timeRemaining, quizData, onQuizComplete]);

  // Handle quiz submission with incomplete check
  const handleSubmit = useCallback(() => {
    if (isSubmitted) return;

    // Check if all questions are answered
    if (!areAllQuestionsAnswered()) {
      setShowIncompleteModal(true);
      return;
    }

    // If all questions answered, submit directly
    forceSubmit();
  }, [isSubmitted, areAllQuestionsAnswered, forceSubmit]);

  // Page leave warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSubmitted) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitted) {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isSubmitted]);

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
    setShowSidebar(false);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const isQuestionAnswered = (questionId, questionType) => {
    const answer = answers[questionId];
    if (!answer) return false;
    if (questionType === "multiple-select") {
      return Array.isArray(answer) && answer.length > 0;
    }

    return answer !== "" && answer !== undefined;
  };

  const currentQ = quizData.questions[currentQuestion];

  // Results screen
  if (isSubmitted) {
    const results = calculateResults();
    const percentage = Math.round(
      (results.totalScore / results.maxScore) * 100
    );

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-lg w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {quizData.title} Complete!
            </h2>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {results.totalScore}/{results.maxScore}
            </div>
            <div className="text-xl text-gray-600">{percentage}% Score</div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span>Questions Answered:</span>
              <span>
                {Object.keys(answers).length}/{quizData.questions.length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Time Spent:</span>
              <span>
                {formatTime((quizData?.timeLimit || 600) - timeRemaining)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Correct Answers:</span>
              <span>
                {results.questionResults.filter((r) => r.correct).length}
              </span>
            </div>
          </div>
          <button
            onClick={() => router.push("/student/student-dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          >
            Return to Student Dashboard
          </button>
        </div>
      </div>
    );
  }

  const renderQuestionContent = () => {
    const userAnswer = answers[currentQ.id];

    switch (currentQ.type) {
      case "multiple-choice":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQ.options.map((option) => (
              <button
                key={option.id}
                onClick={() =>
                  handleAnswerSelect(currentQ.id, option.id, currentQ.type)
                }
                className={`
                p-4 text-left rounded-lg border-2 transition-all duration-200 hover:scale-[1.02]
                ${
                  userAnswer === option.id
                    ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-600/25 text-white"
                    : "bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-600 text-white"
                }
              `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${
                    userAnswer === option.id
                      ? "border-white bg-white"
                      : "border-gray-400"
                  }
                `}
                  >
                    {userAnswer === option.id && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case "multiple-select":
        const selectedAnswers = userAnswer || [];
        return (
          <div className="space-y-3">
            <p className="text-sm text-blue-400 mb-4">Select all that apply:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQ.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() =>
                    handleAnswerSelect(currentQ.id, option.id, currentQ.type)
                  }
                  className={`
                  p-4 text-left rounded-lg border-2 transition-all duration-200 hover:scale-[1.02]
                  ${
                    selectedAnswers.includes(option.id)
                      ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-600/25 text-white"
                      : "bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-600 text-white"
                  }
                `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                    w-4 h-4 rounded border-2 flex items-center justify-center
                    ${
                      selectedAnswers.includes(option.id)
                        ? "border-white bg-white"
                        : "border-gray-400"
                    }
                  `}
                    >
                      {selectedAnswers.includes(option.id) && (
                        <div className="text-blue-600 text-xs font-bold">✓</div>
                      )}
                    </div>
                    <span className="font-medium">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "multiple-subselect":
        const multiPartAnswers = userAnswer || {};
        return (
          <div className="space-y-4">
            <p className="text-sm text-blue-400 mb-4">
              Select an answer for each part:
            </p>
            <div className="space-y-4">
              {currentQ.parts.map((part) => (
                <div key={part.id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-white font-semibold bg-blue-600 px-3 py-1 rounded">
                      {part.label}
                    </span>
                    {part.description && (
                      <span className="text-gray-300 text-sm">
                        {part.description}
                      </span>
                    )}

                    <select
                      value={multiPartAnswers[part.id] || ""}
                      onChange={(e) => {
                        const newAnswers = {
                          ...multiPartAnswers,
                          [part.id]: e.target.value,
                        };
                        handleAnswerSelect(
                          currentQ.id,
                          newAnswers,
                          currentQ.type
                        );
                      }}
                      className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
                    >
                      <option value="" className="text-gray-400">
                        Select an option...
                      </option>
                      {currentQ.options.map((option) => (
                        <option
                          key={option.id}
                          value={option.id}
                          className="text-white"
                        >
                          {option.text}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              All parts must be answered to complete this question
            </div>
          </div>
        );

      case "text-input":
        return (
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <label
                htmlFor="text-answer"
                className="block text-sm text-gray-300 mb-2"
              >
                Your Answer:
              </label>
              <input
                id="text-answer"
                type="text"
                value={userAnswer || ""}
                onChange={(e) =>
                  handleAnswerSelect(currentQ.id, e.target.value, currentQ.type)
                }
                placeholder="Type your answer here..."
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
              {currentQ.alternateAnswers && (
                <p className="text-xs text-gray-400 mt-2">
                  Note: Multiple answer formats may be accepted
                </p>
              )}
            </div>
          </div>
        );

      case "multiple-parts-subselect":
        const multiplePartsAnswers = userAnswer || {}; // Changed variable name to avoid conflict

        return (
          <div className="space-y-4">
            <p className="text-sm text-blue-400 mb-4">
              Select answers for each part:
            </p>
            <div className="space-y-6">
              {currentQ.parts.map((part) => (
                <div key={part.id} className="bg-gray-700 p-4 rounded-lg">
                  {/* Part Header with Label */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-white font-semibold bg-blue-600 px-3 py-1 rounded">
                      {part.label}
                    </span>
                    {part.description && (
                      <span className="text-gray-300 text-sm">
                        {part.description}
                      </span>
                    )}
                  </div>

                  {/* Image and Sub-questions Layout */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image Section */}
                    {part.imageUrl && (
                      <div className="flex-shrink-0">
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <img
                            src={part.imageUrl}
                            alt={`Part ${part.label}`}
                            className="max-w-full h-auto max-w-xs"
                          />
                        </div>
                      </div>
                    )}

                    {/* Sub-questions Section */}
                    <div className="flex-grow space-y-3">
                      {part.subQuestions?.map((subQuestion) => (
                        <div
                          key={subQuestion.id}
                          className="flex items-center gap-3 flex-wrap"
                        >
                          <label className="text-sm font-medium text-gray-300 min-w-[80px]">
                            {subQuestion.label}
                          </label>

                          <select
                            value={
                              multiplePartsAnswers[part.id]?.[subQuestion.id] ||
                              ""
                            }
                            onChange={(e) => {
                              const newAnswers = {
                                ...multiplePartsAnswers,
                                [part.id]: {
                                  ...multiplePartsAnswers[part.id],
                                  [subQuestion.id]: e.target.value,
                                },
                              };
                              handleAnswerSelect(
                                currentQ.id,
                                newAnswers,
                                currentQ.type
                              );
                            }}
                            className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer min-w-[120px]"
                          >
                            <option value="" className="text-gray-400">
                              [ Select ]
                            </option>
                            {(
                              subQuestion.options ||
                              currentQ.globalOptions ||
                              currentQ.options
                            )?.map((option) => (
                              <option
                                key={option.id}
                                value={option.id}
                                className="text-white"
                              >
                                {option.text}
                              </option>
                            ))}
                          </select>
                        </div>
                      )) || (
                        // Fallback for simple single dropdown per part (backward compatibility)
                        <div className="flex items-center gap-3">
                          <select
                            value={multiplePartsAnswers[part.id] || ""}
                            onChange={(e) => {
                              const newAnswers = {
                                ...multiplePartsAnswers,
                                [part.id]: e.target.value,
                              };
                              handleAnswerSelect(
                                currentQ.id,
                                newAnswers,
                                currentQ.type
                              );
                            }}
                            className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
                          >
                            <option value="" className="text-gray-400">
                              Select an option...
                            </option>
                            {currentQ.options.map((option) => (
                              <option
                                key={option.id}
                                value={option.id}
                                className="text-white"
                              >
                                {option.text}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              All parts must be answered to complete this question
            </div>
          </div>
        );

      case "single-image-multiple-points":
        const problemAnswers = userAnswer || {};

        return (
          <div className="space-y-4">
            <p className="text-sm text-blue-400 mb-4">
              Identify each numbered point in the image:
            </p>

          

            {/* Dropdown for each numbered problem */}
            <div className="space-y-3 bg-gray-700 p-4 rounded-lg">
              {currentQ.problems.map((problem) => (
                <div key={problem.id} className="flex items-center gap-4">
                  {/* Problem Number Label */}
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <span className="bg-blue-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      {problem.number}
                    </span>
                    <span className="text-gray-300 text-sm font-medium">
                      {problem.label || `Point ${problem.number}`}
                    </span>
                  </div>

                  {/* Dropdown Selection */}
                  <select
                    value={problemAnswers[problem.id] || ""}
                    onChange={(e) => {
                      const newAnswers = {
                        ...problemAnswers,
                        [problem.id]: e.target.value,
                      };
                      handleAnswerSelect(
                        currentQ.id,
                        newAnswers,
                        currentQ.type
                      );
                    }}
                    className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
                  >
                    <option value="" className="text-gray-400">
                      Select an option...
                    </option>
                    {currentQ.answerChoices.map((choice) => (
                      <option
                        key={choice.id}
                        value={choice.id}
                        className="text-white"
                      >
                        {choice.text}
                      </option>
                    ))}
                  </select>

                  {/* Show if answered */}
                  {problemAnswers[problem.id] && (
                    <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-400 mt-2">
              Identify what each numbered point represents in the isometric view
            </div>
          </div>
        );

      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Warning Banner */}

      {showWarning && !isNoTimeLimit && (
        <div className="bg-red-600 text-white p-2 text-center flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">
            Warning: Leaving the quiz may force submission!
          </span>
        </div>
      )}

      {/* Incomplete Submission Modal */}
      {showIncompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-600">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-bold text-white">Incomplete Quiz</h3>
            </div>

            <p className="text-gray-300 mb-4">
              You have {getUnansweredQuestions().length} unanswered question
              {getUnansweredQuestions().length !== 1 ? "s" : ""}:
            </p>

            <div className="mb-6 max-h-32 overflow-y-auto">
              <ul className="space-y-1">
                {getUnansweredQuestions().map(({ question, index }) => (
                  <li key={question.id} className="text-sm text-gray-400">
                    • Question {index + 1}: {question.text.substring(0, 50)}
                    {question.text.length > 50 ? "..." : ""}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to submit the quiz with unanswered
              questions?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowIncompleteModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg font-medium"
              >
                Continue Quiz
              </button>
              <button
                onClick={() => {
                  setShowIncompleteModal(false);
                  forceSubmit();
                }}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-800 p-2 sm:p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden p-2 hover:bg-gray-700 rounded flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-xl font-bold truncate">
              {quizData.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 hidden sm:block truncate">
              {quizData.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {!isNoTimeLimit ? (
            // Show countdown timer for regular mode
            <div
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                timeRemaining < 60 ? "bg-red-600" : "bg-blue-600"
              }`}
            >
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>
          ) : (
            // Show elapsed time indicator for no-limit mode
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-gray-600">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-mono">
                Time: {formatTime(timeRemaining)}
              </span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm"
          >
            Submit
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`
          ${
            showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
          fixed lg:relative z-30 w-64 bg-gray-800 transition-transform duration-300 border-r border-gray-700
          h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4.5rem)] lg:h-full
        `}
        >
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-3 sm:p-4 border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm sm:text-base">
                  Questions
                </h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="lg:hidden p-1 hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Questions List - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {quizData.questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(index)}
                    className={`
                      p-2 sm:p-3 text-left rounded-lg transition-all duration-200
                      ${
                        currentQuestion === index
                          ? "bg-blue-600 border-2 border-blue-400"
                          : isQuestionAnswered(q.id, q.type)
                          ? "bg-green-600/30 border-2 border-green-500 hover:bg-green-600/40"
                          : "bg-gray-700 hover:bg-gray-600 border-2 border-transparent"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-xs sm:text-sm block truncate">
                          Question {index + 1}
                        </span>
                        <div className="text-xs text-gray-300 mt-0.5 hidden sm:block">
                          {q.points} pts
                        </div>
                      </div>
                      {isQuestionAnswered(q.id, q.type) && (
                        <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 ml-2"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Section - Fixed at Bottom */}
            <div className="p-3 sm:p-4 border-t border-gray-700 bg-gray-800 flex-shrink-0">
              <div className="p-3 bg-gray-700 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-300 mb-2">
                  Progress
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (Object.keys(answers).filter((key) =>
                            isQuestionAnswered(
                              key,
                              quizData.questions.find((q) => q.id === key)?.type
                            )
                          ).length /
                            quizData.questions.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {
                      Object.keys(answers).filter((key) =>
                        isQuestionAnswered(
                          key,
                          quizData.questions.find((q) => q.id === key)?.type
                        )
                      ).length
                    }
                    /{quizData.questions.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {showSidebar && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setShowSidebar(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Question {currentQuestion + 1} of{" "}
                    {quizData.questions.length}
                  </h2>
                  <div className="flex items-center gap-2 sm:gap-4 mt-1">
                    <span className="text-xs sm:text-sm text-blue-400 capitalize">
                      {currentQ.type.replace("-", " ")}
                    </span>
                    <span className="text-xs sm:text-sm text-green-400">
                      {currentQ.points} point{currentQ.points > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className="p-1.5 sm:p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextQuestion}
                    disabled={currentQuestion === quizData.questions.length - 1}
                    className="p-1.5 sm:p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                {currentQ.text}
              </p>

              {/* Image */}
              {currentQ.imageUrl && (
                <div className="mb-4 sm:mb-6 bg-white rounded-lg p-2 sm:p-4 flex items-center justify-center relative">
                  <img
                    src={currentQ.imageUrl}
                    alt={`Question ${currentQuestion + 1} diagram`}
                    className="max-w-full h-auto cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setIsFullscreen(true)}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <div
                    style={{ display: "none" }}
                    className="text-gray-500 text-center p-4 sm:p-8"
                  >
                    Image not found: {currentQ.imageUrl}
                  </div>
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="absolute top-2 right-2 p-1.5 sm:p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                  >
                    <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}

              {/* Question Content */}
              {renderQuestionContent()}
            </div>
          </div>
        </main>
      </div>

      {/* Fullscreen Image Modal */}
      {isFullscreen && currentQ.imageUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={currentQ.imageUrl}
              alt={`Question ${currentQuestion + 1} diagram - fullscreen`}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
