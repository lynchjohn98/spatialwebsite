"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  ArrowLeft, RefreshCw, Download, CheckCircle, Clock, AlertCircle, X,
  ChevronDown, ChevronUp, ChevronRight, User, BookOpen, FileText, School, Users, TrendingUp,
} from "lucide-react";
import {
  fetchTeacherDetail,
  buildQuizAttemptExport,
  downloadCSV,
  QUIZ_CATEGORIES,
  QUIZ_NAMES,
  MODULE_COMPONENTS,
  STAGE_META,
  PASS_MARK,
  progressBarColor,
  scoreColor,
  formatDate,
  formatDateTime,
  formatDuration,
  prettyKey,
  isSensitiveKey,
} from "../../lib/adminData";

// Fields already shown in the details card (hidden from "All database fields")
const SHOWN_FIELDS = new Set([
  "id", "name", "username", "email", "created_at",
  "pretest_complete", "training_complete", "posttest_complete", "research_consent",
]);

export default function TeacherDetailPage() {
  const router = useRouter();
  const { teacherId } = useParams();
  const supabase = useMemo(() => createClientComponentClient(), []);

  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    async (initial = false) => {
      initial ? setIsLoading(true) : setIsRefreshing(true);
      setError("");
      try {
        setTeacher(await fetchTeacherDetail(supabase, teacherId));
      } catch (e) {
        console.error("Error fetching teacher:", e);
        setError("Could not load this teacher.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [supabase, teacherId]
  );

  useEffect(() => {
    if (sessionStorage.getItem("adminAuthorized") !== "true") {
      router.replace("/admin");
      return;
    }
    load(true);
  }, [load, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p>Loading teacher...</p>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-4">
        <AlertCircle size={48} className="text-gray-600" />
        <p className="text-gray-300">{error || "Teacher not found."}</p>
        <button onClick={() => router.push("/admin")} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => router.push("/admin")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors shrink-0"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <div className="h-6 w-px bg-gray-600" />
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">{teacher.name || "Unnamed Teacher"}</h1>
              <p className="text-sm text-gray-400 truncate">
                {teacher.username} • {teacher.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() =>
                downloadCSV(`${teacher.name || "teacher"}_quiz_attempts_${today}.csv`, buildQuizAttemptExport([teacher]))
              }
              disabled={teacher.quizSummary.totalAttempts === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-40"
            >
              <Download size={16} />
              Export quiz attempts
            </button>
            <button
              onClick={() => load()}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8 max-w-7xl mx-auto">
        <section>
          <SectionHeading icon={User}>Teacher Details</SectionHeading>
          <TeacherDetails teacher={teacher} />
        </section>

        <section>
          <SectionHeading icon={TrendingUp}>Teacher Module Progress / Quiz Progress</SectionHeading>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <ModuleProgress teacher={teacher} />
            <QuizProgress teacher={teacher} />
          </div>
        </section>

        <section>
          <SectionHeading icon={School}>Teacher Courses Created ({teacher.coursesCount})</SectionHeading>
          {teacher.coursesCount === 0 ? (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center text-gray-400">
              This teacher hasn't created any courses yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {teacher.courses.map((c) => (
                <CourseCard key={c.id} course={c} onOpen={() => router.push(`/admin/course/${c.id}`)} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ---------- Layout helpers ----------

function SectionHeading({ icon: Icon, children }) {
  return (
    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
      <Icon className="w-5 h-5 text-blue-400" />
      {children}
    </h2>
  );
}

function Panel({ title, icon: Icon, subtitle, children }) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Icon className="w-5 h-5 text-blue-400" />
          {title}
        </h3>
        {subtitle && <span className="text-xs text-gray-400 text-right">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-sm font-medium break-all">{value || "N/A"}</div>
    </div>
  );
}

function StatusPill({ label, done, doneText = "Complete", pendingText = "Pending" }) {
  return (
    <div className="bg-gray-700/30 p-3 rounded">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        {done ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Clock className="w-4 h-4 text-gray-400" />}
      </div>
      <span className={`text-sm font-medium ${done ? "text-green-400" : "text-gray-300"}`}>
        {done ? doneText : pendingText}
      </span>
    </div>
  );
}

// ---------- Section 1: Teacher Details ----------

function TeacherDetails({ teacher }) {
  const stage = STAGE_META[teacher.stage];
  const extraFields = Object.entries(teacher.raw).filter(
    ([k, v]) => !SHOWN_FIELDS.has(k) && !isSensitiveKey(k) && v !== null && v !== ""
  );

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 content-start">
          <Field label="Name" value={teacher.name} />
          <Field label="Username" value={teacher.username} />
          <Field label="Email" value={teacher.email} />
          <Field label="Registered" value={formatDate(teacher.created_at)} />
          <Field label="Last activity" value={formatDateTime(teacher.lastActivity)} />
          <Field label="Counties (from courses)" value={teacher.counties.join(", ")} />
          <Field label="Students across all courses" value={`${teacher.totalStudents} (${teacher.activeStudents} active)`} />
          <div>
            <div className="text-xs text-gray-400 mb-1">Stage</div>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${stage.badge}`}>{stage.label}</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-sm text-gray-400">Overall training progress</span>
            <span className="text-2xl font-bold">{teacher.overallTrainingProgress}%</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatusPill label="Pretest" done={teacher.pretest_complete} />
            <StatusPill label="Training" done={teacher.training_complete} pendingText="In progress" />
            <StatusPill label="Posttest" done={teacher.posttest_complete} />
            <StatusPill label="Research" done={teacher.research_consent} doneText="Consented" pendingText="No consent" />
          </div>
        </div>
      </div>

      {extraFields.length > 0 && (
        <details className="mt-6 border-t border-gray-700 pt-4">
          <summary className="text-sm text-gray-400 cursor-pointer hover:text-white select-none">
            All database fields ({extraFields.length})
          </summary>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {extraFields.map(([k, v]) => (
              <Field key={k} label={prettyKey(k)} value={typeof v === "object" ? JSON.stringify(v) : String(v)} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

// ---------- Section 2a: Module Progress ----------

function ModuleProgress({ teacher }) {
  const [open, setOpen] = useState({});
  const entries = Object.entries(teacher.moduleProgressDetails);

  return (
    <Panel
      title="Module Progress"
      icon={BookOpen}
      subtitle={`${teacher.completedModules}/${teacher.totalModules} complete · ${teacher.moduleProgressPercentage}% avg`}
    >
      {entries.length === 0 ? (
        <p className="text-center py-6 text-gray-500 text-sm">No module progress recorded yet</p>
      ) : (
        <div className="space-y-2">
          {entries.map(([name, m]) => {
            const isOpen = !!open[name];
            return (
              <div key={name} className="bg-gray-700/30 rounded overflow-hidden">
                <button
                  onClick={() => setOpen((o) => ({ ...o, [name]: !o[name] }))}
                  className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-700/50 transition-colors text-left"
                >
                  {m.isComplete ? (
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  ) : m.percentage > 0 ? (
                    <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-500 shrink-0" />
                  )}
                  <span className="flex-1 text-sm font-medium">{name}</span>
                  <div className="w-20 bg-gray-600 rounded-full h-2 shrink-0">
                    <div className={`h-2 rounded-full ${progressBarColor(m.percentage)}`} style={{ width: `${m.percentage}%` }} />
                  </div>
                  <span className="text-sm w-10 text-right">{m.percentage}%</span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isOpen && (
                  <div className="px-3 py-2 border-t border-gray-600 bg-gray-800/40">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {MODULE_COMPONENTS.map((c) => {
                        const done = m[c] === true;
                        return (
                          <div key={c} className={`flex items-center gap-1 ${done ? "text-green-400" : "text-gray-500"}`}>
                            {done ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            {prettyKey(c)}
                          </div>
                        );
                      })}
                    </div>
                    {m.completed_at && (
                      <p className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
                        Completed {formatDateTime(m.completed_at)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

// ---------- Section 2b: Quiz Progress ----------

function QuizProgress({ teacher }) {
  const [open, setOpen] = useState({});
  const { byQuiz, totalAttempts, averageScore, bestScore } = teacher.quizSummary;

  return (
    <Panel
      title="Quiz Progress"
      icon={FileText}
      subtitle={totalAttempts ? `${totalAttempts} attempts · avg ${averageScore}% · best ${bestScore}%` : "No attempts yet"}
    >
      <div className="space-y-5">
        {Object.entries(QUIZ_CATEGORIES).map(([key, cat]) => {
          const taken = cat.ids.filter((id) => byQuiz[id]).length;
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-0.5 rounded border ${cat.badge}`}>{cat.label}</span>
                <span className="text-xs text-gray-400">
                  {taken}/{cat.ids.length} taken
                </span>
              </div>

              <div className="space-y-1">
                {cat.ids.map((id) => {
                  const q = byQuiz[id];
                  if (!q) {
                    return (
                      <div key={id} className="flex items-center justify-between px-3 py-1.5 rounded bg-gray-700/20 text-sm text-gray-500">
                        <span>{QUIZ_NAMES[id]}</span>
                        <span className="text-xs">Not attempted</span>
                      </div>
                    );
                  }

                  const isOpen = !!open[id];
                  const passed = key === "surveys" || q.bestScore >= PASS_MARK;

                  return (
                    <div key={id} className="rounded bg-gray-700/30 overflow-hidden">
                      <button
                        onClick={() => setOpen((o) => ({ ...o, [id]: !o[id] }))}
                        className="w-full flex items-center gap-3 px-3 py-1.5 text-left text-sm hover:bg-gray-700/50 transition-colors"
                      >
                        {passed ? (
                          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
                        )}
                        <span className="flex-1">{q.name}</span>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {q.totalAttempts} attempt{q.totalAttempts !== 1 && "s"}
                        </span>
                        <span className={`font-medium w-12 text-right ${scoreColor(q.bestScore)}`}>{q.bestScore}%</span>
                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {isOpen && (
                        <div className="px-3 py-2 border-t border-gray-600 bg-gray-800/40 space-y-1">
                          <div className="text-xs text-gray-400 mb-1">Average {q.averageScore}%</div>
                          {q.attempts.map((a, idx) => (
                            <div key={a.id ?? idx} className="grid grid-cols-4 gap-2 text-xs bg-gray-800/60 rounded px-2 py-1">
                              <span className="text-gray-400">Attempt {q.attempts.length - idx}</span>
                              <span className="text-gray-500">{formatDateTime(a.time_submitted)}</span>
                              <span className="text-gray-500">{formatDuration(a.time_taken)}</span>
                              <span className={`text-right font-medium ${scoreColor(a.score || 0)}`}>{a.score ?? 0}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

// ---------- Section 3: Courses ----------

function CourseCard({ course, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="text-left bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors p-5 group flex flex-col"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold truncate group-hover:text-blue-400 transition-colors">
            {course.course_name || course.course_school_name || "Unnamed Course"}
          </h3>
          {course.course_name && course.course_school_name && (
            <p className="text-sm text-gray-400 truncate">{course.course_school_name}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Code: <span className="font-mono">{course.course_join_code}</span> · Created {formatDate(course.created_at)}
          </p>
        </div>
        <ChevronRight size={20} className="text-gray-500 group-hover:text-blue-400 shrink-0 mt-1" />
      </div>

      <div className="space-y-1 text-xs mb-4">
        {[
          ["County", course.course_county],
          ["Type", course.course_research_type],
          ["Language", course.course_language || "English"],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="text-gray-500">{label}:</span>
            <span>{value || "N/A"}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-700 mt-auto">
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Users size={12} /> Students
          </div>
          <div className="text-xl font-bold">{course.studentCount}</div>
          <div className="text-xs text-gray-500">{course.activeStudents} active</div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <TrendingUp size={12} /> Avg progress
          </div>
          <div className="text-xl font-bold">{course.averageProgress}%</div>
          <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
            <div
              className={`h-1.5 rounded-full ${progressBarColor(course.averageProgress)}`}
              style={{ width: `${course.averageProgress}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <FileText size={12} /> Assessments
          </div>
          <div className="text-xl font-bold">{course.quizAttempts}</div>
          <div className="text-xs text-gray-500">
            Consent {course.consented}/{course.studentCount}
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-400 rounded-full" /> {course.gender.male} Male
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-pink-400 rounded-full" /> {course.gender.female} Female
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-orange-400 rounded-full" /> {course.gender.other} Other
        </span>
      </div>
    </button>
  );
}