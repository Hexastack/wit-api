const fs = require('fs')
const path = require('path')

const actions = function (params, type = 'wav', format = { encoding: 'unsigned-integer', bits: 8, rate: 8000, endian: 'little' }) {
  let headers = {
    'Content-Type': `audio/${type}`,
    'Transfer-encoding': 'chunked'
  }
  if (type === 'raw') {
    headers['content-type'] = `audio/${type};encoding=${format.encoding};bits=${format.bits};rate=${format.rate};endian=${format.endian}`
  }

  return {
    message: {
      method: 'GET',
      path: '/message',
      qs: params
    },
    speech: {
      method: 'POST',
      path: '/speech',
      qs: params,
      headers
    }
  }
}

const readfile = function (filePath) {
  let type = path.extname(filePath).replace(/^\./, '')
  if (type === 'mp3') {
    type = 'mpeg3'
  }
  return { type, audio: fs.readFileSync(filePath) }
}

module.exports = function (request) {
  return {
    async message(text, params = {}) {
      params.q = text
      const options = actions(params).message
      return await request(options)
    },
    async speech(filePath, params, format) {
      const { type, audio } = readfile(filePath)
      const options = actions(params, type, format).speech
      return await request(options, audio)
    }
  }
}
