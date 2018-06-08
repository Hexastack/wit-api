const App = require('./lib/App')

const actions = function(id) {
  return {
    list: {
      method: 'GET',
      uri: '/apps'
    },
    add: {
      method: 'POST',
      uri: '/apps'
    },
    update: {
      method: 'PUT',
      uri: `/apps/${id}`
    },
    delete: {
      method: 'DELETE',
      uri: `/apps/${id}`
    }
  }
}

module.exports = function (request) {
  return {
    list: function(limit = 500, offset = 0) {
      const payload = actions().list
      payload.qs = {
        limit,
        offset
      }
      return new Promise((resolve, reject) => {
        request(payload, (err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(res.map((app) => new App(app.name, request, app)))
        })
      })
    },
    add: function (name, private = true, lang = 'en', desc = '') {
      let payload = actions().add
      let body = {
        name,
        private,
        lang,
        desc
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
          body.id = res.app_id
          body.token = res.access_token
          return resolve(new App(name, request, body))
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
          // this is very poor, better run get
          return resolve(res)
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
