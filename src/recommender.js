const {yelpSearch} = require('../src/api/yelp.js');

exports.recommend = (specialists, zipcode) => {

  return new Promise((resolve, reject) => {
    const yelpRequest = yelpSearch(specialists, zipcode);
    yelpRequest.then(results => resolve(results)).catch(err => reject(err));
  });
}
