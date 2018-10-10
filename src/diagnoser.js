const request = require("request");

const API_MEDIC_URL = 'https://sandbox-healthservice.priaid.ch'

const stringSimilarity = require('string-similarity');

function baseUrl(path) {
  return `${API_MEDIC_URL}/${path}?token=${process.env.API_MEDIC_TOKEN}&format=json&language=en-gb`;
}

function diagnosisUrl(symptomIds, age, gender) {
  const queryStrings = `symptoms=[${symptomIds.join(',')}]&gender=${gender}&year_of_birth=${age}`;
  return `${baseUrl('diagnosis')}&${queryStrings}`;
}

function symptomsUrl() {
  return baseUrl('symptoms');
}

function symptomMatches(userSymptom, apiSymptom) {
  return stringSimilarity.compareTwoStrings(userSymptom, apiSymptom) > 0.6;
}

function getIdsForSymptoms(userSymptom) {
  return new Promise((resolve, reject) => {
    request(symptomsUrl(), (err, res, body) => {
      if (err) {
        return reject(err);
      }

      const symptoms = JSON.parse(body);

      const symptomIds = symptoms.filter((symptom) => {
        return symptomMatches(symptom['Name'], userSymptom);
      }).map((s) => { return s['ID'] });

      return resolve(symptomIds);
    });
  });
}

exports.diagnose = (params) => {
  return new Promise((resolve, reject) => {
    const {symptoms, age, gender} = params;

    getIdsForSymptoms(symptoms).then((symptomIds) => {

      request(diagnosisUrl(symptomIds, age, gender), (err, res, body) => {
        if (err) {
          return reject(err);
        } else if (typeof JSON.parse(body) === 'string') {
          return reject(body);
        }

        const diagnoses = JSON.parse(body).map((d) => { return d['Issue']['ProfName'] })
        resolve(diagnoses);
      });
    }).catch((err) => { reject(err) });
  });
}