const {request, GraphQLClient} = require('graphql-request')

const YELP_API_URL = 'https://api.yelp.com/v3/graphql';

function requestHeaders() {
  return {
    'Authorization': `Bearer ${process.env.YELP_API_KEY}`
  }
}

function graphQlParams(searchTerm) {
  return `{
    search(term: "${searchTerm.join(' ')}",
           location: "Washington DC") {
      total
      business {
        name
        rating
        url
      }
    }
  }`;
}

function yelpSearch(specialists) {
  return new Promise((resolve, reject) => {
    const graphQLClient = new GraphQLClient(YELP_API_URL, {
      headers: requestHeaders()
    });

    graphQLClient.request(graphQlParams(specialists)).then(data => {
      const results = data.search.business.map(biz => {
        let {name, url} = biz;
        return {name, url};
      });
      resolve(results);
    }).catch(err => reject(err));
  });
}

exports.yelpSearch = yelpSearch;