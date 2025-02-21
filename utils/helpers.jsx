export function validateTeacherCode(inputtedCode) {
  if (inputtedCode === "1234") {
    console.log("Teeacher code is correct");
    return true;
  } else {
    return false;
  }
}

export const schools = [
  //Can you add these as strings and put a comma after each one
  "Ard Scoil Mhuire",
  "Ardscoil Phadraig",
  "Athlone Community College",
  "Belmayne ETSS",
  "Bremore ETSS",
  "Carndonagh Community School",
  "Colaiste Bride Enniscorthy",
  "Colaiste ghlor na Mara",
  "Colaiste Mhuire Askeaton",
  "Colaiste Na Trocaire",
  "Drogheda Grammar School",
  "Gallen Community School",
  "Lusk Community College",
  "Malahide Community School",
  "Old Bawn Community School",
  "Patrician High School",
  "Portumna Community School",
  "Royal and Prior Comprehensive",
  "Sancta Maria College",
  "Santa Sabina Dominican College",
  "St Columbas Comprehensive",
  "St Josephs Castlebar",
  "St Josephs Secondary School Rush",
  "St Kevins Community College",
  "St Mogues",
];

export function generateJoinCode() {
  return (
    Math.random().toString(36).substring(2, 6).toUpperCase() +
    "-" +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}

export function generateStudentCode(){
    return Math.random().toString(36).substr(2, 6).toUpperCase(); // Example: "XK5D9A"
  };