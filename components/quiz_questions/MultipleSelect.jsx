"use client";
import { useState } from "react";

export default function MultipleSelectQuestion({ 
  question, 
  answer, 
  onChange,
  questionNumber 
}) {
  const handleOptionSelect = (optionId) => {
    // Get current selections or initialize empty array
    const currentSelections = answer?.selectedOptions || [];
    
    // Toggle the selection
    let newSelections;
    if (currentSelections.includes(optionId)) {
      newSelections = currentSelections.filter(id => id !== optionId);
    } else {
      newSelections = [...currentSelections, optionId];
    }
    
    onChange(question.id, newSelections);
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

      {/* Options */}
      <div className="options-container space-y-3 mt-4">
        {question.options.map((option) => {
          const isSelected = answer?.selectedOptions?.includes(option.id);
          return (
            <label 
              key={option.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors
                ${isSelected ? 'bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}
                active:bg-blue-800 active:transform active:scale-[0.98]`}
            >
              <input
                type="checkbox"
                name={`question_${question.id}`}
                value={option.id}
                checked={isSelected}
                onChange={() => handleOptionSelect(option.id)}
                className="mr-3"
              />
              <span className="option-text">{option.text}</span>
            </label>
          );
        })}
      </div>

      {/* Points indicator */}
      <div className="points-indicator mt-4 text-right text-sm text-gray-400">
        {question.points} {question.points === 1 ? 'point' : 'points'}
      </div>
    </div>
  );
}