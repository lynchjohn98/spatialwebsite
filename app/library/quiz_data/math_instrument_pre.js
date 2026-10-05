// Maths problem-solving test for DST study, 2026-27
export const quizData = {
  id: 3,
  title: "Maths Problem-Solving Test",
  timeLimit: 0, // 0 = no time limit; all time limits are in seconds
  description: "Assess students' understanding of mathematical concepts.",
  questions: [
    // ---------- Farmhouse (question1.png) ----------
    {
      id: "q1",
      type: "multiple-choice",
      text: "Below is a student’s mathematical model of a farmhouse roof with measurements added. The attic floor, ABCD in the model, is a square. The beams that support the roof are the edges of a block (rectangular prism) EFGHKLMN. E is the middle of AT, F is the middle of BT, G is the middle of CT and H is the middle of DT. All the edges of the pyramid in the model have length 12m. Calculate the area of the attic floor ABCD.",
      imageUrl: "/quiz_images/math_instrument/question1.png",
      points: 1,
      options: [
        { id: "A", text: "24 m²" },
        { id: "B", text: "36 m²" },
        { id: "C", text: "48 m²" },
        { id: "D", text: "124 m²" },
        { id: "E", text: "144 m²", correct: true },
      ],
    },
    {
      id: "q2",
      type: "multiple-choice",
      text: "Below is a student’s mathematical model of a farmhouse roof with measurements added. The attic floor, ABCD in the model, is a square. The beams that support the roof are the edges of a block (rectangular prism) EFGHKLMN. E is the middle of AT, F is the middle of BT, G is the middle of CT and H is the middle of DT. All the edges of the pyramid in the model have length 12m. Calculate the length of EF, one of the horizontal edges of the block.",
      imageUrl: "/quiz_images/math_instrument/question1.png",
      points: 1,
      options: [
        { id: "A", text: "6 m", correct: true },
        { id: "B", text: "8 m" },
        { id: "C", text: "12 m" },
        { id: "D", text: "24 m" },
        { id: "E", text: "36 m" },
      ],
    },

    // ---------- Racetrack (question3A.png / question3B.png) ----------
    {
      id: "q3",
      type: "multiple-choice",
      text: "This graph shows how the speed of a racing car varies along a flat 3 kilometre (km) track during its second lap. What is the approximate distance from the starting line to the beginning of the longest straight section of the track?",
      imageUrl: "/quiz_images/math_instrument/question3A.png",
      points: 1,
      options: [
        { id: "A", text: "0.5 km" },
        { id: "B", text: "1.5 km", correct: true },
        { id: "C", text: "2.3 km" },
        { id: "D", text: "2.6 km" },
      ],
    },
    {
      id: "q4",
      type: "multiple-choice",
      text: "Here are pictures of four tracks. Along which one of these tracks was the car driven to produce the speed graph shown in the previous question? Select the correct answer.",
      imageUrl: "/quiz_images/math_instrument/question3B.png",
      points: 1,
      options: [
        { id: "A", text: "Track A" },
        { id: "B", text: "Track B", correct: true },
        { id: "C", text: "Track C" },
        { id: "D", text: "Track D" },
      ],
    },

    // ---------- Cubes (question4.png) ----------
    {
      id: "q5",
      type: "multiple-choice",
      text: "Susan likes to build blocks from small cubes like the one shown in the following diagram. Susan has a lot of small cubes like this one. She uses glue to join cubes together to make other blocks. First, Susan glues eight of the cubes together to make the block shown in Diagram A. Then Susan makes the solid blocks shown in Diagram B and Diagram C below. Susan realizes that she used more small cubes than she really needed to make a block like the one shown in Diagram C. She realizes that she could have glued small cubes together to look like Diagram C, but the block could have been hollow on the inside. What is the minimum number of cubes she needs to make a block that looks like the one shown in Diagram C, but is hollow?",
      imageUrl: "/quiz_images/math_instrument/question4.png",
      points: 1,
      options: [
        { id: "A", text: "12" },
        { id: "B", text: "24" },
        { id: "C", text: "26", correct: true },
        { id: "D", text: "48" },
        { id: "E", text: "144" },
      ],
    },
    {
      id: "q6",
      type: "multiple-choice",
      text: "Now Susan wants to make a block that looks like a solid block that is 6 small cubes long, 5 small cubes wide, and 4 small cubes high. She wants to use the smallest number of cubes possible, by leaving the largest possible hollow space inside the block. What is the minimum number of cubes she needs to make this block?",
      imageUrl: "/quiz_images/math_instrument/question4.png",
      points: 1,
      options: [
        { id: "A", text: "12" },
        { id: "B", text: "24" },
        { id: "C", text: "32" },
        { id: "D", text: "88" },
        { id: "E", text: "96", correct: true },
      ],
    },

    // ---------- Jug (no image) ----------
    {
      id: "q7",
      type: "multiple-choice",
      text: "Stainless steel cylindrical jugs are made to hold a volume of 2 litres (2000 cm³). If the 1 litre mark is at 8.84 cm, what is the radius of the jug to the nearest centimetre? The area of a circle is πr² and the volume of a cylinder is πr²h, where r is the radius and h is the height.",
      points: 1,
      options: [
        { id: "A", text: "6 cm", correct: true },
        { id: "B", text: "36 cm" },
        { id: "C", text: "0.19 cm" },
        { id: "D", text: "8.5 cm" },
      ],
    },

    // ---------- Rain (question6.png) ----------
    {
      id: "q8",
      type: "multiple-choice",
      text: "The diagram below shows the dimensions of a flat roofed commercial shed. During one week 5 mm of rain fell on the roof of the shed. The rain was collected by gutters that flowed into a cylindrical water barrel with a diameter of 1 m. By how much did the depth of the water in the barrel increase as a result of this rain? The area of a circle is πr² and the volume of a cylinder is πr²h, where r is the radius and h is the height.",
      imageUrl: "/quiz_images/math_instrument/question6.png",
      points: 1,
      // TODO: add `correct: true` to the right option once confirmed against the shed dimensions in question6.png
      options: [
        { id: "A", text: "5 mm" },
        { id: "B", text: "0.005 m" },
        { id: "C", text: "0.175 m" },
        { id: "D", text: "0.25π m" },
        { id: "E", text: "0.55 m" },
      ],
    },

    // ---------- Blood (no image) ----------
    {
      id: "q9",
      type: "multiple-choice",
      text: "When blood samples are centrifuged the blood separates into two distinct layers – one made up mainly of plasma and the other made up of red blood cells. A sample of blood was put in a flat-bottomed test tube with a diameter of 3 cm. When the blood sample was added to the tube it filled the tube to a depth of 7.5 cm. After centrifuging, the red blood layer was 1.5 cm deep. What volume of plasma was in the sample? The area of a circle is πr² and the volume of a cylinder is πr²h, where r is the radius and h is the height.",
      points: 1,
      options: [
        { id: "A", text: "4.5 cm³" },
        { id: "B", text: "6 cm" },
        { id: "C", text: "24π cm" },
        { id: "D", text: "42 cm³", correct: true },
        { id: "E", text: "56 cm³" },
      ],
    },

    // ---------- Class trip (no image) ----------
    {
      id: "q10",
      type: "multiple-choice",
      text: "Joan needs €60 for a class trip. She has €32. She can earn €4 an hour mowing lawns. How many hours must Joan work to have the money she needs?",
      points: 1,
      options: [
        { id: "A", text: "7 hours", correct: true },
        { id: "B", text: "17 hours" },
        { id: "C", text: "23 hours" },
        { id: "D", text: "28 hours" },
      ],
    },

    // ---------- Peanut butter graph (question9.png) ----------
    {
      id: "q11",
      type: "multiple-choice",
      text: "The graph shows the amount of protein contained in a certain brand of peanut butter. Which statement describes the meaning of the point (6, 30) on the graph?",
      imageUrl: "/quiz_images/math_instrument/question9.png",
      points: 1,
      options: [
        { id: "A", text: "There are 6 grams of protein per tablespoon of peanut butter" },
        { id: "B", text: "There are 30 grams of protein per tablespoon of peanut butter" },
        { id: "C", text: "There are 6 grams of protein in 30 tablespoons of peanut butter" },
        { id: "D", text: "There are 30 grams of protein in 6 tablespoons of peanut butter", correct: true },
      ],
    },
  ],
};