const path = require('path')
const fs = require('fs')
const Intent = require('./lib/Intent')

const actions = function(type = 'wav', params = {encoding: 'unsigned-integer', bits: 8, rate: 8000, endian: 'little'}) {
  let headers = {
    'Content-Type': `audio/${type}`,
    'Transfer-encoding': 'chunked'
  }
  if (type === 'raw') {
    headers = {
      'content-type': `audio/${type};encoding=${params.encoding};bits=${params.bits};rate=${params.rate};endian=${params.endian}`,
      'Transfer-encoding': 'chunked'
    }
  }
  return {
    method: 'POST',
    uri: '/speech',
    headers,
    optional: ['context', 'msg_id', 'thread_id', 'n']
  }
}

const readfile = function(path) {
  return {type: path.extname(path), audio: fs.createReadStream(path)}
}

module.exports = function (request) {
  return function (path, options) {
    const {type, audio} = type(path)
    let payload = actions(type, options)
    for (const key in options) {
      if (actions.default.optional.indexOf(key) !== -1) {
        payload.qs[key] = options[key]
      }
    }
    return new Promise((resolve, reject) => {
      audio.pipe(request(payload, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(new Intent(res, options))
      }))
    })
  }
}
