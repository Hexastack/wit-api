const fs = require('fs')
const path = require('path')
const Guess = require('./lib/Guess')
const Language = require('./lib/Language')

const actions = function (params, type = 'wav', format = {}) {
  format = Object.assign({ encoding: 'unsigned-integer', bits: 8, rate: 8000, endian: 'little' }, format)
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
    language: {
      method: 'GET',
      path: '/language',
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
      return new Guess(await request(options))
    },
    async language(text, params = {}) {
      params.q = text
      const options = actions(params).language
      return new Language(await request(options))
    },
    async all(text, params = {}) {
      params.q = text
      const msgOptions = actions(params).message
      const langOptions = actions(params).language
      const responses = await Promise.all([request(msgOptions), request(langOptions)])
      return new Guess(responses[0], new Language(responses[1]))
    },
    async speech(filePath, params, format) {
      const { type, audio } = readfile(filePath)
      const options = actions(params, type, format).speech
      return new Guess(await request(options, audio))
    }
  }
}
