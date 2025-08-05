"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TrainingCard from "../../../components/teacher_components/TrainingCard";
import ResponsiveButton from "../../../components/page_blocks/ResponsiveButton";
import { getTeacherData } from "../../services/teacher_actions";


export default function TeacherTraining() {

  const router = useRouter();
  const [teacherData, setTeacherData] = useState(null);
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const storedData = JSON.parse(sessionStorage.getItem("teacherData"));
        if (!storedData?.id) {
          console.error("No teacher ID found in sessionStorage");
          setIsLoading(false);
          return;
        }
        const result = await getTeacherData(storedData);
        if (result.success && result.data) {
          const freshData = result.data;
          setTeacherData(freshData);
          sessionStorage.setItem("teacherData", JSON.stringify(freshData));
        } else {
          setTeacherData(storedData);
        }
      } catch (error) {
        console.error("Error loading teacher data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeacherData();
  }, []);

    if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">
        Spatial Thinking Teacher Training{" "}
      </h1>
       <div className="text-center mb-6">
          <p className="text-lg mb-2">
            Welcome, {teacherData?.username || "Guest"}!
          </p>
        </div>
      <div className="w-full flex flex-col sm:flex-row sm:justify-center gap-4 mb-4">
        
        <ul className="space-y-2 mb-4">
          <TrainingCard
            moduleId="pretest"
            title="PSVTR Pre-Test: Assessing Your Spatial Skills"
            description="Purdue Spatial Visualization Pre-Test. Must complete before accessing other course content."
            isCompleted={teacherData?.pretest_complete || false}
            estimatedTime="20 minutes"
            href="/teacher/training/quizzes/psvtr_pretest"
          />
          <TrainingCard
            moduleId="premodule"
            title="Pre-Module: The Importance of Spatial Skills"
            description="An introduction to the significance of spatial skills."
            isCompleted={teacherData?.premodule_training || false}
            href="/teacher/training/premodule"
          />
          <TrainingCard
            moduleId="module1"
            title="Module 1 - Combining solids"
            description="Learn how 3D shapes can be combined to form a single object."
            isCompleted={teacherData?.module1_training || false}
            href="/teacher/training/module1"
          />
          <TrainingCard
            moduleId="module2"
            title="Module 2 - Surfaces and solids of Revolution"
            description="Learn how 2D shapes can be revolved around an axis to form a 3D solid."
            isCompleted={teacherData?.module2_training || false}
            href="/teacher/training/module2"
          />
          <TrainingCard
            moduleId="posttest"
            title="Post-Test: Assessing Your Spatial Skills"
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
