const fs = require('fs')
const req = require('request')

const actions = function(id) {
  return {
    get: {
      method: 'GET',
      uri: '/samples'
    },
    add: {
      method: 'POST',
      uri: '/samples'
    },
    delete: {
      method: 'DELETE',
      uri: '/samples'
    },
    export: {
      method: 'GET',
      uri: 'export'
    }
  }
}

module.exports = function (request) {
  return {
    get: function (limit = 10, offset = 0, entities = [], values = [], isNegative = false) {
      let payload = actions().get
      payload.qs = {
        limit,
        offset,
        entity_ids: entities,
        entity_values: values,
        negative: isNegative
      }
      return new Promise((resolve, reject) => {
        request(payload, (err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(res)
        })
      })
    },
    add: function (...args) {
      let payload = actions().add
      let body = Array.isArray(args[0]) ? args[0] : [{text: args[0], entities: args[1]}]
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
    },
    delete: function (...args) {
      let payload = actions().delete
      let body = Array.isArray(args[0]) ? args[0] : [{text: args[0]}]
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
    },
    export: function (filePath = './backup.zip') {
      let payload = actions().export
      return new Promise((resolve, reject) => {
        request(payload, (err, res) => {
          if (err) {
            return reject(err)
          }
          req(res)
          .on('error', (err) => {
            return reject(err)
          })
          .on('response', (response) => {
            return resolve(response)
          })
          .pipe(fs.createWriteStream(filePath))
        })
      })
    }
  }
}
