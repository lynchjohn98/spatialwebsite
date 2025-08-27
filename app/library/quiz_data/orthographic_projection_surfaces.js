export const quizData = {
  id: 6,
  title: "Module 3 Quiz: Isometric Drawings and Coded Plans",
  timeLimit: 3600, // 10 minutes, all time limits are in seconds, look at description for multiple-subselect for more detailed information provided.
  description:
    "Select the option that best corresponds with the isometric sketch.",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      text: "Select the letter of the isometric sketch that best corresponds to an object with the coded plan shown on the left.",
      imageUrl: "/quiz_images/isometric_plans/isometricCoded_question1.png",
      points: 1,
      options: [
        { id: "A", text: "A", correct: true },
        { id: "B", text: "B" },
        { id: "C", text: "C" },
        { id: "D", text: "D" },
      ],
    },
  ],
}
