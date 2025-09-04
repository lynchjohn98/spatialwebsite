"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  const router = useRouter();
  
  // Dashboard states
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  
  // Filter states
  const [filters, setFilters] = useState({
    county: "",
    gender: "",
    urbanicity: "",
    deis: "",
    language: "",
    researchType: "",
    researchConsent: "",
    trainingComplete: "",
    pretestComplete: "",
    posttestComplete: ""
  });
  
  // Available filter options
  const [filterOptions, setFilterOptions] = useState({
    counties: [],
    genders: [],
    urbanicities: [],
    deisOptions: [],
    languages: [],
    researchTypes: []
  });
  
  const supabase = createClientComponentClient();

  // Check for existing admin authorization
  useEffect(() => {
    const adminAuth = sessionStorage.getItem("adminAuthorized");
    if (adminAuth === "true") {
      setIsAuthorized(true);
    }
  }, []);

  // Fetch data when authorized
  useEffect(() => {
    if (isAuthorized) {
      fetchAllData();
    }
  }, [isAuthorized]);

  const handlePasscodeChange = (e) => {
    setPasscode(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setError("");
    
    const adminPasscode = "1234"; 
    
    if (passcode === adminPasscode) {
      sessionStorage.setItem("adminAuthorized", "true");
      setIsAuthorized(true);
    } else {
      setError("Invalid admin passcode. Please try again.");
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthorized");
    setIsAuthorized(false);
    setPasscode("");
  };

  const fetchAllData = async () => {
    setIsLoadingData(true);
    setDataError("");
    
    try {
      // Fetch teachers data
      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (teachersError) throw teachersError;
      
      // Fetch courses data with teacher information
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          teachers (
            id,
            username,
            name,
            research_consent,
            training_complete,
            pretest_complete,
            posttest_complete
          )
        `)
        .order('created_at', { ascending: false });
      
      if (coursesError) throw coursesError;
      
      setTeachers(teachersData || []);
      setCourses(coursesData || []);
      
      // Combine data for filtering
      const combinedData = (coursesData || []).map(course => ({
        ...course,
        teacher_name: course.teachers?.name || course.course_teacher_name,
        teacher_username: course.teachers?.username,
        teacher_research_consent: course.teachers?.research_consent,
        teacher_training_complete: course.teachers?.training_complete,
        teacher_pretest_complete: course.teachers?.pretest_complete,
        teacher_posttest_complete: course.teachers?.posttest_complete
      }));
      
      setFilteredData(combinedData);
      
      // Extract unique filter options
      extractFilterOptions(coursesData || [], teachersData || []);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setDataError("Failed to load data. Please try again.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const extractFilterOptions = (coursesData, teachersData) => {
    const options = {
      counties: [...new Set(coursesData.map(c => c.course_county).filter(Boolean))].sort(),
      genders: [...new Set(coursesData.map(c => c.course_gender).filter(Boolean))].sort(),
      urbanicities: [...new Set(coursesData.map(c => c.course_urbanicity).filter(Boolean))].sort(),
      deisOptions: [...new Set(coursesData.map(c => c.course_deis).filter(Boolean))].sort(),
      languages: [...new Set(coursesData.map(c => c.course_language).filter(Boolean))].sort(),
      researchTypes: [...new Set(coursesData.map(c => c.course_research_type).filter(Boolean))].sort()
    };
    
    setFilterOptions(options);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const applyFilters = (currentFilters) => {
    let filtered = courses.map(course => ({
      ...course,
      teacher_name: course.teachers?.name || course.course_teacher_name,
      teacher_username: course.teachers?.username,
      teacher_research_consent: course.teachers?.research_consent,
      teacher_training_complete: course.teachers?.training_complete,
      teacher_pretest_complete: course.teachers?.pretest_complete,
      teacher_posttest_complete: course.teachers?.posttest_complete
    }));
    
    // Apply filters
    if (currentFilters.county) {
      filtered = filtered.filter(item => item.course_county === currentFilters.county);
    }
    if (currentFilters.gender) {
      filtered = filtered.filter(item => item.course_gender === currentFilters.gender);
    }
    if (currentFilters.urbanicity) {
      filtered = filtered.filter(item => item.course_urbanicity === currentFilters.urbanicity);
    }
    if (currentFilters.deis) {
      filtered = filtered.filter(item => item.course_deis === currentFilters.deis);
    }
    if (currentFilters.language) {
      filtered = filtered.filter(item => item.course_language === currentFilters.language);
    }
    if (currentFilters.researchType) {
      filtered = filtered.filter(item => item.course_research_type === currentFilters.researchType);
    }
    if (currentFilters.researchConsent !== "") {
      filtered = filtered.filter(item => 
        item.teacher_research_consent === (currentFilters.researchConsent === "true")
      );
    }
    if (currentFilters.trainingComplete !== "") {
      filtered = filtered.filter(item => 
        item.teacher_training_complete === (currentFilters.trainingComplete === "true")
      );
    }
    if (currentFilters.pretestComplete !== "") {
      filtered = filtered.filter(item => 
        item.teacher_pretest_complete === (currentFilters.pretestComplete === "true")
      );
    }
    if (currentFilters.posttestComplete !== "") {
      filtered = filtered.filter(item => 
        item.teacher_posttest_complete === (currentFilters.posttestComplete === "true")
      );
    }
    
    setFilteredData(filtered);
  };

  const resetFilters = () => {
    const emptyFilters = {
      county: "",
      gender: "",
      urbanicity: "",
      deis: "",
      language: "",
      researchType: "",
      researchConsent: "",
      trainingComplete: "",
      pretestComplete: "",
      posttestComplete: ""
    };
    setFilters(emptyFilters);
    setFilteredData(courses.map(course => ({
      ...course,
      teacher_name: course.teachers?.name || course.course_teacher_name,
      teacher_username: course.teachers?.username,
      teacher_research_consent: course.teachers?.research_consent,
      teacher_training_complete: course.teachers?.training_complete,
      teacher_pretest_complete: course.teachers?.pretest_complete,
      teacher_posttest_complete: course.teachers?.posttest_complete
    })));
    setCurrentPage(1);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const downloadCSV = (dataType = 'filtered') => {
    let dataToDownload = [];
    let filename = '';
    
    if (dataType === 'filtered') {
      dataToDownload = filteredData;
      filename = 'filtered_course_data.csv';
    } else if (dataType === 'teachers') {
      dataToDownload = teachers;
      filename = 'teachers_data.csv';
    } else if (dataType === 'courses') {
      dataToDownload = courses;
      filename = 'all_courses_data.csv';
    }
    
    if (dataToDownload.length === 0) {
      alert('No data to download');
      return;
    }
    
    // Prepare CSV content
    const headers = Object.keys(dataToDownload[0]).filter(key => key !== 'teachers');
    const csvContent = [
      headers.join(','),
      ...dataToDownload.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle null, undefined, and special characters
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          // Escape quotes and wrap in quotes if contains comma or quotes
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const downloadJSON = (dataType = 'filtered') => {
    let dataToDownload = [];
    let filename = '';
    
    if (dataType === 'filtered') {
      dataToDownload = filteredData;
      filename = 'filtered_course_data.json';
    } else if (dataType === 'teachers') {
      dataToDownload = teachers;
      filename = 'teachers_data.json';
    } else if (dataType === 'courses') {
      dataToDownload = courses;
      filename = 'all_courses_data.json';
    } else if (dataType === 'all') {
      dataToDownload = {
        teachers: teachers,
        courses: courses,
        combined: filteredData
      };
      filename = 'all_data_combined.json';
    }
    
    const jsonString = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Login screen
  if (!isAuthorized) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <div className="flex flex-col items-center justify-center flex-1 w-full px-4 py-8">
          <div className="w-full max-w-md">
            <div className="p-6 rounded-lg shadow-lg mb-8">
              <h1 className="text-2xl font-bold mb-1 text-center">Admin Access</h1>
              <p className="text-center">
                Enter the admin passcode to access the administrative dashboard.
              </p>
            </div>
            
            <div className="space-y-6">
              {error && (
                <div className="bg-red-800 text-white p-3 rounded-md">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-lg font-medium mb-2">
                  Admin Passcode
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={handlePasscodeChange}
                  className="w-full px-4 py-3 rounded bg-blue-200 text-black"
                  placeholder="Enter admin passcode"
                />
              </div>
              
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-md font-medium transition-colors
                    ${isLoading 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  {isLoading ? 'Verifying...' : 'Access Admin Panel'}
                </button>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => router.push("/")}
                  className="text-blue-300 hover:text-blue-200 transition-colors text-sm"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state for data
  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl">Loading data...</div>
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Teachers</h3>
            <p className="text-2xl font-bold">{teachers.length}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Courses</h3>
            <p className="text-2xl font-bold">{courses.length}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Filtered Results</h3>
            <p className="text-2xl font-bold">{filteredData.length}</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Data Filters</h2>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors text-sm"
          >
            Reset Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* County Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">County</label>
            <select
              value={filters.county}
              onChange={(e) => handleFilterChange('county', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
            >
              <option value="">All Counties</option>
              {filterOptions.counties.map(county => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>
          </div>
          
          {/* Gender Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
            >
              <option value="">All Genders</option>
              {filterOptions.genders.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
          </div>
          
          {/* Urbanicity Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Urbanicity</label>
            <select
              value={filters.urbanicity}
              onChange={(e) => handleFilterChange('urbanicity', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
            >
              <option value="">All Types</option>
              {filterOptions.urbanicities.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* DEIS Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">DEIS</label>
            <select
              value={filters.deis}
              onChange={(e) => handleFilterChange('deis', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
            >
              <option value="">All DEIS</option>
              {filterOptions.deisOptions.map(deis => (
                <option key={deis} value={deis}>{deis}</option>
              ))}
            </select>
          </div>
          
          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
            >
              <option value="">All Languages</option>
              {filterOptions.languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          
          {/* Research Type Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Research Type</label>
            <select
              value={filters.researchType}
              onChange={(e) => handleFilterChange('researchType', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
            >
              <option value="">All Types</option>
              {filterOptions.researchTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* Teacher Filters */}
          <div>
            <label className="block text-sm font-medium mb-1">Research Consent</label>
            <select
              value={filters.researchConsent}
              onChange={(e) => handleFilterChange('researchConsent', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Training Complete</label>
            <select
              value={filters.trainingComplete}
              onChange={(e) => handleFilterChange('trainingComplete', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Pretest Complete</label>
            <select
              value={filters.pretestComplete}
              onChange={(e) => handleFilterChange('pretestComplete', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Posttest Complete</label>
            <select
              value={filters.posttestComplete}
              onChange={(e) => handleFilterChange('posttestComplete', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* Full Data Table */}
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Data Table (Filtered)</h2>
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} records
          </div>
        </div>
        
        {filteredData.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-800">
                      Course/School Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-800">
                      Teacher
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-800">
                      County
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-800">
                      Join Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-800">
                      Research Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-800">
                      Gender
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-800">
                      Urbanicity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-800">
                      Language
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-800">
                      Research Consent
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-800">
                      Training
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-800">
                      Pretest
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-800">
                      Posttest
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentItems.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3 text-sm">
                        {course.course_name || course.course_school_name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {course.teacher_name || course.course_teacher_name}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {course.course_county || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">
                        {course.course_join_code}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {course.course_research_type}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {course.course_gender || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {course.course_urbanicity || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {course.course_language || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          course.teacher_research_consent 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {course.teacher_research_consent ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          course.teacher_training_complete 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {course.teacher_training_complete ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          course.teacher_pretest_complete 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {course.teacher_pretest_complete ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          course.teacher_posttest_complete 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {course.teacher_posttest_complete ? '✓' : '✗'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => paginate(1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${
                      currentPage === 1 
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-600 hover:bg-gray-500 text-white'
                    }`}
                  >
                    First
                  </button>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${
                      currentPage === 1 
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-600 hover:bg-gray-500 text-white'
                    }`}
                  >
                    Previous
                  </button>
                </div>
                
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`px-3 py-1 rounded ${
                          currentPage === pageNumber 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-600 hover:bg-gray-500 text-white'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages 
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-600 hover:bg-gray-500 text-white'
                    }`}
                  >
                    Next
                  </button>
                  <button
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages 
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-600 hover:bg-gray-500 text-white'
                    }`}
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-400">No data matches the current filters.</p>
        )}
      </div>

      {/* Download Section - At the Bottom */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Export Data</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CSV Downloads */}
          <div>
            <h3 className="text-lg font-semibold mb-3">CSV Format</h3>
            <div className="space-y-2">
              <button
                onClick={() => downloadCSV('filtered')}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors text-left"
              >
                📊 Download Filtered Data ({filteredData.length} records)
              </button>
              <button
                onClick={() => downloadCSV('courses')}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-left"
              >
                📚 Download All Courses ({courses.length} records)
              </button>
              <button
                onClick={() => downloadCSV('teachers')}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors text-left"
              >
                👥 Download All Teachers ({teachers.length} records)
              </button>
            </div>
          </div>
          
          {/* JSON Downloads */}
          <div>
            <h3 className="text-lg font-semibold mb-3">JSON Format</h3>
            <div className="space-y-2">
              <button
                onClick={() => downloadJSON('filtered')}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors text-left"
              >
                📊 Download Filtered Data (JSON)
              </button>
              <button
                onClick={() => downloadJSON('courses')}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-left"
              >
                📚 Download All Courses (JSON)
              </button>
              <button
                onClick={() => downloadJSON('teachers')}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors text-left"
              >
                👥 Download All Teachers (JSON)
              </button>
              <button
                onClick={() => downloadJSON('all')}
                className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md transition-colors text-left"
              >
                💾 Download Complete Dataset (JSON)
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {dataError && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg">
          {dataError}
        </div>
      )}
    </div>
  );
}