"use client";
import { useState } from "react";

export default function TrainingWarningModal({ incompleteModules, onClose, onProceed }) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-yellow-400">
            ⚠️ Incomplete Training Modules Detected
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-white mb-3">
            You are attempting to make the following modules visible to students, but you haven't completed all required training components:
          </p>
        </div>

        {/* Scrollable area for module list */}
        <div className="flex-1 overflow-y-auto mb-4 max-h-[300px]">
          <div className="space-y-3">
            {incompleteModules.map((module, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-blue-400 mb-2">
                  📚 {module.moduleName}
                </h3>
                <p className="text-sm text-gray-300 mb-2">
                  Missing training components:
                </p>
                <ul className="list-disc list-inside text-red-400 text-sm space-y-1">
                  {module.incompleteItems.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-600 pt-4">
          <div className="mb-4">
            <label className="flex items-center text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mr-2 w-4 h-4"
              />
              I understand and want to make the modules visible to students.
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
              Go Back & Complete Training
            </button>
            <button
              onClick={onProceed}
              disabled={!acknowledged}
              className={`${
                acknowledged
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-gray-500 cursor-not-allowed'
              } text-white font-bold py-2 px-4 rounded transition-colors duration-200`}
            >
              Proceed Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}