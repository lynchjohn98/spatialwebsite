"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supplementalMaterialInformation } from "../../../app/library/helpers/clienthelpers"

export default function TeacherResourcesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter resources based on search and category
  const filteredResources = supplementalMaterialInformation.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === "all") return matchesSearch;
    if (selectedCategory === "guides") return matchesSearch && resource.title.includes("Guide");
    if (selectedCategory === "modules") return matchesSearch && resource.title.includes("Module");
    return matchesSearch;
  });

  const handleDownload = (url, title) => {
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
    } else if (url) {
      window.location.href = url;
    } else {
      alert(`Download link for "${title}" is not currently available`);
    }
  };

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
              <svg
                className="h-5 w-5 mr-2 group-hover:translate-x-[-2px] transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Back to Teacher Portal</span>
            </button>

            <div className="text-sm text-gray-400">Teaching Resources</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Supplemental Teaching Resources
          </h1>
          <p className="text-gray-300 text-lg">
            Download presentations, guides, and materials to enhance your spatial thinking curriculum
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              All Resources
            </button>
            <button
              onClick={() => setSelectedCategory("modules")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === "modules" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Modules
            </button>
            <button
              onClick={() => setSelectedCategory("guides")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === "guides" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Guides
            </button>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all duration-200 flex flex-col"
            >
              {/* Resource Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  {resource.title.includes("Guide") ? (
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  ) : resource.title.includes("Extension") ? (
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold mb-2 text-white">
                {resource.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 flex-1">
                {resource.description}
              </p>

              {/* File Type Badge */}
              <div className="mb-4">
                {resource.downloadUrl && (
                  <span className="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                    {resource.downloadUrl.endsWith('.pdf') ? 'PDF' :
                     resource.downloadUrl.endsWith('.pptx') ? 'PowerPoint' :
                     resource.downloadUrl.endsWith('.docx') ? 'Word' : 'File'}
                  </span>
                )}
              </div>

              {/* Download Button */}
              <button
                onClick={() => handleDownload(resource.downloadUrl, resource.title)}
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
          ))}
        </div>

        {/* Results Summary */}
        <div className="mt-8 text-center text-gray-400">
          <p>Showing {filteredResources.length} of {supplementalMaterialInformation.length} resources</p>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-3">Need Help?</h2>
          <p className="text-gray-300 mb-4">
            These resources are designed to supplement your spatial thinking curriculum. 
            The Teacher's Resource Guide provides comprehensive walkthroughs for each module.
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