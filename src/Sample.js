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
    add: function(text, entities) {
      let payload = actions().add
      let body = [{
        text,
        entities
      }]
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
    delete: function (text) {
      let payload = actions().delete
      let body = [{
        text
      }]
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
