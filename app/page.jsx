"use client";
import { useRouter } from "next/navigation";
import ResponsiveButton from "../components/page_blocks/ResponsiveButton";

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
      <div className="w-full max-w-md sm:max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
          Welcome to Spatial Thinking
        </h1>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-40 h-40 rounded-full overflow-hidden flex items-center justify-center bg-gray-800">
            <img 
              src="/spatialImage.png"
              alt="Spatial Thinking"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="w-full flex flex-col sm:flex-row sm:justify-center gap-4 mb-4">
          <div className="w-full sm:w-1/2">
            <ResponsiveButton 
              label="Join Course As Student" 
              onClick={() => router.push("/student-join")} 
            />
          </div>
          
          <div className="w-full sm:w-1/2">
            <ResponsiveButton 
              label="Join Course as Teacher" 
              onClick={() => router.push("/teacher-join")} 
            />
          </div>
        </div>

        <div className="w-full flex justify-center mb-4">
          <div className="w-full sm:w-2/3">
            <ResponsiveButton 
              label="Create New Course" 
              onClick={() => router.push("/create-course")} 
            />
          </div>
        </div>
   
        <div className="w-full flex justify-center">
          <div className="w-full sm:w-1/3">
            <ResponsiveButton 
              label="Need Help?" 
              onClick={() => router.push("/help")} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}