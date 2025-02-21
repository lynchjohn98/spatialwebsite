
import HomepageStudentButton from "../components/HomepageStudentButton";
import HomepageCreateCourseButton from "../components/HomepageCreateCourseButton";
import HomepageTeacherButton from "../components/HomepageTeacherButton";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black">
      <h1>Welcome to Spatial Learning</h1>
      <div className="flex flex-row items-center justify-center">
        <HomepageCreateCourseButton/>
        <HomepageStudentButton/>
        <HomepageTeacherButton/>
      </div>
    </div>
  );
}


