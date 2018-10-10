const {diagnose} = require('../src/diagnoser.js');

const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/diagnosis', (req, res, next) => {
  const symptoms = req.body.symptoms;
  const age = req.body.age;
  const gender = req.body.gender;

  diagnose({symptoms, age, gender}).then((diagnosis) => {
    res.render('diagnosis', {diagnosis});
  }).catch((err) => res.render('error', {message: err, error: {}}));
});

module.exports = router;
