// app/student-dashboard/quizzes/[id]/page.jsx
"use client";
import { useState, useEffect } from "react";
import { quizData } from "../../../../utils/quiz_data/practice_quiz";
import MultipleChoice from "../../../../components/quiz_questions/MultipleChoice";
import MultipleSelect from "../../../../components/quiz_questions/MultipleSelect";
import TextInput from "../../../../components/quiz_questions/TextInput";

export default function PracticeQuiz() {

  const quiz_data = quizData;
  console.log(quiz_data);

  //Setup for tracking inputted answers from the user
  const [answers, setAnswers] = useState(
    quizData.questions.reduce((acc, question) => {  
      acc[question.id] = {selectedOption:null};
    return acc;
    }, {})
  );
  const handleAnswerChange = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { selectedOption: optionId }
    }));
  };

  const [score, setScore] = useState(0);



  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="space-y-8">
        {quizData.questions.map((question, index) => {
          if (question.type === "multiple-choice") {
            return (
              <MultipleChoice
                key={question.id}
                question={question}
                answer={answers[question.id]}
                onChange={handleAnswerChange}
                questionNumber={index + 1}
              />
            );
          }

          if (question.type === "multiple-select") {
            return (
              <MultipleSelect
                key={question.id}
                question={question}
                answer={answers[question.id]}
                onChange={handleAnswerChange}
                questionNumber={index + 1}
              />
            );
          }
          if (question.type === "text-input") {
            return (
              <TextInput
                key={question.id}
                question={question}
                answer={answers[question.id]}
                onChange={handleAnswerChange}
                questionNumber={index + 1}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}