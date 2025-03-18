export const quizData = {
    "id": 17,
    "description": "A mock quiz to ensure all application settings are working.",
    "questions": [
        {
            id: "q1",
            type: "multiple-choice",
            text: "Which statement best describes volumetric intersection?",
            imageUrl: "/quiz-images/quiz1/q1.svg",
            points: 5,
            options: [
              { id: "a", text: "The total volume when two solids are placed side by side" },
              { id: "b", text: "The volume shared by two overlapping solids", correct: true },
              { id: "c", text: "The volume remaining after one solid is subtracted from another" },
              { id: "d", text: "The volume created when one solid is rotated" }
            ]
          },
          {
            id: "q2",
            type: "multiple-select",
            text: "Select all operations that can be used to combine solids:",
            imageUrl: "/quiz-images/quiz1/q2.svg",
            points: 10,
            options: [
              { id: "a", text: "Union", correct: true },
              { id: "b", text: "Intersection", correct: true },
              { id: "c", text: "Subtraction", correct: true },
              { id: "d", text: "Rotation", correct: false },
              { id: "e", text: "Reflection", correct: false }
            ]
          },
          {
            id: "q3",
            type: "text-input",
            text: "What is the formula for calculating the volume of a cube with side length s?",
            imageUrl: "/quiz-images/quiz1/q3.svg",
            points: 5,
            correctAnswer: "s^3",
            alternateAnswers: ["s*s*s", "s³", "s cubed", "s**3"]
          }
    ] 
}