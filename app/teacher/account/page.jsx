"use client";
import { retrieveTeacherCourse } from "../../services/teacher_actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherAccountPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const courseData = sessionStorage.getItem("courseData");
    if (courseData) {
      setIsAuthorized(true);
    } else {
      router.push("/teacher/join");
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold">Access Denied</h1>
      </div>
    );
  }

  return <TeacherDashboard />;
}