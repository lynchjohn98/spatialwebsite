export const quizData = {
  id: 5,
  title: "Module 2 Quiz: Surfaces and Solids of Revolution",
  timeLimit: 0, // 10 minutes, all time limits are in seconds, look at description for multiple-subselect for more detailed information provided.
  description:
    "Review the combination of solids in the images and answer the questions.",
  questions: [
    {
      id: "q1",
      type: "multiple-select",
      text: "Select the letter corresponding to the object or objects that were formed by revolving the wire-frame shape shown on the left about an axis. There may be more than one answer per problem.",
      imageUrl: "/quiz_images/surfaces_solids/question1.png",
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
      imageUrl: "/quiz_images/surfaces_solids/question2.png",
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
      imageUrl: "/quiz_images/surfaces_solids/question4.png",
      points: 1,
      options: [
        { id: "A", text: "A" },
        { id: "B", text: "B", correct: true },
        { id: "C", text: "C" },
        { id: "D", text: "D" },
      ],
    },
    {
      id: "q4",
      type: "multiple-select",
      text: "Select the letter corresponding to the object or objects that were formed by revolving the wire-frame shape shown on the left about an axis. There may be more than one answer per problem.",
      imageUrl: "/quiz_images/surfaces_solids/question5.png",
      points: 1,
      options: [
        { id: "A", text: "A", correct: true },
        { id: "B", text: "B" },
        { id: "C", text: "C" },
        { id: "D", text: "D", correct: true },
      ],
    },
    {
      id: "q5",
      type: "multiple-parts-subselect",
      text: "Indicate the axis about which the 2-D shape was revolved around to obtain the given solid.",
      points: 4, // Total points for the entire question
      globalOptions: [
   
      ],
      parts: [
        {
          id: "part_a",
          label: "A.",
          imageUrl:
            "/quiz_images/surfaces_solids/question7_a.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              options: [
                { id: "X", text: "X" },
                { id: "X2", text: "X2" },
                { id: "Y", text: "Y" },
                { id: "Z", text: "Z" },
              ],
              correct: "X",
            }
          ],
        },
        {
          id: "part_b",
          label: "B.",
          imageUrl:
            "/quiz_images/surfaces_solids/question7_b.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              options: [
                { id: "X", text: "X" },
                { id: "Y", text: "Y" },
                { id: "Z", text: "Z" },
                { id: "2", text: "Z2" },
              ],
              correct: "Z",
            }
          ],
        },
        {
          id: "part_c",
          label: "C.",
          imageUrl:
            "/quiz_images/surfaces_solids/question7_c.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              options: [
                { id: "X", text: "X" },
                { id: "Y", text: "Y" },
                { id: "Z", text: "Z" },
                { id: "Z2", text: "Z2" },
              ],
              correct: "Y",
            }
          ],
        },
        {
          id: "part_d",
          label: "D.",
          imageUrl:
            "/quiz_images/surfaces_solids/question7_d.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              options: [
                { id: "X", text: "X" },
                { id: "Y", text: "Y" },
                { id: "Z", text: "Z" },
                { id: "Z2", text: "Z2" },
              ],
              correct: "Z",
            }
          ],
        },
      ],
    },
    {
      id: "q6",
      type: "multiple-parts-subselect",
      text: "Indicate the number of degrees and the axis about which the 2-D shape was revolved around to obtain the given solid.",
      points: 8, // Total points for the entire question

      parts: [
        {
          id: "part_a",
          label: "A.",
          imageUrl:
            "/quiz_images/surfaces_solids/question10_a.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              options: [
                { id: "X", text: "X" },
                { id: "X2", text: "X2" },
                { id: "Y", text: "Y" },
                { id: "Z", text: "Z" },
              ],
              correct: "X2",
            },
            {
              id: "degrees_selection",
              label: "Revolved How Many Degrees:",
              type: "dropdown",
              options: [
                { id: "90", text: "90" },
                { id: "180", text: "180" },
                { id: "270", text: "270" },
                { id: "360", text: "360" },
              ],
              correct: "360"
            }
          ],
        },
        {
          id: "part_b",
          label: "B.",
          imageUrl:
            "/quiz_images/surfaces_solids/question10_b.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              options: [
                { id: "X", text: "X" },
                { id: "Y", text: "Y" },
                { id: "Z", text: "Z" },
                { id: "Z2", text: "Z2" },
              ],
              correct: "Z2",
            },
            {
              id: "degrees_selection",
              label: "Revolved How Many Degrees:",
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
        {
          id: "part_c",
          label: "C.",
          imageUrl:
            "/quiz_images/surfaces_solids/question10_c.png",
         subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              options: [
                { id: "X", text: "X" },
                { id: "X2", text: "X2" },
                { id: "Y", text: "Y" },
                { id: "Z", text: "Z" },
              ],
              correct: "X2",
            },
            {
              id: "degrees_selection",
              label: "Revolved How Many Degrees:",
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
        {
          id: "part_d",
          label: "D.",
          imageUrl:
            "/quiz_images/surfaces_solids/question10_d.png",
         subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              options: [
                { id: "X", text: "X" },
                { id: "Y", text: "Y" },
                { id: "Z", text: "Z" },
                { id: "Z2", text: "Z2" },
              ],
              correct: "Z",
            },
            {
              id: "degrees_selection",
              label: "Revolved How Many Degrees:",
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
      id: "q7",
      type: "multiple-parts-subselect",
      text: "Indicate the number of degrees and the axis about which the 2-D shape was revolved around to obtain the given solid.",
      points: 3,
      globalOptions: [
        { id: "A", text: "A" },
        { id: "B", text: "B" },
        { id: "C", text: "C" },
        { id: "D", text: "D" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A.",
          imageUrl:
            "/quiz_images/surfaces_solids/question14_a.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "The Object below corresponds to Shape [ Select ]:",
              type: "dropdown",
              correct: "B",
            },
          ],
        },
        {
          id: "part_b",
          label: "B.",
          imageUrl:
            "/quiz_images/surfaces_solids/question14_b.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "The Object below corresponds to Shape [ Select ]",
              type: "dropdown",
              correct: "A",
            },
          ],
        },
        {
          id: "part_c",
          label: "C.",
          imageUrl:
            "/quiz_images/surfaces_solids/question14_c.png",
         subQuestions: [
            {
              id: "axis_selection",
              label: "The Object below corresponds to Shape [ Select ]:",
              type: "dropdown",
              correct: "D",
            },  
          ],
        },     
      ],
    },
  ],
};
