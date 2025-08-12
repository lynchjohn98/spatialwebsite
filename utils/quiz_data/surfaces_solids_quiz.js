export const quizData = {
  id: 5,
  title: "Module 2 Quiz: Surfaces and Solids of Revolution",
  timeLimit: 6000, // 10 minutes, all time limits are in seconds, look at description for multiple-subselect for more detailed information provided.
  description:
    "Review the combination of solids in the images and answer the questions.",
  questions: [
    {
      id: "q1",
      type: "multiple-select",
      text: "Select the letter corresponding to the object or objects that were formed by revolving the wire-frame shape shown on the left about an axis. There may be more than one answer per problem.",
      imageUrl: "/quiz_images/surfaces_solids/surfacesSolids_question1.png",
      points: 1,
      options: [
        { id: "A", text: "A", correct: true },
        { id: "B", text: "B" },
        { id: "C", text: "C", correct: true },
        { id: "D", text: "D" },
      ],
    },
    {
      id: "q2",
      type: "multiple-select",
      text: "Select the letter corresponding to the object or objects that were formed by revolving the wire-frame shape shown on the left about an axis. There may be more than one answer per problem.",
      imageUrl: "/quiz_images/surfaces_solids/surfacesSolids_question2.png",
      points: 1,
      options: [
        { id: "A", text: "A" },
        { id: "B", text: "B" },
        { id: "C", text: "C", correct: true },
        { id: "D", text: "D", correct: true },
      ],
    },
    {
      id: "q3",
      type: "multiple-select",
      text: "Select the letter corresponding to the object or objects that were formed by revolving the wire-frame shape shown on the left about an axis. There may be more than one answer per problem.",
      imageUrl: "/quiz_images/surfaces_solids/surfacesSolids_question3.png",
      points: 1,
      options: [
        { id: "A", text: "A", correct: true },
        { id: "B", text: "B", correct: true },
        { id: "C", text: "C" },
        { id: "D", text: "D", correct: true },
      ],
    },
    {
      id: "q4",
      type: "multiple-select",
      text: "Select the letter corresponding to the object or objects that were formed by revolving the wire-frame shape shown on the left about an axis. There may be more than one answer per problem.",
      imageUrl: "/quiz_images/surfaces_solids/surfacesSolids_question4.png",
      points: 1,
      options: [
        { id: "A", text: "A"},
        { id: "B", text: "B", correct: true },
        { id: "C", text: "C" },
        { id: "D", text: "D"},
      ],
    },
     {
      id: "q5",
      type: "multiple-select",
      text: "Select the letter corresponding to the object or objects that were formed by revolving the wire-frame shape shown on the left about an axis. There may be more than one answer per problem.",
      imageUrl: "/quiz_images/surfaces_solids/surfacesSolids_question5.png",
      points: 1,
      options: [
        { id: "A", text: "A", correct: true },
        { id: "B", text: "B" },
        { id: "C", text: "C" },
        { id: "D", text: "D", correct: true },
      ],
    },
    {
      id: "q6",
      type: "multiple-select",
      text: "Select the letter corresponding to the object or objects that were formed by revolving the wire-frame shape shown on the left about an axis. There may be more than one answer per problem.",
      imageUrl: "/quiz_images/surfaces_solids/surfacesSolids_question6.png",
      points: 1,
      options: [
        { id: "A", text: "A" },
        { id: "B", text: "B" },
        { id: "C", text: "C", correct: true  },
        { id: "D", text: "D", correct: true },
      ],
    },
   {
      id: "q7",
      type: "multiple-subselect",
      text: "Indicate the axis about which the 2-D shape was revolved around to obtain the given solid.",
      imageUrl: "/quiz_images/surfaces_solids/surfacesSolids_question7_a.png",
      points: 3,
      options: [
        { id: "Y", text: "Y" },
        { id: "X", text: "X" },
        { id: "Z", text: "Z" },
        { id: "X2", text: "X2" },
      ],
      parts: [
        {
          id: "part_a",
          label: "The shape was revolved around the { } axis",
          correct: "cut1",
        },
        
      ],
    },


  ],
};