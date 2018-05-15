const fs = require('fs')
const path = require('path')
const Intent = require('./lib/Intent')

const actions = function (type = 'wav', params = { encoding: 'unsigned-integer', bits: 8, rate: 8000, endian: 'little' }) {
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
    optional: ['context', 'msg_id', 'thread_id', 'n'],
    allowedMime: ['audio/wav', 'audio/mpeg3', 'audio/ulaw', 'audio/raw']
  }
}

const readfile = function (filePath) {
  let type = path.extname(filePath).replace(/^\./, '')
  if (type === 'mp3') {
    type = 'mpeg3'
  }
  return { type, audio: fs.createReadStream(filePath) }
}

module.exports = function (request) {
  return function (filePath, options) {
    return new Promise((resolve, reject) => {
      const { type, audio } = readfile(filePath)
      let payload = actions(type, options)
      if (payload.allowedMime.indexOf(`audio/${type}`) === -1) {
        reject(new Error(`Unsupported mime type ${type}`))
      }
      for (const key in options) {
        if (actions.default.optional.indexOf(key) !== -1) {
          payload.qs[key] = options[key]
        }
      }
      payload.body = audio
      request(payload, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(new Intent(res, options))
      })
    })
  }
}
