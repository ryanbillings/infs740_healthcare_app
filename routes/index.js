const {diagnose} = require('../src/diagnoser.js');
const {recommend} = require('../src/recommender.js');

const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/about', function(req, res, next) {
  res.render('about');
});
router.get('/help', function(req, res, next) {
  res.render('help');
});
router.post('/diagnosis', (req, res, next) => {
  const symptoms = req.body.symptoms;
  const age = req.body.age;
  const gender = req.body.gender;

  diagnose({symptoms, age, gender}).then((data) => {

    const {diagnosis, specialists} = data;
    res.render('diagnosis', {diagnosis, specialists});

  }).catch((err) => res.render('error', {message: err, error: {}}));
});

router.get('/treatments', (req, res, next) => {
  const specialists = req.query.specialists.split(',');

  recommend(specialists).then(results => {
    res.render('treatments', {specialists, results});
  }).catch((err) => res.render('error', {message: err, error: {}}));
});

module.exports = router;
