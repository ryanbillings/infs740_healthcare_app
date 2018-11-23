const {diagnose} = require('../src/diagnoser.js');
const {recommend} = require('../src/recommender.js');

const express = require('express');
const router = express.Router();

const zipcodes = require('zipcodes');


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
  const zipcode = req.body.zip;
  let location;

  diagnose({symptoms, age, gender, zipcode}).then((data) => {

    const {diagnosis, specialists} = data;
    const trends = JSON.parse(data.trends);
    if(zipcode) {
      location = zipcodes.lookup(zipcode);
    }

    res.render('diagnosis', {
      symptoms,
      diagnosis,
      specialists,
      location,
      trends: trends.default.timelineData.filter((x, i) => i % 3 == 0)
    });

  }).catch((err) => res.render('error', {message: err, error: {}}));
});

router.get('/treatments', (req, res, next) => {
  const specialists = req.query.specialists.split(',');

  recommend(specialists).then(results => {
    res.render('treatments', {specialists, results});
  }).catch((err) => res.render('error', {message: err, error: {}}));
});

module.exports = router;
