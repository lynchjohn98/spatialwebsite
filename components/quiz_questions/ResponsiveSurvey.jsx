"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  Info,
} from "lucide-react";

const DEFAULT_PER_PAGE = 5;

// Question column takes all remaining space; answer columns stay compact.
const gridCols = (n) => `minmax(0,1fr) repeat(${n}, minmax(4.5rem, 7rem))`;

const isChoice = (q) => q.type === "single-choice";

// Splits "Physics: description ... (job list)" into a bold label, the
// description, and a muted detail line. Plain questions render unchanged.
function QuestionText({ text }) {
  const labelMatch = text.match(/^([^:]{2,60}):\s*([\s\S]*)$/);
  const label = labelMatch ? labelMatch[1] : null;
  const body = labelMatch ? labelMatch[2] : text;

  const extraMatch = body.match(/^([\s\S]*?)\s*\(([^()]*)\)\s*\.?$/);
  const main = extraMatch ? extraMatch[1] : body;
  const extra = extraMatch ? extraMatch[2] : null;

  return (
    <>
      {label && <span className="font-semibold text-white">{label}: </span>}
      {main}
      {extra && (
        <span className="mt-1 block text-xs leading-snug text-gray-400 lg:text-sm">{extra}</span>
      )}
    </>
  );
}

// Radio circle used by both question types
function RadioDot({ checked, size = "md:h-7 md:w-7" }) {
  return (
    <span
      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-gray-800 ${size} ${
        checked ? "border-blue-400 bg-blue-500" : "border-gray-500"
      }`}
    >
      {checked && <span className="h-2 w-2 rounded-full bg-white" />}
    </span>
  );
}

// A single-choice question shown as a card, with an optional "please specify" box
function ChoiceQuestion({ question, number, options, value, other, missing, onSelect, onOtherChange }) {
  const selected = options.find((o) => o.id === value);
  const textMissing = missing && selected?.allowText && !(other || "").trim();

  return (
    <div
      role="radiogroup"
      aria-labelledby={`${question.id}-text`}
      className={`rounded-xl border p-4 lg:p-6 ${
        missing ? "border-orange-500 bg-orange-900/10" : "border-gray-700/50 bg-gray-800/70"
      }`}
    >
      <p id={`${question.id}-text`} className="mb-4 flex gap-2 text-sm font-medium text-gray-100 lg:text-base">
        <span className="tabular-nums text-gray-500">{number}.</span>
        {question.text}
      </p>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {options.map((o) => {
          const checked = value === o.id;
          return (
            <label
              key={o.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors lg:text-base ${
                checked
                  ? "border-blue-500 bg-blue-900/30 text-white"
                  : "border-gray-600 bg-gray-700/30 text-gray-200 hover:border-gray-500"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={o.id}
                checked={checked}
                onChange={() => onSelect(o.id)}
                className="peer sr-only"
              />
              <RadioDot checked={checked} size="" />
              {o.text}
            </label>
          );
        })}
      </div>

      {selected?.allowText && (
        <div className="mt-3">
          <label htmlFor={`${question.id}-other`} className="mb-1 block text-sm text-gray-300">
            Please specify
          </label>
          <input
            id={`${question.id}-other`}
            type="text"
            autoFocus
            maxLength={200}
            value={other || ""}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="Type your answer"
            aria-invalid={textMissing || undefined}
            className={`w-full rounded-lg border bg-gray-900 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 lg:text-base ${
              textMissing ? "border-orange-500" : "border-gray-600"
            }`}
          />
          {textMissing && <p className="mt-1 text-xs text-orange-300">Please type your answer.</p>}
        </div>
      )}
    </div>
  );
}

export default function SimpleSurvey({
  data,
  onSurveyComplete,
  exitHref = "/student/student-dashboard/quizzes",
  questionsPerPage,
}) {
  const [mounted, setMounted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [otherText, setOtherText] = useState({});
  const [page, setPage] = useState(0);
  const [showMissing, setShowMissing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime] = useState(() => new Date());
  const bodyRef = useRef(null);

  const perPage = questionsPerPage || data.questionsPerPage || DEFAULT_PER_PAGE;
  const total = data.questions.length;

  // Render into <body> so no parent layout can clip or offset the view.
  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const getOptions = (q) => {
    if (q.options) return q.options;
    if (q.optionsGroup === 2 && data.likertOptions2) return data.likertOptions2;
    if (q.optionsGroup === 1 && data.likertOptions1) return data.likertOptions1;
    return data.likertOptions || data.likertOptions1 || data.likertOptions2 || [];
  };

  const selectedOption = (q) => getOptions(q).find((o) => o.id === answers[q.id]);

  // Answered = an option is chosen, and if it's an "Other" option, text is filled in
  const isAnswered = (q) => {
    if (!answers[q.id]) return false;
    if (selectedOption(q)?.allowText) return (otherText[q.id] || "").trim().length > 0;
    return true;
  };

  // Split questions into pages. A new page starts when the page is full, the
  // section changes, the question type changes, or the likert scale changes.
  const pages = useMemo(() => {
    const result = [];
    let current = [];
    data.questions.forEach((q, i) => {
      const first = current[0]?.question;
      const breakHere =
        current.length === perPage ||
        (first &&
          ((first.section || "") !== (q.section || "") ||
            isChoice(first) !== isChoice(q) ||
            (!isChoice(q) && getOptions(first) !== getOptions(q))));
      if (breakHere) {
        result.push(current);
        current = [];
      }
      current.push({ question: q, number: i + 1 });
    });
    if (current.length) result.push(current);
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, perPage]);

  const pageItems = pages[page] || [];
  const firstQuestion = pageItems[0]?.question;
  const pageIsChoice = firstQuestion ? isChoice(firstQuestion) : false;
  const section = firstQuestion?.section;
  const options = firstQuestion ? getOptions(firstQuestion) : [];
  const cols = gridCols(options.length);
  const isLastPage = page === pages.length - 1;
  const answeredCount = data.questions.filter(isAnswered).length;
  const percent = Math.round((answeredCount / total) * 100);
  const isPageComplete = (i) => pages[i].every(({ question }) => isAnswered(question));

  const firstNum = pageItems[0]?.number;
  const lastNum = pageItems[pageItems.length - 1]?.number;

  const goTo = (i) => {
    setPage(i);
    setShowMissing(false);
    bodyRef.current?.scrollTo({ top: 0 });
  };

  const handleSelect = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleOtherChange = (questionId, text) => {
    setOtherText((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleNext = () => {
    if (!isPageComplete(page)) {
      setShowMissing(true);
      return;
    }
    goTo(page + 1);
  };

  const handleExit = () => {
    if (
      Object.keys(answers).length > 0 &&
      !window.confirm("Leave the survey? Your answers so far will not be saved.")
    ) {
      return;
    }
    window.location.href = exitHref;
  };

  const handleSubmit = async () => {
    const firstIncomplete = pages.findIndex((_, i) => !isPageComplete(i));
    if (firstIncomplete !== -1) {
      setPage(firstIncomplete);
      setShowMissing(true);
      bodyRef.current?.scrollTo({ top: 0 });
      return;
    }

    const endTime = new Date();
    const submissionData = {
      surveyId: data.id,
      surveyTitle: data.title,
      answers: data.questions
        .filter((q) => answers[q.id])
        .map((q) => {
          const opt = selectedOption(q);
          return {
            questionId: q.id,
            questionText: q.text,
            ...(q.section ? { section: q.section } : {}),
            answer: answers[q.id],
            answerText: opt?.text,
            ...(opt?.allowText ? { otherText: otherText[q.id].trim() } : {}),
          };
        }),
      completedAt: endTime.toISOString(),
      timeSpent: Math.round((endTime - startTime) / 1000),
      completionPercentage: 100,
    };

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = onSurveyComplete ? await onSurveyComplete(submissionData) : null;
      if (result && result.success === false) throw result.error || new Error("Submit failed");
      setIsSubmitted(true);
    } catch (err) {
      console.error("Survey submit error:", err);
      setSubmitError("Something went wrong saving your answers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  // ---------- Thank-you screen ----------
  if (isSubmitted) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-700/50 bg-gray-800/70 p-8 text-center shadow-xl">
          <CheckCircle className="mx-auto mb-4 h-20 w-20 text-green-400" />
          <h2 className="mb-2 text-2xl font-bold text-white">Thank you!</h2>
          <p className="mb-6 text-gray-300">Your survey has been submitted.</p>
          <button
            onClick={() => (window.location.href = exitHref)}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Return to Quizzes
          </button>
        </div>
      </div>,
      document.body
    );
  }

  // ---------- Survey ----------
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex flex-col bg-gray-900 text-gray-100"
      aria-labelledby="survey-title"
    >
      {/* Top bar */}
      <header className="flex-shrink-0 border-b border-gray-800">
        <div className="flex w-full items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-10">
          <button
            onClick={handleExit}
            aria-label="Exit survey"
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <h1 id="survey-title" className="flex-1 truncate text-base font-semibold sm:text-lg">
            {data.title}
          </h1>
          <span className="hidden text-sm text-gray-500 sm:inline">
            Page {page + 1} of {pages.length} · Questions {firstNum}–{lastNum}
          </span>
          <span className="whitespace-nowrap text-sm text-gray-400 sm:ml-4">
            {answeredCount}/{total} answered
          </span>
        </div>
        <div
          className="h-1 bg-gray-800"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Survey progress"
        >
          <div className="h-1 bg-blue-500 transition-all duration-300" style={{ width: `${percent}%` }} />
        </div>
      </header>

      {/* Body */}
      <main ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full w-full flex-col px-4 py-4 sm:px-6 lg:px-10">
          {/* Instructions — shown at the top of every page */}
          {data.description && (
            <div className="mb-4 flex flex-shrink-0 gap-3 rounded-lg border border-blue-900/60 bg-blue-950/30 px-4 py-3 text-sm leading-relaxed text-gray-300 lg:text-[15px]">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-300" aria-hidden="true" />
              <p>
                <span className="sr-only">Instructions: </span>
                {data.description}
              </p>
            </div>
          )}

          <p className="mb-3 text-xs text-gray-500 sm:hidden">
            Page {page + 1} of {pages.length} · Questions {firstNum}–{lastNum}
          </p>

          {showMissing && (
            <div
              role="alert"
              className="mb-4 flex flex-shrink-0 items-center gap-2 rounded-lg border-l-4 border-orange-500 bg-orange-900/20 p-3 text-sm text-orange-300"
            >
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-orange-400" />
              Please answer the highlighted questions to continue.
            </div>
          )}

          {section && (
            <h2 className="mb-3 flex-shrink-0 text-base font-semibold text-white lg:text-lg">{section}</h2>
          )}

          {pageIsChoice ? (
            /* ---------- Single-choice questions ---------- */
            <div className="grid content-start gap-4 xl:grid-cols-2">
              {pageItems.map(({ question, number }) => (
                <ChoiceQuestion
                  key={question.id}
                  question={question}
                  number={number}
                  options={getOptions(question)}
                  value={answers[question.id]}
                  other={otherText[question.id]}
                  missing={showMissing && !isAnswered(question)}
                  onSelect={(optId) => handleSelect(question.id, optId)}
                  onOtherChange={(text) => handleOtherChange(question.id, text)}
                />
              ))}
            </div>
          ) : (
            /* ---------- Likert table (fills remaining height) ---------- */
            <div className="flex flex-1 flex-col rounded-xl border border-gray-700/50 bg-gray-800/70">
              <div
                className="sticky top-0 z-10 hidden flex-shrink-0 items-end gap-2 rounded-t-xl border-b border-gray-700 bg-gray-800 px-4 py-3 md:grid lg:px-6"
                style={{ gridTemplateColumns: cols }}
                aria-hidden="true"
              >
                <div />
                {options.map((o) => (
                  <div key={o.id} className="text-center text-xs font-medium leading-tight text-gray-300 lg:text-sm">
                    {o.shortText || o.text}
                  </div>
                ))}
              </div>

              <div className="flex flex-1 flex-col divide-y divide-gray-700/50">
                {pageItems.map(({ question, number }) => {
                  const missing = showMissing && !isAnswered(question);
                  return (
                    <div
                      key={question.id}
                      role="radiogroup"
                      aria-labelledby={`${question.id}-text`}
                      className={`border-l-4 px-4 py-4 md:grid md:flex-1 md:items-center md:gap-2 lg:px-6 ${
                        missing ? "border-orange-500 bg-orange-900/15" : "border-transparent"
                      }`}
                      style={{ gridTemplateColumns: cols }}
                    >
                      <p
                        id={`${question.id}-text`}
                        className="flex gap-2 text-sm leading-relaxed text-gray-200 md:pr-6 lg:text-base"
                      >
                        <span className="w-7 flex-shrink-0 text-right font-medium tabular-nums text-gray-500">
                          {number}.
                        </span>
                        <span>
                          <QuestionText text={question.text} />
                        </span>
                      </p>

                      <div
                        className="mt-3 grid gap-1.5 md:mt-0 md:contents"
                        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}
                      >
                        {options.map((o) => {
                          const checked = answers[question.id] === o.id;
                          return (
                            <label
                              key={o.id}
                              className={`flex cursor-pointer flex-col items-center justify-center gap-1 self-stretch rounded-lg border px-1 py-2 text-center transition-colors md:border-transparent md:bg-transparent md:hover:bg-gray-700/30 ${
                                checked
                                  ? "border-blue-500 bg-blue-900/30"
                                  : "border-gray-600 bg-gray-700/30 hover:border-gray-500"
                              }`}
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={o.id}
                                checked={checked}
                                onChange={() => handleSelect(question.id, o.id)}
                                className="peer sr-only"
                              />
                              <RadioDot checked={checked} />
                              <span className="text-[11px] leading-tight text-gray-300 md:sr-only">
                                {o.shortText || o.text}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {submitError && (
            <p role="alert" className="mt-4 text-sm text-red-400">
              {submitError}
            </p>
          )}
        </div>
      </main>

      {/* Footer navigation */}
      <footer className="flex-shrink-0 border-t border-gray-800">
        <div className="flex w-full items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-10">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            className="flex items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 disabled:invisible"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <nav aria-label="Survey pages" className="hidden items-center gap-1.5 sm:flex">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to page ${i + 1}${isPageComplete(i) ? " (complete)" : ""}`}
                aria-current={i === page ? "step" : undefined}
                className={`h-2.5 rounded-full transition-all ${
                  i === page
                    ? "w-6 bg-blue-500"
                    : isPageComplete(i)
                    ? "w-2.5 bg-green-500"
                    : "w-2.5 bg-gray-600 hover:bg-gray-500"
                }`}
              />
            ))}
          </nav>
          <span className="text-sm text-gray-400 sm:hidden">
            {page + 1} / {pages.length}
          </span>

          {isLastPage ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-1 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-60"
            >
              {isSubmitting ? "Submitting…" : "Submit"}
              {!isSubmitting && <CheckCircle className="h-4 w-4" />}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </footer>
    </div>,
    document.body
  );
}