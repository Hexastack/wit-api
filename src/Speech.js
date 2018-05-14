const actions = {
  default: {
    method: 'POST',
    uri: '/speech',
    headers: {
      'Content-Type': 'audio/wav'
    }
  }
}

module.exports = function (request, cb) {
  return function (audio, cb) {
    let payload = actions.default
    payload.body = audio
    request(payload, cb)
  }
}
