const {priaidDiagnosis} = require('../src/api/priaid.js');
const {infermedicaDiagnosis} = require('../src/api/infermedica.js');

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

      resolve(mergedDiagnoses);
    });
  });
}