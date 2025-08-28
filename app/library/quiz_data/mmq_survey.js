import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// Sample survey data structure
export const surveyData = {
  id: "survey-1",
  title: "Employee Satisfaction Survey",
  description: "Please rate your experience and provide feedback",
  timeLimit: 1200, // 20 minutes in seconds
  sections: [
    {
      id: "section-1",
      title: "Work Environment",
      questions: [
        {
          id: "q1",
          type: "likert",
          text: "I feel comfortable in my physical workspace",
          required: true,
        },
        {
          id: "q2",
          type: "likert",
          text: "The office equipment meets my needs",
          required: true,
        },
        {
          id: "q3",
          type: "likert",
          text: "I have access to the resources I need to do my job effectively",
          required: true,
        },
      ],
    },
    {
      id: "section-2",
      title: "Team Collaboration",
      questions: [
        {
          id: "q4",
          type: "likert",
          text: "I feel supported by my team members",
          required: true,
        },
        {
          id: "q5",
          type: "likert",
          text: "Communication within the team is effective",
          required: true,
        },
        {
          id: "q6",
          type: "likert",
          text: "Team meetings are productive and valuable",
          required: false,
        },
      ],
    },
    {
      id: "section-3",
      title: "Management & Leadership",
      questions: [
        {
          id: "q7",
          type: "likert",
          text: "My manager provides clear direction and expectations",
          required: true,
        },
        {
          id: "q8",
          type: "likert",
          text: "I receive regular and constructive feedback",
          required: true,
        },
        {
          id: "q9",
          type: "likert",
          text: "Leadership is transparent about company decisions",
          required: true,
        },
      ],
    },
    {
      id: "section-4",
      title: "Additional Feedback",
      questions: [
        {
          id: "q10",
          type: "text-area",
          text: "What do you enjoy most about working here?",
          required: false,
        },
        {
          id: "q11",
          type: "text-area",
          text: "What improvements would you suggest?",
          required: false,
        },
      ],
    },
  ],
  likertScale: [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Disagree" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Agree" },
    { value: 5, label: "Strongly Agree" },
  ],
};