const subjectSection =
  "Which of these subjects did you study for the Junior Certificate?";

const subjects = [
  "Applied Technology",
  "Business Studies",
  "Classics",
  "Engineering",
  "Geography",
  "Graphics",
  "Home Economics",
  "Music",
  "Science",
  "Visual Arts",
  "Wood Technology",
];

export const quizData = {
  id: 20,
  title: "STEM Subject and Careers Survey",
  description:
    "Please answer each question about the subjects you studied and your plans after school. There are no “right” or “wrong” answers. The only correct responses are those that are true for you.",
  questionsPerPage: 11, // keeps all subjects on one page
  questions: [
    ...subjects.map((name, i) => ({
      id: `q${i + 1}`,
      type: "likert-question",
      section: subjectSection,
      text: name,
    })),
    {
      id: "q12",
      type: "single-choice",
      section: "Your plans",
      text: "What do you plan to do after you have completed your Leaving Certificate?",
      options: [
        { id: "college", text: "Go to college/university" },
        { id: "apprenticeship", text: "Start a trade apprenticeship" },
        { id: "job", text: "Get a job" },
        { id: "plc", text: "Do a post-leaving certificate (PLC) course" },
        { id: "other", text: "Other (please specify)", allowText: true },
      ],
    },
    {
      id: "q13",
      type: "single-choice",
      section: "Your plans",
      text: "If college/university, what discipline do you hope to study?",
      options: [
        { id: "science", text: "Science" },
        { id: "engineering", text: "Engineering" },
        { id: "arts", text: "Arts" },
        { id: "business", text: "Business" },
        { id: "humanities", text: "Humanities" },
        { id: "medicine", text: "Medicine/Health Sciences" },
        { id: "other", text: "Other (please specify)", allowText: true },
        { id: "na", text: "Not applicable" },
      ],
    },
  ],
  likertOptions: [
    { id: "yes", text: "Yes" },
    { id: "no", text: "No" },
    { id: "notAvailable", text: "Not available in my school", shortText: "Not available" },
  ],
};