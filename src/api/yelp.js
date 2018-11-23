const {request, GraphQLClient} = require('graphql-request')

const YELP_API_URL = 'https://api.yelp.com/v3/graphql';

function requestHeaders() {
  return {
    'Authorization': `Bearer ${process.env.YELP_API_KEY}`
  }
}

function graphQlParams(searchTerm, zipcode) {
  return `{
    search(term: "${searchTerm.join(' ')}",
           location: "${zipcode}") {
      total
      business {
        name
        rating
        url
      }
    }
  }`;
}

function yelpSearch(specialists, zipcode) {
  return new Promise((resolve, reject) => {
    const graphQLClient = new GraphQLClient(YELP_API_URL, {
      headers: requestHeaders()
    });

    graphQLClient.request(graphQlParams(specialists, zipcode)).then(data => {
      console.log(JSON.stringify(data));
      const results = data.search.business.map(biz => {
        let {name, url} = biz;
        return {name, url};
      });
      resolve(results);
    }).catch(err => reject(err));
  });
}

exports.yelpSearch = yelpSearch;
