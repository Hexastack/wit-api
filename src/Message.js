const Intent = require('./lib/Intent')

const actions = function() {
  return {
    method: 'GET',
    uri: '/message'
  }
}

const optional = ['context', 'msg_id', 'thread_id', 'n', 'verbose']

module.exports = function (request) {
  return function(message, options) {
    let payload = actions()
    payload.qs = {q: message}
    for (const key in options) {
      if (optional.indexOf(key) !== -1) {
        payload.qs[key] = options[key]
      }
    }
    return new Promise((resolve, reject) => {
      request(payload, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(new Intent(res, options))
      })
    })
  } 
}
