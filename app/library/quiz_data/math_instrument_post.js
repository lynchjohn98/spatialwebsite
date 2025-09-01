// This filename
export const quizData = {
  id: 16,
  title: "Math Instrument Post-Test",
  timeLimit: 0, // 10 minutes, all time limits are in seconds
  description: "Assess students' understanding of mathematical concepts.",
  questions: [
    {
      id: "q1",
      type: "text-input",
      text: "Below is a student’s mathematical model of a farmhouse roof with measurements added. The attic floor, ABCD in the model, is a square. The beams that support the roof are the edges of a block (rectangular prism) EFGHKLMN. E is the middle of AT, F is the middle of BT, G is the middle of CT and H is the middle of DT. All the edges of the pyramid in the model have length 12m. Calculate the area of the attic floor ABCD and answer only using digits (e.g. 10, 20), do not include the measurement unit.",
      imageUrl: "/quiz_images/math_instrument/question2.png",
      points: 1,
      correctAnswer: "144",
      alternateAnswers: ["1 4 4", "One Fourty Four", "144"],
    },
    {
      id: "q2",
      type: "text-input",
      text: "Below is a student’s mathematical model of a farmhouse roof with measurements added. The attic floor, ABCD in the model, is a square. The beams that support the roof are the edges of a block (rectangular prism) EFGHKLMN. E is the middle of AT, F is the middle of BT, G is the middle of CT and H is the middle of DT. All the edges of the pyramid in the model have length 12m. Calculate the length of EF, one of the horizontal edges of the block.",
      imageUrl: "/quiz_images/math_instrument/question2.png",
      points: 1,
      correctAnswer: "6",
      alternateAnswers: ["6", "six", " 6 ", "SIX", "Six"],
    },
    {
      id: "q3",
      type: "single-image-multiple-points",
      text: "The total number of dots on two opposite faces is always seven. You can make a simple number cube by cutting, folding, and gluing carboard. This can be done in many ways. In the figure below you can see three cuttings that can be used to make cubes, with dots on the sides. Which of the following shapes can be folded together to form a cube that obeys the rule that the sum of opposite faces is 7? For each shape, select either “Yes” or “No” in the table below.",
      imageUrl: "/quiz_images/math_instrument/question4.png",
      problems: [
        {
          id: "shape1",
          number: "1",
          label: "Shape #1",
          correctAnswer: "No",
        },
        {
          id: "shape2",
          number: "2",
          label: "Shape #2",
          correctAnswer: "Yes",
        },
        {
          id: "shape3",
          number: "3",
          label: "Shape #3",
          correctAnswer: "Yes",
        },
      ],
      answerChoices: [
        { id: "Yes", text: "Yes" },
        { id: "No", text: "No" },
      ],
      points: 3, // Total points for getting all three correct
    },
    {
      id: "q4",
      type: "multiple-choice",
      text: "What is the approximate distance from the starting line to the beginning of the longest straight section of the track?",
      imageUrl: "/quiz_images/math_instrument/question5.png",
      points: 1,
      options: [
        { id: "A", text: "0.5 km"},
        { id: "B", text: "1.5 km", correct: true  },
        { id: "C", text: "2.3 km" },
        { id: "D", text: "2.6 km" },
      ],
    },

    {
      id: "q5",
      type: "multiple-choice",
      text: "Below is a picture of four tracks. Along which one of these tracks was the car driven to produce the speed graph shown above? Select the correct answer.",
      imageUrl: "/quiz_images/math_instrument/question6.png",
      points: 1,
      options: [
        { id: "A", text: "Track A"},
        { id: "B", text: "Track B" , correct: true },
        { id: "C", text: "Track C" },
        { id: "D", text: "Track D" },
      ],
    },

    {
      id: "q6",
      type: "single-image-multiple-points",
      text: "People living in an apartment building decide to buy the building. They will put their money together in such a way that each will pay an amount that is proportional to the size of their apartment. For example, a man living in an apartment that occupies one fifth of the floor area of all apartments will pay one fifth of the total price of the building. Select Correct or Incorrect for each of the following statements",
      problems: [
        {
          id: "statement1",
          number: "1",
          label: "A person living in the largest apartment will pay more money for each square meter of his apartment than the person living in the smallest apartment.",
          correctAnswer: "Incorrect",
        },
        {
          id: "statement2",
          number: "2",
          label: "If we know the areas of two apartments and the price of one of them, we can calculate the price of the second.",
          correctAnswer: "Correct",
        },
        {
          id: "statement3",
          number: "3",
          label: "If we know the price of the building and how much each owner will pay, then the total area of all apartments can be calculated.",
          correctAnswer: "Incorrect",
        },
        {
          id: "statement4",
          number: "4",
          label: "If the total price of the building were reduced by 10%, each of the owners would pay 10% less.",
          correctAnswer: "Correct",
        },
      ],
      answerChoices: [
        { id: "Correct", text: "Correct" },
        { id: "Incorrect", text: "Incorrect" },
      ],
      points: 4, // Total points for getting all three correct
    },

    {
      id: "q7",
      type: "text-input",
      text: "Susan likes to build blocks from small cubes like the one shown in the following diagram. Susan has a lot of small cubes like this one. She uses glue to join cubes together to make other blocks. First, Susan glues eight of the cubes together to make the block shown in Diagram A. Then Susan makes the solid blocks shown in Diagram B and Diagram C below. Susan realizes that she used more small cubes than she really needed to make a block like the one shown in Diagram C. She realizes that she could have glued small cubes together to look like Diagram C, but the block could have been hollow on the inside. What is the minimum number of cubes she needs to make a block that looks like the one shown in Diagram C, but is hollow? Please enter only numbers.",
      imageUrl: "/quiz_images/math_instrument/question7.png",
      points: 1,
      correctAnswer: "26",
      alternateAnswers: ["2 6", "26", "TwentySix", "Twenty Six", "Twenty-Six"],
    },

     {
      id: "q8",
      type: "text-input",
      text: "Now Susan wants to make a block that looks like a solid block that is 6 small cubes long, 5 small cubes wide, and 4 small cubes high. She wants to use the smallest number of cubes possible, by leaving the largest possible hollow space inside the block. What is the minimum number of cubes she needs to make this block? Please enter only numbers.",
      imageUrl: "/quiz_images/math_instrument/question7.png",
      points: 1,
      correctAnswer: "37",
      alternateAnswers: ["96", "Ninety Six", "Ninety-Six", " 9 6 ", "ninetysix"],
    },

  ],
};
