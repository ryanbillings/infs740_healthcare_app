const hmacMd5 = require('crypto-js/hmac-md5');
const Base64 = require('crypto-js/enc-base64');

const request = require("request");

const API_MEDIC_URL = 'https://sandbox-healthservice.priaid.ch'
const AUTH_URL = 'https://sandbox-authservice.priaid.ch/login';

const stringSimilarity = require('string-similarity');

function getAuthorizationToken() {
  const computedHash = hmacMd5(AUTH_URL, process.env.PRIAID_SECRET_KEY);
  const computedHashString = Base64.stringify(computedHash);
  const options = {
    url: `${AUTH_URL}`,
    headers: {
      'Authorization': `Bearer: ${process.env.PRIAID_API_KEY}:${computedHashString}`
    }
  };

  return new Promise((resolve, reject) => {
    request.post(options, (err, response, body) => {
      const json = JSON.parse(body);
      resolve(json['Token']);
    });
  });
}


function baseUrl(path, token) {
  return `${API_MEDIC_URL}/${path}?token=${token}&format=json&language=en-gb`;
}

function diagnosisUrl(symptomIds, age, gender, token) {
  const queryStrings = `symptoms=[${symptomIds.join(',')}]&gender=${gender}&year_of_birth=${age}`;
  return `${baseUrl('diagnosis', token)}&${queryStrings}`;
}

function symptomsUrl(token) {
  return baseUrl('symptoms', token);
}

function symptomMatches(userSymptom, apiSymptom) {
  return stringSimilarity.compareTwoStrings(userSymptom, apiSymptom) > 0.6;
}

function getIdsForSymptoms(userSymptom, token) {
  return new Promise((resolve, reject) => {
    request(symptomsUrl(token), (err, res, body) => {
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

function priaidDiagnosis (params) {
  return new Promise(async (resolve, reject) => {
    const {symptoms, age, gender} = params;
    const token = await getAuthorizationToken();

    getIdsForSymptoms(symptoms, token).then((symptomIds) => {

      request(diagnosisUrl(symptomIds, age, gender, token), (err, res, body) => {
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

exports.priaidDiagnosis = priaidDiagnosis;