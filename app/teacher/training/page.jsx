"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TrainingCard from "../../../components/teacher_components/TrainingCard";
import ResponsiveButton from "../../../components/page_blocks/ResponsiveButton";
export default function TeacherTraining() {
  const router = useRouter();
  const [teacherData, setTeacherData] = useState(null);
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem("teacherData");
      console.log(storedData);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setTeacherData(parsedData);
        setTrainingCompleted(parsedData?.training_complete || false);
      }
    } catch (error) {
      console.error("Error parsing teacher data from sessionStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">
        Spatial Thinking Teacher Training{" "}
      </h1>
       <div className="text-center mb-6">
          <p className="text-lg mb-2">
            Welcome, {teacherData?.username || "Guest"}!
            {teacherData?.id}
          </p>
          <p className="text-sm text-gray-300">
            Complete each module and submit your scores at the end.
          </p>
        </div>
      <div className="w-full flex flex-col sm:flex-row sm:justify-center gap-4 mb-4">
        
        <ul className="space-y-2 mb-4">
          <TrainingCard
            moduleId="pretest"
            title="Pre-Test: Assessing Your Spatial Skills"
            description="A quick assessment to gauge your current spatial skills."
            isCompleted={teacherData?.pretest_complete || false}
            estimatedTime="20 minutes"
            href="/teacher/training/quizzes/pretest"
          />
          <TrainingCard
            moduleId="premodule"
            title="Pre-Module: The Importance of Spatial Skills"
            description="An introduction to the significance of spatial skills."
            isCompleted={teacherData?.premodule_training || false}
            estimatedTime="5 minutes"
            href="/teacher/training/premodule"
          />
          <TrainingCard
            moduleId="module1"
            title="Module 1 - Combining solids"
            description="Learn how 3D shapes can be combined to form a single object."
            isCompleted={teacherData?.module1_training || false}
            estimatedTime="5 minutes"
            href="/teacher/training/module1"
          />
          <TrainingCard
            moduleId="module2"
            title="Module 2 - Surfaces and solids of Revolution"
            description="Learn how 2D shapes can be revolved around an axis to form a 3D solid."
            isCompleted={teacherData?.module2_training || false}
            estimatedTime="5 minutes"
            href="/teacher/training/module2"
          />
          <TrainingCard
            moduleId="posttest"
            title="Pre-Test: Assessing Your Spatial Skills"
            description="A quick assessment to gauge your current spatial skills."
            isCompleted={teacherData?.posttest || false}
            estimatedTime="20 minutes"
            href="/teacher/training/quizzes/pretest"
          />
        </ul>
      </div>
    </div>
  );
}
