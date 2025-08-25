"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

const ResearchConsentTable = forwardRef(({ studentData, researchData, onSave, isSaving }, ref) => {
  const [consentData, setConsentData] = useState({});
  const [showTable, setShowTable] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Initialize consent data from existing research data or create new
    const initialData = {};
    studentData.forEach(student => {
      const username = student.student_username || student.student_join_code;
    
      if (username) {
        // Check both researchData and student's own consent status
        initialData[username] = researchData[username] || {
          consented: student.student_consent || false,
          consent_date: student.consent_date || null,
          notes: student.student_notes || ''
        };
      }
    });
    setConsentData(initialData);
    setHasChanges(false); // Reset changes flag when data is loaded
  }, [studentData, researchData]);

  const updateConsentStatus = (username, field, value) => {
    setConsentData(prev => ({
      ...prev,
      [username]: {
        ...prev[username],
        [field]: value,
        // Auto-set date when consent is marked as provided
        ...(field === 'consented' && value && !prev[username]?.consent_date 
          ? { consent_date: new Date().toISOString().split('T')[0] } 
          : {})
      }
    }));
    setHasChanges(true); // Mark that changes have been made
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getUpdatedData: () => consentData,
    hasUnsavedChanges: () => hasChanges,
    resetChanges: () => setHasChanges(false)
  }));

  const getConsentStats = () => {
    const total = Object.keys(consentData).length;
    const consented = Object.values(consentData).filter(d => d.consented).length;
    return { total, consented };
  };

  const stats = getConsentStats();

  const handleSelectAll = (checked) => {
    const updatedData = {};
    Object.keys(consentData).forEach(username => {
      updatedData[username] = {
        ...consentData[username],
        consented: checked,
        ...(checked && !consentData[username]?.consent_date 
          ? { consent_date: new Date().toISOString().split('T')[0] } 
          : {})
      };
    });
    setConsentData(updatedData);
    setHasChanges(true);
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave(consentData);
      setHasChanges(false);
    }
  };

  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      {/* Header with stats */}
      <div
        className="flex items-center justify-between cursor-pointer text-white text-xl font-semibold bg-gray-700 p-3 rounded-lg transition-all duration-300 mb-3"
        onClick={() => setShowTable(!showTable)}
      >
        <div className="flex items-center gap-4">
          <h2>Student Research Consent Tracking</h2>
          <div className="flex gap-3 text-sm">
            <span className="bg-blue-900/50 px-2 py-1 rounded">
              Total: {stats.total}
            </span>
            <span className="bg-green-900/50 px-2 py-1 rounded">
              Consented: {stats.consented}
            </span>
            <span className="bg-yellow-900/50 px-2 py-1 rounded">
              Pending: {stats.total - stats.consented}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-yellow-400 text-sm animate-pulse">
              Unsaved changes
            </span>
          )}
          <span className="text-2xl transition-transform duration-300 transform">
            {showTable ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* Table */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          showTable ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="overflow-auto max-h-[500px]">
          <table className="table-auto w-full border-collapse border border-gray-600">
            <thead className="bg-gray-700 sticky top-0 z-10">
              <tr>
                <th className="border border-gray-600 px-4 py-2">Student Name</th>
                <th className="border border-gray-600 px-4 py-2">Username</th>
                <th className="border border-gray-600 px-4 py-2 w-32">
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4"
                      title="Select all"
                    />
                    <span>Consent Provided</span>
                  </div>
                </th>
                <th className="border border-gray-600 px-4 py-2">Consent Date</th>
                <th className="border border-gray-600 px-4 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {studentData.length > 0 ? (
                studentData.map((student, index) => {
                  const username = student.student_username || student.student_join_code;
                  const consent = consentData[username] || {};
                  
                  return (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="border border-gray-600 px-4 py-2">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="border border-gray-600 px-4 py-2">
                        <span className="bg-blue-900 px-2 py-1 rounded font-mono text-xs">
                          {username}
                        </span>
                      </td>
                      <td className="border border-gray-600 px-4 py-2 text-center">
                        <button
                          onClick={() => updateConsentStatus(username, 'consented', !consent.consented)}
                          className="text-2xl transition-all hover:scale-110"
                          title="Toggle consent status"
                        >
                          {consent.consented ? (
                            <span className="text-green-500">✅</span>
                          ) : (
                            <span className="text-gray-500">⬜</span>
                          )}
                        </button>
                      </td>
                      <td className="border border-gray-600 px-4 py-2">
                        <input
                          type="date"
                          value={consent.consent_date || ''}
                          onChange={(e) => updateConsentStatus(username, 'consent_date', e.target.value)}
                          className="bg-gray-700 text-white p-1 rounded text-sm w-full"
                        />
                      </td>
                      <td className="border border-gray-600 px-4 py-2">
                        <input
                          type="text"
                          value={consent.notes || ''}
                          onChange={(e) => updateConsentStatus(username, 'notes', e.target.value)}
                          placeholder="Optional notes..."
                          className="bg-gray-700 text-white p-1 rounded text-sm w-full"
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center border border-gray-600 px-4 py-4 text-gray-400">
                    No students found. Please add students in the Settings page first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="mt-3 bg-gray-700 p-3 rounded flex justify-between items-center">
          <div className="text-sm text-gray-300">
            <span className="mr-4">✅ Full Consent: {stats.consented}/{stats.total}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Progress: {stats.total > 0 ? Math.round((stats.consented / stats.total) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Save Button for Table */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSaveClick}
            disabled={isSaving || !hasChanges}
            className={`${
              isSaving 
                ? 'bg-gray-500 cursor-not-allowed' 
                : hasChanges
                  ? 'bg-green-600 hover:bg-green-700 animate-pulse'
                  : 'bg-gray-600 cursor-not-allowed'
            } text-white font-bold py-2 px-6 rounded transition-colors duration-200 flex items-center gap-2 shadow-lg`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                Saving Consent Data...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Save Consent Status
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ResearchConsentTable.displayName = "ResearchConsentTable";
export default ResearchConsentTable;