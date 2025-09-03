export const quizData = {
  id: 6,
  title: "Module 3 Quiz: Isometric Drawings and Coded Plans",
  timeLimit: 0, // 10 minutes, all time limits are in seconds, look at description for multiple-subselect for more detailed information provided.
  description:
    "Select the option that best corresponds with the isometric sketch.",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      text: "Select the letter of the isometric sketch that best corresponds to an object with the coded plan shown on the left.",
      imageUrl: "/quiz_images/isometric_plans/question1.png",
      points: 1,
      options: [
        { id: "A", text: "A", correct: true },
        { id: "B", text: "B" },
        { id: "C", text: "C" },
        { id: "D", text: "D" },
      ],
    },
    {
      id: "q2",
      type: "multiple-choice",
      text: "Select the letter of the isometric sketch that best corresponds to an object with the coded plan shown on the left.",
      imageUrl: "/quiz_images/isometric_plans/question2.png",
      points: 1,
      options: [
        { id: "A", text: "A" },
        { id: "B", text: "B" },
        { id: "C", text: "C", correct: true },
        { id: "D", text: "D" },
      ],
    },
    {
      id: "q3",
      type: "multiple-choice",
      text: "Select the letter of the isometric sketch that best corresponds to an object with the coded plan shown on the left.",
      imageUrl: "/quiz_images/isometric_plans/question3.png",
      points: 1,
      options: [
        { id: "A", text: "A" },
        { id: "B", text: "B" },
        { id: "C", text: "C" },
        { id: "D", text: "D", correct: true },
      ],
    },
    {
      id: "q4",
      type: "single-image-multiple-points",
      text: "Select the letter of the isometric sketch that best corresponds to an object with:",
      imageUrl: "/quiz_images/isometric_plans/question4.png",
      problems: [
        {
          id: "row1",
          number: "1",
          label: "coded plan #1",
          correctAnswer: "B"
        },
        {
          id: "row2", 
          number: "2",
          label: "coded plan #2",
          correctAnswer: "D"
        },
        {
          id: "row3",
          number: "3",
          label: "coded plan #3",
          correctAnswer: "A"
        }
      ],
      answerChoices: [
        { id: "A", text: "A" },
        { id: "B", text: "B" },
        { id: "C", text: "C" },
        { id: "D", text: "D" }
      ],
      points: 3  // Total points for getting all three correct
    },
    {
      id: "q5",
      type: "single-image-multiple-points",
      text: "Select the letter of the isometric sketch that best corresponds to an object with:",
      imageUrl: "/quiz_images/isometric_plans/question5.png",
      problems: [
        {
          id: "row1",
          number: "1",
          label: "coded plan #1",
          correctAnswer: "BC"
        },
        {
          id: "row2", 
          number: "2",
          label: "coded plan #2",
          correctAnswer: "D"
        },
        {
          id: "row3",
          number: "3",
          label: "coded plan #3",
          correctAnswer: "A"
        }
      ],
      answerChoices: [
        { id: "A", text: "A" },
        { id: "B", text: "B" },
        { id: "C", text: "C" },
        { id: "D", text: "D" }
      ],
      points: 3  // Total points for getting all three correct
    },
    {
      id: "q6",
      type: "single-image-multiple-points",
      text: "Select the letter of the isometric sketch that best corresponds to an object with:",
      imageUrl: "/quiz_images/isometric_plans/question6.png",
      problems: [
        {
          id: "isometric1",
          number: "1",
          label: "Isometric View #1",
          correctAnswer: "Y"
        },
        {
          id: "isometric2",
          number: "2",
          label: "Isometric View #2",
          correctAnswer: "Y"
        },
        {
          id: "isometric3",
          number: "3",
          label: "Isometric View #3",
          correctAnswer: "X"
        },
        {
          id: "isometric4",
          number: "4",
          label: "Isometric View #4",
          correctAnswer: "X"
        },
        {
          id: "isometric5",
          number: "5",
          label: "Isometric View #5",
          correctAnswer: "Y"
        },
        {
          id: "isometric6",
          number: "6",
          label: "Isometric View #6",
          correctAnswer: "Z"
        }
      ],
      answerChoices: [
        { id: "W", text: "W" },
        { id: "X", text: "X" },
        { id: "Y", text: "Y" },
        { id: "Z", text: "Z" }
      ],
      points: 6  // Total points for getting all three correct
    },
    {
      id: "q7",
      type: "single-image-multiple-points",
      text: "Select the letter of the isometric sketch that best corresponds to an object with:",
      imageUrl: "/quiz_images/isometric_plans/question7.png",
      problems: [
        {
          id: "isometric1",
          number: "1",
          label: "Isometric View #1",
          correctAnswer: "X"
        },
        {
          id: "isometric2",
          number: "2",
          label: "Isometric View #2",
          correctAnswer: "X"
        },
        {
          id: "isometric3",
          number: "3",
          label: "Isometric View #3",
          correctAnswer: "Z"
        },
        {
          id: "isometric4",
          number: "4",
          label: "Isometric View #4",
          correctAnswer: "X"
        },
        {
          id: "isometric5",
          number: "5",
          label: "Isometric View #5",
          correctAnswer: "X"
        },
        {
          id: "isometric6",
          number: "6",
          label: "Isometric View #6",
          correctAnswer: "Z"
        }
      ],
      answerChoices: [
        { id: "W", text: "W" },
        { id: "X", text: "X" },
        { id: "Y", text: "Y" },
        { id: "Z", text: "Z" }
      ],
      points: 6  // Total points for getting all three correct
    },
    
    
  ],
};
