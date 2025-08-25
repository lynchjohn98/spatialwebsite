
// Quiz Card Component
export default function StudentQuizCard({ quiz, onStart, studentData }) {
  
  const getQuizTypeColor = (quizName) => {
    if (quizName.toLowerCase().includes("pre-test")) return "bg-yellow-900/20 border-yellow-700";
    if (quizName.toLowerCase().includes("post-test")) return "bg-green-900/20 border-green-700";
    if (quizName.toLowerCase().includes("practice")) return "bg-purple-900/20 border-purple-700";
    return "bg-blue-900/20 border-blue-700";
  };

  const getQuizTypeLabel = (quizName) => {
    if (quizName.toLowerCase().includes("pre-test")) return "Pre-Test";
    if (quizName.toLowerCase().includes("post-test")) return "Post-Test";
    if (quizName.toLowerCase().includes("practice")) return "Practice";
    return "Module Quiz";
  };

  const getQuizTypeBadgeColor = (quizName) => {
    if (quizName.toLowerCase().includes("pre-test")) return "bg-yellow-700 text-yellow-100";
    if (quizName.toLowerCase().includes("post-test")) return "bg-green-700 text-green-100";
    if (quizName.toLowerCase().includes("practice")) return "bg-purple-700 text-purple-100";
    return "bg-blue-700 text-blue-100";
  };

  return (
    <div className={`${getQuizTypeColor(quiz.name)} border rounded-lg p-6 hover:shadow-lg transition-all duration-200 flex flex-col`}>
      {/* Quiz Type Badge */}
      <div className="flex justify-between items-start mb-3">
        <span className={`${getQuizTypeBadgeColor(quiz.name)} text-xs font-semibold px-2 py-1 rounded`}>
          {getQuizTypeLabel(quiz.name)}
        </span>
        {quiz.time && (
          <span className="text-xs text-gray-400 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {quiz.time} min
          </span>
        )}
      </div>

      {/* Quiz Title */}
      <h3 className="text-lg font-semibold text-white mb-2">
        {quiz.name}
      </h3>
      
      {/* Quiz Description */}
      <p className="text-gray-400 text-sm mb-4 flex-grow">
        {quiz.description}
      </p>
      
      {/* Quiz Details */}
      <div className="flex justify-between text-sm mb-4">
        <span className="text-gray-500">Attempts Allowed:</span>
        <span className="text-gray-300">{quiz.attempts || "Unlimited"}</span>
      </div>
      
      {/* Action Button */}
      <button
        onClick={() => onStart(quiz)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Start Quiz
      </button>
    </div>
  );
}