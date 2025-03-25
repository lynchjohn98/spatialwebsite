export const quizData = {
    "id": 17,
    "description": "A mock quiz to ensure all application settings are working.",
    "questions": [
        {
            id: "q1",
            type: "multiple-choice",
            text: "What fruits are these?",
            imageUrl: "/quiz_images/practice_quiz/problem1.jpg",
            points: 1,
            options: [
              { id: "a", text: "Apples", correct:true },
              { id: "b", text: "Bananas",},
              { id: "c", text: "Oranges" },
              { id: "d", text: "Grapes" }
            ]
          },
          {
            id: "q2",
            type: "multiple-select",
            text: "Select all the colors that match the fur of this cat.",
            imageUrl: "/quiz_images/practice_quiz/problem2.jpg",
            points: 2,
            options: [
              { id: "a", text: "Black", correct: true },
              { id: "b", text: "Orange", correct: true },
              { id: "c", text: "White", correct: true },
              { id: "d", text: "Green", correct: false },
              { id: "e", text: "Blue", correct: false }
            ]
          },
          {
            id: "q3",
            type: "text-input",
            text: "What is the answer to this question? Please type numbers only.",
            imageUrl: "/quiz_images/practice_quiz/problem3.jpg",
            points: 1,
            correctAnswer: "37",
            alternateAnswers: ["3 7", "thiry-seven", "Thirty Seven", "37"]
          }
    ] 
}