'use strict';
const request = require('request');

function streamElements(jwtToken) {
  const base = 'https://api.streamelements.com/kappa/v1';

  function makeRequest(method, endpoint, queryObj, json) {
    return new Promise((resolve, reject) => {
      request({
        method,
        url: `${base}/${endpoint}`,
        json: true,
        headers: { 'authorization': 'Bearer '+ jwtToken},
        qs: queryObj,
        body: json,
      }, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        if (body && body.error) {
          return reject(body.error);
        }
        if (res.statusCode !== 200) {
          return reject(`Unable to get data from the streamelements API. HTML status code: ${res.statusCode}`);
        }
        if (typeof body !== 'object') {
          return reject(`Invalid response type from streamelements API. Was expecting a JSON object.`);
        }
        return resolve(body);
      });
    });
  }

  return {
    get: {
      points: (username, channel) => makeRequest('get', `points/${channel}/${username}`),
    },
    put: {
      points: (username, amount) => makeRequest('put', `points/${username}/${amount}`),
    },
  };
}

module.exports = streamElements;