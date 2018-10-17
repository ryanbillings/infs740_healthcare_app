const {priaidDiagnosis} = require('../src/api/priaid.js');

exports.diagnose = (params) => {
  const resolvedApis = Promise.all([priaidDiagnosis(params)]);

  return new Promise((resolve, reject) => {
    resolvedApis.then(diagnoses => resolve(diagnoses[0]));
  });
}