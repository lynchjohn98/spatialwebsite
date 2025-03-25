"use client";
import { useState } from "react";

export default function TextInputQuestion({ 
  question, 
  answer, 
  onChange,
  questionNumber 
}) {
  const handleTextChange = (e) => {
    onChange(question.id, e.target.value);
  };

  return (
    <div className="question-container w-full">
      <div className="question-header mb-4">
        <h3 className="text-lg sm:text-xl font-medium pb-2 border-b border-gray-700">
          <span className="text-blue-400 mr-2">{questionNumber}.</span> 
          {question.text}
        </h3>
      </div>

      {/* Display question image if available */}
      {question.imageUrl && (
        <div className="question-image flex justify-center mb-6 mt-4">
          <img 
            src={question.imageUrl} 
            alt={`Question ${questionNumber}`} 
            className="max-w-full h-auto max-h-64 rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Text Input */}
      <div className="input-container mt-4">
        <input
          type="text"
          value={answer?.textAnswer || ""}
          onChange={handleTextChange}
          placeholder="Enter your answer here"
          className="w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Points indicator */}
      <div className="points-indicator mt-4 text-right text-sm text-gray-400">
        {question.points} {question.points === 1 ? 'point' : 'points'}
      </div>
    </div>
  );
}