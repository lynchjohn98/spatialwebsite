"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  lecturePowerpoints,
  workbookPowerpoints,
  supplementalMaterial,
  researchMaterial,
  MODULE_ORDER,
} from "../../../app/library/helpers/clienthelpers";

// ---------- Data normalisation ----------

const TYPES = [
  { key: "Lecture", label: "Lectures", items: lecturePowerpoints },
  { key: "Workbook", label: "Workbooks", items: workbookPowerpoints },
  { key: "Supplemental Material", label: "Supplemental", items: supplementalMaterial },
  { key: "Research", label: "Research", items: researchMaterial },
];

// Works out the module from the title: "Pre-Module ..." -> 0, "Module 4 ..." -> 4, otherwise null (general).
// You can override this per item by adding `module: 4` to any entry in clienthelpers.
function getModule(title) {
  if (/pre-module/i.test(title)) return 0;
  const m = title.match(/module\s+(\d+)/i);
  return m ? Number(m[1]) : null;
}

const ALL_RESOURCES = TYPES.flatMap((t) =>
  t.items.map((r) => ({
    ...r,
    type: r.type ?? t.key,
    module: r.module !== undefined ? r.module : getModule(r.title),
  }))
);

const MODULES = [
  ...MODULE_ORDER.map((name, i) => ({
    id: i,
    short: i === 0 ? "Pre" : String(i),
    name: name.replace(/^Pre-Module:\s*/, ""),
  })),
  { id: "general", short: "General", name: "General Resources" },
];

const moduleMatches = (r, id) => (id === "general" ? r.module === null : r.module === id);
const moduleLabel = (n) => (n === 0 ? "Pre-Module" : `Module ${n}`);

function fileType(url = "") {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".pdf")) return "PDF";
  if (clean.endsWith(".pptx") || clean.endsWith(".ppt")) return "PowerPoint";
  if (clean.endsWith(".docx") || clean.endsWith(".doc")) return "Word";
  return "File";
}

const TYPE_STYLES = {
  Lecture: "bg-blue-600/20 text-blue-400",
  Workbook: "bg-emerald-600/20 text-emerald-400",
  "Supplemental Material": "bg-amber-600/20 text-amber-400",
  Research: "bg-purple-600/20 text-purple-400",
};

// ---------- Small components ----------

function Chip({ active, onClick, children, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
        active ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }`}
    >
      {children}
      {count !== undefined && (
        <span className={`text-xs px-1.5 rounded ${active ? "bg-blue-500" : "bg-gray-600"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function ResourceCard({ resource, onDownload, onModuleClick, showModuleTag }) {
  return (
    <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-blue-500 transition-all duration-200 flex flex-col">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`text-xs px-2 py-1 rounded ${TYPE_STYLES[resource.type] ?? "bg-gray-700 text-gray-300"}`}>
          {resource.type === "Supplemental Material" ? "Supplemental" : resource.type}
        </span>
        <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
          {fileType(resource.downloadUrl)}
        </span>
        {showModuleTag && resource.module !== null && (
          <button
            onClick={() => onModuleClick(resource.module)}
            className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white transition-colors"
            title="View everything for this module"
          >
            {moduleLabel(resource.module)} →
          </button>
        )}
      </div>

      <h3 className="text-base font-semibold mb-2 text-white">{resource.title}</h3>
      <p className="text-gray-400 text-sm mb-4 flex-1">{resource.description}</p>

      <button
        onClick={() => onDownload(resource.downloadUrl, resource.title)}
        disabled={!resource.downloadUrl}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
          resource.downloadUrl
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-700 text-gray-500 cursor-not-allowed"
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {resource.downloadUrl ? "Download" : "Unavailable"}
      </button>
    </div>
  );
}

// ---------- Page ----------

export default function TeacherResourcesPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("type"); // "type" | "module"
  const [selectedType, setSelectedType] = useState("Lecture");
  const [selectedModule, setSelectedModule] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const q = searchTerm.trim().toLowerCase();
  const matchesSearch = (r) =>
    !q || r.title.toLowerCase().includes(q) || (r.description ?? "").toLowerCase().includes(q);

  // Type view: flat list, sorted by module number (general items last)
  const typeResults = useMemo(
    () =>
      ALL_RESOURCES.filter((r) => r.type === selectedType && matchesSearch(r)).sort(
        (a, b) => (a.module ?? 99) - (b.module ?? 99)
      ),
    [selectedType, q]
  );

  // Module view: grouped into sections by type
  const moduleSections = useMemo(
    () =>
      TYPES.map((t) => ({
        ...t,
        resources: ALL_RESOURCES.filter(
          (r) => r.type === t.key && moduleMatches(r, selectedModule) && matchesSearch(r)
        ),
      })).filter((s) => s.resources.length > 0),
    [selectedModule, q]
  );

  const handleDownload = (url, title) => {
    if (url && url.startsWith("http")) window.open(url, "_blank");
    else if (url) window.location.href = url;
    else alert(`Download link for "${title}" is not currently available`);
  };

  const jumpToModule = (moduleId) => {
    setSelectedModule(moduleId);
    setViewMode("module");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentModule = MODULES.find((m) => m.id === selectedModule);
  const resultCount =
    viewMode === "type"
      ? typeResults.length
      : moduleSections.reduce((n, s) => n + s.resources.length, 0);

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      {/* Sticky Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/teacher/homepage")}
              className="flex items-center text-gray-300 hover:text-white transition-colors group"
            >
              <svg className="h-5 w-5 mr-2 group-hover:translate-x-[-2px] transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Back to Teacher Portal</span>
            </button>
            <div className="text-sm text-gray-400">Teaching Resources</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Teaching Resources</h1>
          <p className="text-gray-300">
            Lectures, workbooks and supplemental materials for the spatial thinking curriculum
          </p>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            {/* View toggle */}
            <div className="inline-flex bg-gray-700 rounded-lg p-1 shrink-0">
              {[
                { key: "type", label: "By Type" },
                { key: "module", label: "By Module" },
              ].map((v) => (
                <button
                  key={v.key}
                  onClick={() => setViewMode(v.key)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === v.key ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Secondary filter row */}
          <div className="flex flex-wrap gap-2">
            {viewMode === "type"
              ? TYPES.map((t) => (
                  <Chip
                    key={t.key}
                    active={selectedType === t.key}
                    onClick={() => setSelectedType(t.key)}
                    count={ALL_RESOURCES.filter((r) => r.type === t.key).length}
                  >
                    {t.label}
                  </Chip>
                ))
              : MODULES.map((m) => (
                  <Chip
                    key={m.id}
                    active={selectedModule === m.id}
                    onClick={() => setSelectedModule(m.id)}
                    count={ALL_RESOURCES.filter((r) => moduleMatches(r, m.id)).length}
                  >
                    {m.id === 0 || m.id === "general" ? m.short : `Module ${m.short}`}
                  </Chip>
                ))}
          </div>
        </div>

        {/* Results */}
        {viewMode === "type" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {typeResults.map((r) => (
              <ResourceCard
                key={r.downloadUrl ?? r.title}
                resource={r}
                onDownload={handleDownload}
                onModuleClick={jumpToModule}
                showModuleTag
              />
            ))}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              {selectedModule === "general"
                ? currentModule?.name
                : `${moduleLabel(selectedModule)}: ${currentModule?.name}`}
            </h2>
            <div className="space-y-8">
              {moduleSections.map((section) => (
                <section key={section.key}>
                  <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
                    {section.label} ({section.resources.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.resources.map((r) => (
                      <ResourceCard
                        key={r.downloadUrl ?? r.title}
                        resource={r}
                        onDownload={handleDownload}
                        onModuleClick={jumpToModule}
                        showModuleTag={false}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}

        {resultCount === 0 && (
          <div className="text-center text-gray-400 py-12 bg-gray-800/50 rounded-lg border border-gray-700">
            No resources found{q ? ` matching "${searchTerm}"` : ""}.
          </div>
        )}

        <div className="mt-8 text-center text-gray-400 text-sm">
          Showing {resultCount} of {ALL_RESOURCES.length} resources
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-3">Need Help?</h2>
          <p className="text-gray-300 mb-4">
            The Teacher's Resource Guide (under General) provides comprehensive walkthroughs for each module.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/teacher/walkthrough")}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              View Platform Tutorial
            </button>
            <button
              onClick={() => router.push("/teacher/training")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Go to Training
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}