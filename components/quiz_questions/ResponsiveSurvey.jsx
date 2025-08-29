"use client";
import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function SimpleSurvey({ data, onSurveyComplete }) {
  const [answers, setAnswers] = useState({});
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime] = useState(new Date());

  // Handle answer selection
  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
    setShowIncompleteWarning(false);
  };

  // Check if all questions are answered
  const isComplete = () => {
    return data.questions.every(q => answers[q.id]);
  };

  // Get completion percentage
  const getCompletionPercentage = () => {
    const answered = Object.keys(answers).length;
    return Math.round((answered / data.questions.length) * 100);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!isComplete()) {
      setShowIncompleteWarning(true);
      // Scroll to first unanswered question
      const firstUnanswered = data.questions.find(q => !answers[q.id]);
      if (firstUnanswered) {
        const element = document.getElementById(firstUnanswered.id);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const endTime = new Date();
    const timeSpent = Math.round((endTime - startTime) / 1000); // in seconds

    const submissionData = {
      surveyId: data.id,
      surveyTitle: data.title,
      answers: Object.entries(answers).map(([questionId, answerId]) => ({
        questionId,
        answer: answerId,
        questionText: data.questions.find(q => q.id === questionId)?.text
      })),
      completedAt: endTime.toISOString(),
      timeSpent,
      completionPercentage: 100
    };

    setIsSubmitted(true);
    
    // Call the parent callback if provided
    if (onSurveyComplete) {
      onSurveyComplete(submissionData);
    }

    console.log('Survey Submitted:', submissionData);
  };

  // Success screen
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
            onClick={() => window.location.href = '/student/student-dashboard/quizzes'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Return to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="space-y-6">
        {/* Header Section */}
        <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-300">
            {data.title}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            {data.description}
          </p>
          
          {/* Progress Bar */}
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
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
          <div className="bg-orange-900/20 border-l-4 border-orange-500 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-400 mr-2" />
              <p className="text-sm text-orange-300">
                Please answer all questions before submitting.
              </p>
            </div>
          </div>
        )}

        {/* Likert Scale Questions */}
        <section className="bg-gray-800/70 rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
          {/* Likert Scale Header - Sticky */}
          <div className="bg-gray-700/50 px-6 py-4 border-b border-gray-700 sticky top-0 z-10">
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-1"></div>
              {data.likertOptions.map(option => (
                <div key={option.id} className="text-center">
                  <span className="text-xs sm:text-sm font-medium text-gray-300">
                    {option.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Questions List */}
          <div className="divide-y divide-gray-700/50">
            {data.questions.map((question, index) => (
              <div 
                key={question.id} 
                id={question.id}
                className={`px-6 py-5 hover:bg-gray-700/20 transition-colors ${
                  !answers[question.id] && showIncompleteWarning 
                    ? 'bg-orange-900/10 border-l-4 border-orange-500' 
                    : ''
                }`}
              >
                <div className="grid grid-cols-6 gap-2 items-center">
                  {/* Question Text */}
                  <div className="col-span-1 pr-4">
                    <div className="flex items-start">
                      <span className="text-gray-500 text-sm mr-2 font-medium">
                        {index + 1}.
                      </span>
                      <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                        {question.text}
                      </p>
                    </div>
                  </div>

                  {/* Radio Buttons */}
                  {data.likertOptions.map(option => (
                    <div key={option.id} className="flex justify-center">
                      <label className="cursor-pointer group">
                        <input
                          type="radio"
                          name={question.id}
                          value={option.id}
                          checked={answers[question.id] === option.id}
                          onChange={() => handleAnswerSelect(question.id, option.id)}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 
                                   focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 
                                   cursor-pointer transition-all
                                   checked:bg-blue-600 checked:border-blue-500"
                        />
                        <span className="sr-only">{option.text}</span>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Show checkmark for answered questions */}
                {answers[question.id] && (
                  <div className="flex items-center gap-2 text-green-400 text-xs mt-2 pl-8">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Answered</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Submit Section */}
        <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-gray-400">
              <p className="text-sm">
                Please ensure all questions are answered before submitting.
              </p>
              <p className="text-xs mt-1">
                {data.questions.length - Object.keys(answers).length} questions remaining
              </p>
            </div>
            <button
              onClick={handleSubmit}
              className={`px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105 
                ${isComplete() 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600 cursor-not-allowed'
                }`}
            >
              Submit Survey
            </button>
          </div>

          {/* Completion Indicator */}
          {isComplete() && (
            <div className="mt-4 p-4 bg-green-900/20 rounded-lg border border-green-700/50">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">
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