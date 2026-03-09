"use client";
import { useState } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function SimpleSurvey({ data, onSurveyComplete }) {
  const [answers, setAnswers] = useState({});
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime] = useState(new Date());

  // ✅ Resolve whichever likert options exist on the data object
  const getOptionsForQuestion = (question) => {
    // If question itself specifies an optionsGroup, use that
    if (question.optionsGroup === 2 && data.likertOptions2) return data.likertOptions2;
    if (question.optionsGroup === 1 && data.likertOptions1) return data.likertOptions1;
    // Fall back through all possible field names
    return data.likertOptions || data.likertOptions1 || data.likertOptions2 || [];
  };

  // For the sticky header, use the primary/first available options
  const primaryOptions = data.likertOptions || data.likertOptions1 || data.likertOptions2 || [];

  // Dynamically set grid columns based on number of options
  const getGridCols = (optionCount) => {
    const map = { 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8 };
    return map[optionCount] || 6;
  };

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setShowIncompleteWarning(false);
  };

  const isComplete = () => data.questions.every(q => answers[q.id]);

  const getCompletionPercentage = () =>
    Math.round((Object.keys(answers).length / data.questions.length) * 100);

  const handleSubmit = () => {
    if (!isComplete()) {
      setShowIncompleteWarning(true);
      const firstUnanswered = data.questions.find(q => !answers[q.id]);
      if (firstUnanswered) {
        document.getElementById(firstUnanswered.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const endTime = new Date();
    const submissionData = {
      surveyId: data.id,
      surveyTitle: data.title,
      answers: Object.entries(answers).map(([questionId, answerId]) => ({
        questionId,
        answer: answerId,
        questionText: data.questions.find(q => q.id === questionId)?.text,
      })),
      completedAt: endTime.toISOString(),
      timeSpent: Math.round((endTime - startTime) / 1000),
      completionPercentage: 100,
    };

    setIsSubmitted(true);
    if (onSurveyComplete) onSurveyComplete(submissionData);
    console.log("Survey Submitted:", submissionData);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/70 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-700/50">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
          <p className="text-gray-300 mb-6">Your survey has been submitted successfully.</p>
          <div className="bg-gray-700/30 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-400">
              Your responses have been recorded and will help improve the course experience.
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/student/student-dashboard/quizzes")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Return to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 px-2 sm:px-0 sm:py-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <section className="bg-gray-800/70 rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-700/50">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-blue-300">
            {data.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 sm:mb-6">
            {data.description}
          </p>

          {/* Progress Bar */}
          <div className="bg-gray-700/30 p-3 sm:p-4 rounded-lg">
            <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span className="text-blue-400">{getCompletionPercentage()}% Complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {Object.keys(answers).length} of {data.questions.length} questions answered
            </div>
          </div>
        </section>

        {/* Warning Message */}
        {showIncompleteWarning && (
          <div className="bg-orange-900/20 border-l-4 border-orange-500 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mr-2 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-orange-300">
                Please answer all questions before submitting.
              </p>
            </div>
          </div>
        )}

        {/* Likert Scale Questions */}
        <section className="bg-gray-800/70 rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">

          {/* ── DESKTOP / TABLET (md+): sticky header + grid rows ── */}
          <div className="hidden md:block">
            {/* Sticky Header */}
            <div className="bg-gray-700/50 px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-700 sticky top-0 z-10">
              <div
                className="grid gap-2 items-center"
                style={{ gridTemplateColumns: `2fr repeat(${primaryOptions.length}, 1fr)` }}
              >
                <div />
                {primaryOptions.map(option => (
                  <div key={option.id} className="text-center">
                    <span className="text-xs lg:text-sm font-medium text-gray-300 leading-tight">
                      {option.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions */}
            <div className="divide-y divide-gray-700/50">
              {data.questions.map((question, index) => {
                const options = getOptionsForQuestion(question);
                return (
                  <div
                    key={question.id}
                    id={question.id}
                    className={`px-4 lg:px-6 py-4 lg:py-5 hover:bg-gray-700/20 transition-colors ${
                      !answers[question.id] && showIncompleteWarning
                        ? "bg-orange-900/10 border-l-4 border-orange-500"
                        : ""
                    }`}
                  >
                    <div
                      className="grid gap-2 items-center"
                      style={{ gridTemplateColumns: `2fr repeat(${options.length}, 1fr)` }}
                    >
                      {/* Question Text */}
                      <div className="pr-3">
                        <div className="flex items-start gap-2">
                          <span className="text-gray-500 text-xs lg:text-sm font-medium flex-shrink-0">
                            {index + 1}.
                          </span>
                          <p className="text-xs lg:text-sm text-gray-200 leading-relaxed">
                            {question.text}
                          </p>
                        </div>
                      </div>

                      {/* Radio Buttons */}
                      {options.map(option => (
                        <div key={option.id} className="flex justify-center">
                          <label className="cursor-pointer group">
                           <div className="relative flex items-center justify-center">
  <input
    type="radio"
    name={question.id}
    value={option.id}
    checked={answers[question.id] === option.id}
    onChange={() => handleAnswerSelect(question.id, option.id)}
    className="w-5 h-5 cursor-pointer appearance-none rounded-full border-2 
               border-gray-500 bg-gray-700 transition-all duration-150
               focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:ring-offset-gray-800"
  />
  {answers[question.id] === option.id && (
    <div className="absolute w-2.5 h-2.5 rounded-full bg-green-400 pointer-events-none" />
  )}
</div>
                            <span className="sr-only">{option.text}</span>
                          </label>
                        </div>
                      ))}
                    </div>

                    {answers[question.id] && (
                      <div className="flex items-center gap-1 text-green-400 text-xs mt-2 pl-5">
                        <CheckCircle className="w-3 h-3" />
                        <span>Answered</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── MOBILE (< md): stacked card layout ── */}
          <div className="md:hidden divide-y divide-gray-700/50">
            {data.questions.map((question, index) => {
              const options = getOptionsForQuestion(question);
              return (
                <div
                  key={question.id}
                  id={question.id}
                  className={`p-4 ${
                    !answers[question.id] && showIncompleteWarning
                      ? "bg-orange-900/10 border-l-4 border-orange-500"
                      : ""
                  }`}
                >
                  {/* Question */}
                  <p className="text-sm text-gray-200 leading-relaxed mb-3">
                    <span className="text-gray-500 font-medium mr-1">{index + 1}.</span>
                    {question.text}
                  </p>

                  {/* Options as labeled radio buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {options.map(option => (
                      <label
                        key={option.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                          answers[question.id] === option.id
                            ? "border-blue-500 bg-blue-900/20 text-blue-300"
                            : "border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500"
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.id}
                          checked={answers[question.id] === option.id}
                          onChange={() => handleAnswerSelect(question.id, option.id)}
                          className="w-3.5 h-3.5 text-blue-600 bg-gray-700 border-gray-600 flex-shrink-0"
                        />
                        <span className="text-xs leading-tight">{option.text}</span>
                      </label>
                    ))}
                  </div>

                  {answers[question.id] && (
                    <div className="flex items-center gap-1 text-green-400 text-xs mt-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Answered</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Submit Section */}
        <section className="bg-gray-800/70 rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-center sm:text-left">
              <p className="text-xs sm:text-sm">
                Please ensure all questions are answered before submitting.
              </p>
              <p className="text-xs mt-1">
                {data.questions.length - Object.keys(answers).length} questions remaining
              </p>
            </div>
            <button
              onClick={handleSubmit}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105 
                ${isComplete()
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600 cursor-not-allowed"
                }`}
            >
              Submit Survey
            </button>
          </div>

          {isComplete() && (
            <div className="mt-4 p-3 sm:p-4 bg-green-900/20 rounded-lg border border-green-700/50">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">
                  All questions answered! Ready to submit.
                </span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}