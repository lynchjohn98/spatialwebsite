"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ResponsiveButton from "../../../components/page_blocks/ResponsiveButton";

export default function TeacherHelpPage() {
  const router = useRouter();

  return (
    <div>
      Hello World
      <h1 className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Help Page</h1>

      <p> What type of questions are on the quizzes?</p>
      <div>
        Before each quiz a brief overview will provide the types of questions the quiz will have.
        <ul>
          <li>Multiple Choice</li>
          <li>Multiple Select</li>
          <li>Text Input</li>
        </ul>
      </div>
    </div>
  );

}
