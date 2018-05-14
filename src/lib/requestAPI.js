module.exports = function(request) {
  return function (params, callback) {
    request(params, (error, response, body) => {
      if (error) {
        return callback(error, null)
      }
      if (response && response.statusCode != '200') {
        return callback(new Error(body), null)
      }
      try {
        return callback(null, JSON.parse(body))
      } catch(e) {
        return callback(e, null)
      }
    });
  }
}
