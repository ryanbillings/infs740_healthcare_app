const request = require("request");

const API_MEDIC_URL = 'https://healthservice.priaid.ch/diagnosis'

function urlBuilder(symptomIds, age, gender){
  const queryStrings = `symptoms=[${symptomIds.join(',')}]&gender=${gender}&year_of_birth=${age}`;
  return `${API_MEDIC_URL}?token=${process.env.API_MEDIC_TOKEN}&${queryStrings}&format=json&language=en-gb`;
}

exports.diagnose = (params) => {
  return new Promise((resolve, reject) => {
    const {symptoms, age, gender} = params;

    request(urlBuilder([symptoms], age, gender), (err, res, body) => {
      if (err) {
        return reject(err);
      } else if (typeof JSON.parse(body) === 'string') {
        return reject(body);
      }

      const diagnoses = JSON.parse(body).map((d) => { return d['Issue']['ProfName'] })
      resolve(diagnoses);
    });
  });
}