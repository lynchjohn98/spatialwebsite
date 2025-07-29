// TrainingCard.js
"use client"
import { useRouter } from "next/navigation";

export default function TrainingCard({ 
  moduleId, 
  title, 
  description, 
  isCompleted = false,
  estimatedTime,
  href 
}) {
  const router = useRouter();

  return (
    <div 
      className={`
        relative p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02]
        ${isCompleted 
          ? 'bg-green-900/30 border-green-500 shadow-md shadow-green-500/10' 
          : 'bg-gray-800/50 border-gray-600 hover:border-blue-400 hover:bg-gray-700/50'
        }
      `}
      onClick={() => router.push(href)}
    >
      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <div className="bg-green-500 rounded-full p-1.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      <div className="pr-6">
        <h3 className={`text-lg font-semibold mb-1 ${isCompleted ? 'text-green-300' : 'text-white'}`}>
          {title}
        </h3>
        
        <p className={`text-sm mb-2 leading-relaxed ${isCompleted ? 'text-green-200/90' : 'text-gray-300'}`}>
          {description}
        </p>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center text-gray-400">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {estimatedTime}
          </div>
          
          <span className={`font-medium ${isCompleted ? 'text-green-400' : 'text-blue-400'}`}>
            {isCompleted ? '✓ Complete' : 'Start →'}
          </span>
        </div>
      </div>
    </div>
  );
}
