const Entity = require('./lib/Entity')

const actions = function(id) {
  return {
    list: {
      method: 'GET',
      uri: '/entities'
    },
    add: {
      method: 'POST',
      uri: '/entities'
    },
    get: {
      method: 'GET',
      uri: `/entities/${id}`
    },
    update: {
      method: 'PUT',
      uri: `/entities/${id}`
    },
    delete: {
      method: 'DELETE',
      uri: `/entities/${id}`
    }
  }
}

module.exports = function (request) {
  return {
    list: function () {
      const payload = actions().list
      return new Promise((resolve, reject) => {
        request(payload, (err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(res.map((entity) => new Entity(entity, request)))
        })
      })
    },
    add: function (entity, doc = '') {
      let payload = actions().add
      return new Promise((resolve, reject) => {
        try {
          payload.body = JSON.stringify({ id: entity, doc })
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
    get: function (id) {
      let payload = actions(id).get
      return new Promise((resolve, reject) => {
        request(payload, (err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(new Entity(id, request, res))
        })
      })
    },
    update: function (id, changes) {
      let payload = actions(id).update
      return new Promise((resolve, reject) => {
        try {
          payload.body = JSON.stringify(changes)
        } catch (e) {
          return reject(e)
        }
        request(payload, (err, res) => {
          if (err) {
            return reject(err)
          }
          if (changes.values) {
            res.values = changes.values
          }
          // works fine still better to run get
          return resolve(new Entity(res.name, request, res))
        })
      })
    },
    delete: function (id) {
      let payload = actions(id).delete
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
