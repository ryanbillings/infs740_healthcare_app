const {priaidDiagnosis} = require('../src/api/priaid.js');
const {infermedicaDiagnosis} = require('../src/api/infermedica.js');
const uniq = require('lodash.uniq');
const flatten = require('lodash.flatten');

exports.diagnose = (params) => {
  const priaidPromise = priaidDiagnosis(params);
  const infermedicaPromise = infermedicaDiagnosis(params);

  const resolvedApis = Promise.all([priaidPromise, infermedicaPromise]);

  return new Promise((resolve, reject) => {
    resolvedApis.then(apiData => {
      const mergedDiagnoses = apiData.reduce((reducer, data) => {
        let {diagnoses, specialists} = data;

        reducer.diagnosis = reducer.diagnosis.concat(diagnoses);
        reducer.specialists = reducer.specialists.concat(specialists);
        return reducer;
      }, {diagnosis: [], specialists: []});

      mergedDiagnoses.diagnosis = uniq(flatten(mergedDiagnoses.diagnosis));
      mergedDiagnoses.specialists = uniq(flatten(mergedDiagnoses.specialists));

      console.log(mergedDiagnoses.specialists);

      resolve(mergedDiagnoses);
    }).catch(err => { reject(err) });
  });
}
