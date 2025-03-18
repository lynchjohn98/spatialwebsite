"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import QuizNavigation from "./QuizNavigation";
import QuizTimer from "./QuizTimer";

const QuizIntro = ({ quiz, onStart, onBack }) => (
  <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 my-8" role="region" aria-labelledby="quiz-intro-title">
    <h1 id="quiz-intro-title" className="text-2xl sm:text-3xl font-bold mb-6 text-center">{quiz.name}</h1>
    
    <div className="mb-6">
      <p className="text-gray-300 mb-4">{quiz.description}</p>
      
      <div className="bg-gray-700 p-4 rounded-lg space-y-3">
        <div className="flex justify-between">
          <span>Total Questions:</span>
          <span className="font-medium">{quiz.questions.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Time Limit:</span>
          <span className="font-medium">{quiz.timeLimit} minutes</span>
        </div>
        <div className="flex justify-between">
          <span>Total Points:</span>
          <span className="font-medium">{quiz.totalPoints}</span>
        </div>
      </div>
    </div>
    
    <div className="bg-yellow-900 p-4 rounded-lg mb-6" role="region" aria-label="Important quiz information">
      <h3 className="text-yellow-300 font-medium mb-2">Important Notes</h3>
      <ul className="text-yellow-100 space-y-2 list-disc pl-5">
        <li>Once you start, the timer will begin immediately</li>
        <li>You can navigate between questions using the previous and next buttons</li>
        <li>Your answers are saved as you go</li>
        <li>The quiz will automatically submit when time runs out</li>
        <li>If you try to leave the quiz, you will be asked to confirm and your answers will be submitted</li>
      </ul>
    </div>
    
    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
      <button
        onClick={onBack}
        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded shadow transition-colors"
        aria-label="Go back to quizzes list"
      >
        Back to Quizzes
      </button>
      <button
        onClick={onStart}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded shadow transition-colors"
        aria-label="Begin quiz"
      >
        Start Quiz
      </button>
    </div>
  </div>
);

// Results screen component
const QuizResults = ({ quiz, results, onReturn }) => (
  <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 my-8" role="region" aria-labelledby="quiz-results-title">
    <h2 id="quiz-results-title" className="text-2xl font-bold mb-6 text-center">Quiz Results</h2>
    
    <div className="bg-gray-700 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">{quiz.name}</h3>
        <span className="text-sm text-gray-400">Time taken: {results.timeTaken} minutes</span>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg">Your score:</span>
        <span className="text-2xl font-bold">
          {results.score} / {results.maxScore}
        </span>
      </div>
      
      <div className="w-full bg-gray-600 rounded-full h-4 mb-4" role="progressbar" 
           aria-valuenow={results.percentage} aria-valuemin="0" aria-valuemax="100">
        <div 
          className={`h-4 rounded-full ${
            results.percentage >= 90 ? 'bg-green-500' :
            results.percentage >= 70 ? 'bg-blue-500' :
            results.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${results.percentage}%` }}
        ></div>
      </div>
      
      <div className="text-center">
        <span className={`text-xl font-bold ${
          results.percentage >= 90 ? 'text-green-400' :
          results.percentage >= 70 ? 'text-blue-400' :
          results.percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
        }`}>
          {results.percentage}%
        </span>
        <p className="mt-1 text-sm text-gray-400">
          {results.percentage >= 90 ? 'Excellent!' :
           results.percentage >= 70 ? 'Good job!' :
           results.percentage >= 60 ? 'Satisfactory' : 'Needs improvement'}
        </p>
      </div>
    </div>
    
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-medium mb-2">Question Summary:</h3>
      <div className="space-y-3">
        {results.answers.map((answer, index) => {
          const question = quiz.questions.find(q => q.id === answer.questionId);
          return (
            <div key={answer.questionId} className="p-3 bg-gray-700 rounded">
              <div className="flex items-center mb-2">
                <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 ${
                  answer.correct ? 'bg-green-500' : 'bg-red-500'
                }`} aria-hidden="true">
                  {answer.correct ? '✓' : '✗'}
                </div>
                <p className="font-medium">Question {index + 1}</p>
                <span className="ml-auto text-sm" aria-label={`${answer.points} out of ${question.points} points`}>
                  {answer.points} / {question.points} points
                </span>
              </div>
              <p className="text-sm text-gray-300 ml-8 mt-1">
                {question.text}
                <span className="sr-only">. {answer.correct ? 'Correct' : 'Incorrect'}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
    
    <div className="flex justify-center mt-8">
      <button
        onClick={onReturn}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition-colors"
        aria-label="Go back to quizzes list"
      >
        Return to Quizzes
      </button>
    </div>
  </div>
);

// Exit warning modal component
const ExitWarningModal = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="warning-title">
    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
      <h3 id="warning-title" className="text-xl font-bold mb-4 text-yellow-300">Warning!</h3>
      <p className="mb-6">
        You haven't completed this quiz. If you exit now, your current answers will be submitted as your final answers.
      </p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
        >
          Continue Quiz
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Exit & Submit
        </button>
      </div>
    </div>
  </div>
);

// Main Quiz component
export default function Quiz({ quiz, studentData, courseData, onComplete }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizState, setQuizState] = useState('intro'); // intro, active, completed, exiting
  const [quizResults, setQuizResults] = useState(null);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [questionStatus, setQuestionStatus] = useState([]);
  const timerRef = useRef(null);
  
  // Initialize the quiz
  useEffect(() => {
    if (quiz) {
      // Create initial answers array
      const initialAnswers = quiz.questions.map(question => {
        switch (question.type) {
          case "multiple-choice":
            return { questionId: question.id, selectedOption: null, correct: false, points: 0 };
          case "multiple-select":
            return { questionId: question.id, selectedOptions: [], correct: false, points: 0 };
          case "text-input":
            return { questionId: question.id, textInput: "", correct: false, points: 0 };
          default:
            return { questionId: question.id, answer: null, correct: false, points: 0 };
        }
      });
      setAnswers(initialAnswers);
      
      // Set time limit
      setTimeLeft(quiz.timeLimit * 60); // convert to seconds
      
      // Initialize question status tracking
      setQuestionStatus(quiz.questions.map(() => 'unseen'));
    }
    
    // Cleanup timer
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quiz]);
  
  // Handle timer
  useEffect(() => {
    if (quizState === 'active') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            handleSubmitQuiz();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizState]);
  
  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (quizState === 'active') {
        const message = "You have an active quiz. If you leave, your progress will be lost.";
        e.returnValue = message;
        return message;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [quizState]);
  
  // Update question status when navigating
  useEffect(() => {
    if (quizState === 'active') {
      setQuestionStatus(prevStatus => {
        const newStatus = [...prevStatus];
        
        // Mark current question as viewed at minimum
        if (newStatus[currentQuestion] === 'unseen') {
          newStatus[currentQuestion] = 'viewed';
        }
        
        // Check if question is answered
        const currentAnswer = answers[currentQuestion];
        if (currentAnswer) {
          const isAnswered = (
            (currentAnswer.selectedOption !== null) || 
            (currentAnswer.selectedOptions?.length > 0) || 
            (currentAnswer.textInput?.trim().length > 0)
          );
          
          if (isAnswered) {
            newStatus[currentQuestion] = 'answered';
          }
        }
        
        return newStatus;
      });
    }
  }, [currentQuestion, answers, quizState]);
  
  // Event handlers
  const handleStartQuiz = useCallback(() => {
    setQuizState('active');
  }, []);
  
  const handleReturnToQuizzes = useCallback(() => {
    router.push("/student-dashboard/quizzes");
  }, [router]);
  
  const handleAnswerChange = useCallback((questionId, value) => {
    const questionIndex = answers.findIndex(a => a.questionId === questionId);
    
    if (questionIndex === -1) return;
    
    const question = quiz.questions.find(q => q.id === questionId);
    const questionType = question?.type;
    
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      
      switch (questionType) {
        case 'multiple-choice':
          newAnswers[questionIndex].selectedOption = value;
          break;
        case 'multiple-select':
          newAnswers[questionIndex].selectedOptions = value;
          break;
        case 'text-input':
          newAnswers[questionIndex].textInput = value;
          break;
      }
      
      return newAnswers;
    });
    
    setQuestionStatus(prevStatus => {
      const newStatus = [...prevStatus];
      newStatus[questionIndex] = 'answered';
      return newStatus;
    });
  }, [quiz, answers]);
  
  const handleExitClick = useCallback(() => {
    if (quizState === 'active') {
      setShowExitWarning(true);
    } else {
      router.push("/student-dashboard/quizzes");
    }
  }, [quizState, router]);
  
  const handleExitCancel = useCallback(() => {
    setShowExitWarning(false);
  }, []);
  
  const handleExitConfirm = useCallback(() => {
    setShowExitWarning(false);
    setQuizState('exiting');
    handleSubmitQuiz();
  }, []);
  
  const handlePrevQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);
  
  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  }, [currentQuestion, quiz]);
  
  const handleGoToQuestion = useCallback((index) => {
    if (index >= 0 && index < quiz.questions.length) {
      setCurrentQuestion(index);
    }
  }, [quiz]);
  
  // Grade and submit quiz
  const handleSubmitQuiz = useCallback(() => {
    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Grade the quiz
    const gradedAnswers = answers.map(answer => {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      let correct = false;
      let points = 0;
      
      switch (question.type) {
        case "multiple-choice":
          const correctOption = question.options.find(opt => opt.correct);
          correct = answer.selectedOption === correctOption?.id;
          points = correct ? question.points : 0;
          break;
        
        case "multiple-select":
          const correctOptions = question.options
            .filter(opt => opt.correct)
            .map(opt => opt.id);
          
          const selectedOptions = answer.selectedOptions || [];
          
          // Check if all correct options are selected and no incorrect options
          const allCorrectSelected = correctOptions.every(id => selectedOptions.includes(id));
          const noIncorrectSelected = selectedOptions.every(id => correctOptions.includes(id));
          
          correct = allCorrectSelected && noIncorrectSelected;
          
          // Partial credit for multiple select
          if (selectedOptions.length > 0) {
            const correctSelections = selectedOptions.filter(id => correctOptions.includes(id));
            const incorrectSelections = selectedOptions.filter(id => !correctOptions.includes(id));
            
            const maxPoints = question.points;
            const pointsPerCorrect = maxPoints / correctOptions.length;
            const pointsEarned = correctSelections.length * pointsPerCorrect;
            const pointsDeducted = incorrectSelections.length * (pointsPerCorrect / 2);
            
            points = Math.max(0, Math.min(maxPoints, pointsEarned - pointsDeducted));
            points = Math.round(points * 10) / 10; // Round to 1 decimal place
          }
          break;
        
        case "text-input":
          const userAnswer = (answer.textInput || "").trim().toLowerCase();
          const correctAnswer = question.correctAnswer.toLowerCase();
          const alternateAnswers = (question.alternateAnswers || []).map(ans => 
            ans.toLowerCase()
          );
          
          correct = userAnswer === correctAnswer || alternateAnswers.includes(userAnswer);
          points = correct ? question.points : 0;
          break;
      }
      
      return { ...answer, correct, points };
    });
    
    // Calculate total score
    const totalScore = gradedAnswers.reduce((sum, answer) => sum + answer.points, 0);
    const maxScore = quiz.totalPoints || quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (totalScore / maxScore) * 100;
    const timeTaken = quiz.timeLimit - Math.floor(timeLeft / 60);
    
    // Create the quiz result object
    const quizAttempt = {
      studentId: studentData?.id || "unknown",
      studentName: studentData ? `${studentData.first_name} ${studentData.last_name}` : "Unknown Student",
      courseId: courseData?.course?.id || courseData?.id,
      quizId: quiz.id,
      quizName: quiz.name,
      dateCompleted: new Date().toISOString(),
      timeTaken,
      timeAllotted: quiz.timeLimit,
      answers: gradedAnswers,
      score: totalScore,
      maxScore,
      percentage: Math.round(percentage * 10) / 10 // Round to 1 decimal place
    };
    
    // Save to localStorage
    try {
      const key = `quizAttempts_${studentData?.id || "unknown"}_${courseData?.course?.id || courseData?.id || "unknown"}`;
      const existingAttemptsJson = localStorage.getItem(key);
      const existingAttempts = existingAttemptsJson ? JSON.parse(existingAttemptsJson) : [];
      localStorage.setItem(key, JSON.stringify([...existingAttempts, quizAttempt]));
    } catch (error) {
      console.error("Error saving quiz results:", error);
    }
    
    // Update state
    setQuizResults(quizAttempt);
    setQuizState('completed');
    
    // Call completion callback if provided
    if (onComplete) {
      onComplete(quizAttempt);
    }
    
    // If exiting, redirect after a short delay
    if (quizState === 'exiting') {
      setTimeout(() => {
        router.push("/student-dashboard/quizzes");
      }, 500);
    }
  }, [answers, quiz, timeLeft, studentData, courseData, quizState, router, onComplete]);
  
  // Render appropriate screen based on quiz state
  if (quizState === 'intro') {
    return (
      <QuizIntro 
        quiz={quiz} 
        onStart={handleStartQuiz} 
        onBack={handleReturnToQuizzes} 
      />
    );
  }
  
  if (quizState === 'completed') {
    return (
      <QuizResults 
        quiz={quiz} 
        results={quizResults} 
        onReturn={handleReturnToQuizzes} 
      />
    );
  }
  
  if (showExitWarning) {
    return (
      <ExitWarningModal 
        onCancel={handleExitCancel} 
        onConfirm={handleExitConfirm} 
      />
    );
  }
  
  // Active quiz - main question display
  const currentQuestionData = quiz.questions[currentQuestion];
  
  return (
    <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 my-4" role="main" aria-label={`Question ${currentQuestion + 1} of ${quiz.questions.length}`}>
      {/* Top bar with timer and exit button */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <button
          onClick={handleExitClick}
          className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded flex items-center"
          aria-label="Exit quiz"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Exit
        </button>
        
        <div className="flex-grow max-w-[200px]">
          <QuizTimer 
            timeLeft={timeLeft} 
            totalTime={quiz.timeLimit * 60} 
            onTimeUp={handleSubmitQuiz} 
          />
        </div>
      </div>
      
      {/* Question component based on type */}
      <div className="mb-6 question-container">
        {currentQuestionData.type === "multiple-choice" && (
          <MultipleChoiceQuestion
            question={currentQuestionData}
            answer={answers[currentQuestion]}
            onChange={handleAnswerChange}
            questionNumber={currentQuestion + 1}
          />
        )}
        
        {currentQuestionData.type === "multiple-select" && (
          <MultipleSelectQuestion
            question={currentQuestionData}
            answer={answers[currentQuestion]}
            onChange={handleAnswerChange}
            questionNumber={currentQuestion + 1}
          />
        )}
        
        {currentQuestionData.type === "text-input" && (
          <TextInputQuestion
            question={currentQuestionData}
            answer={answers[currentQuestion]}
            onChange={handleAnswerChange}
            questionNumber={currentQuestion + 1}
          />
        )}
      </div>
      
      {/* Navigation */}
      <QuizNavigation
        totalQuestions={quiz.questions.length}
        currentQuestion={currentQuestion}
        onPrevious={handlePrevQuestion}
        onNext={handleNextQuestion}
        onSubmit={handleSubmitQuiz}
        isFirstQuestion={currentQuestion === 0}
        isLastQuestion={currentQuestion === quiz.questions.length - 1}
        questionStatus={questionStatus}
      />
    </div>
  );
}