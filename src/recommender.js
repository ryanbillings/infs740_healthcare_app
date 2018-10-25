const {yelpSearch} = require('../src/api/yelp.js');

exports.recommend = (specialists) => {

  return new Promise((resolve, reject) => {
    const yelpRequest = yelpSearch(specialists);
    yelpRequest.then(results => resolve(results)).catch(err => reject(err));
  });
}