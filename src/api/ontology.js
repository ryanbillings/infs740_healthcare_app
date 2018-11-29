
const ONTOLOGY_DESCRIPTION = {
  'Cold': {
    description: "An upper respiratory tract disease which involves inflammation of the mucous membranes of the nose, throat, eyes, and eustachian tubes with watery then purulent discharge. This is an acute contagious disease caused by rhinoviruses, human parainfluenza viruses, human respiratory syncytial virus, influenza viruses, adenoviruses, enteroviruses, or metapneumovirus. ",
    id: '10459'
  },
  'Food poisoning': {
    description: "A primary bacterial infectious disease that results_in infection located_in intestine caused by eating food contaminated with enterotoxins produced by bacteria, has_material_basis_in Staphylococcus aureus. The infection has_symptom diarrhea, has_symptom vomiting, has_symptom nausea, has_symptom cramps, and has_symptom weakness.",
    id: '96'
  },
  'Inflammation of the nose and throat': {
    description: "A primary immunodeficiency disease characterized by recurrent episodes of maculopapular skin rash triggered by exposure to cold associated with low-grade fever, general malaise, eye redness and arthralgia/myalgia.",
    id: '0090061'
  },
  'Reflux disease': {
    description: "A digestive disease in which stomach acid or bile irritates the food pipe lining.",
    id: '8534'
  }
};

function ontologyClassifier (disease) {
  const ontologyItem = ONTOLOGY_DESCRIPTION[disease];
  return {
    name: disease,
    description: ontologyItem ? ontologyItem.description : "N/A",
    id: ontologyItem ? ontologyItem.id : ""
  };
};

exports.ontologyClassifier = ontologyClassifier;
