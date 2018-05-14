const Entity = function(name, data = {
    id: '', values: null, builtin: false, doc: '', lang: 'en', lookups: []
  }) {
  this.name = name
  this.id = data.id
  this.values = data.values
  this.builtin = data.builtin
  this.doc = data.doc
  this.lang = data.lang
  this.lookups = data.lookups
}

const actions = {
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
    uri: '/entities'
  },
  update: {
    method: 'POST',
    uri: '/entities'
  },
  delete: {
    method: 'DELETE',
    uri: '/entities'
  }
}

module.exports = function (request) {
  return {
    list: function () {
      const payload = actions.list
      return new Promise((resolve, reject) => {
        request(payload, (err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(res.map((entity) => new Entity(entity)))
        })
      })
    },
    add: function (entity, doc = '') {
      let payload = actions.add
      try {
        payload.body = JSON.stringify({entity, doc})
      } catch (e) {
        return (e, null)
      }
      return new Promise((resolve, reject) => {
        request(payload, (err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(new Entity(entity, res))
        })
      })
    },
    get: function (id) {
      let payload = actions.get
      payload.uri += `/${id}`
      return new Promise((resolve, reject) => {
        request(payload, (err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(new Entity(id, res))
        })
      })
    },
    update: function (id, changes) {
      let payload = actions.update
      payload.uri += `/${id}`
      try {
        payload.body = JSON.stringify(changes)
      } catch (e) {
        return (e, null)
      }
      return new Promise((resolve, reject) => {
        request(payload, (err, res) => {
          if (err) {
            return reject(err)
          }
          if (changes.values) {
            res.values = changes.values
          }
          return resolve(new Entity(res.name, res))
        })
      })
    },
    delete: function (id) {
      let payload = actions.delete
      payload.uri += `/${id}`
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
