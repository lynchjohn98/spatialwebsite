export const quizData = {
  id: 20,
  title: "STEM Career Survey",
  description: "Here are descriptions of subject areas that involve math, science, engineering and/or technology, and lists of jobs connected to each subject area. As you read the list below, you will know how interested you are in the subject and the jobs. Fill in the circle that relates to how interested you are. There are no “right” or “wrong” answers. The only correct responses are those that are true for you.",
  questions: [
    {
      id: "q1",
      type: "likert-question",
      text: "Physics: is the study of basic laws governing the motion, energy, structure, and interactions of matter. This can include studying the nature of the universe. (aviation engineer, alternative energy technician, lab technician, physicist, astronomer)"
    },

    {
      id: "q2",
      type: "likert-question",
      text: "Environmental Work: involves learning about physical and biological processes that govern nature and working to improve the environment. This includes finding and designing solutions to problems like pollution, reusing waste and recycling. (pollution control analyst, environmental engineer or scientist, erosion control specialist, energy systems engineer and maintenance technician)"
    },
    {
      id: "q3",
      type: "likert-question",
      text: "Biology and Zoology: involve the study of living organisms (such as plants and animals) and the processes of life. This includes working with farm animals and in areas like nutrition and breeding. (biological technician, biological scientist, plant breeder, crop lab technician, animal scientist, geneticist, zoologist)"
    },
    
    {
      id: "q4",
      type: "likert-question",
      text: "Veterinary Work: involves the science of preventing or treating disease in animals. (veterinary assistant, veterinarian, livestock producer, animal caretaker)"
    },
    {
      id: "q5",
      type: "likert-question",
      text: "Mathematics: is the science of numbers and their operations. It involves computation, algorithms and theory used to solve problems and summarize data. (accountant, applied mathematician, economist, financial analyst, mathematician, statistician, market researcher, stock market analyst)"
    },
    {
      id: "q6",
      type: "likert-question",
      text: "Medicine: involves maintaining health and preventing and treating disease. (physician’s assistant, nurse, doctor, nutritionist, emergency medical technician, physical therapist, dentist)"
    },
    {
      id: "q7",
      type: "likert-question",
      text: "Earth Science: is the study of earth, including the air, land, and ocean. (geologist, weather forecaster, archaeologist, geoscientist)"
    },
    {
        id: "q9",
        type: "likert-question",
        text: "Computer Science: consists of the development and testing of computer systems, designing new programs and helping others to use computers. (computer support specialist, computer programmer, computer and network technician, gaming designer, computer software engineer, information technology specialist)"
    },
    {
        id: "q10",
        type: "likert-question",
        text: "Medical Science: involves researching human disease and working to find new solutions to human health problems. (clinical laboratory technologist, medical scientist, biomedical engineer, epidemiologist, pharmacologist)"
    }
    ,
    {
        id: "q11",
        type: "likert-question",
        text: "Chemistry: uses math and experiments to search for new chemicals, and to study the structure of matter and how it behaves. (chemical technician, chemist, chemical engineer)"
    }
    ,
    {
        id: "q12",
        type: "likert-question",
        text: "Energy: involves the study and generation of power, such as heat or electricity. (electrician, electrical engineer, heating, ventilation, and air conditioning (HVAC) technician, nuclear engineer, systems engineer, alternative energy systems installer or technician)"
    }
    ,
    {
        id: "q13",
        type: "likert-question",
        text: "Engineering: involves designing, testing, and manufacturing new products (like machines, bridges, buildings, and electronics) through the use of math, science, and computers. (civil, industrial, agricultural, or mechanical engineers, welder, auto-mechanic, engineering technician, construction manager)"
    }

  ],
  likertOptions: [
        { id: "notAtAll", text: "Not at all Interested" },
        { id: "notSo", text: "Not So Interested" },
        { id: "interested", text: "Interested" },
        { id: "veryInterested", text: "Very Interested" },
      ],
}