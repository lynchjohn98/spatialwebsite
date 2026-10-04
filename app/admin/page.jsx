"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Search, Download, ChevronRight, ChevronLeft, X, FileText } from "lucide-react";

import { AdminLogin } from "./components/AdminLogin";
import { AdminHeader } from "./components/AdminHeader";
import { StatsCards } from "./components/StatsCards";
import {
  fetchAdminData,
  buildTeacherExport,
  buildQuizAttemptExport,
  downloadCSV,
  STAGE_META,
  progressBarColor,
  formatDate,
  daysSince,
} from "./lib/adminData";

const PAGE_SIZE = 25;

const EMPTY_FILTERS = {
  stage: "all",
  county: "",
  researchType: "",
  language: "",
  courses: "",
  consent: "",
  activity: "",
};

const STAGE_CHIPS = [
  { key: "all", label: "All teachers" },
  { key: "not-started", label: "Not started" },
  { key: "in-progress", label: "In progress" },
  { key: "complete", label: "Training complete" },
];

const SORTS = {
  activity: { label: "Most recently active", fn: (a, b) => new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0) },
  name: { label: "Name (A–Z)", fn: (a, b) => (a.name || "").localeCompare(b.name || "") },
  progressDesc: { label: "Progress (high → low)", fn: (a, b) => b.moduleProgressPercentage - a.moduleProgressPercentage },
  progressAsc: { label: "Progress (low → high)", fn: (a, b) => a.moduleProgressPercentage - b.moduleProgressPercentage },
  newest: { label: "Newest registered", fn: (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0) },
};

const toOptions = (allLabel, values) => [{ value: "", label: allLabel }, ...values.map((v) => ({ value: v, label: v }))];
const uniq = (arr) => [...new Set(arr.filter(Boolean))].sort();

export default function AdminPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClientComponentClient(), []);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [data, setData] = useState({ teachers: [], courses: [], quizAttempts: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState("activity");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (sessionStorage.getItem("adminAuthorized") === "true") setIsAuthorized(true);
  }, []);

  const load = useCallback(
    async (initial = false) => {
      initial ? setIsLoading(true) : setIsRefreshing(true);
      setError("");
      try {
        console.log("Fetching admin data...");
        setData(await fetchAdminData(supabase));
        setLastRefresh(new Date());
      } catch (e) {
        console.error("Error fetching data:", e);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [supabase]
  );

  useEffect(() => {
    if (isAuthorized) load(true);
  }, [isAuthorized, load]);

  const { teachers, courses, quizAttempts } = data;

  // ----- Filter options -----
  const options = useMemo(
    () => ({
      counties: uniq(courses.map((c) => c.course_county)),
      researchTypes: uniq(courses.map((c) => c.course_research_type)),
      languages: uniq(courses.map((c) => c.course_language)),
    }),
    [courses]
  );

  const stageCounts = useMemo(() => {
    const counts = { all: teachers.length };
    teachers.forEach((t) => (counts[t.stage] = (counts[t.stage] || 0) + 1));
    return counts;
  }, [teachers]);

  // ----- Filtering + sorting -----
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teachers
      .filter((t) => {
        if (q) {
          const haystack = [
            t.name, t.username, t.email,
            ...t.courses.flatMap((c) => [c.course_name, c.course_school_name, c.course_join_code]),
          ];
          if (!haystack.some((v) => v?.toLowerCase().includes(q))) return false;
        }
        if (filters.stage !== "all" && t.stage !== filters.stage) return false;
        if (filters.county && !t.counties.includes(filters.county)) return false;
        if (filters.researchType && !t.researchTypes.includes(filters.researchType)) return false;
        if (filters.language && !t.languages.includes(filters.language)) return false;
        if (filters.courses === "with" && t.coursesCount === 0) return false;
        if (filters.courses === "without" && t.coursesCount > 0) return false;
        if (filters.consent && String(!!t.research_consent) !== filters.consent) return false;
        if (filters.activity === "week" && daysSince(t.lastActivity) > 7) return false;
        if (filters.activity === "month" && daysSince(t.lastActivity) > 30) return false;
        if (filters.activity === "stale" && daysSince(t.lastActivity) <= 30) return false;
        return true;
      })
      .sort(SORTS[sortBy].fn);
  }, [teachers, search, filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const updateFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const activeFilterCount =
    Object.entries(filters).filter(([k, v]) => v !== EMPTY_FILTERS[k]).length + (search ? 1 : 0);

  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearch("");
    setPage(1);
  };

  const today = new Date().toISOString().split("T")[0];

  // ----- Aggregate stats (unchanged) -----
  const aggregateStats = {
    totalTeachers: teachers.length,
    totalCourses: courses.length,
    averageProgress: teachers.length
      ? Math.round(teachers.reduce((acc, t) => acc + t.moduleProgressPercentage, 0) / teachers.length)
      : 0,
    completedTraining: teachers.filter((t) => t.training_complete).length,
    activeTeachers: teachers.filter((t) => daysSince(t.lastActivity) < 7).length,
    totalQuizAttempts: quizAttempts.length,
    teachersWithCourses: teachers.filter((t) => t.coursesCount > 0).length,
    teachersWithoutCourses: teachers.filter((t) => t.coursesCount === 0).length,
  };

  if (!isAuthorized) return <AdminLogin onAuthorized={() => setIsAuthorized(true)} />;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p>Loading comprehensive data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader
        lastRefresh={lastRefresh}
        onRefresh={() => load()}
        isRefreshing={isRefreshing}
        onLogout={() => {
          sessionStorage.removeItem("adminAuthorized");
          setIsAuthorized(false);
        }}
      />

      <div className="max-w-full px-6 py-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">Total Statistics</h2>
        <StatsCards stats={aggregateStats} />

        <div className="bg-gray-800 rounded-lg border border-gray-700">
          {/* ---------- Controls ---------- */}
          <div className="p-4 border-b border-gray-700 space-y-4">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
              <h2 className="text-xl font-bold lg:mr-4">Teachers</h2>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name, username, email, course name, school or join code..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadCSV(`teachers_full_${today}.csv`, buildTeacherExport(filtered))}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors whitespace-nowrap"
                  title="One row per teacher with every column, module and quiz"
                >
                  <Download size={18} />
                  Export CSV ({filtered.length})
                </button>
                <button
                  onClick={() => downloadCSV(`quiz_attempts_${today}.csv`, buildQuizAttemptExport(filtered))}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors whitespace-nowrap text-sm"
                  title="One row per quiz attempt"
                >
                  <FileText size={16} />
                  Quiz attempts
                </button>
              </div>
            </div>

            {/* Stage chips */}
            <div className="flex flex-wrap gap-2">
              {STAGE_CHIPS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => updateFilter("stage", s.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    filters.stage === s.key ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {s.label}
                  <span className={`text-xs px-1.5 rounded ${filters.stage === s.key ? "bg-blue-500" : "bg-gray-600"}`}>
                    {stageCounts[s.key] || 0}
                  </span>
                </button>
              ))}
            </div>

            {/* Dropdown filters */}
            <div className="flex flex-wrap items-end gap-3">
              <FilterSelect label="County" value={filters.county} onChange={(v) => updateFilter("county", v)} options={toOptions("All counties", options.counties)} />
              <FilterSelect label="Research type" value={filters.researchType} onChange={(v) => updateFilter("researchType", v)} options={toOptions("All types", options.researchTypes)} />
              <FilterSelect label="Language" value={filters.language} onChange={(v) => updateFilter("language", v)} options={toOptions("All languages", options.languages)} />
              <FilterSelect
                label="Courses"
                value={filters.courses}
                onChange={(v) => updateFilter("courses", v)}
                options={[
                  { value: "", label: "Any" },
                  { value: "with", label: "Has created courses" },
                  { value: "without", label: "No courses yet" },
                ]}
              />
              <FilterSelect
                label="Research consent"
                value={filters.consent}
                onChange={(v) => updateFilter("consent", v)}
                options={[
                  { value: "", label: "Any" },
                  { value: "true", label: "Consented" },
                  { value: "false", label: "Not consented" },
                ]}
              />
              <FilterSelect
                label="Activity"
                value={filters.activity}
                onChange={(v) => updateFilter("activity", v)}
                options={[
                  { value: "", label: "Any time" },
                  { value: "week", label: "Active in last 7 days" },
                  { value: "month", label: "Active in last 30 days" },
                  { value: "stale", label: "Inactive 30+ days" },
                ]}
              />

              <div className="flex-1" />

              <FilterSelect
                label="Sort by"
                value={sortBy}
                onChange={setSortBy}
                highlight={false}
                options={Object.entries(SORTS).map(([value, s]) => ({ value, label: s.label }))}
              />

              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                >
                  <X size={14} />
                  Clear ({activeFilterCount})
                </button>
              )}
            </div>
          </div>

          {/* ---------- Table ---------- */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr className="bg-gray-800/50">
                  {["Teacher", "Stage", "Module progress", "Quizzes", "Courses & students", "Last active", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {pageItems.map((t) => {
                  const open = () => router.push(`/admin/teacher/${t.id}`);
                  const stage = STAGE_META[t.stage];
                  return (
                    <tr
                      key={t.id}
                      onClick={open}
                      onKeyDown={(e) => e.key === "Enter" && open()}
                      tabIndex={0}
                      className="cursor-pointer hover:bg-gray-700/40 focus:bg-gray-700/40 focus:outline-none transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium group-hover:text-blue-400 transition-colors">{t.name || "N/A"}</div>
                        <div className="text-sm text-gray-400">{t.username}</div>
                        <div className="text-xs text-gray-500">{t.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${stage.badge}`}>
                          {stage.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-28 bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${progressBarColor(t.moduleProgressPercentage)}`}
                              style={{ width: `${t.moduleProgressPercentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{t.moduleProgressPercentage}%</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {t.completedModules}/{t.totalModules} modules complete
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {t.quizSummary.totalAttempts > 0 ? (
                          <>
                            <div>{t.quizSummary.uniqueQuizzes} quizzes taken</div>
                            <div className="text-xs text-gray-400">
                              Avg {t.quizSummary.averageScore}% · Best {t.quizSummary.bestScore}%
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-500">None yet</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          {t.coursesCount} course{t.coursesCount !== 1 && "s"} · {t.totalStudents} student{t.totalStudents !== 1 && "s"}
                        </div>
                        {t.counties.length > 0 && <div className="text-xs text-gray-400">{t.counties.join(", ")}</div>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{formatDate(t.lastActivity)}</td>
                      <td className="px-4 py-3 text-gray-500 group-hover:text-blue-400">
                        <ChevronRight size={18} />
                      </td>
                    </tr>
                  );
                })}

                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                      No teachers match the current filters.
                      {activeFilterCount > 0 && (
                        <button onClick={clearAll} className="ml-2 text-blue-400 hover:text-blue-300 underline">
                          Clear filters
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ---------- Footer / pagination ---------- */}
          <div className="flex items-center justify-between p-4 border-t border-gray-700 text-sm">
            <span className="text-gray-400">
              {filtered.length === 0
                ? "0 teachers"
                : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length} teachers`}
              {filtered.length !== teachers.length && ` (filtered from ${teachers.length})`}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:hover:bg-gray-700"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:hover:bg-gray-700"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg">{error}</div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, highlight = true }) {
  const active = highlight && value !== "";
  return (
    <label className="flex flex-col gap-1 text-xs text-gray-400">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`px-3 py-2 rounded-md text-sm bg-gray-700 text-white border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          active ? "border-blue-500" : "border-transparent"
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}