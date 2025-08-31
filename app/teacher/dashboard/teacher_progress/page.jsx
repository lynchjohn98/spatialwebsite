"use client";
import { useState, useEffect, Fragment, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/teacher_components/TeacherSidebar";
import { fetchAllStudentCourseProgress } from "../../../library/services/teacher_services/student_progress";
import { ChevronDown, ChevronRight, Check, X, Clock, Award, Download, RefreshCw, Eye, BookOpen, FileText, Monitor } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";


export default function TeacherProgressPage() {

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Teacher Progress</h1>
                {/* Add content here */}
            </main>
        </div>
    );
}
