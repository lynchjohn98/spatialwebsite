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
        { id: "A", text: "A" },
        { id: "B", text: "B", correct: true },
        { id: "C", text: "C" },
        { id: "D", text: "D" },
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
        { id: "C", text: "C", correct: true },
        { id: "D", text: "D", correct: true },
      ],
    },
    {
      id: "q7",
      type: "multiple-parts-subselect",
      text: "Indicate the axis about which the 2-D shape was revolved around to obtain the given solid.",
      points: 4, // Total points for the entire question
      globalOptions: [
        { id: "X", text: "X" },
        { id: "X2", text: "X2" },
        { id: "Y", text: "Y" },
        { id: "Y2", text: "Y2" },
        { id: "Z", text: "Z" },
        { id: "Z2", text: "Z2" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question7_a.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "X",
            }
          ],
        },
        {
          id: "part_b",
          label: "B.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question7_b.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "Z",
            }
          ],
        },
        {
          id: "part_c",
          label: "C.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question7_c.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "Y",
            }
          ],
        },
        {
          id: "part_d",
          label: "D.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question7_d.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "Z",
            }
          ],
        },
      ],
    },
    {
      id: "q8",
      type: "multiple-parts-subselect",
      text: "Indicate the axis about which the 2-D shape was revolved around to obtain the given solid.",
      points: 4, // Total points for the entire question
      globalOptions: [
        { id: "X", text: "X" },
        { id: "X2", text: "X2" },
        { id: "Y", text: "Y" },
        { id: "Y2", text: "Y2" },
        { id: "Z", text: "Z" },
        { id: "Z2", text: "Z2" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question8_a.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "X2",
            }
          ],
        },
        {
          id: "part_b",
          label: "B.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question8_b.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "X",
            }
          ],
        },
        {
          id: "part_c",
          label: "C.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question8_c.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "Z2",
            }
          ],
        },
        {
          id: "part_d",
          label: "D.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question8_d.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "X",
            }
          ],
        },
      ],
    },

    {
      id: "q9",
      type: "multiple-parts-subselect",
      text: "Indicate the axis about which the 2-D shape was revolved around to obtain the given solid.",
      points: 4, // Total points for the entire question
      globalOptions: [
        { id: "X", text: "X" },
        { id: "X2", text: "X2" },
        { id: "Y", text: "Y" },
        { id: "Y2", text: "Y2" },
        { id: "Z", text: "Z" },
        { id: "Z2", text: "Z2" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question9_a.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "Y",
            }
          ],
        },
        {
          id: "part_b",
          label: "B.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question9_b.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "Y2",
            }
          ],
        },
        {
          id: "part_c",
          label: "C.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question9_c.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "Z",
            }
          ],
        },
        {
          id: "part_d",
          label: "D.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question9_d.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "Y2",
            }
          ],
        },
      ],
    },

    {
      id: "q10",
      type: "multiple-parts-subselect",
      text: "Indicate the number of degrees and the axis about which the 2-D shape was revolved around to obtain the given solid.",
      points: 8, // Total points for the entire question
      globalOptions: [
        { id: "X", text: "X" },
        { id: "X2", text: "X2" },
        { id: "Y", text: "Y" },
        { id: "Y2", text: "Y2" },
        { id: "Z", text: "Z" },
        { id: "Z2", text: "Z2" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question10_a.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
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
            "/quiz_images/surfaces_solids/surfacesSolids_question10_b.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
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
            "/quiz_images/surfaces_solids/surfacesSolids_question10_c.png",
         subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
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
            "/quiz_images/surfaces_solids/surfacesSolids_question10_d.png",
         subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
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
      id: "q11",
      type: "multiple-parts-subselect",
      text: "Indicate the number of degrees and the axis about which the 2-D shape was revolved around to obtain the given solid.",
      points: 8, // Total points for the entire question
      globalOptions: [
        { id: "X", text: "X" },
        { id: "X2", text: "X2" },
        { id: "Y", text: "Y" },
        { id: "Y2", text: "Y2" },
        { id: "Z", text: "Z" },
        { id: "Z2", text: "Z2" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question11_a.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
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
              correct: "180"
            }
          ],
        },
        {
          id: "part_b",
          label: "B.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question11_b.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
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
            "/quiz_images/surfaces_solids/surfacesSolids_question11_c.png",
         subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "X",
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
        {
          id: "part_d",
          label: "D.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question11_d.png",
         subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "Y2",
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
              correct: "180"
            }
          ],
        },
      ],
    },

    {
      id: "q12",
      type: "multiple-parts-subselect",
      text: "Indicate the number of degrees and the axis about which the 2-D shape was revolved around to obtain the given solid.",
      points: 8, // Total points for the entire question
      globalOptions: [
        { id: "X", text: "X" },
        { id: "X2", text: "X2" },
        { id: "Y", text: "Y" },
        { id: "Y2", text: "Y2" },
        { id: "Z", text: "Z" },
        { id: "Z2", text: "Z2" },
      ],
      parts: [
        {
          id: "part_a",
          label: "A.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question12_a.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "X",
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
        {
          id: "part_b",
          label: "B.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question12_b.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "Y2",
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
            "/quiz_images/surfaces_solids/surfacesSolids_question12_c.png",
         subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
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
              correct: "90"
            }
          ],
        },
        {
          id: "part_d",
          label: "D.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question12_d.png",
         subQuestions: [
            {
              id: "axis_selection",
              label: "Revolved About Which Axis:",
              type: "dropdown",
              correct: "X",
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
              correct: "180"
            }
          ],
        },
      ],
    },

    {
      id: "q13",
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
            "/quiz_images/surfaces_solids/surfacesSolids_question13_a.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "The Object below corresponds to Shape [ Select ]:",
              type: "dropdown",
              correct: "C",
            },
          ],
        },
        {
          id: "part_b",
          label: "B.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question13_b.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "The Object below corresponds to Shape [ Select ]",
              type: "dropdown",
              correct: "D",
            },
          ],
        },
        {
          id: "part_c",
          label: "C.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question13_c.png",
         subQuestions: [
            {
              id: "axis_selection",
              label: "The Object below corresponds to Shape [ Select ]:",
              type: "dropdown",
              correct: "B",
            },  
          ],
        },     
      ],
    },

    {
      id: "q14",
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
            "/quiz_images/surfaces_solids/surfacesSolids_question14_a.png",
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
            "/quiz_images/surfaces_solids/surfacesSolids_question14_b.png",
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
            "/quiz_images/surfaces_solids/surfacesSolids_question14_c.png",
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

    {
      id: "q15",
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
            "/quiz_images/surfaces_solids/surfacesSolids_question15_a.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "The Object below corresponds to Shape [ Select ]:",
              type: "dropdown",
              correct: "A",
            },
          ],
        },
        {
          id: "part_b",
          label: "B.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question15_b.png",
          subQuestions: [
            {
              id: "axis_selection",
              label: "The Object below corresponds to Shape [ Select ]",
              type: "dropdown",
              correct: "D",
            },
          ],
        },
        {
          id: "part_c",
          label: "C.",
          imageUrl:
            "/quiz_images/surfaces_solids/surfacesSolids_question15_c.png",
         subQuestions: [
            {
              id: "axis_selection",
              label: "The Object below corresponds to Shape [ Select ]:",
              type: "dropdown",
              correct: "C",
            },  
          ],
        },     
      ],
    },
  ],
};
