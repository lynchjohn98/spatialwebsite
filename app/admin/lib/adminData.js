// Shared constants, data processing, fetching and CSV export for the admin pages.

// ---------- Constants ----------

export const QUIZ_NAMES = {
  1: "PSVT:R Pre-Test",
  2: "DAT:SR Pre-Test",
  3: "Math Instrument Pre-Test",
  4: "Combining Solids",
  5: "Surfaces and Solids of Revolution",
  6: "Isometric Drawings and Coded Plans",
  7: "Flat Patterns",
  8: "Rotation of Objects About a Single Axis",
  9: "Reflections and Symmetry",
  10: "Cutting Planes and Cross-Sections",
  11: "Rotation of Objects About Two or More Axes",
  12: "Orthographic Projection",
  13: "Inclined and Curved Surfaces",
  14: "PSVT:R Post-Test",
  15: "DAT:SR Post-Test",
  16: "Math Instrument Post-Test",
  17: "Practice Quiz",
  18: "Mathematics Motivation Survey",
  19: "STEM Attitudes Survey",
  20: "STEM Career Survey",
};

export const QUIZ_CATEGORIES = {
  "pre-tests": {
    label: "Pre-Tests",
    ids: [1, 2, 3],
    badge: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  },
  "module-quizzes": {
    label: "Module Quizzes",
    ids: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17],
    badge: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  },
  "post-tests": {
    label: "Post-Tests",
    ids: [14, 15, 16],
    badge: "text-green-400 bg-green-400/10 border-green-400/30",
  },
  surveys: {
    label: "Surveys",
    ids: [18, 19, 20],
    badge: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  },
};

export const getQuizCategory = (id) =>
  Object.keys(QUIZ_CATEGORIES).find((k) => QUIZ_CATEGORIES[k].ids.includes(Number(id))) ?? "other";

export const PASS_MARK = 80;

export const MODULE_ORDER = [
  "Pre-Module: The Importance of Spatial Skills",
  "Combining Solids",
  "Surfaces and Solids of Revolution",
  "Isometric Drawings and Coded Plans",
  "Flat Patterns",
  "Rotation of Objects About a Single Axis",
  "Reflections and Symmetry",
  "Cutting Planes and Cross-Sections",
  "Rotation of Objects About Two or More Axes",
  "Orthographic Projection",
  "Inclined and Curved Surfaces",
];

export const MODULE_COMPONENTS = [
  "introduction_video",
  "mini_lecture",
  "getting_started",
  "software",
  "workbook",
  "quiz",
];

// Matches the calculation used on the course page
const STUDENT_COMPONENTS = ["quiz", "software", "workbook", "mini_lecture", "getting_started"];

export const STAGE_META = {
  "not-started": { label: "Not started", badge: "bg-gray-600/40 text-gray-300" },
  "in-progress": { label: "In progress", badge: "bg-yellow-500/15 text-yellow-400" },
  complete: { label: "Training complete", badge: "bg-green-500/15 text-green-400" },
};

// ---------- Formatting helpers ----------

export const progressBarColor = (p) =>
  p === 100 ? "bg-green-500" : p >= 75 ? "bg-blue-500" : p >= 50 ? "bg-yellow-500" : p >= 25 ? "bg-orange-500" : "bg-red-500";

export const scoreColor = (s) => (s >= 80 ? "text-green-400" : s >= 60 ? "text-yellow-400" : "text-red-400");

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A";

export const formatDateTime = (d) =>
  d
    ? new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "N/A";

export const formatDuration = (seconds) => {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return h ? `${h}h ${m}m` : m ? `${m}m ${s}s` : `${s}s`;
};

export const daysSince = (d) => (d ? (Date.now() - new Date(d).getTime()) / 86_400_000 : Infinity);

export const prettyKey = (k) => k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// Never show or export these columns
export const isSensitiveKey = (k) => /pass(word|code)?|hash|token|secret/i.test(k);

const uniqSorted = (arr) => [...new Set(arr.filter(Boolean))].sort();

const parseJSON = (v) => {
  if (!v) return null;
  if (typeof v !== "string") return v;
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
};

const normaliseModule = (s) => String(s).toLowerCase().replace("sketching", "drawings").trim();
export const moduleRank = (name) => {
  const i = MODULE_ORDER.findIndex((m) => normaliseModule(m) === normaliseModule(name));
  return i === -1 ? 999 : i;
};

const groupBy = (rows, key) =>
  rows.reduce((map, r) => {
    const k = r[key];
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(r);
    return map;
  }, new Map());

// ---------- Processing ----------

export function processModuleProgress(raw) {
  const data = parseJSON(raw) || {};
  const entries = Object.entries(data).sort(([a], [b]) => moduleRank(a) - moduleRank(b));
  const moduleProgressDetails = {};
  let completedModules = 0;
  let sum = 0;

  for (const [name, info] of entries) {
    const done = MODULE_COMPONENTS.filter((c) => info?.[c] === true).length;
    const percentage = Math.round((done / MODULE_COMPONENTS.length) * 100);
    const isComplete = percentage === 100 || !!info?.completed_at;
    moduleProgressDetails[name] = {
      ...info,
      percentage,
      componentsComplete: done,
      totalComponents: MODULE_COMPONENTS.length,
      isComplete,
    };
    if (isComplete) completedModules++;
    sum += percentage;
  }

  return {
    moduleProgressDetails,
    completedModules,
    totalModules: entries.length,
    moduleProgressPercentage: entries.length ? Math.round(sum / entries.length) : 0,
  };
}

export function summarizeQuizzes(attempts = []) {
  const sorted = [...attempts].sort((a, b) => new Date(b.time_submitted) - new Date(a.time_submitted));
  const byQuiz = {};

  for (const a of sorted) {
    const id = a.quiz_id;
    if (!byQuiz[id]) {
      byQuiz[id] = { quizId: id, name: QUIZ_NAMES[id] ?? `Quiz ${id}`, category: getQuizCategory(id), attempts: [] };
    }
    byQuiz[id].attempts.push(a);
  }

  for (const q of Object.values(byQuiz)) {
    const scores = q.attempts.map((a) => a.score || 0);
    q.totalAttempts = scores.length;
    q.bestScore = Math.max(...scores);
    q.averageScore = Math.round(scores.reduce((s, x) => s + x, 0) / scores.length);
    q.lastAttempt = q.attempts[0]?.time_submitted ?? null;
  }

  const scores = sorted.map((a) => a.score || 0);
  return {
    totalAttempts: sorted.length,
    uniqueQuizzes: Object.keys(byQuiz).length,
    averageScore: scores.length ? Math.round(scores.reduce((s, x) => s + x, 0) / scores.length) : 0,
    bestScore: scores.length ? Math.max(...scores) : 0,
    byQuiz,
  };
}

export function studentOverallProgress(raw) {
  const data = parseJSON(raw);
  const modules = data ? Object.values(data) : [];
  if (!modules.length) return 0;
  const done = modules.filter(
    (m) => STUDENT_COMPONENTS.every((c) => m?.[c] === true) || !!m?.completed_at
  ).length;
  return Math.round((done / modules.length) * 100);
}

export function summarizeCourse(course, students = [], studentProgress = [], studentGrades = []) {
  const roster = students.filter((s) => s.course_id === course.id);
  const progressById = new Map(studentProgress.map((p) => [p.student_id, p]));
  const progresses = roster.map((s) => studentOverallProgress(progressById.get(s.id)?.module_progress));

  return {
    ...course,
    studentCount: roster.length,
    activeStudents: progresses.filter((p) => p > 0).length,
    completedStudents: progresses.filter((p) => p === 100).length,
    averageProgress: roster.length ? Math.round(progresses.reduce((s, p) => s + p, 0) / roster.length) : 0,
    gender: {
      male: roster.filter((s) => s.student_gender === "Male").length,
      female: roster.filter((s) => s.student_gender === "Female").length,
      other: roster.filter((s) => s.student_gender === "Other").length,
    },
    consented: roster.filter((s) => progressById.get(s.id)?.research_consent).length,
    quizAttempts: studentGrades.filter((g) => g.course_id === course.id).length,
  };
}

export function buildTeacher(teacher, { progress = null, attempts = [], courses = [] } = {}) {
  const trainingFlags = [teacher.pretest_complete, teacher.training_complete, teacher.posttest_complete, teacher.research_consent];
  const activityTimes = [progress?.updated_at, ...attempts.map((a) => a.time_submitted)]
    .filter(Boolean)
    .map((d) => new Date(d).getTime());

  const t = {
    ...teacher,
    raw: teacher,
    progress: progress ?? {},
    ...processModuleProgress(progress?.module_progress),
    quizAttempts: attempts,
    quizSummary: summarizeQuizzes(attempts),
    courses,
    coursesCount: courses.length,
    totalStudents: courses.reduce((n, c) => n + c.studentCount, 0),
    activeStudents: courses.reduce((n, c) => n + c.activeStudents, 0),
    counties: uniqSorted(courses.map((c) => c.course_county)),
    researchTypes: uniqSorted(courses.map((c) => c.course_research_type)),
    languages: uniqSorted(courses.map((c) => c.course_language)),
    overallTrainingProgress: Math.round((trainingFlags.filter(Boolean).length / trainingFlags.length) * 100),
    lastActivity: activityTimes.length ? new Date(Math.max(...activityTimes)) : null,
  };

  t.stage = t.training_complete
    ? "complete"
    : t.pretest_complete || t.completedModules > 0 || t.quizSummary.totalAttempts > 0
    ? "in-progress"
    : "not-started";

  return t;
}

// ---------- Fetching ----------

// Supabase returns max 1000 rows per request — page through everything
async function fetchAll(buildQuery, pageSize = 1000) {
  const rows = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await buildQuery().range(from, from + pageSize - 1);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < pageSize) return rows;
  }
}

export async function fetchAdminData(supabase) {
  const [teachers, progress, grades, courses, students, studentProgress] = await Promise.all([
    fetchAll(() => supabase.from("teachers").select("*").order("created_at", { ascending: false })),
    fetchAll(() => supabase.from("teachers_progress").select("*")),
    fetchAll(() => supabase.from("teachers_grades").select("*").order("time_submitted", { ascending: false })),
    fetchAll(() => supabase.from("courses").select("*").order("created_at", { ascending: false })),
    fetchAll(() => supabase.from("students").select("*")),
    fetchAll(() => supabase.from("students_progress").select("*")),
  ]);

  const progressByTeacher = new Map(progress.map((p) => [p.teacher_id, p]));
  const gradesByTeacher = groupBy(grades, "teacher_id");
  const courseSummaries = courses.map((c) => summarizeCourse(c, students, studentProgress));
  const coursesByTeacher = groupBy(courseSummaries, "course_teacher_id");

  return {
    teachers: teachers.map((t) =>
      buildTeacher(t, {
        progress: progressByTeacher.get(t.id),
        attempts: gradesByTeacher.get(t.id) ?? [],
        courses: coursesByTeacher.get(t.id) ?? [],
      })
    ),
    courses: courseSummaries,
    quizAttempts: grades,
  };
}

export async function fetchTeacherDetail(supabase, teacherId) {
  const [teacherR, progressR, gradesR, coursesR] = await Promise.all([
    supabase.from("teachers").select("*").eq("id", teacherId).single(),
    supabase.from("teachers_progress").select("*").eq("teacher_id", teacherId).limit(1),
    supabase.from("teachers_grades").select("*").eq("teacher_id", teacherId).order("time_submitted", { ascending: false }),
    supabase.from("courses").select("*").eq("course_teacher_id", teacherId).order("created_at", { ascending: false }),
  ]);
  if (teacherR.error) throw teacherR.error;

  const courses = coursesR.data ?? [];
  const ids = courses.map((c) => c.id);
  let students = [];
  let studentProgress = [];
  let studentGrades = [];

  if (ids.length) {
    [students, studentProgress, studentGrades] = await Promise.all([
      fetchAll(() => supabase.from("students").select("*").in("course_id", ids)),
      fetchAll(() => supabase.from("students_progress").select("*").in("course_id", ids)),
      fetchAll(() => supabase.from("students_grades").select("course_id").in("course_id", ids)),
    ]);
  }

  return buildTeacher(teacherR.data, {
    progress: progressR.data?.[0],
    attempts: gradesR.data ?? [],
    courses: courses.map((c) => summarizeCourse(c, students, studentProgress, studentGrades)),
  });
}

// ---------- CSV export ----------

const csvCell = (v) => {
  if (v === null || v === undefined) return "";
  const s = v instanceof Date ? v.toISOString() : typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function downloadCSV(filename, { headers, rows }) {
  // BOM so Excel reads fadas (á, é, í…) correctly
  const csv = "\uFEFF" + [headers, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// One row per teacher: every DB column + every computed metric + per-module + per-quiz detail
export function buildTeacherExport(teachers) {
  const rawKeys = [...new Set(teachers.flatMap((t) => Object.keys(t.raw ?? {})))].filter((k) => !isSensitiveKey(k));
  const moduleNames = [...new Set(teachers.flatMap((t) => Object.keys(t.moduleProgressDetails)))].sort(
    (a, b) => moduleRank(a) - moduleRank(b)
  );
  const quizIds = Object.keys(QUIZ_NAMES).map(Number);
  const blankModule = Array(2 + MODULE_COMPONENTS.length).fill("");

  const headers = [
    ...rawKeys,
    "stage", "overall_training_progress_pct", "module_progress_pct", "modules_completed", "modules_total",
    "quiz_attempts_total", "quizzes_unique", "quiz_avg_score", "quiz_best_score",
    "courses_count", "course_names", "course_join_codes", "counties", "research_types", "languages",
    "students_total", "students_active", "last_activity",
    ...moduleNames.flatMap((m) => [`${m} | progress_pct`, `${m} | completed_at`, ...MODULE_COMPONENTS.map((c) => `${m} | ${c}`)]),
    ...quizIds.flatMap((id) => [`${QUIZ_NAMES[id]} | attempts`, `${QUIZ_NAMES[id]} | best`, `${QUIZ_NAMES[id]} | avg`]),
  ];

  const rows = teachers.map((t) => {
    const q = t.quizSummary.byQuiz;
    return [
      ...rawKeys.map((k) => t.raw?.[k]),
      STAGE_META[t.stage]?.label, t.overallTrainingProgress, t.moduleProgressPercentage, t.completedModules, t.totalModules,
      t.quizSummary.totalAttempts, t.quizSummary.uniqueQuizzes, t.quizSummary.averageScore, t.quizSummary.bestScore,
      t.coursesCount,
      t.courses.map((c) => c.course_name || c.course_school_name).join(" | "),
      t.courses.map((c) => c.course_join_code).join(" | "),
      t.counties.join(" | "), t.researchTypes.join(" | "), t.languages.join(" | "),
      t.totalStudents, t.activeStudents, t.lastActivity,
      ...moduleNames.flatMap((m) => {
        const d = t.moduleProgressDetails[m];
        return d ? [d.percentage, d.completed_at ?? "", ...MODULE_COMPONENTS.map((c) => d[c] ?? "")] : blankModule;
      }),
      ...quizIds.flatMap((id) => (q[id] ? [q[id].totalAttempts, q[id].bestScore, q[id].averageScore] : [0, "", ""])),
    ];
  });

  return { headers, rows };
}

// One row per quiz attempt, with every DB column
export function buildQuizAttemptExport(teachers) {
  const pairs = teachers.flatMap((t) => t.quizAttempts.map((a) => ({ t, a })));
  const rawKeys = [...new Set(pairs.flatMap(({ a }) => Object.keys(a)))];
  return {
    headers: ["teacher_name", "teacher_email", "quiz_name", "quiz_category", "passed", ...rawKeys],
    rows: pairs.map(({ t, a }) => [
      t.name,
      t.email,
      QUIZ_NAMES[a.quiz_id] ?? `Quiz ${a.quiz_id}`,
      QUIZ_CATEGORIES[getQuizCategory(a.quiz_id)]?.label ?? "Other",
      (a.score ?? 0) >= PASS_MARK ? "Yes" : "No",
      ...rawKeys.map((k) => a[k]),
    ]),
  };
}