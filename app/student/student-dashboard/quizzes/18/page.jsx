"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import StudentResponsiveQuiz from "../../../../../components/student_components/StudentResponsiveQuiz";
import { quizData } from "../../../../library/quiz_data/combining_solids_quiz.js";
import { submitStudentQuiz } from "../../../../library/services/student_services/student_quiz"
import { mmq_survey } from "../../../../../app/library/quiz_data/mmq_survey.js";

export default function StudentModuleQuiz() {

    return (
        <h1>
            Being Updated:
        </h1>
    )
}