const googleTrends = require('google-trends-api');
const zipcodes = require('zipcodes');

function getTrends(symptoms, zipcode) {
  let geos = ['US'];
  let keywords = [symptoms];

  if (zipcode) {
    const location = zipcodes.lookup(zipcode);
    if (location) {
      geos.push(`US-${location.state}`);
      keywords.push(symptoms);
    }
  }

  return googleTrends.interestOverTime({
    keyword: keywords,
    startTime: new Date('2018-01-01'),
    geo: geos
  });
}

exports.getTrends = getTrends;
