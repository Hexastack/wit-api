const actions = {
  default: {
    method: 'POST',
    uri: '/samples'
  }
}

module.exports = function (request, cb) {
  return function (message, cb) {
    let payload = actions.default
    try {
      payload.body = JSON.stringify(changes)
    } catch (e) {
      return cb(e, null)
    }
    request(payload, cb)
  }
}
