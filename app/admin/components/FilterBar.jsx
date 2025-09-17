// FilterBar.jsx
import React, { useState } from 'react';
import { Search, Filter, Download, X, ChevronDown, ChevronUp } from 'lucide-react';

export function FilterBar({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  filterOptions, 
  onDownload, 
  onReset 
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Count active filters
  const activeFilterCount = Object.values(filters).filter(v => v !== "").length;

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by teacher name, username, or email..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            <Filter size={18} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-600 text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
            {isFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {/* Filter Dropdown Menu */}
          {isFilterOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-gray-700 rounded-lg shadow-xl z-10 p-4 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {/* County Filter */}
                {filterOptions.counties?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">County</label>
                    <select
                      value={filters.county}
                      onChange={(e) => onFilterChange('county', e.target.value)}
                      className="w-full px-3 py-1.5 bg-gray-600 rounded text-white text-sm"
                    >
                      <option value="">All Counties</option>
                      {filterOptions.counties.map(county => (
                        <option key={county} value={county}>{county}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Research Type Filter */}
                {filterOptions.researchTypes?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Research Type</label>
                    <select
                      value={filters.researchType}
                      onChange={(e) => onFilterChange('researchType', e.target.value)}
                      className="w-full px-3 py-1.5 bg-gray-600 rounded text-white text-sm"
                    >
                      <option value="">All Types</option>
                      {filterOptions.researchTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Language Filter */}
                {filterOptions.languages?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Language</label>
                    <select
                      value={filters.language}
                      onChange={(e) => onFilterChange('language', e.target.value)}
                      className="w-full px-3 py-1.5 bg-gray-600 rounded text-white text-sm"
                    >
                      <option value="">All Languages</option>
                      {filterOptions.languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Progress Range Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Module Progress</label>
                  <select
                    value={filters.progressRange}
                    onChange={(e) => onFilterChange('progressRange', e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-600 rounded text-white text-sm"
                  >
                    <option value="">All Progress Levels</option>
                    {filterOptions.progressRanges?.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Module Completion Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Minimum Modules Completed</label>
                  <select
                    value={filters.moduleCompletion}
                    onChange={(e) => onFilterChange('moduleCompletion', e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-600 rounded text-white text-sm"
                  >
                    <option value="">Any</option>
                    <option value="1">At least 1</option>
                    <option value="3">At least 3</option>
                    <option value="5">At least 5</option>
                    <option value="7">At least 7</option>
                    <option value="10">All modules</option>
                  </select>
                </div>
                
                {/* Has Courses Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Has Courses</label>
                  <select
                    value={filters.hasCourses}
                    onChange={(e) => onFilterChange('hasCourses', e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-600 rounded text-white text-sm"
                  >
                    <option value="">All Teachers</option>
                    <option value="true">Has Created Courses</option>
                    <option value="false">No Courses Created</option>
                  </select>
                </div>
                
                {/* Has Students Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Has Students</label>
                  <select
                    value={filters.hasStudents}
                    onChange={(e) => onFilterChange('hasStudents', e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-600 rounded text-white text-sm"
                  >
                    <option value="">All</option>
                    <option value="true">Has Students</option>
                    <option value="false">No Students</option>
                  </select>
                </div>
                
                {/* Research Consent */}
                <div>
                  <label className="block text-sm font-medium mb-1">Research Consent</label>
                  <select
                    value={filters.researchConsent}
                    onChange={(e) => onFilterChange('researchConsent', e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-600 rounded text-white text-sm"
                  >
                    <option value="">All</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                
                {/* Pretest Complete */}
                <div>
                  <label className="block text-sm font-medium mb-1">Pretest Complete</label>
                  <select
                    value={filters.pretestComplete}
                    onChange={(e) => onFilterChange('pretestComplete', e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-600 rounded text-white text-sm"
                  >
                    <option value="">All</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                
                {/* Training Complete */}
                <div>
                  <label className="block text-sm font-medium mb-1">Training Complete</label>
                  <select
                    value={filters.trainingComplete}
                    onChange={(e) => onFilterChange('trainingComplete', e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-600 rounded text-white text-sm"
                  >
                    <option value="">All</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                
                {/* Posttest Complete */}
                <div>
                  <label className="block text-sm font-medium mb-1">Posttest Complete</label>
                  <select
                    value={filters.posttestComplete}
                    onChange={(e) => onFilterChange('posttestComplete', e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-600 rounded text-white text-sm"
                  >
                    <option value="">All</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                
                {/* Reset Button */}
                <div className="pt-2 border-t border-gray-600">
                  <button
                    onClick={onReset}
                    className="w-full px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Download Button */}
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>
      
      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (value === "") return null;
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-700 rounded-full text-sm"
              >
                {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                <button
                  onClick={() => onFilterChange(key, "")}
                  className="ml-1 hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}