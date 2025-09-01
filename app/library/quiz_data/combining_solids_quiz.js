export const quizData = {
  id: 4,
  title: "Module 1 Quiz: Combining Solids",
  timeLimit: 0, // 10 minutes, all time limits are in seconds, look at description for multiple-subselect for more detailed information provided.
  description:
    "Review the combination of solids in the images and answer the questions.",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      text: "The objects on the left are to be combined, with the result shown on the right. Select the letter that corresponds to the operation that was performed.",
      imageUrl: "/quiz_images/combining_solids/question1.png",
      points: 1,
      options: [
        { id: "cut", text: "Cut", correct: true },
        { id: "join", text: "Join" },
        { id: "intersect", text: "Intersect" },
      ],
    },
    {
      id: "q2",
      type: "multiple-choice",
      text: "The objects on the left are to be combined, with the result shown on the right. Select the letter that corresponds to the operation that was performed.",
      imageUrl: "/quiz_images/combining_solids/question6.png",
      points: 1,
      options: [
        { id: "cut", text: "Cut" },
        { id: "join", text: "Join", correct: true },
        { id: "intersect", text: "Intersect" },
      ],
    },
    {
      id: "q3",
      type: "multiple-choice",
      text: "The objects on the left are to be combined, with the result shown on the right. Select the letter that corresponds to the operation that was performed.",
      imageUrl: "/quiz_images/combining_solids/question8.png",
      points: 1,
      options: [
        { id: "cut", text: "Cut" },
        { id: "join", text: "Join" },
        { id: "intersect", text: "Intersect", correct: true },
      ],
    },
    {
      id: "q4",
      type: "multiple-subselect",
      text: "For the two overlapping objects shown on the left below, select the combining operation that was performed to obtain each of the three objects shown on the right.",
      imageUrl: "/quiz_images/combining_solids/question12.png",
      points: 3,
      options: [
        { id: "cut1", text: "Object 1 cuts Object 2" },
        { id: "cut2", text: "Object 2 cuts Object 1" },
        { id: "join", text: "Join" },
        { id: "intersect", text: "Intersect" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A",
          //description: "First result",
          correct: "cut2",
        },
        {
          id: "part_b",
          label: "B",
          correct: "intersect",
        },
        {
          id: "part_c",
          label: "C",
          correct: "join",
        },
      ],
    },
    {
      id: "q5",
      type: "multiple-subselect",
      text: "For the two overlapping objects shown on the left below, select the combining operation that was performed to obtain each of the three objects shown on the right.",
      imageUrl: "/quiz_images/combining_solids/question14.png",
      points: 3,
      options: [
        { id: "cut1", text: "Object 1 cuts Object 2" },
        { id: "cut2", text: "Object 2 cuts Object 1" },
        { id: "join", text: "Join" },
        { id: "intersect", text: "Intersect" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A",
          //description: "First result",
          correct: "cut2",
        },
        {
          id: "part_b",
          label: "B",
          correct: "intersect",
        },
        {
          id: "part_c",
          label: "C",
          correct: "join",
        },
      ],
    },

    {
      id: "q6",
      type: "multiple-subselect",
      text: "For the two overlapping objects shown on the left below, select the combining operation that was performed to obtain each of the three objects shown on the right.",
      imageUrl: "/quiz_images/combining_solids/question15.png",
      points: 3,
      options: [
        { id: "cut1", text: "Object 1 cuts Object 2" },
        { id: "cut2", text: "Object 2 cuts Object 1" },
        { id: "join", text: "Join" },
        { id: "intersect", text: "Intersect" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A",
          //description: "First result",
          correct: "intersect",
        },
        {
          id: "part_b",
          label: "B",
          correct: "join",
        },
        {
          id: "part_c",
          label: "C",
          correct: "cut1",
        },
      ],
    },
    {
      id: "q7",
      type: "multiple-choice",
      text: "For the two overlapping objects shown on the left, select the letter corresponding to the correct volume of interference.",
      imageUrl: "/quiz_images/combining_solids/question17.png",
      points: 1,
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C", correct: true },
        { id: "d", text: "D" },
      ],
    },
    {
      id: "q8",
      type: "multiple-choice",
      text: "For the two overlapping objects shown on the left, select the letter corresponding to the correct volume of interference.",
      imageUrl: "/quiz_images/combining_solids/question19.png",
      points: 1,
      options: [
        { id: "a", text: "A", correct: true },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" },
      ],
    },
    {
      id: "q9",
      type: "multiple-choice",
      text: "For the two overlapping objects shown on the left, select the letter corresponding to the correct volume of interference.",
      imageUrl: "/quiz_images/combining_solids/question22.png",
      points: 1,
      options: [
        { id: "a", text: "A", correct: true },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" },
      ],
    },
    {
      id: "q10",
      type: "multiple-choice",
      text: "For the two overlapping objects shown on the left, select the letter corresponding to the correct volume of interference.",
      imageUrl: "/quiz_images/combining_solids/question23.png",
      points: 1,
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D", correct: true },
      ],
    },

    {
      id: "q11",
      type: "multiple-choice",
      text: "For the two overlapping objects shown on the left, select the letter corresponding to the correct volume of interference.",
      imageUrl: "/quiz_images/combining_solids/question24.png",
      points: 1,
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B", correct: true },
        { id: "c", text: "C" },
        { id: "d", text: "D" },
      ],
    },

    {
      id: "q12",
      type: "multiple-choice",
      text: "For the two overlapping objects shown on the left, select the letter corresponding to the correct volume of interference.",
      imageUrl: "/quiz_images/combining_solids/question25.png",
      points: 1,
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D", correct: true },
      ],
    },
  ],
};
