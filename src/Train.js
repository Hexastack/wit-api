const actions = {
  default: {
    method: 'POST',
    uri: '/samples'
  }
}

module.exports = function (request) {
  return function (text, entities) {
    // entity format : {
    //   entity*,
    //   value*,
    //   start,
    //   end
    // }
    let payload = actions.default
    let body = [{
      text,
      entities
    }]
    return new Promise((resolve, reject) => {
      try {
        payload.body = JSON.stringify(body)
      } catch (e) {
        return reject(e)
      }
      request(payload, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }
}
