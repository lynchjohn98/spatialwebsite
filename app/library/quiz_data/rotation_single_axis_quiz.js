export const quizData = {
  id: 8,
  title: "Module 5 Quiz: Rotation of Objects About a Single Axis",
  timeLimit: 3600, // 10 minutes, all time limits are in seconds, look at description for multiple-subselect for more detailed information provided.
  description:
    "Check your understanding on concepts from Module 5.",
  questions: [
    {
      id: "q1",
      type: "single-image-multiple-points",
      text: "The objects shown below have been rotated positively about the given axis. In the space provided, indicate the amount of rotation (either 90°, 180°, or 270°) for:",
      imageUrl: "/quiz_images/rotation_objects_single_axis/question1.png",
      problems: [
        {
          id: "rotation1",
          number: "1",
          label: "Rotation #1",
          correctAnswer: "270"
        },
        {
          id: "rotation2", 
          number: "2",
          label: "Rotation #2",
          correctAnswer: "180"
        },
        {
          id: "rotation3",
          number: "3",
          label: "Rotation #3",
          correctAnswer: "180"
        },
         {
          id: "rotation4",
          number: "4",
          label: "Rotation #4",
          correctAnswer: "270"
        },

      ],
      answerChoices: [
        { id: "90", text: "90°" },
        { id: "180", text: "180°" },
        { id: "270", text: "270°" },

      ],
      points: 3  // Total points for getting all three correct
    },
  ],
}
