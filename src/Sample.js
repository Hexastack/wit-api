const actions = function(id) {
  return {
    add: {
      method: 'POST',
      uri: '/samples'
    },
    delete: {
      method: 'DELETE',
      uri: '/samples'
    }
  }
}

module.exports = function (request) {
  return {
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
    }
  }
}
