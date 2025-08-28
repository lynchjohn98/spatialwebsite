export default function ResponsiveSurvey({ data = surveyData, onSurveyComplete }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(data?.timeLimit || 1200);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Flatten all questions for easy access
  const allQuestions = data.sections.flatMap(section => 
    section.questions.map(q => ({ ...q, sectionId: section.id, sectionTitle: section.title }))
  );

  // Timer functionality
  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Page leave warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSubmitted) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSubmitted]);

  // Handle answer selection
  const handleAnswerSelect = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Check if a question is answered
  const isQuestionAnswered = (questionId) => {
    const answer = answers[questionId];
    return answer !== undefined && answer !== "" && answer !== null;
  };

  // Check if a section is complete
  const isSectionComplete = (section) => {
    return section.questions.every(
      (q) => !q.required || isQuestionAnswered(q.id)
    );
  };

  // Get completion stats
  const getCompletionStats = () => {
    const requiredQuestions = allQuestions.filter(q => q.required);
    const answeredRequired = requiredQuestions.filter(q => isQuestionAnswered(q.id));
    const totalAnswered = allQuestions.filter(q => isQuestionAnswered(q.id));
    
    return {
      requiredComplete: answeredRequired.length === requiredQuestions.length,
      requiredCount: requiredQuestions.length,
      requiredAnswered: answeredRequired.length,
      totalCount: allQuestions.length,
      totalAnswered: totalAnswered.length,
      percentage: Math.round((totalAnswered.length / allQuestions.length) * 100),
    };
  };

  // Get unanswered required questions
  const getUnansweredRequired = () => {
    return allQuestions.filter(q => q.required && !isQuestionAnswered(q.id));
  };

  // Handle submission
  const handleSubmit = () => {
    if (isSubmitted) return;

    const stats = getCompletionStats();
    
    if (!stats.requiredComplete) {
      setShowIncompleteModal(true);
      return;
    }

    submitSurvey();
  };

  const submitSurvey = () => {
    const stats = getCompletionStats();
    const timeSpent = (data?.timeLimit || 1200) - timeRemaining;

    setIsSubmitted(true);

    if (onSurveyComplete) {
      onSurveyComplete({
        surveyId: data.id,
        surveyTitle: data.title,
        answers,
        stats,
        timeSpent,
        completedAt: new Date().toISOString(),
      });
    }
  };

  // Navigation
  const goToSection = (index) => {
    setCurrentSection(index);
    setShowSidebar(false);
  };

  const nextSection = () => {
    if (currentSection < data.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const currentSec = data.sections[currentSection];

  // Results screen
  if (isSubmitted) {
    const stats = getCompletionStats();

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-lg w-full">
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Survey Complete!</h2>
            <p className="text-gray-600">Thank you for your feedback</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span>Questions Answered:</span>
              <span>{stats.totalAnswered}/{stats.totalCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Required Questions:</span>
              <span>{stats.requiredAnswered}/{stats.requiredCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Time Spent:</span>
              <span>{formatTime((data?.timeLimit || 1200) - timeRemaining)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Completion Rate:</span>
              <span>{stats.percentage}%</span>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          >
            Start New Survey
          </button>
        </div>
      </div>
    );
  }

  // Render question based on type
  const renderQuestion = (question) => {
    const answer = answers[question.id];

    if (question.type === "likert") {
      return (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            {data.likertScale.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswerSelect(question.id, option.value)}
                className={`
                  flex-1 p-3 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02]
                  ${
                    answer === option.value
                      ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/25"
                      : "bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-600 text-white"
                  }
                `}
              >
                <div className="text-center">
                  <div className="font-bold text-lg mb-1">{option.value}</div>
                  <div className="text-xs">{option.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (question.type === "text-area") {
      return (
        <div className="space-y-2">
          <textarea
            value={answer || ""}
            onChange={(e) => handleAnswerSelect(question.id, e.target.value)}
            placeholder="Type your response here..."
            className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-vertical"
            rows={4}
          />
          <div className="text-xs text-gray-400">
            {answer ? `${answer.length} characters` : "Optional feedback"}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Warning Banner */}
      {showWarning && (
        <div className="bg-red-600 text-white p-2 text-center flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Warning: Leaving the survey may lose your progress!</span>
        </div>
      )}

      {/* Incomplete Modal */}
      {showIncompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-600">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-bold text-white">Required Questions Missing</h3>
            </div>

            <p className="text-gray-300 mb-4">
              You have {getUnansweredRequired().length} required question{getUnansweredRequired().length !== 1 ? "s" : ""} unanswered.
            </p>

            <div className="mb-6 max-h-32 overflow-y-auto">
              <ul className="space-y-1">
                {getUnansweredRequired().slice(0, 5).map((q) => (
                  <li key={q.id} className="text-sm text-gray-400">
                    • {q.sectionTitle}: {q.text.substring(0, 50)}...
                  </li>
                ))}
                {getUnansweredRequired().length > 5 && (
                  <li className="text-sm text-gray-400">
                    • And {getUnansweredRequired().length - 5} more...
                  </li>
                )}
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowIncompleteModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg font-medium"
              >
                Continue Survey
              </button>
              <button
                onClick={() => {
                  setShowIncompleteModal(false);
                  submitSurvey();
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
      <header className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden p-2 hover:bg-gray-700 rounded"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">{data.title}</h1>
            <p className="text-sm text-gray-300">{data.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-sm">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{formatTime(timeRemaining)}</span>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium text-sm"
          >
            Submit
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`
            ${showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            fixed lg:relative z-30 w-64 bg-gray-800 transition-transform duration-300 border-r border-gray-700 h-full
          `}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Sections</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="lg:hidden p-1 hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {data.sections.map((section, index) => {
                  const isComplete = isSectionComplete(section);
                  const isCurrent = currentSection === index;

                  return (
                    <button
                      key={section.id}
                      onClick={() => goToSection(index)}
                      className={`
                        w-full p-3 text-left rounded-lg transition-all duration-200
                        ${
                          isCurrent
                            ? "bg-blue-600 border-2 border-blue-400"
                            : isComplete
                            ? "bg-green-600/30 border-2 border-green-500 hover:bg-green-600/40"
                            : "bg-gray-700 hover:bg-gray-600 border-2 border-transparent"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{section.title}</div>
                          <div className="text-xs text-gray-300 mt-1">
                            {section.questions.length} questions
                          </div>
                        </div>
                        {isComplete && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-300 mb-2">Progress</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getCompletionStats().percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {getCompletionStats().percentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {showSidebar && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{currentSec.title}</h2>
                  <p className="text-gray-400 mt-1">
                    Section {currentSection + 1} of {data.sections.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prevSection}
                    disabled={currentSection === 0}
                    className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSection}
                    disabled={currentSection === data.sections.length - 1}
                    className="p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                {currentSec.questions.map((question, qIndex) => (
                  <div key={question.id} className="border-b border-gray-700 pb-6 last:border-0">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-lg flex-1">
                          {question.text}
                          {question.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </p>
                        {isQuestionAnswered(question.id) && (
                          <CheckCircle className="w-5 h-5 text-green-400 ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    {renderQuestion(question)}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <p className="text-sm text-gray-400">
                  * Required questions
                </p>
                <div className="flex gap-3">
                  {currentSection > 0 && (
                    <button
                      onClick={prevSection}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium"
                    >
                      Previous Section
                    </button>
                  )}
                  {currentSection < data.sections.length - 1 ? (
                    <button
                      onClick={nextSection}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                    >
                      Next Section
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
                    >
                      Submit Survey
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}