"use client";
import { useState } from "react";

export default function QuizNavigation({ 
  totalQuestions, 
  currentQuestion, 
  onPrevious, 
  onNext, 
  onSubmit,
  isFirstQuestion,
  isLastQuestion,
  questionStatus = []
}) {
  return (
    <div className="quiz-navigation">
      {/* Progress indicator */}
      <div className="progress-container mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span className="text-sm">
            {Math.round(((currentQuestion + 1) / totalQuestions) * 100)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question status indicators (optional) */}
      {questionStatus.length > 0 && (
        <div className="question-status-container mb-4 overflow-x-auto py-2">
          <div className="flex space-x-2 min-w-max">
            {questionStatus.map((status, index) => (
              <button
                key={index}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium 
                  ${index === currentQuestion ? 'ring-2 ring-white' : ''}
                  ${status === 'answered' ? 'bg-green-600' : 
                    status === 'viewed' ? 'bg-blue-600' : 'bg-gray-600'}`}
                onClick={() => onNavigate(index)}
                aria-label={`Go to question ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className={`px-4 py-2 rounded transition-colors
            ${isFirstQuestion
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
          aria-label="Go to previous question"
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Previous
          </div>
        </button>
        
        {isLastQuestion ? (
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded transition-colors"
            aria-label="Submit quiz"
          >
            <div className="flex items-center">
              Submit Quiz
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        ) : (
          <button
            onClick={onNext}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded transition-colors"
            aria-label="Go to next question"
          >
            <div className="flex items-center">
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}