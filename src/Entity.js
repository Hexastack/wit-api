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

module.exports = function (request, cb) {
  return {
    list: function (cb) {
      const payload = actions.list
      request(payload, cb)
    },
    add: function (entity, cb) {
      let payload = actions.add
      try {
        payload.body = JSON.stringify(entity)
      } catch (e) {
        return cb(e, null)
      }
      request(payload, cb)
    },
    get: function (id, cb) {
      let payload = actions.get
      payload.uri += `/${id}`
      request(payload, cb)
    },
    update: function (id, changes, cb) {
      let payload = actions.update
      payload.uri += `/${id}`
      try {
        payload.body = JSON.stringify(changes)
      } catch (e) {
        return cb(e, null)
      }
      request(payload, cb)
    },
    delete: function (id, cb) {
      let payload = actions.delete
      payload.uri += `/${id}`
      request(payload, cb)
    }
  }
}
