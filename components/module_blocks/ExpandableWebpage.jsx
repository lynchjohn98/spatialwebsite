// components/ExpandableWebpage.js
"use client";
import { useState, useEffect } from "react";

export default function ExpandableWebpage({
  url,
  title = "External Resource",
  description = "",
  icon = null,
  previewImage = null,
  allowFullscreen = true,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset states when URL changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(false);
  }, [url]);

  // Handle iframe load error
  const handleIframeError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Handle iframe load success
  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Expand to fullscreen
  const handleExpand = () => {
    setIsExpanded(true);
    setIsLoading(true);
    // Prevent body scroll when expanded
    document.body.style.overflow = "hidden";
  };

  // Close fullscreen
  const handleClose = () => {
    setIsExpanded(false);
    setHasError(false);
    setIsLoading(false);
    // Restore body scroll
    document.body.style.overflow = "unset";
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isExpanded) {
        handleClose();
      }
    };

    if (isExpanded) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isExpanded]);

  return (
    <>
      {/* Collapsed State - Button */}
      {!isExpanded && (
        <div className="w-full max-w-full mx-auto">
          <button
            onClick={handleExpand}
            className="w-full p-3 sm:p-4 bg-gray-800/50 border border-gray-600 rounded-lg hover:border-blue-400 hover:bg-gray-700/50 transition-all duration-200 group touch-manipulation"
            style={{ minHeight: "64px" }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                {/* Website Icon/Preview */}
                <div className="relative w-12 h-9 sm:w-16 sm:h-12 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt={`${title} preview`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                      {icon || (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      )}
                    </div>
                  )}

                  {/* External link overlay */}
                  <div className="absolute inset-0 bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Website Info */}
                <div className="text-left min-w-0 flex-1">
                  <h3 className="text-white font-semibold text-sm sm:text-lg group-hover:text-blue-300 transition-colors line-clamp-2 break-words">
                    {title}
                  </h3>
                  {description && (
                    <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2 break-words">
                      {description}
                    </p>
                  )}
                  <p className="text-blue-300 text-xs mt-1 opacity-75">
                    {new URL(url).hostname}
                  </p>
                </div>
              </div>

              {/* Expand Icon */}
              <div className="text-blue-400 group-hover:text-blue-300 transition-colors flex-shrink-0 p-1">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Expanded State - Fullscreen Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Header Bar */}
          <div className="bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex-shrink-0 flex items-center justify-center">
                {icon || (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold text-lg truncate">
                  {title}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                  {new URL(url).hostname}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => window.open(url, "_blank")}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800 flex items-center gap-2"
                title="Open in new tab"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <span className="text-xs font-medium hidden sm:inline">
                  Open in New Tab
                </span>
              </button>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800 flex items-center gap-2"
                title="Close (Esc)"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-xs font-medium hidden sm:inline">
                  Return to Training
                </span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex-1 flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading webpage...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="flex-1 flex items-center justify-center bg-gray-800">
              <div className="text-center max-w-md mx-auto p-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 13.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-xl mb-2">
                  Unable to Load Page
                </h3>
                <p className="text-gray-400 mb-6">
                  This website cannot be embedded. This often happens when sites
                  have security restrictions.
                </p>
                <button
                  onClick={() => window.open(url, "_blank")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Open in New Tab Instead
                </button>
              </div>
            </div>
          )}

          {/* Iframe Content */}
          {!hasError && (
            <div className="flex-1 relative">
              <iframe
                src={url}
                className={`w-full h-full border-0 ${
                  isLoading ? "opacity-0" : "opacity-100"
                } transition-opacity duration-300`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen={allowFullscreen}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .touch-manipulation {
          touch-action: manipulation;
        }

        @media (max-width: 640px) {
          .line-clamp-2 {
            -webkit-line-clamp: 1;
          }
        }
      `}</style>
    </>
  );
}
