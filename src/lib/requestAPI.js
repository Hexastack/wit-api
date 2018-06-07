module.exports = function(request) {
  return function (params, callback) {
    request(params, (error, response, body) => {
      if (error) {
        return callback(error, null)
      }
      
      let res = JSON.parse(body)
      if (response && response.statusCode != '200') {
        return callback(new Error(res.body), null)
      }
      
      try {
        return callback(null, res)
      } catch(e) {
        return callback(e, null)
      }
    });
  }
}
