// components/ExpandableVideo.js
"use client"
import { useState } from 'react';

export default function ExpandableVideo({ 
  videoId, 
  title = "Training Video",
  description = "",
  thumbnailUrl = null 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  // Extract video ID from various YouTube URL formats
  const extractVideoId = (url) => {
    if (!url) return videoId;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : videoId;
  };

  const finalVideoId = extractVideoId(videoId);
  const getThumbnailUrl = () => {
    if (thumbnailUrl) return thumbnailUrl;
    if (thumbnailError) return `https://img.youtube.com/vi/${finalVideoId}/hqdefault.jpg`;
    return `https://img.youtube.com/vi/${finalVideoId}/maxresdefault.jpg`;
  };

  const handleThumbnailError = () => {
    setThumbnailError(true);
  };

  return (
    <div className="w-full max-w-full mx-auto">
      {/* Collapsed State - Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full p-3 sm:p-4 bg-gray-800/50 border border-gray-600 rounded-lg hover:border-blue-400 hover:bg-gray-700/50 transition-all duration-200 group touch-manipulation"
          style={{ minHeight: '64px' }} // Ensure minimum touch target
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              {/* Video Thumbnail */}
              <div className="relative w-12 h-9 sm:w-16 sm:h-12 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={getThumbnailUrl()}
                  alt={`${title} thumbnail`}
                  className="w-full h-full object-cover"
                  onError={handleThumbnailError}
                  loading="lazy"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Video Info */}
              <div className="text-left min-w-0 flex-1">
                <h3 className="text-white font-semibold text-sm sm:text-lg group-hover:text-blue-300 transition-colors line-clamp-2 break-words">
                  {title}
                </h3>
                {description && (
                  <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2 break-words">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Expand Icon */}
            <div className="text-blue-400 group-hover:text-blue-300 transition-colors flex-shrink-0 p-1">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>
      )}

      {/* Expanded State - Video */}
      {isExpanded && (
        <div className="bg-gray-800/30 border border-gray-600 rounded-lg overflow-hidden">
          {/* Header with title and close button */}
          <div className="flex items-start justify-between p-3 sm:p-4 border-b border-gray-600 gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-semibold text-base sm:text-lg break-words">{title}</h3>
              {description && (
                <p className="text-gray-400 text-xs sm:text-sm mt-1 break-words">{description}</p>
              )}
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white transition-colors p-2 -m-1 flex-shrink-0 touch-manipulation"
              title="Close video"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* YouTube Video Embed - Responsive */}
          <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${finalVideoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
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
    </div>
  );
}