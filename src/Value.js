const Entity = require('./lib/Entity')

const actions = function (entity, value) {
  return {
    add: {
      method: 'POST',
      uri: `/entities/${entity}/values`
    },
    delete: {
      method: 'DELETE',
      uri: `/entities/${entity}/values/${value}`
    }
  }
}

module.exports = function (request) {
  return {
    add: function (entity, value, expressions = [], metadata = '') {
      let payload = actions(entity).add
      let body = {
        value,
        expressions,
        metadata
      }
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
          return resolve(new Entity(entity, request, res))
        })
      })
    },
    delete: function (entity, value) {
      let payload = actions(entity, value).delete
      return new Promise((resolve, reject) => {
        request(payload, (err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(res)
        })
      })
    }
  }
}
