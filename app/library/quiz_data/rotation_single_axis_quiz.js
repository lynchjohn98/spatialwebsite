export const quizData = {
  id: 8,
  title: "Module 5 Quiz: Rotation of Objects About a Single Axis",
  timeLimit: 0, // 10 minutes, all time limits are in seconds, look at description for multiple-subselect for more detailed information provided.
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
      points: 4   // Total points for getting all three correct
    },
    {
      id: "q2",
      type: "multiple-parts-subselect",
      imageUrl: "/quiz_images/rotation_objects_single_axis/question3.png",
      text: "Indicate the number of degrees and the axis about which the 2-D shape was revolved around to obtain the given solid.",
      points: 2, // Total points for the entire question
      globalOptions: [
        { id: "+X", text: "+X" },
        { id: "+Y", text: "+Y" },
        { id: "+Z", text: "+Z" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A.",
          imageUrl:
            "/quiz_images/rotation_objects_single_axis/positives.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Axis of Rotation:",
              type: "dropdown",
              correct: "+Z",
            },
            {
              id: "degrees_selection",
              label: "Amount of Rotation:",
              type: "dropdown",
              options: [
                { id: "90", text: "90" },
                { id: "180", text: "180" },
                { id: "270", text: "270" },
                { id: "360", text: "360" },
              ],
              correct: "180"
            }
          ],
        },
        
      ],
    },
    {
      id: "q3",
      type: "multiple-parts-subselect",
      imageUrl: "/quiz_images/rotation_objects_single_axis/question6.png",
      text: "Indicate the number of degrees and the axis about which the 2-D shape was revolved around to obtain the given solid.",
      points: 2, // Total points for the entire question
      globalOptions: [
        { id: "+X", text: "+X" },
        { id: "+Y", text: "+Y" },
        { id: "+Z", text: "+Z" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A.",
          imageUrl:
            "/quiz_images/rotation_objects_single_axis/positives.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Axis of Rotation:",
              type: "dropdown",
              correct: "+X",
            },
            {
              id: "degrees_selection",
              label: "Amount of Rotation:",
              type: "dropdown",
              options: [
                { id: "90", text: "90" },
                { id: "180", text: "180" },
                { id: "270", text: "270" },
                { id: "360", text: "360" },
              ],
              correct: "270"
            }
          ],
        },
        
      ],
    },
    {
      id: "q4",
      type: "multiple-parts-subselect",
      imageUrl: "/quiz_images/rotation_objects_single_axis/question10.png",
      text: "Indicate the number of degrees and the axis about which the 2-D shape was revolved around to obtain the given solid.",
      points: 2, // Total points for the entire question
      globalOptions: [
        { id: "+X", text: "+X" },
        { id: "+Y", text: "+Y" },
        { id: "+Z", text: "+Z" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A.",
          imageUrl:
            "/quiz_images/rotation_objects_single_axis/positives.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Axis of Rotation:",
              type: "dropdown",
              correct: "+Z",
            },
            {
              id: "degrees_selection",
              label: "Amount of Rotation:",
              type: "dropdown",
              options: [
                { id: "90", text: "90" },
                { id: "180", text: "180" },
                { id: "270", text: "270" },
                { id: "360", text: "360" },
              ],
              correct: "90"
            }
          ],
        },
        
      ],
    },
    {
      id: "q5",
      type: "multiple-parts-subselect",
      imageUrl: "/quiz_images/rotation_objects_single_axis/question12.png",
      text: "The figure below shows an object that has been rotated by the given amount. Indicate an equivalent rotation that would produce the same image.",
      points: 2, // Total points for the entire question
      globalOptions: [
        { id: "+X", text: "+X" },
        { id: "+Y", text: "+Y" },
        { id: "+Z", text: "+Z" },
        { id: "-X", text: "-X" },
        { id: "-Y", text: "-Y" },
        { id: "-Z", text: "-Z" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A.",
          imageUrl:
            "/quiz_images/rotation_objects_single_axis/positives-negatives.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Axis of Rotation:",
              type: "dropdown",
              correct: "+Z",
            },
            {
              id: "degrees_selection",
              label: "Amount of Rotation:",
              type: "dropdown",
              options: [
                { id: "90", text: "90" },
                { id: "180", text: "180" },
                { id: "270", text: "270" },
  
              ],
              correct: "270"
            }
          ],
        },
        
      ],
    },
    {
      id: "q6",
      type: "multiple-parts-subselect",
      imageUrl: "/quiz_images/rotation_objects_single_axis/question14.png",
      text: "The figure below shows an object that has been rotated by the given amount. Indicate an equivalent rotation that would produce the same image.",
      points: 2, // Total points for the entire question
      globalOptions: [
        { id: "+X", text: "+X" },
        { id: "+Y", text: "+Y" },
        { id: "+Z", text: "+Z" },
        { id: "-X", text: "-X" },
        { id: "-Y", text: "-Y" },
        { id: "-Z", text: "-Z" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A.",
          imageUrl:
            "/quiz_images/rotation_objects_single_axis/positives-negatives.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Axis of Rotation:",
              type: "dropdown",
              correct: "+X",
            },
            {
              id: "degrees_selection",
              label: "Amount of Rotation:",
              type: "dropdown",
              options: [
                { id: "90", text: "90" },
                { id: "180", text: "180" },
                { id: "270", text: "270" },
  
              ],
              correct: "180"
            }
          ],
        },
        
      ],
    },
    {
      id: "q7",
      type: "multiple-parts-subselect",
      imageUrl: "/quiz_images/rotation_objects_single_axis/question17.png",
      text: "The figure below shows an object that has been rotated by the given amount. Indicate an equivalent rotation that would produce the same image.",
      points: 2, // Total points for the entire question
      globalOptions: [
        { id: "+X", text: "+X" },
        { id: "+Y", text: "+Y" },
        { id: "+Z", text: "+Z" },
        { id: "-X", text: "-X" },
        { id: "-Y", text: "-Y" },
        { id: "-Z", text: "-Z" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A.",
          imageUrl:
            "/quiz_images/rotation_objects_single_axis/positives-negatives.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Axis of Rotation:",
              type: "dropdown",
              correct: "-Y",
            },
            {
              id: "degrees_selection",
              label: "Amount of Rotation:",
              type: "dropdown",
              options: [
                { id: "90", text: "90" },
                { id: "180", text: "180" },
                { id: "270", text: "270" },
  
              ],
              correct: "90"
            }
          ],
        },
        
      ],
    },
  ],
}
