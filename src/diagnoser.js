const {priaidDiagnosis} = require('../src/api/priaid.js');
const {infermedicaDiagnosis} = require('../src/api/infermedica.js');

exports.diagnose = (params) => {
  const priaidPromise = priaidDiagnosis(params);
  const infermedicaPromise = infermedicaDiagnosis(params);

  const resolvedApis = Promise.all([priaidPromise, infermedicaPromise]);

  return new Promise((resolve, reject) => {
    resolvedApis.then(diagnoses => {
      const mergedDiagnoses = diagnoses.reduce((reducer, diagnose) => {
        return reducer.concat(diagnose);
      }, []);

      resolve(mergedDiagnoses);
    });
  });
}