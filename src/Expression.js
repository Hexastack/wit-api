const Entity = require('./lib/Entity')

const actions = function (entity, value, expression) {
  return {
    add: {
      method: 'POST',
      uri: `/entities/${entity}/values/${value}/expressions`
    },
    delete: {
      method: 'DELETE',
      uri: `/entities/${entity}/values/${value}/expressions/${expression}`
    }
  }
}

module.exports = function (request) {
  return {
    add: function (entity, value, expression) {
      let payload = actions(entity, value).add
      let body = {
        expressions
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
    delete: function (entity, value, expression) {
      let payload = actions(entity, value, expression).delete
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
