const request = require('request');

const API_INFERMEDICA_URL = 'https://api.infermedica.com';

function baseUrl(path) {
  return `${API_INFERMEDICA_URL}/v2/${path}`;
}

function symptomsUrl() {
  return baseUrl('parse');
}

function diagnosisUrl() {
  return baseUrl('diagnosis');
}

function requestHeaders() {
  return {
    'App-Id': process.env.INFERMEDICA_APP_ID,
    'App-Key': process.env.INFERMEDICA_APP_KEY
  };
}

function symptomsHttpOptions(text) {
  return {
    url: symptomsUrl(),
    method: 'POST',
    headers: requestHeaders(),
    body: {
      text
    },
    json: true
  };
}

function diagnosisHttpOptions(sex, age, evidence) {
  return {
    url: diagnosisUrl(),
    headers: requestHeaders(),
    method: 'POST',
    body: {
      sex,
      age,
      evidence
    },
    json: true
  };
}


function getIdsForSymptoms(symptomText) {
  return new Promise((resolve, reject) => {
    request(symptomsHttpOptions(symptomText), (err, res, body) => {
      if (err) {
        return reject(err);
      }

      const symptomIds = body.mentions.map(mention => {
        const {id, choice_id} = mention;
        return {id, choice_id};
      });

      return resolve(symptomIds);
    });
  });
}


function infermedicaDiagnosis (params) {
  return new Promise(async (resolve, reject) => {
    const {symptoms, age, gender} = params;
    // age is year of birth
    const currentYear = (new Date()).getFullYear();
    const computedAge = currentYear - age;

    getIdsForSymptoms(symptoms).then((symptomIds) => {

      request(diagnosisHttpOptions(gender, computedAge, symptomIds), (err, res, body) => {
        if (err) {
          reject(err);
        }

        resolve(body.conditions.map(c => c.name));
      });
    }).catch(err => reject(err));
  });
};

exports.infermedicaDiagnosis = infermedicaDiagnosis;