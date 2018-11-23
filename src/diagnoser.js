const {priaidDiagnosis} = require('../src/api/priaid.js');
const {infermedicaDiagnosis} = require('../src/api/infermedica.js');
const {ontologyClassifier} = require('../src/api/ontology.js');
const {getTrends} = require('../src/api/trends.js');
const uniq = require('lodash.uniq');
const flatten = require('lodash.flatten');


function diagnose(params){
  const priaidPromise = priaidDiagnosis(params);
  const infermedicaPromise = infermedicaDiagnosis(params);

  const resolvedApis = Promise.all([priaidPromise, infermedicaPromise]);

  return new Promise((resolve, reject) => {
    resolvedApis.then(async (apiData) => {
      const mergedDiagnoses = apiData.reduce((reducer, data) => {
        let {diagnoses, specialists} = data;

        reducer.diagnosis = reducer.diagnosis.concat(diagnoses);
        reducer.specialists = reducer.specialists.concat(specialists);
        return reducer;
      }, {diagnosis: [], specialists: []});

      const diagnosis = uniq(flatten(mergedDiagnoses.diagnosis));
      const decoratedDiagnosis = diagnosis.map(d => ontologyClassifier(d));

      mergedDiagnoses.diagnosis = decoratedDiagnosis;
      mergedDiagnoses.specialists = uniq(flatten(mergedDiagnoses.specialists));
      mergedDiagnoses.trends = await getTrends(params.symptoms, params.zipcode);

      resolve(mergedDiagnoses);
    }).catch(err => { reject(err) });
  });
}

exports.diagnose = diagnose;
