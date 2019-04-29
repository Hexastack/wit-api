const https = require('https')
const qs = require('querystring')

module.exports = init = function (token, version = '20170307', timeout = 20000, debug = false) {
  return function (options, data) {
    return new Promise((resolve, reject) => {

      Object.assign(options, {
        hostname: 'api.wit.ai',
        port: 443,
        timeout
      })

      if (!options.headers) options.headers = {}
      Object.assign(options.headers, {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        Connection: 'keep-alive',
        'Keep-Alive': 'timeout=10, max=1000'
      })
      if (!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json; charset=utf-8'

      if (!options.qs) options.qs = {}
      Object.assign(options.qs, { v: version })

      if (data && options.headers['Content-Type'] === 'application/json; charset=utf-8')
        try {
          data = JSON.stringify(data)
        } catch (e) {
          return reject(e)
        }
      
      if (options.method && ['POST', 'PUT', 'PATCH'].indexOf(options.method.toUpperCase()) !== -1)
        options.headers['Content-Length'] = Buffer.byteLength(data)

      options.path += '?' + qs.stringify(options.qs)

      const req = https.request(options, function (res) {
        if (debug)
          console.debug(res.req._header)
        let body = ''
        res.setEncoding('utf8')
        res.on('data', function (chunk) {
          body += chunk
        })
        res.on('end', function () {
          let response = {}
          try {
            response = JSON.parse(body)
          } catch (e) {
            return reject(e)
          }
          if (response.error)
            return reject(new Error(response.error))
          return resolve(response)
        })
      })
      req.on('error', function (err) {
        return reject(err)
      })
      if (options.method && ['POST', 'PUT', 'PATCH'].indexOf(options.method.toUpperCase()) !== -1)
        req.write(data)
      req.end()
    })
  }
}
