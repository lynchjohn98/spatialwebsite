// app/student-dashboard/quizzes/[id]/page.jsx
"use client";
import { useState, useEffect } from "react";
import { quizData } from "../../../../utils/quiz_data/practice_quiz";
import MultipleChoice from "../../../../components/quiz_questions/MultipleChoice";
import MultipleSelect from "../../../../components/quiz_questions/MultipleSelect";
import TextInput from "../../../../components/quiz_questions/TextInput";
import { useRouter } from "next/navigation";
import { submitQuizData } from "../../../actions";

export default function PracticeQuiz() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [submissionError, setSubmissionError] = useState(null);
 

  const totalPoints = quizData.questions.reduce(
    (total, question) => total + question.points, 
    0
  );

  const [answers, setAnswers] = useState(
    quizData.questions.reduce((acc, question) => {
      if (question.type === "multiple-select") {
        acc[question.id] = { selectedOptions: [] };
      } else if (question.type === "text-input") {
        acc[question.id] = { textAnswer: "" };
      } else {
        acc[question.id] = { selectedOption: null };
      }
      return acc;
    }, {})
  );

  useEffect(() => {
    const storedCourseData = sessionStorage.getItem("courseData");
    const storedStudentData = sessionStorage.getItem("studentData");
    setCourseData(JSON.parse(storedCourseData));
    setStudentData(JSON.parse(storedStudentData));
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => {
      const question = quizData.questions.find(q => q.id === questionId);
      
      if (question.type === "multiple-select") {
        const selectedOptionsWithText = value.map(optionId => {
          const option = question.options.find(opt => opt.id === optionId);
          return {
            id: optionId,
            text: option ? option.text : ''
          };
        });
        
        return { ...prev, [questionId]: { 
          selectedOptions: value,
          selectedOptionsWithText 
        }};
      } else if (question.type === "text-input") {
        return { ...prev, [questionId]: { textAnswer: value }};
      } else {
        const selectedOption = question.options.find(opt => opt.id === value);
        const selectedOptionText = selectedOption ? selectedOption.text : '';   
        return { ...prev, [questionId]: { 
          selectedOption: value,
          selectedOptionText 
        }};
      }
    });
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    const endTime = new Date();
    let totalScore = 0;
    
    quizData.questions.forEach(question => {
      const userAnswer = answers[question.id];
      
      if (question.type === "multiple-choice") {
        const selectedOption = question.options.find(
          opt => opt.id === userAnswer.selectedOption
        );
        if (selectedOption && selectedOption.correct) {
          totalScore += question.points;
        }
      } 
      else if (question.type === "multiple-select") {
        const correctOptionIds = question.options
          .filter(opt => opt.correct)
          .map(opt => opt.id);
        
        const userSelectedIds = userAnswer.selectedOptions || [];
        
        const allCorrectSelected = correctOptionIds.every(
          id => userSelectedIds.includes(id)
        );
        
        const noIncorrectSelected = userSelectedIds.every(
          id => correctOptionIds.includes(id)
        );
        
        if (allCorrectSelected && noIncorrectSelected) {
          totalScore += question.points;
        }
      } 
      else if (question.type === "text-input") {
        const userText = (userAnswer.textAnswer || "").trim().toLowerCase();
        const correctAnswers = [
          question.correctAnswer.toLowerCase(),
          ...(question.alternateAnswers || []).map(ans => ans.toLowerCase())
        ];
        
        if (correctAnswers.includes(userText)) {
          totalScore += question.points;
        }
      }
    });
    setScore(totalScore);

    const payload = {
      quiz_id: quizData.id,
      student_id: studentData?.id || 'unknown',
      score: totalScore,
      answers: JSON.stringify(answers),
      attempt_number: attemptNumber,
      time_start: startTime.toISOString(),
      time_end: endTime.toISOString(),
      course_id: studentData?.course_id || 'unknown'
    }
    
    try {
      await submitQuizData(payload);     
      setQuizSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setSubmissionError("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date());
    }
    
    if (!quizSubmitted) {
      const handleBeforeUnload = (e) => {
        const message = "You have unsaved changes. Are you sure you want to leave? Your quiz will be automatically submitted.";
        e.preventDefault();
        e.returnValue = message;
        return message;
      };
      
      const handlePopState = (e) => {
        e.preventDefault();
        if (confirm("If you leave now, your quiz will be automatically submitted. Continue?")) {
          handleSubmit();
        }
        window.history.pushState(null, "", window.location.pathname);
      };
      
      const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA')) {
          e.preventDefault();
          alert("Please use the navigation buttons provided. If you need to leave, your quiz will be submitted.");
        }
      };
      window.history.pushState(null, "", window.location.pathname);   
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [quizSubmitted, startTime]);

  const currentQuestion = quizData.questions[currentQuestionIndex];

  if (quizSubmitted) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-white">
        <div className="w-full max-w-3xl mx-auto p-6">
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Quiz Results</h2>
            <div className="text-center mb-8">
              <p className="text-3xl font-bold mb-2">
                {score} / {totalPoints}
              </p>
              <p className="text-lg text-gray-400">
                {Math.round((score / totalPoints) * 100)}% Score
              </p>
              <p className="text-sm text-gray-400 mt-4">
                Attempt #{attemptNumber}
              </p>
            </div>
            <button
              onClick={() => router.push("/student-dashboard")}
              className="w-full py-3 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
        {/* Quiz header */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-2">{quizData.description}</h2>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestionIndex + 1} of {quizData.questions.length}</span>
            <span>Total points: {totalPoints}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            {startTime && (
              <div>Started: {startTime.toLocaleString()}</div>
            )}
            <div>Attempt #{attemptNumber}</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 md:p-6 shadow-lg mb-6">
          {currentQuestion.type === "multiple-choice" && (
            <MultipleChoice
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onChange={handleAnswerChange}
              questionNumber={currentQuestionIndex + 1}
            />
          )}

          {currentQuestion.type === "multiple-select" && (
            <MultipleSelect
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onChange={handleAnswerChange}
              questionNumber={currentQuestionIndex + 1}
            />
          )}

          {currentQuestion.type === "text-input" && (
            <TextInput
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onChange={handleAnswerChange}
              questionNumber={currentQuestionIndex + 1}
            />
          )}
        </div>

        {/* Error message */}
        {submissionError && (
          <div className="bg-red-800 text-white p-3 rounded-lg mb-4">
            {submissionError}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors
              ${currentQuestionIndex === 0 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Previous
          </button>
          
          {currentQuestionIndex < quizData.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-2 bg-green-600 rounded-lg font-medium hover:bg-green-700 transition-colors
                ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}